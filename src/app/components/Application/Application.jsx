/* global window */
import React from 'react';
import PropTypes from 'prop-types';
import DocumentTitle from 'react-document-title';

import { Header, navConfig } from '@nypl/dgx-header-component';
import Footer from '@nypl/dgx-react-footer';

import Feedback from '../Feedback/Feedback';
import Store from '../../stores/Store';
import PatronStore from '../../stores/PatronStore';
import {
  basicQuery,
} from '../../utils/utils';

import { breakpoints } from '../../data/constants';
import DataLoader from '../DataLoader/DataLoader';

class Application extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: Store.getState(),
      patron: PatronStore.getState(),
      media: 'desktop',
    };
    this.onChange = this.onChange.bind(this);
    this.shouldStoreUpdate = this.shouldStoreUpdate.bind(this);
  }

  getChildContext() {
    return { media: this.state.media };
  }

  componentDidMount() {
    Store.listen(this.onChange);


    window.addEventListener('resize', this.onWindowResize.bind(this));
    this.onWindowResize();
  }

  shouldStoreUpdate() {
    return `?${basicQuery({})(Store.getState())}` !== this.context.router.location.search;
  }

  componentWillUnmount() {
    Store.unlisten(this.onChange);
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

  onChange() {
    this.setState({ data: Store.getState() });
  }

  render() {
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
            skipNav={{ target: 'mainContent' }}
            patron={this.state.patron}
          />
          <DataLoader
            location={this.context.router.location}
            next={Store.next}
            key={JSON.stringify(dataLocation)}
          >
            {React.cloneElement(this.props.children, this.state.data)}
          </DataLoader>
          <Footer />
          <Feedback location={this.props.location} />
        </div>
      </DocumentTitle>
    );
  }
}

Application.propTypes = {
  children: PropTypes.object,
  location: PropTypes.object,
};

Application.defaultProps = {
  children: {},
  location: {},
};

Application.contextTypes = {
  router: PropTypes.object,
};

Application.childContextTypes = {
  media: PropTypes.string,
};

export default Application;
