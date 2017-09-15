/* eslint-env mocha */
import MockAdapter from 'axios-mock-adapter';
import { expect } from 'chai';
import axios from 'axios';
import sinon from 'sinon';
import { useQueries } from 'history';
import { gaUtils } from 'dgx-react-ga';

const mock = new MockAdapter(axios);

import {
  ajaxCall,
  getDefaultFacets,
  createAppHistory,
  destructureFilters,
  getSortQuery,
  getFacetFilterParam,
  getFieldParam,
  trackDiscovery,
  basicQuery,
  getReqParams,
  getAggregatedElectronicResources,
} from '../../src/app/utils/utils.js';

/**
 * ajaxCall()
 */
describe('ajaxCall', () => {
  describe('No input', () => {
    it('should return null if no enpoint is passed', () => {
      expect(ajaxCall()).to.equal(null);
    });
  });

  describe('Good call', () => {
    before(() => {
      mock
        .onGet('/api?q=locofocos')
        .reply(200, { searchResults: [] });
    });

    after(() => {
      mock.reset();
    });

    it('should call the "get" function from axios with an endpoint', () => {
      const ajaxCallGetSpy = sinon.spy(axios, 'get');
      ajaxCall('/api?q=locofocos');

      expect(ajaxCallGetSpy.callCount).to.equal(1);

      ajaxCallGetSpy.restore();
    });

    it('should invoke the callback function', () => {
      const cbSpy = sinon.spy();
      ajaxCall('/api?q=locofocos', cbSpy);

      setTimeout(() => {
        expect(cbSpy.callCount).to.equal(1);
      }, 0);

      cbSpy.reset();
    });
  });

  describe('Bad call', () => {
    before(() => {
      mock
        .onGet('/api?q=locofocos')
        .reply(400, { searchResults: [] });
    });

    after(() => {
      mock.reset();
    });

    it('should invoke the default error callback function', () => {
      const cbSpy = sinon.spy();
      // const consoleError = sinon.spy(console, 'error');
      ajaxCall('/api?q=locofocos', cbSpy);

      setTimeout(() => {
        expect(cbSpy.callCount).to.equal(0);
        // expect(consoleError.callCount).to.equal(1);
      }, 0);

      cbSpy.reset();
      // consoleError.reset();
    });

    it('should invoke the error callback function', () => {
      const cbSpy = sinon.spy();
      const cbErrorSpy = sinon.spy();
      ajaxCall('/api?q=locofocos', (cbSpy), cbErrorSpy)
        .then(() => {
          expect(cbSpy.callCount).to.equal(0);
          expect(cbErrorSpy.callCount).to.equal(1);
        });

      cbSpy.reset();
      cbErrorSpy.reset();
    });
  });
});

/**
 * getDefaultFacets
 */
describe('getDefaultFacets', () => {
  it('should return an object with a list of facets', () => {
    const defaultFacets = getDefaultFacets();

    expect(defaultFacets).to.eql({
      materialType: [],
      language: [],
      dateAfter: {},
      dateBefore: {},
    });
  });
});

/**
 * createAppHistory
 */
describe('createAppHistory', () => {
  // Don't think this is working too well.
  // TODO: find a better way to test this function:
  it('should create a server-side history', () => {
    const useQueriesSpy = sinon.spy(useQueries);

    createAppHistory();
    setTimeout(() => {
      expect(useQueriesSpy.callCount).to.equal(1);
    }, 0);

    useQueriesSpy.reset();
  });
});

/**
 * destructureFilters
 */
describe('destructureFilters', () => {
  describe('Default call', () => {
    it('should return an empty object', () => {
      const filters = destructureFilters();
      expect(filters).to.eql({});
    });
  });

  // describe('No facets from the API', () => {
    // it('should return an empty object', () => {
    //   const filters = destructureFilters();
    //   expect(filters).to.eql({});
    // });
  // });
});

/**
 * getSortQuery()
 */
