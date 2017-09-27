import Actions from '../actions/Actions.js';
import alt from '../alt.js';

import { reject as _reject } from 'underscore';

class Store {
  constructor() {
    this.bindListeners({
      updateSearchResults: Actions.updateSearchResults,
      updateSearchKeywords: Actions.updateSearchKeywords,
      updateBib: Actions.updateBib,
      updateFilters: Actions.updateFilters,
      updateSelectedFilters: Actions.updateSelectedFilters,
      removeFilter: Actions.removeFilter,
      updatePage: Actions.updatePage,
      updateSortBy: Actions.updateSortBy,
      updateLoadingStatus: Actions.updateLoadingStatus,
      updateField: Actions.updateField,
      updateForm: Actions.updateForm,
      updateDeliveryLocations: Actions.updateDeliveryLocations,
      updateIsEddRequestable: Actions.updateIsEddRequestable,
    });

    this.state = {
      searchResults: {},
      bib: {},
      searchKeywords: '',
      filters: {},
      selectedFilters: {
        materialType: [],
        language: [],
        dateAfter: {},
        dateBefore: {},
      },
      page: '1',
      sortBy: 'relevance',
      isLoading: false,
      field: 'all',
      error: {},
      form: {},
      deliveryLocations: [],
      isEddRequestable: false,
    };
  }

  updateSearchResults(data) {
    this.setState({ searchResults: data });
  }

  updateSearchKeywords(data) {
    this.setState({ searchKeywords: data });
  }

  updateBib(data) {
    this.setState({ bib: data });
  }

  updateFilters(data) {
    this.setState({ filters: data });
  }

  updateSelectedFilters(data) {
    this.setState({ selectedFilters: data });
  }

  removeFilter({ filterKey, valueId }) {
    if (filterKey === 'dateBefore' || filterKey === 'dateAfter') {
      this.state.selectedFilters[filterKey] = {};
    } else {
      this.state.selectedFilters[filterKey] =
        _reject(this.state.selectedFilters[filterKey], { id: valueId });
    }
    this.setState({ selectedFilters: this.state.selectedFilters });
  }

  updatePage(page) {
    this.setState({ page });
  }

  updateSortBy(sortBy) {
    this.setState({ sortBy });
  }

  updateLoadingStatus(data) {
    this.setState({ isLoading: data });
  }

  updateField(data) {
    this.setState({ field: data });
  }

  updateForm(data) {
    this.setState({ form: data });
  }

  updateDeliveryLocations(data) {
    this.setState({ deliveryLocations: data });
  }

  updateIsEddRequestable(data) {
    this.setState({ isEddRequestable: data });
  }
}

export default alt.createStore(Store, 'Store');
