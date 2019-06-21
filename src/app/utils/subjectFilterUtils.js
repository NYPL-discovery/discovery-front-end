const subjectFilterUtil = {
  getSubjectLiteralFilters(apiFilters) {
    const apiSubjectLiteralFilters = apiFilters.filter(
      apiFilter => apiFilter.field === 'subjectLiteral',
    );
    return apiSubjectLiteralFilters.length ? apiSubjectLiteralFilters[0] : null;
  },

  subjectFilterIsSelected(selectedSubjectLiteralFilters) {
    return subjectLiteralFilter =>
      selectedSubjectLiteralFilters.some(
        selectedFilter => subjectLiteralFilter.value === selectedFilter.value,
      );
  },

  /**
    params: selectedSubjectLiteralFilters is an object with a 'values' property, which
    points to an array of filters represented by objects of the form:
    {
      value,
      label,
      count
    }
    e.g. the value could be 'Dogs -- Card Games -- Painting.'

    explodedSubjectFilters modifies the array by adding

    {
      value: X,
      label: X,
      count: Y
    }

    whenever

    {
      value: X -- Z,
      label: X -- Z,
      count: Y
    }

    is in the original array.
  */

  explodeSubjectFilters(selectedSubjectLiteralFilters) {
    selectedSubjectLiteralFilters
      .values
      .forEach((valueObject) => {
        // get all the components of a subject filter, e.g. 'X -- Y -- Z' => ['X', 'Y', 'Z']
        let explodedValues = valueObject
          .value
          .replace(/\.$/, '')
          .split(/--/g);
        // map all the components to the subject filter up to that point
        // e.g. [X, Y, Z] => [X, X -- Y, X -- Y -- Z]
        explodedValues = explodedValues.map((_, i) => explodedValues.slice(0, i + 1).join('--').trim());
        // add objects representing each exploded filter back into the list of filters
        explodedValues.forEach((explodedValue) => {
          selectedSubjectLiteralFilters.values.push({
            value: explodedValue,
            label: explodedValue,
            count: valueObject.count, // this seems like it could cause problems when there is more than one subject
          });
        });
      });
  },

  /**
    params:
      apiFilters: an object containing all the aggregations received from the api
      selectedFilters: an object containing the currently selected filters (selected in
         the Refine Search accordion)
    narrowSubjectFilters returns a new object, which is a copy of apiFilters but with only
     the selected subjectLiteralFilters
  */

  narrowSubjectFilters(apiFilters, selectedFilters) {
    // deep copy the apiFilters object
    const newApiFilters = JSON.parse(JSON.stringify(apiFilters));
    // grab the aggregated subject literal filters
    const subjectLiteralFilters = this.getSubjectLiteralFilters(newApiFilters);
    // add the exploded subject literals if there are any
    if (subjectLiteralFilters) {
      this.explodeSubjectFilters(subjectLiteralFilters);
    }
    // get the selected subject literals
    const selectedSubjectLiteralFilters = selectedFilters.subjectLiteral || [];
    // build a function which filters subject filters down to those in selectedSubjectLiteralFilters
    const checkIsSelected = this.subjectFilterIsSelected(selectedSubjectLiteralFilters);
    // remove all the unselected filters from subject literal filters
    if (subjectLiteralFilters) {
      subjectLiteralFilters.values = subjectLiteralFilters
        .values
        .filter(checkIsSelected);
    }
    return newApiFilters;
  },
};

export default subjectFilterUtil;