describe('getSortQuery', () => {
  describe('No input', () => {
    it('should return an empty string', () => {
      expect(getSortQuery()).to.equal('');
    });
  });

  describe('Sort by Relevance', () => {
    it('should return an empty string if sorting by "revelance"', () => {
      const sortBy = 'relevance';
      expect(getSortQuery(sortBy)).to.equal('');
    });
  });

  describe('Return URL query params', () => {
    it('should sort by title asc', () => {
      const sortBy = 'title_asc';
      expect(getSortQuery(sortBy)).to.equal('&sort=title&sort_direction=asc');
    });

    it('should sort by title desc', () => {
      const sortBy = 'title_desc';
      expect(getSortQuery(sortBy)).to.equal('&sort=title&sort_direction=desc');
    });

    it('should sort by date asc', () => {
      const sortBy = 'date_asc';
      expect(getSortQuery(sortBy)).to.equal('&sort=date&sort_direction=asc');
    });

    it('should sort by date desc', () => {
      const sortBy = 'date_desc';
      expect(getSortQuery(sortBy)).to.equal('&sort=date&sort_direction=desc');
    });
  });
});

/**
 * getFacetFilterParam()
 */
describe('getFacetFilterParam', () => {
  describe('No input', () => {
    it('should return an empty string', () => {
      expect(getFacetFilterParam()).to.equal('');
    });

    it('should return an empty string with no selected facets', () => {
      const facets = {
        date: { value: '', label: '' },
        issuance: { value: '', label: '' },
        language: { value: '', label: '' },
        location: { value: '', label: '' },
        materialType: { value: '', label: '' },
        mediaType: { value: '', label: '' },
        owner: { value: '', label: '' },
        publisher: { value: '', label: '' },
        subject: { value: '', label: '' },
      };
      expect(getFacetFilterParam(facets)).to.equal('');
    });
  });

  describe('Only facets object input', () => {
    it('should return a key:value string from two facets', () => {
      const facets = {
        date: { value: '', label: '' },
        issuance: { value: '', label: '' },
        language: { value: '', label: '' },
        location: { value: '', label: '' },
        materialType: { value: 'resourcetypes:aud', label: 'Audio' },
        mediaType: { value: '', label: '' },
        owner: { value: 'orgs:1000', label: 'Stephen A. Schwarzman Building' },
        publisher: { value: '', label: '' },
        subject: { value: '', label: '' },
      };
      expect(getFacetFilterParam(facets))
        .to.equal('&filters[materialType]=resourcetypes%3Aaud&filters[owner]=orgs%3A1000');
    });

    it('should return a key:value string from three facets', () => {
      const facets = {
        date: { value: '', label: '' },
        issuance: { value: '', label: '' },
        language: { value: 'lang:ger', label: 'German' },
        location: { value: '', label: '' },
        materialType: { value: '', label: '' },
        mediaType: { value: '', label: '' },
        owner: { value: '', label: '' },
        publisher: { value: '[Berlin] : Walter de Gruyter', label: '[Berlin] : Walter de Gruyter' },
        subject: { value: 'Electronic journals.', label: 'Electronic journals.' },
      };
      expect(getFacetFilterParam(facets))
        .to.equal('&filters[language]=lang%3Ager&filters[publisher]=%5BBerlin%5D%20%3A%20Walter' +
          '%20de%20Gruyter&filters[subject]=Electronic%20journals.');
    });
  });
});

/**
 * getFieldParam()
 */
describe('getFieldParam', () => {
  describe('No input', () => {
    it('should return an empty string', () => {
      expect(getFieldParam()).to.equal('');
    });
  });

  describe('Different values', () => {
    it('should return an empty string when "all" is selected', () => {
      expect(getFieldParam('all')).to.equal('');
    });

    it('should return a url query when "title" is selected', () => {
      expect(getFieldParam('title')).to.equal('&search_scope=title');
    });

    it('should return a url query when "author" is selected', () => {
      expect(getFieldParam('author')).to.equal('&search_scope=author');
    });
  });
});

/**
 * trackDiscovery()
 */
// describe('trackDiscovery', () => {
//   it('should make a call to gaUtils', () => {
//     const trackEventSpy = sinon.spy(gaUtils, 'trackEvent');
//
//     trackDiscovery('action', 'label');
//
//     expect(trackEventSpy.callCount).to.equal(1);
//
//     trackEventSpy.reset();
//   });
// });

/**
 * basicQuery()
 */
