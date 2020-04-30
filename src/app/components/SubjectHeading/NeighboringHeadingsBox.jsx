import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import LocalLoadingLayer from './LocalLoadingLayer';
import SubjectHeadingsTable from './SubjectHeadingsTable';

class NeighboringHeadingsBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      contextHeadings,
      contextIsLoading,
      location,
      uuid,
      linkUrl,
      contextError,
    } = this.props;

    let content;

    if (contextError) {
      content = (<div>Error loading neighboring headings</div>);
    } else if (contextIsLoading) {
      content = (<LocalLoadingLayer message="Loading More Subject Headings" />);
    } else {
      content = (
        <SubjectHeadingsTable
          subjectHeadings={contextHeadings}
          location={location}
          showId={uuid}
          keyId="context"
          container="context"
          seeMoreLinkUrl={linkUrl}
          seeMoreText="See More in Subject Headings Index"
          tfootContent={
            <tr>
              <td>
                <Link
                  to={linkUrl}
                  className="toIndex"
                >
                  Explore more in Subject Heading index
                </Link>
              </td>
            </tr>
          }
        />
      );
    }

    return (
      <div
        className="nypl-column-half subjectHeadingInfoBox"
        tabIndex='0'
        aria-label="Neighboring Subject Headings"
      >
        <div className="backgroundContainer">
          <h4>Neighboring Subject Headings</h4>
        </div>
        {content}
      </div>
    );
  }
}

NeighboringHeadingsBox.propTypes = {
  location: PropTypes.object,
  uuid: PropTypes.string,
  linkUrl: PropTypes.string,
  contextHeadings: PropTypes.object,
  contextIsLoading: PropTypes.bool,
  contextError: PropTypes.bool,
};

export default NeighboringHeadingsBox;