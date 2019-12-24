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
import appConfig from '../../../../appConfig';
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
    this.redirectTo = this.redirectTo.bind(this);
    this.updateSort = this.updateSort.bind(this);
    this.updatePage = this.updatePage.bind(this);
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

    axios({
      method: 'GET',
      url: `${appConfig.shepApi}/subject_headings?${apiParamString}`,
      crossDomain: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    },
    ).then(
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

  extractParam(paramName, url) {
    const params = url.replace(/[^\?]*\?/, '');
    const matchdata = params.match(new RegExp(`(^|&)${paramName}=([^&]*)`));
    return matchdata && matchdata[2];
  }

  convertApiUrlToFrontendUrl(url) {
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
    return `${path}?${paramString}`;
  }

  redirectTo(url) {
    const redirectFunction = function (e) {
      e.preventDefault();
      this.context.router.push(url);
    };
    return redirectFunction.bind(this);
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

  updatePage(page, type) {
    const {
      previousUrl,
      nextUrl,
    } = this.state;
    const urlForPrevious = this.convertApiUrlToFrontendUrl(previousUrl);
    const urlForNext = this.convertApiUrlToFrontendUrl(nextUrl);
    if (type === 'Previous') {
      this.context.router.push(urlForPrevious);
    } else {
      this.context.router.push(urlForNext);
    }
  }

  pagination() {
    return (
      <Pagination
        page={2}
        updatePage={this.updatePage}
        subjectShowPage
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
      <div>
        <LoadingLayer status={loading} title={"Subject Headings"}/>
        <div className="subjectMainContentWrapper">
          <div className="subjectHeadingMainContent index">
            {this.pagination()}
            <div className="tableHeadingsWrapper">
            </div>
            <SubjectHeadingsTable
              subjectHeadings={subjectHeadings}
              linked={linked}
              location={location}
              sortBy={sortBy}
              sortButton={sortButton}
            />
            {this.pagination()}
          </div>
        </div>
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
