/* eslint-env mocha */
import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import { mock } from 'sinon';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

import ResultsList from '../../src/app/components/ResultsList/ResultsList';
import resultsBibs from '../fixtures/resultsBibs';
import appConfig from '../../src/app/data/appConfig';

const results = [{}, {}, {}];
const singleBibNoTitleDisplay = {
  result: {
    '@id': 'res:b17692265',
    extent: ['xii, 267 p. : ill. '],
    note: ['Includes bibliographical references (p. 244-258) and index.'],
    createdYear: 2007,
    title: ['Hamlet without Hamlet', 'Hamlet without Hamlet /'],
    creatorLiteral: ['De Grazia, Margreta.'],
    createdString: ['2007'],
    items: [],
  },
};
const singleBibNoTitleDisplayOrCreator = {
  result: {
    '@id': 'res:b17692265',
    extent: ['xii, 267 p. : ill. '],
    note: ['Includes bibliographical references (p. 244-258) and index.'],
    createdYear: 2007,
    title: ['Hamlet without Hamlet', 'Hamlet without Hamlet /'],
    createdString: ['2007'],
    items: [],
  },
};
const emptyBib = { result: {} };
const onlyStartYearBib = {
  result: {
    dateStartYear: 2007,
  },
};
const startEndYearBib = {
  result: {
    dateStartYear: 1999,
    dateEndYear: 2007,
  },
};
const startYear999Bib = {
  result: {
    dateStartYear: 999,
    dateEndYear: 2007,
  },
};
const endYear9999Bib = {
  result: {
    dateStartYear: 1999,
    dateEndYear: 9999,
  },
};


