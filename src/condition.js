'use strict';

const isNil = require('lodash.isnil');
const isFunction = require('lodash.isfunction');
const hasIn = require('lodash.hasin');

/**
 * Class for building Property Condition to be used with `Where`.
 *
 * @example
 * const condition = muto.cn('psngr_cnt', 'gt', 81);
 *
 * condition.build()
 * '["psngr_cnt"]" > 81'
 *
 * @param {string} [prop] Name of the property key to crate condition against
 * @param {string} [operator] Operator for the condition. One of `is`, `eq`,
 * `ne`, `lt`, `lte`, `gt`, `gte`, `exists`, `missing`, `contain`, `notcontain`
 * @param {*} [value] Value for the property condition
 */
class Condition {
    // eslint-disable-next-line require-jsdoc
    constructor(prop, operator, value) {
        if (!isNil(prop)) this._prop = prop;

        if (!isNil(operator)) {
            if (
                operator !== 'prop' &&
                operator !== 'build' &&
                hasIn(this, operator) &&
                isFunction(this[operator])
            ) {
                this[operator](value);
            } else throw new Error(`Invalid operator '${operator}'!`);
        }
    }

    /**
     * Sets the property name for condition.
     *
     * @param {string} prop Name of the property key to crate condition against
     * @returns {Condition} returns `this` so that calls can be chained
     */
    prop(prop) {
        this._prop = prop;
        return this;
    }

    /**
     * Sets the condition type to boolean with given parameter.
     *
     * @param {boolean} trueOrFalse `true` or `false`
     * @returns {Condition} returns `this` so that calls can be chained
     */
    is(trueOrFalse) {
        this._operator = 'is';
        this._value = trueOrFalse;
        return this;
    }

    /**
     * Sets the type of condition as equality with given value.
     *
     * @param {*} value A valid string/number/date to check equality against
     * @returns {Condition} returns `this` so that calls can be chained
     */
    eq(value) {
        this._operator = '==';
        this._value = value;
        return this;
    }

    /**
     * Sets the type of condition as not equal to given value.
     *
     * @param {*} value A valid string/number to check inequality against
     * @returns {Condition} returns `this` so that calls can be chained
     */
    ne(value) {
        this._operator = '!=';
        this._value = value;
        return this;
    }

    /**
     * Sets the type of condition as less than given value.
     *
     * @param {*} value A valid string/number/date.
     * @returns {Condition} returns `this` so that calls can be chained
     */
    lt(value) {
        this._operator = '<';
        this._value = value;
        return this;
    }

    /**
     * Sets the type of condition as less than or equal to given value.
     *
     * @param {*} value A valid string/number/date.
     * @returns {Condition} returns `this` so that calls can be chained
     */
    lte(value) {
        this._operator = '<=';
        this._value = value;
        return this;
    }

    /**
     * Sets the type of condition as greater than given value
     *
     * @param {*} value A valid string/number/date.
     * @returns {Condition} returns `this` so that calls can be chained
     */
    gt(value) {
        this._operator = '>';
        this._value = value;
        return this;
    }

    /**
     * Sets the type of condition as greater than or equal to given value
     *
     * @param {*} value A valid string/number/date.
     * @returns {Condition} returns `this` so that calls can be chained
     */
    gte(value) {
        this._operator = '>=';
        this._value = value;
        return this;
    }

    /**
     * Sets the type of condition to check value exists.
     *
     * @returns {Condition} returns `this` so that calls can be chained
     */
    exists() {
        this._operator = 'exists';
        return this;
    }

    /**
     * Sets the type of condition to check value is missing.
     *
     * @returns {Condition} returns `this` so that calls can be chained
     */
    missing() {
        this._operator = 'missing';
        return this;
    }

    /**
     * Sets the type of condition to check property contains given value.
     *
     * @param {*} value A valid string
     * @returns {Condition} returns `this` so that calls can be chained
     */
    contains(value) {
        this._operator = 'contains';
        this._value = value;
        return this;
    }

    /**
     *
     * @private
     * @param {*} value A valid string
     * @returns {Condition} returns `this` so that calls can be chained
     */
    notcontains(value) {
        return this.notContains(value);
    }

    /**
     * Sets the type of condition to check property does not contain given value.
     *
     * @param {*} value A valid string
     * @returns {Condition} returns `this` so that calls can be chained
     */
    notContains(value) {
        this._operator = '!contains';
        this._value = value;
        return this;
    }

    /**
     * Builds and returns muto syntax for Property Condition
     *
     * @returns {string} returns a string which maps to the muto syntax for
     * Property Condition
     */
    build() {
        // Not gonna throw error here if expected members are not populated
        // For exists and missing, thisn._value _should_ be undefined
        // We just check if the operator is one of the 2.
        if (this._operator === 'exists' || this._operator === 'missing') {
            return `["${this._prop}"] ${this._operator}`;
        }
        return `["${this._prop}"] ${this._operator} ${JSON.stringify(this._value)}`;
    }

    /**
     * Hotwire to return `this.build()`
     *
     * @override
     * @returns {string}
     */
    toString() {
        return this.build();
    }

    /**
     * Hotwire to return `this.build()`
     *
     * @override
     * @returns {string}
     */
    toJSON() {
        return this.build();
    }
}

module.exports = Condition;
