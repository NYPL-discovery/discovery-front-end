import React from 'react';
import PropTypes from 'prop-types';

// import Actions from '../../actions/Actions';
// import {
//   ajaxCall,
//   trackDiscovery,
// } from '../../utils/utils';
// import appConfig from '../../data/appConfig';
//
// const sortingOpts = [
//   { val: 'relevance', label: 'relevance' },
//   { val: 'title_asc', label: 'title (a - z)' },
//   { val: 'title_desc', label: 'title (z - a)' },
//   { val: 'date_asc', label: 'date (old to new)' },
//   { val: 'date_desc', label: 'date (new to old)' },
// ];

class Sorter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sortValue: this.props.sortBy || this.props.defaultSort,
      js: false,
    };

    this.updateSortValue = this.updateSortValue.bind(this);
    this.generateSortOptions = this.generateSortOptions.bind(this);
  }

  componentDidMount() {
    this.setState({
      js: true,
    });
  }

  /**
   * updateSortValue(e)
   * The fuction listens to the event of changing the input of sort options.
   * It then sets the state with the callback function of making a new search.
   *
   * @param {Event} e
   */
  updateSortValue(e) {
    e.preventDefault();
    const sortValue = e.target.value;

    const sortParams = sortValue.split("_")
    sortParams.sort = sortParams[0]
    sortParams.sortDirection = sortParams[1]

    this.setState({ sortValue }, this.props.updateResults(sortParams));
  }

  /**
   * sortResultsBy(sortBy)
   * The fuction that makes a new search based on the passed sort option.
   *
   * @param {String} sortBy
   */
  // const sortResultsBy = () => {
  //   const apiQuery = this.props.createAPIQuery({ sortBy, page: this.props.page });
  //
  //   trackDiscovery('Sort by', sortBy);
  //   Actions.updateLoadingStatus(true);
  //   ajaxCall(`${appConfig.baseUrl}/api?${apiQuery}`, (response) => {
  //     Actions.updateSearchResults(response.data.searchResults);
  //     Actions.updateSortBy(sortBy);
  //     setTimeout(() => {
  //       Actions.updateLoadingStatus(false);
  //       this.context.router.push(`${appConfig.baseUrl}/search?${apiQuery}`);
  //     }, 500);
  //   });
  // }

  /**
   * renderResultsSort()
   * The fuction that makes renders the sort options.
   *
   * @return {HTML Element}
   */
  generateSortOptions() {
    return this.props.sortOptions.map(d => (
      <option value={d.val} key={d.val}>
        {d.label}
      </option>
    ));
  }

  render() {
    const { sortValue } = this.state;

    return (
      <div className="nypl-results-sorting-controls">
        <div className="nypl-results-sorter">
          <div className="nypl-select-field-results">
            <label htmlFor="sort-by-label">Sort by</label>
            <form>
              <span className="nypl-omni-fields">
                <strong>
                  <select
                    id="sort-by-label"
                    onChange={this.updateSortValue}
                    value={sortValue}
                    name="sort_scope"
                  >
                    {this.generateSortOptions()}
                  </select>
                </strong>
              </span>
              {!this.state.js && <input type="submit" />}
            </form>
          </div>
        </div>
      </div>
    );
  }
}

Sorter.propTypes = {
  sortBy: PropTypes.string,
  searchKeywords: PropTypes.string,
  field: PropTypes.string,
  page: PropTypes.string,
  createAPIQuery: PropTypes.func,
};

Sorter.defaultProps = {
  searchKeywords: '',
  field: '',
};

Sorter.contextTypes = {
  router: PropTypes.object,
};

export default Sorter;
