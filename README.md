## Discovery
### Shared Collection Catalog
[![GitHub version](https://badge.fury.io/gh/nypl-discovery%2Fdiscovery-front-end.svg)](https://badge.fury.io/gh/nypl-discovery%2Fdiscovery-front-end)
[![Build Status](https://travis-ci.org/NYPL-discovery/discovery-front-end.svg?branch=master)](https://travis-ci.org/NYPL-discovery/discovery-front-end)
[![Dependencies Status](https://david-dm.org/nypl-discovery/discovery-front-end/status.svg)](https://david-dm.org/nypl-discovery/discovery-front-end)
[![devDependencies Status](https://david-dm.org/nypl-discovery/discovery-front-end/dev-status.svg)](https://david-dm.org/nypl-discovery/discovery-front-end?type=dev)

[![forthebadge](http://forthebadge.com/images/badges/built-with-love.svg)](https://nypl.org)


Front-end app for searching, discovering, and placing a hold on research items from NYPL and ReCAP partners. Currently using data from the [Discovery API](https://github.com/NYPL-discovery/registry-api).

## Technology

* Universal React
* [Alt](http://alt.js.org/)/Iso as the Flux implementation
* Webpack & Webpack Dev Server
* ES6 and Babel
* ESLint with [Airbnb's config](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb)
* Unit Testing with [Mocha](https://mochajs.org/) and [Enzyme](http://airbnb.io/enzyme/)
* Express Server
* [Travis](https://travis-ci.org/)

## Installation and running locally

To install packages run

    $ npm install

To run locally in development mode run

    $ clientID=[client id] clientSecret=[client secret] npm run dev-start

If you would like to run in different the environments, run

    $ clientID=[client id] clientSecret=[client secret] APP_ENV=[environment variable] npm start

`environment variable` is the name of the particular environment, such as `qa`.

At last, visit `localhost:3001`.

To run locally in production mode run

    $ npm run dist
    $ clientID=[client id] clientSecret=[client secret] NODE_ENV=production APP_ENV=[environment variable] npm start

and visit `localhost:3001`.
NOTE: Currently the only working `environment variable` is `development`.

## Client Id and Secret
We are environment variables to make authorized requests to NYPL's API platform. The `clientId` and `clientSecret` environment variables should be received from a developer in the NYPL Digital Department.

Please check the [EBSVARS](EBSVARS.md) documentation for more information.

## Contributing

Cut branches off of the `development` branch, and open pull requests against `development`.  

## Testing

### Unit Tests
Unit tests are currently written in the [Mocha](https://mochajs.org/) testing framework. [Chai](http://chaijs.com/) is used as the assertion library and [Enzyme](http://airbnb.io/enzyme/) is used as the React testing utility.

We are also integrating [Travis](https://travis-ci.org/) for better test work flow. After every push to the github repo, Travis will help us build and test the code.

You can see the current build result at [here](https://travis-ci.org/NYPL-discovery/discovery-front-end).

The tests can be found in the `test` folder.

To run all the tests once, run

    $ npm run test

To run the tests continuously for active development, run

    $ npm run test-dev

To run a specific test file, run

    $ npm run test-file test/SearchResultsPage.test.js

### Code Coverage
[Istanbul](https://istanbul.js.org/) is used for checking code coverage.

To run the code coverage tool and view a quick report, run

    $ npm run coverage

To run the code coverage tool and view a better report, run

    $ npm run coverage-report

This last command will create a folder called `coverage` in the root directory. You can open up `coverage/lcov-report/index.html` in a browser to see more details about what lines of codes have not been tested.

### End-to-end Tests
Currently testing out [Nightwatch.js](http://nightwatchjs.org/) as the testing framework. WebDriver and its API is used by Nightwatch to run end-to-end tests against a browser. WebDriver is a W3C specification aiming to standardize browser automation and that project started off as a part of the Selenium project.

In order to run the tests, the command will be:

    $ npm run nightwatch

but what first needs to be configured are the browser drivers and the Selenium Server.
* Create a folder `bin` at the root level.
* Download the [Selenium Server](http://selenium-release.storage.googleapis.com/index.html) picking the 3.x.x version. Add the `selenium-server-standalone-3.x.x.jar` file inside the `bin` folder.
* Download the latest [Chrome Driver](https://sites.google.com/a/chromium.org/chromedriver/downloads) and add it to the `bin` folder.
* Download the latest [Gecko Driver](https://github.com/mozilla/geckodriver/releases) (for FireFox) and add it to the `bin` folder.

Running `npm run nightwatch` should run the tests now which are located at `test/nightwatch/*`. Currently, starting the Selenium Server, selecting a browser, and running the tests are all encapsulated within the `npm run nightwatch` command.

The command

    $ npm run nightwatch

runs with Chrome as the default browser. If the Firefox browser wants to be tested, run

    $ npm run nightwatch -- --env firefox.

The `default`, `firefox`, and other nightwatch settings can be found in `./nightwatch.json`.

If you run into a Java version issue such as `java.lang.UnsupportedClassVersionError` when running the Selenium server, make sure that your current Java installation is being pointed to in `~/.bash_profile`:

    export JAVA_HOME="/Library/Java/.../Contents/Home/";

## React Accessibility

### eslint-plugin-jsx-a11y
Adding accessibility rule checker through ESLint and the [eslint-plugin-jsx-a11y](https://github.com/evcohen/eslint-plugin-jsx-a11y) plugin. This checks accessibility issues when ESLint is ran in the command line.

Note: At the moment, use ESLint as the global package by install the packages:

    $ sudo npm install -g eslint eslint-plugin-jsx-a11y eslint-config-airbnb

And to check files run:

    $ eslint src/app/components/.../path/to/file.jsx

Or all components at once:

    $ eslint src/app/components/**/*

### react-a11y
[react-a11y](https://github.com/reactjs/react-a11y) is an npm package that can be run in development mode when the `loadA11y` environment variable is set to true.

    $ loadA11y=true npm start

This will output warnings in the browser's console for elements that do not meet accessibility standards. Some rules may be too strict and should be verified against other accessibility rules.

## Misc

Starting up from a [Node/React boilerplate](https://bitbucket.org/NYPL/dgx-nypl-react-boilerplate).

## Deployment

### Elastic Beanstalk
We are using AWS EB to deploy our app. Check the [deployment file](DEPLOYMENT.md) for more information.

## Feedback Form

The `Feedback` component in `src/app/components/Feedback/Feedback.jsx` can help us collect the feedback from patrons, send it to the Google Form, and finally, present it with [the Google Spreadsheet](https://docs.google.com/spreadsheets/d/1jD8EnC0uoPuo118jUF3of9MNgvrXTv1Jww67ZVJCSHs/edit#gid=536144761).

Every time the `Feedback` component has significant updates, it might lead to the need to create a new Google Form and Spreadsheet to match those updates. Here are the steps to create and sync the HTML form with a Google Form.

 - First, create a Google Form based on the fields of the HTML form. The fields need to be the same type respectively.

 - Second, under the `RESPONSES` tab, click the three dots icon to open the setting, then click `Select response destination`, choose `Create a new spreadsheet`. The spreadsheet will be the one to present the feedback.

 - Then, go to the Google Form page and get the form URL.

 - Forth, copy the URL, replace the path _/viewform_ with the path _/formResponse_ in its end. Enter the URL to the HTML form's action attribute.

 - At last, view the page source of the Google Form page and find the value of each field's name attribute. Enter the value to the name attribute of the respectively field in the HTML form.

 - Run the application and test it with the feedback form.
