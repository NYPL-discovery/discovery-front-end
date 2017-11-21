import React from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import { Link } from 'react-router';

import appConfig from '../../../../appConfig.js';

const NotFound404 = () => (
  <DocumentTitle title="404 | Shared Collection Catalog | NYPL">
    <main id="mainContent" className="not-found-404">
      <div className="nypl-full-width-wrapper">
        <div className="nypl-row">
          <div className="nypl-column-three-quarters">
            <h1>404 Not Found</h1>
            <p>We're sorry...</p>
            <p>The page you were looking for doesn't exist.</p>
            <p>
              Search the <Link to={`${appConfig.baseUrl}/`}>
              Shared Collection Catalog</Link> or our classic <a href="http://catalog.nypl.org/">
              Research Catalog</a> for research materials.</p>
          </div>
        </div>
      </div>
    </main>
  </DocumentTitle>
);

NotFound404.propTypes = {
  searchKeywords: PropTypes.string,
  searchURL: PropTypes.string,
};

export default NotFound404;
