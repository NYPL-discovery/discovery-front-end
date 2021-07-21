import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import DocumentTitle from 'react-document-title';

import {
  Breadcrumbs,
  Heading,
} from '@nypl/design-system-react-components';

import LoadingLayer from '../LoadingLayer/LoadingLayer';
import SubNav from '../SubNav/SubNav';
import appConfig from '../../data/appConfig';

const SccContainer = (props) => {
  const {
    loading,
  } = useSelector(state => ({
    loading: state.loading,
  }));
  const {
    useLoadingLayer,
    children,
    activeSection,
    className,
    pageTitle,
    primaryId,
  } = props;

  const documentTitle = `${pageTitle ? `${pageTitle} | ` : ''}${appConfig.displayTitle} | NYPL`;

  return (
    <DocumentTitle title={documentTitle}>
      <div className="nypl-ds nypl--research layout-container">
        {
          useLoadingLayer ? (
            <LoadingLayer
              loading={loading}
            />
          ) : null
        }
        <main className="main main-page">
          <div className="content-header catalog__header">
            <Breadcrumbs
              breadcrumbs={[
                { url: 'https://www.nypl.org/', text: 'Home' },
                { url: 'https://www.nypl.org/research', text: 'Research' },
                { url: appConfig.baseUrl, text: appConfig.displayTitle },
              ]}
              className="breadcrumbs"
            />
            <div className="catalog__heading">
              <Heading
                level={1}
                id="1"
                blockName="hero"
              >
                {appConfig.displayTitle}
              </Heading>
            </div>
            <SubNav activeSection={activeSection} />
          </div>
          <div className={`content-primary ${className || ''}`} id={primaryId}>
            {children}
          </div>
        </main>
      </div>
    </DocumentTitle>
  );
};

SccContainer.propTypes = {
  children: PropTypes.array,
  useLoadingLayer: PropTypes.bool,
  activeSection: PropTypes.string,
  className: PropTypes.string,
  pageTitle: PropTypes.string,
  primaryId: PropTypes.string,
};

SccContainer.defaultProps = {
  useLoadingLayer: true,
  primaryId: 'SccContainer-content-primary',
};

SccContainer.contextTypes = {
  router: PropTypes.object,
};

export default SccContainer;
