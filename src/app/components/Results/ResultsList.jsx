import React from 'react';
import { Link } from 'react-router';
import {
  isEmpty as _isEmpty,
  chain as _chain,
} from 'underscore';

import Actions from '../../actions/Actions.js';
import LibraryItem from '../../utils/item.js';
import ResultItems from './ResultItems.jsx';
import { ajaxCall } from '../../utils/utils.js';

class ResultsList extends React.Component {
  constructor(props) {
    super(props);

    this.routeHandler = this.routeHandler.bind(this);
    this.getRecord = this.getRecord.bind(this);
  }

  getRecord(e, id, path) {
    e.preventDefault();

    ajaxCall(`/api/retrieve?q=${id}`, (response) => {
      // console.log(response.data);
      Actions.updateBib(response.data);
      this.routeHandler(`/${path}/${id}`);
    });
  }

  getCollapsedBibs(collapsedBibs) {
    if (!collapsedBibs.length) return null;

    const bibs = collapsedBibs.map((bib, i) => this.getBib(bib, false, i));

    return (
      <div className="related-items">
        <h4>Related formats and editions</h4>
        <ul>
          {bibs}
        </ul>
      </div>
    );
  }

  getBib(bib, author, i) {
    if (!bib.result || _isEmpty(bib.result)) return null;

    const result = bib.result;
    // const collapsedBibs = bib.collapsedBibs && bib.collapsedBibs.length ?
    //   bib.collapsedBibs : [];
    // const collapsedBibsElements = this.getCollapsedBibs(collapsedBibs);
    const itemTitle = result.title ? result.title[0] : '';
    const itemImage = result.btCover ? (
      <div className="result-image">
        <img src={result.btCover} alt={itemTitle} />
      </div>
      ) : null;
    const authors = author && result.contributor && result.contributor.length ?
      result.contributor : null;
    const id = result['@id'].substring(4);
    const items = LibraryItem.getItems(result);
    // Just displaying information for the first item for now, unless if the first item
    // is displays a HathiTrust viewer, in that case display the second item.
    const firstItem = items.length && items[0].actionLabel !== 'View online' ?
      items[0] : (items[1] ? items[1] : null);
    const materialType = result && result.materialType[0] ?
      result.materialType[0].prefLabel : null;
    const yearPublished = result && result.dateStartYear ? result.dateStartYear : null;
    const usageType = firstItem ? firstItem.actionLabel : null;
    const location = _chain(items)
      .pluck('location')
      .uniq()
      .value()
      .join(', ');
    const bibInfo = [
      { label: 'Material Type', data: materialType },
      { label: 'By', data: authors },
      { label: 'Year Published', data: yearPublished },
      { label: 'At Location', data: location },
      { label: 'Usage Type', data: usageType },
    ];

    return (
      <li key={i} className="result-item">
        <div className="result-text">
          <h2>
            <Link
              onClick={(e) => this.getRecord(e, id, 'item')}
              href={`/item/${id}`}
              className="title"
            >
              {itemTitle}
            </Link>
          </h2>
          <dl>
            {
              bibInfo.map((info) => {
                if (!info.data) return null;
                return [
                  (<dt>{info.label}:</dt>),
                  (<dd>{info.data}</dd>),
                ];
              })
            }
          </dl>
        </div>
      </li>
    );
  }

  routeHandler(route) {
    this.context.router.push(route);
  }

  render() {
    const results = this.props.results;
    let resultsElm = null;

    if (results && results.length) {
      resultsElm = results.map((bib, i) => this.getBib(bib, true, i));
    }

    return (
      <ul className="results-list">
        {resultsElm}
      </ul>
    );
  }
}

ResultsList.propTypes = {
  results: React.PropTypes.array,
};

ResultsList.contextTypes = {
  router: function contextType() {
    return React.PropTypes.func.isRequired;
  },
};

export default ResultsList;