describe('ResultsList', () => {
  describe('Default rendering', () => {
    it('should return null if no results were passed', () => {
      const component = shallow(<ResultsList />);
      expect(component.type()).to.equal(null);
    });
  });

  describe('Basic rendering checks', () => {
    let component;

    before(() => {
      component = shallow(<ResultsList results={results} />);
    });

    it('should have a ul wrapper', () => {
      expect(component.first().type()).to.equal('ul');
      expect(component.find('.nypl-results-list').length).to.equal(1);
    });

    it('should not have an initial isLoading state', () => {
      expect(component.find('.hide-results-list').length).to.equal(0);
    });

    it('should not render any li because the objects are empty', () => {
      expect(component.find('li').length).to.equal(0);
    });
  });

  describe('Rendering with three bibs', () => {
    let component;

    before(() => {
      component = mount(<ResultsList results={resultsBibs} />);
    });

    it('should render two bib li items', () => {
      expect(component.find('.nypl-results-item').length).to.equal(3);
    });

    it('should render three "h3"s with the title of the bib', () => {
      expect(component.find('h3').length).to.equal(3);
      expect(component.find('h3').find('Link').length).to.equal(3);

      // We expect each H3 text to equal corresponding bib's titleDisplay:
      resultsBibs.forEach((bib, ind) => {
        expect(
          component.find('h3').at(ind)
            .find('Link').render()
            .text(),
        ).to.equal(bib.result.titleDisplay[0]);
      });
    });

    it('should render 15 `li`s since each bib displays 1 LI + 4 LIs for their info', () => {
      expect(component.find('li').length).to.equal(15);
    });

    // Only renders the table if the bib has only ONE item:
    it('should render one table for each single-item bib (2)', () => {
      expect(component.find('table').length).to.equal(2);
    });
  });

  describe('Rendering with one bib and two items', () => {
    const bib = resultsBibs[0];
    let component;

    before(() => {
      component = mount(<ResultsList results={[bib]} />);
    });

    it('should render one main li', () => {
      expect(component.find('li').find('.nypl-results-item').length).to.equal(1);
    });

    it('should have five lis for the bib\'s description', () => {
      expect(component.find('.nypl-results-item-description').find('li').length).to.equal(4);
    });

    it('should have a media description', () => {
      const materialType = component.find('.nypl-results-media');
      expect(materialType.length).to.equal(1);
      expect(materialType.text()).to.equal('Text');
    });

    it('should have a publication statement description', () => {
      const place = component.find('.nypl-results-publication');
      expect(place.length).to.equal(1);
      expect(place.text()).to.equal('Cambridge, UK ; New York : Cambridge University Press,');
    });

    it('should have a year published description', () => {
      const yearPublished = component.find('.nypl-results-date');
      expect(yearPublished.length).to.equal(1);
      expect(yearPublished.text()).to.equal('2007');
    });

    it('should have a total items description', () => {
      const yearPublished = component.find('.nypl-results-info');
      expect(yearPublished.length).to.equal(1);
      expect(yearPublished.text()).to.equal('2 items');
    });

    it('should not have a table', () => {
      expect(component.find('table').length).to.equal(0);
    });
  });

  describe('Rendering with one bib and one item', () => {
    const bib = resultsBibs[1];
    let component;

    before(() => {
      component = mount(<ResultsList results={[bib]} />);
    });

    it('should have a total items description', () => {
      const yearPublished = component.find('.nypl-results-info');
      expect(yearPublished.length).to.equal(1);
      expect(yearPublished.text()).to.equal('1 item');
    });

    it('should have one table', () => {
      expect(component.find('table').length).to.equal(1);
    });
  });

  describe('Mocking ajax call for the bib', () => {
    describe('Good response', () => {
      let component;
      let mock;

      before(() => {
        component = mount(
          <ResultsList results={resultsBibs} />,
          { context: { router: { createHref: () => {}, push: () => {}, replace: () => {} } } },
        );
        mock = new MockAdapter(axios);
        mock
          .onGet('/research/collections/shared-collection-catalog/api/bib?bibId=b17692265')
          .reply(200, { searchResults: [] });
      });

      after(() => {
        mock.restore();
      });
    });
  });

  describe('Bad response', () => {
    let component;
    let mock;

    before(() => {
      component = mount(
        <ResultsList results={resultsBibs} />,
        { context: { router: { createHref: () => {}, push: () => {} } } },
      );
      mock = new MockAdapter(axios);
      mock
        .onGet('/research/collections/shared-collection-catalog/api/bib?bibId=b17692265')
        .reply(404, { error: 'Some error' });
    });

    after(() => {
      mock.restore();
    });
  });

  describe('Misc functions', () => {
    describe('getBibTitle', () => {
      it('should display titleDisplay', () => {
        const component = mount(<ResultsList results={resultsBibs} />);
        const getBibTitle = component.instance().getBibTitle(resultsBibs[0].result);

        expect(getBibTitle).to.equal('Hamlet without Hamlet / Margreta De Grazia.');
      });

      it('should display `title` with `creatorLiteral` if there\'s no `titleDisplay`', () => {
        const component = mount(<ResultsList results={[singleBibNoTitleDisplay]} />);
        const getBibTitle = component.instance().getBibTitle(singleBibNoTitleDisplay.result);

        // The result combines `title` with `creatorLiteral`:
        expect(getBibTitle).to.equal('Hamlet without Hamlet / De Grazia, Margreta.');
      });

      it('should display just `title` if there\'s no `titleDisplay` or `creatorLiteral`', () => {
        const component = mount(<ResultsList results={[singleBibNoTitleDisplayOrCreator]} />);
        const getBibTitle =
          component.instance().getBibTitle(singleBibNoTitleDisplayOrCreator.result);

        expect(getBibTitle).to.equal('Hamlet without Hamlet');
      });

      it('should return an empty string', () => {
        const component = mount(<ResultsList results={[emptyBib]} />);
        const getBibTitle = component.instance().getBibTitle(emptyBib.result);

        expect(getBibTitle).to.equal('');
      });
    });

    describe('getYearDisplay', () => {
      it('should return null with no bib', () => {
        const component = mount(<ResultsList results={[emptyBib]} />);
        const getYearDisplay = component.instance().getYearDisplay(emptyBib.result);

        expect(getYearDisplay).to.equal(null);
      });

      it('should return null with a bib but no dates', () => {
        const component = mount(<ResultsList results={singleBibNoTitleDisplay} />);
        const getYearDisplay = component.instance().getYearDisplay(singleBibNoTitleDisplay.result);

        expect(getYearDisplay).to.equal(null);
      });

      it('should return just the start date', () => {
        const component = mount(<ResultsList results={onlyStartYearBib} />);
        const getYearDisplay = component.instance().getYearDisplay(onlyStartYearBib.result);

        expect(getYearDisplay.type).to.equal('li');
        expect(getYearDisplay.props.children).to.equal(2007);
      });

      it('should return the start and end date', () => {
        const component = mount(<ResultsList results={startEndYearBib} />);
        const getYearDisplay = component.instance().getYearDisplay(startEndYearBib.result);

        expect(getYearDisplay.type).to.equal('li');
        expect(getYearDisplay.props.children.join('')).to.equal('1999-2007');
      });

      it('should return the start unknown and end date', () => {
        const component = mount(<ResultsList results={startYear999Bib} />);
        const getYearDisplay = component.instance().getYearDisplay(startYear999Bib.result);

        expect(getYearDisplay.type).to.equal('li');
        expect(getYearDisplay.props.children.join('')).to.equal('unknown-2007');
      });

      it('should return the start date and end present', () => {
        const component = mount(<ResultsList results={endYear9999Bib} />);
        const getYearDisplay = component.instance().getYearDisplay(endYear9999Bib.result);

        expect(getYearDisplay.type).to.equal('li');
        expect(getYearDisplay.props.children.join('')).to.equal('1999-present');
      });
    });
  });

  describe('ResultsList functions', () => {
    let component;
    let axiosSpy;
    let mock;

    before(() => {
      component = mount(
        <ResultsList results={resultsBibs} />,
        { context: { router: { createHref: () => {}, push: () => {} } } },
      );
      mock = new MockAdapter(axios);
      mock
        .onGet('/research/collections/shared-collection-catalog/api/bib?bibId=b17692265')
        .reply(404, { error: 'Some error' });
    });

    after(() => {
      mock.restore();
      component.unmount();
      axiosSpy.restore();
    });
  });

  describe('DRBB integration', () => {
    let component;
    const context = {};
    let appConfigMock;

    before(() => {
      appConfigMock = mock(appConfig);
    });

    describe('without integration', () => {
      before(() => {
        appConfig.includeDrbb = false;
        component = mount(<ResultsList results={resultsBibs} />, context);
      });

      it('should not have any components with .drbb-integration class', () => {
        expect(component.find('.drbb-integration')).to.have.length(0);
      });
    });

    describe('with integration', () => {
      before(() => {
        appConfig.includeDrbb = true;
        component = mount(<ResultsList results={resultsBibs} />, { context });
      });

      it('should have components with .drbb-integration class', () => {
        expect(component.find('.drbb-integration')).to.have.length(1);
      });
    });

    after(() => {
      appConfigMock.restore();
    });
  });
});
