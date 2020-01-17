/* globals document */
import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import axios from 'axios';
import SubjectHeadingsTable from './SubjectHeadingsTable'
// import SubjectHeadingsList from './SubjectHeadingsList';
import SubjectHeadingsTableHeader from './SubjectHeadingsTableHeader'
import SubjectHeadingSearch from './Search/SubjectHeadingSearch'
import SortButton from './SortButton';
import appConfig from '../../data/appConfig';
import LoadingLayer from '../LoadingLayer/LoadingLayer';
import Pagination from '../Pagination/Pagination';


class SubjectHeadingsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      loading: true,
    };
    this.pagination = this.pagination.bind(this);
    this.updateSort = this.updateSort.bind(this);
    this.navigationLinks = this.navigationLinks.bind(this);
    this.currentPage = this.currentPage.bind(this);
  }

  componentDidMount() {
    let {
      fromLabel,
      fromComparator,
      filter,
      sortBy,
      fromAttributeValue,
    } = this.props.location.query;

    if (!fromComparator) fromComparator = filter ? null : "start"
    if (!fromLabel) fromLabel = filter ? null : "Aac"

    const apiParamHash = {
      from_comparator: fromComparator,
      from_label: fromLabel,
      filter,
      sort_by: sortBy,
      from_attribute_value: fromAttributeValue,
    };

    const apiParamString = Object
      .entries(apiParamHash)
      .map(([key, value]) => (value ? `${key}=${value}` : null))
      .filter(pair => pair)
      .join('&');

    axios(`${appConfig.shepApi}/subject_headings?${apiParamString}`,)
    .then(
      (res) => {
        this.setState({
          previousUrl: res.data.previous_url,
          nextUrl: res.data.next_url,
          subjectHeadings: res.data.subject_headings,
          error: res.data.subject_headings.length === 0,
          loading: false
        });
      },
    ).catch(
      (err) => {
        console.log('error: ', err);
        if (!this.state.subjectHeadings || this.state.subjectHeadings.length === 0) {
          this.setState({ error: true });
        }
      },
    );
  }

  currentPage() {
    return parseInt(this.props.location.query.page || 2);
  }

  extractParam(paramName, url) {
    const params = url.replace(/[^\?]*\?/, '');
    const matchdata = params.match(new RegExp(`(^|&)${paramName}=([^&]*)`));
    return matchdata && matchdata[2];
  }

  convertApiUrlToFrontendUrl(url, type) {
    if (!url) return null;
    const path = this.props.location.pathname;
    const paramHash = {
      fromLabel: 'from_label',
      fromComparator: 'from_comparator',
      filter: 'filter',
      fromAttributeValue: 'from_attribute_value',
      sortBy: 'sort_by',
    };
    const paramString = Object.entries(paramHash)
      .map(([key, value]) => {
        const extractedValue = this.extractParam(value, url);
        return extractedValue ? `${key}=${extractedValue}` : null;
      },
      )
      .filter(pair => pair)
      .join('&');
    return `${path}?${paramString}&page=${this.currentPage() + (type === 'next' ? 1 : -1)}`;
  }

  updateSort(e) {
    e.preventDefault();
    const {
      pathname,
      query,
    } = this.props.location;
    const paramString = `filter=${query.filter}&sortBy=${e.target.value}`;
    if (e.target.value !== this.state.sortBy) {
      this.context.router.push(`${pathname}?${paramString}`);
    }
  }

  navigationLinks() {
    const {
      previousUrl,
      nextUrl,
    } = this.state;
    const urlForPrevious = this.convertApiUrlToFrontendUrl(previousUrl, 'previous');
    const urlForNext = this.convertApiUrlToFrontendUrl(nextUrl, 'next');

    return { previous: urlForPrevious, next: urlForNext }
  }

  pagination() {
    return (
      <Pagination
        page={this.currentPage()}
        shepNavigation={this.navigationLinks()}
        subjectIndexPage
      />
    );
  }

  render() {
    const { error, subjectHeadings, loading } = this.state;
    const location = this.props.location;
    let { linked, sortBy, filter } = this.props.location.query;

    if (!linked) linked = '';

    if (error) {
      return (
        <div>
            'No results found for that search'
        </div>
      )
    }

    const sortButton = (
      filter
        ? <SortButton sortBy={sortBy || 'alphabetical'} handler={this.updateSort} />
        : null
    );

    return (
      <div
        className="nypl-column-full subjectHeadingMainContent index"
      >
        {this.pagination()}
        <SubjectHeadingsTable
          subjectHeadings={subjectHeadings}
          linked={linked}
          location={location}
          sortBy={sortBy}
          sortButton={sortButton}
        />
        {this.pagination()}
      </div>
    );
  }
}

SubjectHeadingsContainer.contextTypes = {
  router: PropTypes.object,
};

SubjectHeadingsContainer.propTypes = {
  location: PropTypes.object,
};

export default SubjectHeadingsContainer;
