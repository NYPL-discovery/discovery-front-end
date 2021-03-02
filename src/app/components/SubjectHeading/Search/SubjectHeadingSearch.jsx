/* global document */
import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Autosuggest from "react-autosuggest";

import appConfig from '../../../data/appConfig';

import AutosuggestItem from './AutosuggestItem';
import SearchIcon from '../../../../client/icons/SearchIcon';

class SubjectHeadingSearch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeSuggestion: 0,
      suggestions: [],
      userInput: '',
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.resetAutosuggest = this.resetAutosuggest.bind(this);
    this.changeActiveSuggestion = this.changeActiveSuggestion.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.blurClickHandler = this.blurClickHandler.bind(this);
    this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', this.blurClickHandler);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.blurClickHandler);
  }

  onSubmit(submitEvent) {
    submitEvent.preventDefault();
    const url = this.generatePath(this.state.suggestions[this.state.activeSuggestion]);
    this.resetAutosuggest();
    this.context.router.push(url);
  }

  onChange(inputEvent) {
    const userInput = inputEvent.currentTarget.value;

    this.setState({
      userInput,
    });
  }

  onFocus() {
    this.setState({ hidden: false });
  }

  blurClickHandler(e) {
    const hasParentAutosuggest = (element) => {
      if (element.id === 'autosuggest') return true;
      if (element.parentElement) return hasParentAutosuggest(element.parentElement);
      return false;
    };
    if (!hasParentAutosuggest(e.target)) this.setState({ hidden: true });
  }

  makeApiCallWithThrottle(timerId) {
    const apiCall = () => {
      if (this.state.userInput) {
        return axios(`${appConfig.baseUrl}/api/subjectHeadings/autosuggest?query=${this.state.userInput}`)
          .then((res) => {
            if (res.data.request.query.trim() === this.state.userInput.trim()) {
              this.setState({
                suggestions: res.data.autosuggest,
                activeSuggestion: 0,
              });
            }
          })
          .catch(console.error);
      }
      // if this.state.userInput.length is falsey, reset suggestions
      return this.setState({ suggestions: [] });
    };

    if (timerId) return;

    const newTimerId = setTimeout(() => {
      apiCall();
      this.setState({ timerId: undefined });
    }, 500);

    this.setState({ timerId: newTimerId });
  }

  changeActiveSuggestion(keyEvent) {
    const { suggestions, activeSuggestion } = this.state;
    if (suggestions.length > 0) {
      if (keyEvent.key === 'ArrowDown' && suggestions.length - 1 > activeSuggestion) {
        keyEvent.preventDefault();
        this.setState(prevState => ({
          activeSuggestion: prevState.activeSuggestion + 1,
        }));
      } else if (keyEvent.key === 'ArrowUp' && activeSuggestion > 0) {
        keyEvent.preventDefault();
        this.setState(prevState => ({
          activeSuggestion: prevState.activeSuggestion - 1,
        }));
      }
    }
  }

  resetAutosuggest() {
    this.setState({
      userInput: '',
      activeSuggestion: 0,
    });
  }

  generatePath(item) {
    const subjectComponent = item.class === 'subject_component';
    const base = appConfig.baseUrl;
    let path;

    if (subjectComponent) {
      path = `${base}/subject_headings?filter=${item.label}`;
    } else if (item.uuid) {
      path = `${base}/subject_headings/${item.uuid}`;
    }

    return path;
  }

  onSuggestionsFetchRequested() {
    this.makeApiCallWithThrottle(this.state.timerId);
  }

  render() {
    const {
      onChange,
      onSubmit,
      changeActiveSuggestion,
      onSuggestionsFetchRequested,
      state: {
        suggestions,
        activeSuggestion,
        userInput,
        hidden,
      },
    } = this;

    let suggestionsListComponent = null;

    if (userInput && suggestions.length && !hidden) {
      suggestionsListComponent = (
        <ul className="suggestions">
          {suggestions.map((suggestion, index) => (
            <AutosuggestItem
              item={suggestion}
              path={this.generatePath(suggestion)}
              activeSuggestion={index === activeSuggestion}
              key={suggestion.uuid || suggestion.label}
              onClick={this.resetAutosuggest}
            />
          ))}
        </ul>
      );
    }

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.resetAutosuggest}
        getSuggestionValue={suggestion => suggestion.label}
        inputProps={{
          placeholder: 'Enter a Subject Heading Term',
          value: userInput,
          onChange,
        }}
        renderSuggestion={suggestion => (
          <AutosuggestItem
            item={suggestion}
            path={this.generatePath(suggestion)}
            key={suggestion.uuid || suggestion.label}
            onClick={this.resetAutosuggest}
          />
        )}
      />
    )

    // return (
    //   <form
    //     className="autocomplete"
    //     autoComplete="off"
    //     onSubmit={onSubmit}
    //     onKeyDown={changeActiveSuggestion}
    //     onFocus={this.onFocus}
    //     id="mainContent"
    //   >
    //     <div className="autocomplete-field">
    //       <label htmlFor="autosuggest">Subject Heading Lookup</label>
    //       <div className="autosuggestInput">
    //         <input
    //           id="autosuggest"
    //           type="text"
    //           onChange={onChange}
    //           value={userInput}
    //           placeholder="Subject"
    //         />
    //         <button
    //           onSubmit={onSubmit}
    //           type="submit"
    //         >
    //           <SearchIcon />
    //         </button>
    //       </div>
    //       {suggestionsListComponent}
    //     </div>
    //   </form>
    // );
  }
}

SubjectHeadingSearch.contextTypes = {
  router: PropTypes.object,
};

export default SubjectHeadingSearch;
