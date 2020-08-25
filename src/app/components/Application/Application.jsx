/* global window */
import React from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';
import { Header, navConfig } from '@nypl/dgx-header-component';
import Footer from '@nypl/dgx-react-footer';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import Feedback from '../Feedback/Feedback';
import LoadingLayer from '../LoadingLayer/LoadingLayer';
import DataLoader from '../DataLoader/DataLoader';

import { breakpoints } from '../../data/constants';

class Application extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      media: 'desktop',
      patron: props.patron,
    };
    this.submitFeedback = this.submitFeedback.bind(this);
  }

  getChildContext() {
    return {
      media: this.state.media,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.onWindowResize.bind(this));
    this.onWindowResize();
  }

  onWindowResize() {
    const { media } = this.state;
    const { innerWidth } = window;
    const {
      xtrasmall,
      tablet,
    } = breakpoints;

    if (innerWidth <= xtrasmall) {
      if (media !== 'mobile') this.setState({ media: 'mobile' });
    } else if (innerWidth <= tablet) {
      if (media !== 'tablet') this.setState({ media: 'tablet' });
    } else {
      if (media !== 'desktop') this.setState({ media: 'desktop' });
    }
  }

  submitFeedback(callback, e) {
    e.preventDefault();
    const { pathname, hash, search } = this.context.router.location;
    const currentURL = `${pathname}${hash}${search}`;

    callback(currentURL);
  }

  render() {
    // dataLocation is passed as a key to DataLoader to ensure it reloads
    // whenever the location changes.
    const dataLocation = Object.assign(
      {},
      this.context.router.location,
      {
        hash: null,
        action: null,
        key: null,
      },
    );

    return (
      <DocumentTitle title="Shared Collection Catalog | NYPL">
        <div className="app-wrapper">
          <Header
            navData={navConfig.current}
            patron={this.state.patron}
            skipNav={{ target: 'mainContent' }}
          />
          <LoadingLayer
            title="Loading"
            loading={this.props.loading}
          />
          <DataLoader
            location={this.context.router.location}
            key={JSON.stringify(dataLocation)}
          >
            {React.cloneElement(this.props.children)}
          </DataLoader>
          <Footer />
          <Feedback submit={this.submitFeedback} />
        </div>
      </DocumentTitle>
    );
  }
}

Application.propTypes = {
  children: PropTypes.object,
  patron: PropTypes.object,
  loading: PropTypes.bool,
};

Application.defaultProps = {
  children: {},
};

Application.contextTypes = {
  router: PropTypes.object,
};

Application.childContextTypes = {
  media: PropTypes.string,
};

export default withRouter(connect(({ patron, loading }) => ({ patron, loading }))(Application));
