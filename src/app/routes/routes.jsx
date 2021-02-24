import React from 'react';

import { IndexRoute, Route, Redirect } from 'react-router';

/*
 * Pages
 */
import SubjectHeadingsIndexPage from '../pages/SubjectHeadingsIndexPage';
import SubjectHeadingShowPage from '../pages/SubjectHeadingShowPage';
import SearchResults from '../pages/SearchResultsPage';
import BibPage from '../pages/BibPage';
import Home from '../pages/Home';

/*
 * Components
 */
import Application from '../components/Application/Application';
import HoldRequest from '../components/HoldRequest/HoldRequest';
import HoldConfirmation from '../components/HoldConfirmation/HoldConfirmation';
import ElectronicDelivery from '../components/ElectronicDelivery/ElectronicDelivery';
import NotFound404 from '../components/NotFound404/NotFound404';
import appConfig from '../data/appConfig';

const { baseUrl } = appConfig;
const routes = {
  // Routes used in the Express server:
  server: (
    <Route path="/" component={Application}>
      <IndexRoute component={Home} />
      <Route path="/search" component={SearchResults} />
      <Route path="/bib/:bibId" component={BibPage} />
      <Route path="/bib/:bibId/all" component={BibPage} />
      <Route path="/hold/request/:bibId-:itemId" component={HoldRequest} />
      <Route path="/hold/request/:bibId-:itemId/edd" component={ElectronicDelivery} />
      <Route path="/hold/confirmation/:bibId-:itemId" component={HoldConfirmation} />
      <Route path="/subject_headings/:subjectHeadingUuid" component={SubjectHeadingShowPage} />
      <Route path="/subject_headings" component={SubjectHeadingsIndexPage} />
      <Route path="/404" component={NotFound404} />
      <Redirect from="*" to="/404" />
    </Route>
  ),
  // Routes used in the client-side React-Router:
  client: (
    <Route path={`${baseUrl}/`} component={Application}>
      <IndexRoute component={Home} />
      <Route path={`${baseUrl}/search`} component={SearchResults} />
      <Route path={`${baseUrl}/bib/:bibId`} component={BibPage} />
      <Route path={`${baseUrl}/bib/:bibId/all`} component={BibPage} />
      <Route path={`${baseUrl}/hold/request/:bibId-:itemId`} component={HoldRequest} />
      <Route path={`${baseUrl}/hold/request/:bibId-:itemId/edd`} component={ElectronicDelivery} />
      <Route path={`${baseUrl}/hold/confirmation/:bibId-:itemId`} component={HoldConfirmation} />
      <Route path={`${baseUrl}/subject_headings/:subjectHeadingUuid`} component={SubjectHeadingShowPage} />
      <Route path={`${baseUrl}/subject_headings`} component={SubjectHeadingsIndexPage} />
      <Route path={`${baseUrl}/404`} component={NotFound404} />
      <Redirect from="*" to={`${baseUrl}/404`} />
    </Route>
  ),
};

export default routes;