describe('basicQuery', () => {
  // This is the default values for the API endpoint call. Since this is the foundation, these
  // values won't change the default query.
  const defaultQueryObj = {
    sortBy: 'relevance',
    field: 'all',
    selectedFacets: {},
    searchKeywords: '',
    page: '1',
  };
  const defaultQueryObjwithData = {
    sortBy: 'title_desc',
    field: 'all',
    selectedFacets: {},
    searchKeywords: 'shakespeare',
    page: '4',
  };

  describe('Default call', () => {
    it('should return a function', () => {
      expect(basicQuery()).to.be.a('function');
    });

    it('should take an object as input and still return a function', () => {
      expect(basicQuery(defaultQueryObj)).to.be.a('function');
    });

    it('should take empty objects as input and return default string when invoked', () => {
      const createAPIQuery = basicQuery({});

      expect(createAPIQuery({})).to.equal('q=');
    });

    it('should still return the default string even with the default object', () => {
      const createAPIQuery = basicQuery(defaultQueryObj);
      expect(createAPIQuery({})).to.equal('q=');
    });
  });

  // The initial data passed is not the expected default.
  describe('Default call with updated initial data', () => {
    it('should return updated default query string', () => {
      const createAPIQuery = basicQuery(defaultQueryObjwithData);

      expect(createAPIQuery({})).to.equal('q=shakespeare&sort=title&sort_direction=desc&page=4');
    });

    it('should return updated string if any new data was passed', () => {
      const createAPIQuery = basicQuery(defaultQueryObjwithData);

      expect(createAPIQuery({ page: 7, searchKeywords: 'king lear' }))
        .to.equal('q=king%20lear&sort=title&sort_direction=desc&page=7');
    });
  });

  describe('With updated data input', () => {
    const createAPIQuery = basicQuery(defaultQueryObj);

    it('should update the sort by query', () => {
      // There are more tests in the `getSortQuery` suite.
      expect(createAPIQuery({ sortBy: 'title_asc' })).to.equal('q=&sort=title&sort_direction=asc');
      expect(createAPIQuery({ sortBy: 'date_asc' })).to.equal('q=&sort=date&sort_direction=asc');
    });

    it('should update the field query', () => {
      // There are more tests in the `getFieldParam` suite.
      expect(createAPIQuery({ field: 'title' })).to.equal('q=&search_scope=title');
      expect(createAPIQuery({ field: 'author' })).to.equal('q=&search_scope=author');
    });

    it('should update the selected facets query', () => {
      // There are more tests in the `getFacetFilterParam` suite.
      expect(createAPIQuery({
        selectedFacets: {
          language: { value: '', label: '' },
          materialType: { value: 'resourcetypes:aud', label: 'Audio' },
          owner: { value: 'orgs:1000', label: 'Stephen A. Schwarzman Building' },
          subject: { value: '', label: '' },
        },
      })).to.equal('q=&filters[materialType]=resourcetypes%3Aaud&filters[owner]=orgs%3A1000');
    });

    it('should update the searchKeywords query', () => {
      expect(createAPIQuery({ searchKeywords: 'locofocos' })).to.equal('q=locofocos');
    });

    it('should update the page query', () => {
      expect(createAPIQuery({ page: '3' })).to.equal('q=&page=3');
    });

    it('should update the string if there are multiple selections', () => {
      expect(createAPIQuery({
        field: 'title',
        searchKeywords: 'hamlet',
        sortBy: 'title_asc',
        page: '5',
      })).to.equal('q=hamlet&sort=title&sort_direction=asc&search_scope=title&page=5');
    });
  });
});

/**
 * getReqParams()
 */
