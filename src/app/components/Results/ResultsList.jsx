import React from 'react';
import { Link } from 'react-router';
import axios from 'axios';

import Actions from '../../actions/Actions.js';

class ResultsList extends React.Component {
  constructor(props) {
    super(props);

    this.state ={
      expandedItems: []
    };

    this.routeHandler = this.routeHandler.bind(this);
    this.getRecord = this.getRecord.bind(this);
    this.getItems = this.getItems.bind(this);
  }

  getRecord(e, id, path) {
    e.preventDefault();

    axios
      .get(`/api/retrieve?q=${id}`)
      .then(response => {
        // console.log(response.data);
        Actions.updateItem(response.data);
        this.routeHandler(`/${path}/${id}`);
      })
      .catch(error => {
        console.log(error);
      });
  }

  routeHandler(route) {
    this.context.router.push(route);
  }

  showMoreItems(e, id){
    e.preventDefault();

    // This is a makeshift way of doing it; we should probably have the sub-items as another component that tracks its own expanded/collapsed state
    const expandedItems = this.state.expandedItems;
    expandedItems.push(id);
    this.setState({ expandedItems: expandedItems });
  }

  getItems(items, result) {
    // Filter items that have a status, for now.
    const itemCount = items.filter(i => i.status).length;
    const maxDisplay = 5;
    const moreCount = itemCount - maxDisplay;
    const expandedItems = this.state.expandedItems;
    const resultId = result.idBnum;

    // available items first
    items.sort((a, b) => {
      const aAvailability = a.status && a.status[0].prefLabel.trim().toLowerCase() === 'available' ? -1 : 1;
      const bAvailability = b.status && b.status[0].prefLabel.trim().toLowerCase() === 'available' ? -1 : 1;
      return aAvailability - bAvailability;
    });

    return items.map((item, i) => {
      const availability = item.status && item.status[0].prefLabel ? item.status[0].prefLabel : '';
      const available = availability.trim().toLowerCase() === 'available';
      const id = item['@id'].substring(4);
      const availabilityClassname = availability.replace(/\W/g, '').toLowerCase();
      const collapsed = expandedItems.indexOf(resultId) < 0

      return (
        <div key={i}>
          {
            item.status ? 
            <div className={`sub-item ${i>=maxDisplay && collapsed ? 'more' : ''}`}>
              <div>
                <span className={`status ${availabilityClassname}`}>{availability}</span>
                {
                  available ? ' to use in ' : ' '
                }
                <a href="#">{item.location && item.location.length ? item.location[0][0].prefLabel : null}</a>
                {
                  item.shelfMark && item.shelfMark.length ?
                  (<span className="call-no"> with call no. {item.shelfMark[0]}</span>)
                  : null
                }
              </div>
              <div>
                {
                  available ?
                    (
                      <Link
                        className="button"
                        to={`/hold/${id}`}
                        onClick={(e) => this.getRecord(e, id, 'hold')}
                      >
                        Place a hold
                      </Link>
                    )
                    : null
                }
              </div>
            </div>
            : null
          }
          {
            i >= itemCount - 1 && moreCount > 0 && collapsed ?
              (
                <Link
                  onClick={(e) => this.showMoreItems(e, resultId)}
                  href="#see-more"
                  className="see-more-link">
                  See {moreCount} more item{moreCount > 1 ? 's' : ''}
                </Link>
              )
              : null
          }
        </div>
      );
    });
  }

  render() {
    const results = this.props.results;
    let resultsElm = null;

    if (results && results.length) {
      resultsElm = results.map((item, i) => {
        const result = item.result;
        const itemTitle = result.title[0];
        const itemImage = result.btCover ? (
          <div className="result-image">
            <img src={result.btCover} />
          </div>
          ) : null;
        const authors = result.contributor && result.contributor.length ?
          result.contributor.map((author) => `${author}; ` )
          : null;
        const id = result['@id'].substring(4);
        const items = result.items;

        return (
          <li key={i} className="result-item">
            <div className="result-text">
              {/*<div className="type">{result.type ? result.type[0].prefLabel : null}</div>*/}
              <Link
                onClick={(e) => this.getRecord(e, id, 'item')}
                href={`/item/${id}`}
                className="title"
              >
                {itemTitle}
              </Link>
              <div className="description author">
                {authors} {result.created}
              </div>
              <div className="description">
              </div>
              <div className="sub-items">
                {this.getItems(items, result)}
              </div>
            </div>
          </li>
        );
      });
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
