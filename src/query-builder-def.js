'use strict';

const debug = require('debug')('elastic-muto');

const bob = require('elastic-builder');

module.exports = {
    // Condition builder for number less than or equal to
    numLte(key, value) {
        debug('Number property less than or equal to condition');
        debug('key - %s, value - %s', key, value);
        return bob.rangeQuery(key).lte(value);
    },

    // Condition builder for number greater than or equal to
    numGte(key, value) {
        debug('Number property greater than or equal to condition');
        debug('key - %s, value - %s', key, value);
        return bob.rangeQuery(key).gte(value);
    },

    // Condition builder for number less than
    numLt(key, value) {
        debug('Number property less than condition');
        debug('key - %s, value - %s', key, value);
        return bob.rangeQuery(key).lt(value);
    },

    // Condition builder for number greater than or equal to
    numGt(key, value) {
        debug('Number property greater than condition');
        debug('key - %s, value - %s', key, value);
        return bob.rangeQuery(key).gt(value);
    },

    // Condition builder for number equalality
    numEq(key, value) {
        debug('Number property equality condition');
        debug('key - %s, value - %s', key, value);
        return bob.termQuery(key, value);
    },

    // Condition builder for number inequality
    numNe(key, value) {
        debug('Number property inequality condition');
        debug('key - %s, value - %s', key, value);
        return bob
            .boolQuery()
            .must(bob.existsQuery(key))
            .mustNot(bob.termQuery(key, value));
    },

    // Condition builder for date less than or equal to
    dateLte(key, value) {
        debug('Date property less than or equal to condition');
        debug('key - %s, value - %s', key, value);
        return bob.rangeQuery(key).lte(value.getTime());
    },

    // Condition builder for date greater than or equal to
    dateGte(key, value) {
        debug('Date property less than or equal to condition');
        debug('key - %s, value - %s', key, value);
        return bob.rangeQuery(key).gte(value.getTime());
    },

    // Condition builder for date less than
    dateLt(key, value) {
        debug('Date property less than condition');
        debug('key - %s, value - %s', key, value);
        return bob.rangeQuery(key).lt(value.getTime());
    },

    // Condition builder for date greater than
    dateGt(key, value) {
        debug('Date property greater than condition');
        debug('key - %s, value - %s', key, value);
        return bob.rangeQuery(key).gt(value.getTime());
    },

    // Condition builder for date equality
    dateEq(key, value) {
        debug('Date property equality condition');
        debug('key - %s, value - %s', key, value);
        return bob
            .rangeQuery(key)
            .gte(`${value.getTime()}||/d`)
            .lte(`${value.getTime()}||+1d/d`);
    },

    // Condition builder for string contains
    strContains(key, value) {
        debug('String property contains condition');
        debug('key - %s, value - %s', key, value);
        return bob.matchQuery(key, value);
    },

    // Condition builder for string does not contain
    strNotContains(key, value) {
        debug('String property does not contain condition');
        debug('key - %s, value - %s', key, value);
        return bob
            .boolQuery()
            .must(bob.existsQuery(key))
            .mustNot(bob.matchQuery(key, value));
    },

    // Condition builder for string equality
    strEq(key, value, notAnalysedFields) {
        debug('String property equality condition');
        debug('key - %s, value - %s', key, value);
        const fieldName = notAnalysedFields.has(key) ? key : `${key}.keyword`;
        return bob.termQuery(fieldName, value);
    },

    // Condition builder for string inequality
    strNe(key, value, notAnalysedFields) {
        debug('String property inequality condition');
        debug('key - %s, value - %s', key, value);
        const fieldName = notAnalysedFields.has(key) ? key : `${key}.keyword`;
        return bob
            .boolQuery()
            .must(bob.existsQuery(key))
            .mustNot(bob.termQuery(fieldName, value));
    },

    // Condition for boolean property equality
    bool(key, value) {
        debug('Boolean condition');
        debug('key - %s, value - %s', key, value);
        return bob.termQuery(key, value);
    },

    // Condition builder for property exists
    exists(key) {
        debug('Property Exists condition');
        debug('key - %s', key);
        return bob.existsQuery(key);
    },

    // Condition builder for property missing
    missing(key) {
        debug('Property does not exist condition');
        debug('key - %s', key);
        return bob.cookMissingQuery(key);
    },

    // Function for building property key
    propertyKey: chars => chars.join('')
};
