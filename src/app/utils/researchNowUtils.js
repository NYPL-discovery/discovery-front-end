/*
  `createResearchNowQuery()` currently handles:
  `search_scope`, `dateAfter`, `dateBefore`,
  `contributorLiteral`, `subjectLiteral`, `language`,
  sorting, and pagination
*/

/* eslint-disable camelcase */

const mapSearchScope = {
  all: 'keyword',
  contributor: 'author',
  standard_number: 'standardNumber',
  title: 'title',
  date: 'date',
};

const filterObj = (field, value) => ({ field, value });
const queryObj = (field, query) => ({ field, query });

const mapFilters = (filters = {}) => {
  const researchNowFilters = [];

  const years = {};
  if (filters.dateAfter) years.start = filters.dateAfter;
  if (filters.dateBefore) years.end = filters.dateBefore;
  if (years.start || years.end) researchNowFilters.push(filterObj('years', years));
  if (filters.language) {
    const languages = filters.language.map(lang => lang.replace('lang:', ''));
    languages.forEach(language => researchNowFilters.push(filterObj('language', language)));
  }

  return researchNowFilters;
};

const createResearchNowQuery = (params) => {
  const {
    q,
    sort,
    sort_direction,
    filters,
    page,
    search_scope,
  } = params;

  const mainQuery = queryObj(
    mapSearchScope[search_scope] || 'keyword',
    q || '*');

  const query = {
    queries: [mainQuery],
    per_page: 3,
    page: (page - 1) || 0,
  };

  if (sort) {
    query.sort = [{ field: sort }];
    if (sort_direction) query.sort[0].dir = sort_direction;
  }

  console.log('researchNowQuery', query);

  if (!filters) return query;

  const {
    subjectLiteral,
    contributorLiteral,
    language,
    dateAfter,
    dateBefore,
  } = filters;

  if (subjectLiteral) {
    subjectLiteral.forEach(subject => query.queries.push(queryObj('subject', subject)));
  }
  if (contributorLiteral) query.queries.push(queryObj('author', contributorLiteral));

  if (language || dateAfter || dateBefore) {
    query.filters = mapFilters({ dateAfter, dateBefore, language });
  }
  console.log(query);

  return query;
};

const authorUrl = author => encodeURIComponent(JSON.stringify({ queries: [queryObj('author', author)] }));

export {
  createResearchNowQuery,
  authorUrl,
};
