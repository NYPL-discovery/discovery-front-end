/* globals document */
import React from 'react';
import SubjectHeadingsTableHeader from './SubjectHeadingsTableHeader';
import SubjectHeadingsTableBody from './SubjectHeadingsTableBody';


export default (props) => {
  const {
    subjectHeadings,
    linked,
    location,
    sortBy,
    showId,
    keyId,
    container,
    sortButton,
  } = props;

  return (
    <table className="subjectHeadingsTable">
      <SubjectHeadingsTableHeader sortButton={sortButton}/>
      <tbody>
        <SubjectHeadingsTableBody
          subjectHeadings={subjectHeadings}
          linked={linked}
          location={location}
          sortBy={sortBy}
          showId={showId}
          keyId={keyId}
          container={container}
        />
      </tbody>
  </table>
  );
};