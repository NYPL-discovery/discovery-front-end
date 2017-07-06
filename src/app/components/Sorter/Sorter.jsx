import React from 'react';
import PropTypes from 'prop-types';
import { findWhere as _findWhere } from 'underscore';
import { DownWedgeIcon } from 'dgx-svg-icons';

import Actions from '../../actions/Actions';
import { ajaxCall } from '../../utils/utils';

const sortingOpts = [
  { val: 'relevance', label: 'relevance' },
  { val: 'title_asc', label: 'title (a - z)' },
  { val: 'title_desc', label: 'title (z - a)' },
  { val: 'date_asc', label: 'date (old to new)' },
  { val: 'date_desc', label: 'date (new to old)' },
];

class Sorter extends React.Component {
  constructor(props) {
    super(props);
    const defaultLabelObject = _findWhere(sortingOpts, { val: this.props.sortBy });
    const defaultLabel = defaultLabelObject ? defaultLabelObject.label : undefined;

    this.state = {
      sortValue: this.props.sortBy || 'relevance',
      sortLabel: defaultLabel || 'relevance',
      active: false,
      className: '',
      js: false,
    };

    this.updateSortValue = this.updateSortValue.bind(this);
  }

  componentDidMount() {
    this.setState({
      js: true,
    });
  }

  updateSortValue(e) {
    e.preventDefault();
    const value = e.target.value;

    this.setState(
      { sortValue: value, sortLabel: e.target.value },
      () => { this.sortResultsBy(value); }
    );
  }

  sortResultsBy(sortBy) {
    const apiQuery = this.props.createAPIQuery({ sortBy, page: this.props.page });

    Actions.updateSpinner(true);
    ajaxCall(`/api?${apiQuery}`, (response) => {
      Actions.updateSearchResults(response.data.searchResults);
      Actions.updateSortBy(sortBy);
      this.setState({ sortBy });
      this.context.router
        .push(`/search?${apiQuery}`);
      Actions.updateSpinner(false);
    });
    this.setState({ active: false });
  }

  renderResultsSort() {
    return sortingOpts.map((d, i) => (
      <option value={d.val} key={i}>
        {d.label}
      </option>
    ));
  }

  render() {
    const keywords = this.props.keywords || '';
    const field = this.props.field || '';

    return (
      <div className="nypl-results-sorting-controls">
        <div className="nypl-results-sorter">
          <form
            action={
              `/search${keywords ? `?q=${keywords}` : ''}${field ? `&search_scope=${field}` : ''}`
            }
            method="POST"
          >
            <span className="nypl-omni-fields">
              <label htmlFor="search-by-field">Sort by</label>
              <strong>
                <select
                  id="sort-by-label"
                  onChange={this.updateSortValue}
                  value={this.state.sortLabel}
                  name="sort_scope"
                >
                  {this.renderResultsSort()}
                </select>
              </strong>
            </span>
            {
              !this.state.js &&
                <input
                  type="submit"
                >
                </input>
            }
          </form>
        </div>
      </div>
    );
  }
}

Sorter.propTypes = {
  sortBy: PropTypes.string,
  keywords: PropTypes.string,
  field: PropTypes.string,
  page: PropTypes.string,
  createAPIQuery: PropTypes.func,
};

Sorter.contextTypes = {
  router: PropTypes.object,
};

export default Sorter;
