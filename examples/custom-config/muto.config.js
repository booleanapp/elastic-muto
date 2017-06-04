'use strict';

const bob = require('elastic-builder');

module.exports = {
    // Condition builder for property exists
    exists(key) {
        // Either the property should exist
        // or it should be equal to `dancing_monkey`
        // Implicit `minimum_should_match = 1`
        return bob
            .boolQuery()
            .should(bob.termQuery(key, 'dancing_monkey'))
            .should(bob.existsQuery(key));
    },
    // Function for building property key
    // We can add custom logic for manipulating the field name here
    // Append $ to field names
    propertyKey: chars => '$' + chars.join('') // eslint-disable-line prefer-template
};
