import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { isEmpty as _isEmpty } from 'underscore';

const createMarkup = (html) => ({ __html: html });

const ItemTableRow = ({ item, bibId, getRecord }) => {
  if (_isEmpty(item)) {
    return null;
  }

  let itemLink;
  let itemDisplay = null;

  if (item.requestHold) {
    itemLink = item.available ?
      <Link
        className="button"
        to={`/hold/request/${bibId}-${item.id}`}
        onClick={(e) => getRecord(e, bibId, item.id)}
        tabIndex="0"
      >Request</Link> :
      <span className="nypl-item-unavailable">Unavailable</span>;
  }

  if (item.callNumber) {
    itemDisplay = <span dangerouslySetInnerHTML={createMarkup(item.callNumber)}></span>;
  } else if (item.isElectronicResource) {
    itemDisplay = <span>{item.location}</span>;
  }

  return (
    <tr className={item.availability}>
      <td>{item.location}</td>
      <td>{itemDisplay}</td>
      <td>{item.status.prefLabel}</td>
      <td>{item.accessMessage.prefLabel}</td>
      <td>{itemLink}</td>
    </tr>
  );
};

ItemTableRow.propTypes = {
  item: PropTypes.object,
  bibId: PropTypes.string,
  getRecord: PropTypes.func,
};

export default ItemTableRow;
