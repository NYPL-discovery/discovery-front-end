import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';

import { Button } from '@nypl/design-system-react-components';
import ItemFilter from './ItemFilter';
import { trackDiscovery } from '../../utils/utils';
import { itemFilters } from '../../data/constants';


const ItemFilters = ({ items, hasFilterApplied, numOfFilteredItems }, { router }) => {
  if (!items || !items.length) return null;
  const [openFilter, changeOpenFilter] = useState('none');

  const manageFilterDisplay = (filterType) => {
    if (filterType === openFilter) {
      trackDiscovery('Search Filters', `Close Filter - ${filterType}`);
      changeOpenFilter('none');
    } else {
      if (filterType === 'none') trackDiscovery('Search Filters', `Close Filter - ${openFilter}`);
      else {
        trackDiscovery('Search Filters', `Open Filter - ${openFilter}`);
      }
      changeOpenFilter(filterType);
    }
  };

  const { query } = router.location;
  const options = {};
  const mapFilterIdsToLabel = {};
  itemFilters.forEach((filter) => {
    const filterOptions = filter.options(items);
    options[filter.type] = filterOptions;
    filterOptions.forEach((option) => {
      mapFilterIdsToLabel[option.id] = option.label;
    });
  });

  // join filter selections and add single quotes
  const parsedFilterSelections = () => {
    const filterSelections = itemFilters.map(
      (filter) => {
        const selection = query[filter.type];
        if (Array.isArray(selection)) return selection.map(id => mapFilterIdsToLabel[id]);
        return mapFilterIdsToLabel[selection];
      }).filter(selections => selections);
    const joinedText = filterSelections.join("', '");
    return `'${joinedText}'`;
  };

  const resetFilters = () => {
    const href = router.createHref({
      pathname: router.location.pathname,
      hash: '#item-filters',
    });
    router.push(href);
  };

  return (
    <Fragment>
      <div id="item-filters" className="item-table-filters">
        {
          itemFilters.map(filter => (
            <ItemFilter
              filter={filter.type}
              options={options[filter.type]}
              open={openFilter === filter.type}
              manageFilterDisplay={manageFilterDisplay}
              key={filter.type}
            />
          ))
        }
      </div>
      <div className="item-filter-info">
        <h3>{numOfFilteredItems} Result{numOfFilteredItems > 1 ? 's' : null} Found</h3>
        {hasFilterApplied ? <span>Filtered by {parsedFilterSelections()}</span> : null}
        {
          hasFilterApplied ? (
            <Button
              buttonType="link"
              onClick={() => resetFilters()}
            >Clear all filters
            </Button>
          ) : null
        }
      </div>
    </Fragment>
  );
};

ItemFilters.propTypes = {
  items: PropTypes.array,
  hasFilterApplied: PropTypes.bool,
  numOfFilteredItems: PropTypes.integer,
};

ItemFilters.contextTypes = {
  router: PropTypes.object,
};

export default ItemFilters;
