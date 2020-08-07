import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';

/* eslint-disable import/no-unresolved, import/extensions */
import SearchResultsSorter from '@SearchResultsSorter';
import SearchResultsContainer from '@SearchResultsContainer';
/* eslint-enable */
import SccContainer from '../components/SccContainer/SccContainer';
import Search from '../components/Search/Search';
import FilterPopup from '../components/FilterPopup/FilterPopup';
import SelectedFilters from '../components/Filters/SelectedFilters';
import ResultsCount from '../components/ResultsCount/ResultsCount';

import {
  basicQuery,
} from '../utils/utils';
import AppConfigStore from '../stores/AppConfigStore';

const SearchResults = (props, context) => {
  const {
    searchResults,
    searchKeywords,
    selectedFilters,
    filters,
    page,
    field,
    sortBy,
  } = props;

  const {
    router,
  } = context;

  const { features } = AppConfigStore.getState();
  const includeDrbb = features.includes('drb-integration');

  const { location } = router;

  const [dropdownOpen, toggleDropdown] = useState(false);

  const totalResults = searchResults ? searchResults.totalResults : undefined;
  const totalPages = totalResults ? Math.floor(totalResults / 50) + 1 : 0;
  const searchKeywordsLabel = searchKeywords ? `for ${searchKeywords}` : '';
  const pageLabel = totalPages ? `page ${page} of ${totalPages}` : '';
  const headerLabel = `Search results ${searchKeywordsLabel} ${pageLabel}`;

  const apiFilters = filters && filters.itemListElement && filters.itemListElement.length ?
    filters.itemListElement : [];
  const createAPIQuery = basicQuery(props);
  const dateFilterErrors = [];
  const searchError = location.query && location.query.error ? location.query.error : '';
  if (searchError === 'dateFilterError') {
    dateFilterErrors.push({
      name: 'date',
      value: 'Date',
    });
  }
  const checkForSelectedFilters = () => {
    if (selectedFilters &&
      (selectedFilters.dateBefore !== '' ||
        selectedFilters.dateAfter !== '' ||
        (selectedFilters.language && selectedFilters.language.length) ||
        (selectedFilters.materialType && selectedFilters.materialType.length) ||
        (selectedFilters.subjectLiteral && selectedFilters.subjectLiteral.length)
      )
    ) {
      if (!dropdownOpen) {
        return true;
      }
    }
    return false;
  };

  const selectedFiltersAvailable = checkForSelectedFilters();
  const hasResults = searchResults && totalResults;

  return (
    <DocumentTitle title="Search Results | Shared Collection Catalog | NYPL">
      <SccContainer
        mainContent={<SearchResultsContainer {...props} />}
        bannerOptions={
          {
            text: 'Search Results',
            ariaLabel: headerLabel,
          }
        }
        extraBannerElement={
          <Search
            searchKeywords={searchKeywords}
            field={field}
            createAPIQuery={createAPIQuery}
            selectedFilters={selectedFilters}
          />
        }
        secondaryExtraBannerElement={
          <React.Fragment>
            <FilterPopup
              filters={apiFilters}
              createAPIQuery={createAPIQuery}
              selectedFilters={selectedFilters}
              searchKeywords={searchKeywords}
              raisedErrors={dateFilterErrors}
              updateDropdownState={toggleDropdown}
              totalResults={totalResults}
            />
            {
              selectedFiltersAvailable &&
              <div className={`nypl-full-width-wrapper selected-filters${includeDrbb ? ' drbb-integration' : ''}`}>
                <div className="nypl-row">
                  <div className="nypl-column-full">
                    <SelectedFilters
                      selectedFilters={selectedFilters}
                      createAPIQuery={createAPIQuery}
                    />
                  </div>
                </div>
              </div>
            }
          </React.Fragment>
        }
        extraRow={
          <div className="nypl-sorter-row">
            <div className={`nypl-full-width-wrapper selected-filters${includeDrbb ? ' drbb-integration' : ''}`}>
              <div className="nypl-row">
                <div className="nypl-column-full">
                  <ResultsCount
                    count={totalResults}
                    selectedFilters={selectedFilters}
                    searchKeywords={searchKeywords}
                    field={field}
                    page={parseInt(page, 10)}
                  />
                  {
                    hasResults ?
                      <SearchResultsSorter
                        sortBy={sortBy}
                        page={page}
                        searchKeywords={searchKeywords}
                        createAPIQuery={createAPIQuery}
                      />
                      : null
                  }
                </div>
              </div>
            </div>
          </div>
        }
        loadingLayerText="Searching"
        breadcrumbsType="search"
      />
    </DocumentTitle>
  );
};

SearchResults.propTypes = {
  searchResults: PropTypes.object,
  searchKeywords: PropTypes.string,
  selectedFilters: PropTypes.object,
  page: PropTypes.string,
  filters: PropTypes.object,
  field: PropTypes.string,
  sortBy: PropTypes.string,
  drbbResults: PropTypes.object,
};

SearchResults.defaultProps = {
  page: '1',
  drbbResults: { totalWorks: 0 },
};

SearchResults.contextTypes = {
  router: PropTypes.obj,
};

export default SearchResults;