describe('getReqParams', () => {
  describe('Default call', () => {
    it('should return the default object', () => {
      expect(getReqParams()).to.eql({
        page: '1',
        q: '',
        sort: '',
        order: '',
        sortQuery: '',
        fieldQuery: '',
        filters: {},
      });
    });
  });

  describe('With data passed from the query in the URL', () => {
    it('should return updated page', () => {
      const queryFromUrl = { page: '4' };
      expect(getReqParams(queryFromUrl)).to.eql({
        page: '4',
        q: '',
        sort: '',
        order: '',
        sortQuery: '',
        fieldQuery: '',
        filters: {},
      });
    });

    it('should return updated searchKeywords', () => {
      const queryFromUrl = { q: 'harry potter' };
      expect(getReqParams(queryFromUrl)).to.eql({
        page: '1',
        q: 'harry potter',
        sort: '',
        order: '',
        sortQuery: '',
        fieldQuery: '',
        filters: {},
      });
    });

    it('should return updated sort by', () => {
      const queryFromUrl = { sort: 'title', sort_direction: 'asc' };
      expect(getReqParams(queryFromUrl)).to.eql({
        page: '1',
        q: '',
        sort: 'title',
        order: 'asc',
        sortQuery: '',
        fieldQuery: '',
        filters: {},
      });
    });

    it('should return updated field', () => {
      const queryFromUrl = { search_scope: 'author' };
      expect(getReqParams(queryFromUrl)).to.eql({
        page: '1',
        q: '',
        sort: '',
        order: '',
        sortQuery: '',
        fieldQuery: 'author',
        filters: {},
      });
    });

    it('should return updated field', () => {
      const queryFromUrl = { sort_scope: 'title_asc' };
      expect(getReqParams(queryFromUrl)).to.eql({
        page: '1',
        q: '',
        sort: '',
        order: '',
        sortQuery: 'title_asc',
        fieldQuery: '',
        filters: {},
      });
    });

    it('should return updated filters', () => {
      const queryFromUrl = { filters: 'filters[owner]=orgs%3A1000' };
      expect(getReqParams(queryFromUrl)).to.eql({
        page: '1',
        q: '',
        sort: '',
        order: '',
        sortQuery: '',
        fieldQuery: '',
        filters: 'filters[owner]=orgs%3A1000',
      });
    });
  });
});

/**
 * getAggregatedElectronicResources()
 */
describe('getAggregatedElectronicResources', () => {
  describe('No input', () => {
    it('should return an empty array with no input or an empty array', () => {
      expect(getAggregatedElectronicResources()).to.eql([]);
      expect(getAggregatedElectronicResources([])).to.eql([]);
    });
  });

  describe('Collected Electronic Resources', () => {
    it('should return an array with one electronic resource', () => {
      const mockedItems = [
        {},
        {},
        {
          isElectronicResource: true,
          electronicResources: [{
            id: 'someId',
            title: 'someTitle',
            url: 'someUrl',
          }],
        },
      ];
      expect(getAggregatedElectronicResources(mockedItems))
        .to.eql([
          {
            id: 'someId',
            title: 'someTitle',
            url: 'someUrl',
          },
        ]);
    });

    it('should return an array with two electronic resources from the same item', () => {
      const mockedItems = [
        {},
        {},
        {
          isElectronicResource: true,
          electronicResources: [
            {
              id: 'someId',
              title: 'someTitle',
              url: 'someUrl',
            },
            {
              id: 'someId2',
              title: 'someTitle2',
              url: 'someUrl2',
            },
          ],
        },
      ];
      expect(getAggregatedElectronicResources(mockedItems))
        .to.eql([
          {
            id: 'someId',
            title: 'someTitle',
            url: 'someUrl',
          },
          {
            id: 'someId2',
            title: 'someTitle2',
            url: 'someUrl2',
          },
        ]);
    });

    it('should return an array with three electronic resources, two from one item and' +
      ' another from another item in the same array', () => {
      const mockedItems = [
        {},
        {
          isElectronicResource: true,
          electronicResources: [
            {
              id: 'someId',
              title: 'someTitle',
              url: 'someUrl',
            },
          ],
        },
        {
          isElectronicResource: true,
          electronicResources: [
            {
              id: 'someId2',
              title: 'someTitle2',
              url: 'someUrl2',
            },
            {
              id: 'someId3',
              title: 'someTitle3',
              url: 'someUrl3',
            },
          ],
        },
      ];
      expect(getAggregatedElectronicResources(mockedItems))
        .to.eql([
          {
            id: 'someId',
            title: 'someTitle',
            url: 'someUrl',
          },
          {
            id: 'someId2',
            title: 'someTitle2',
            url: 'someUrl2',
          },
          {
            id: 'someId3',
            title: 'someTitle3',
            url: 'someUrl3',
          },
        ]);
    });
  });
});
