// Type definitions for elastic-muto
// Project: https://muto.js.org
// Definitions by: Suhas Karanth <sudo.suhas@gmail.com>

import { BoolQuery } from 'elastic-builder';

/**
 * Parses given expression and generates an `elastic-builder` query object.
 *
 * @param {string|Where|Condition} expr
 * @param {Array} [notAnalysedFields]
 * parsing the expression
 * @throws {SyntaxError} If expression is an invalid where condition
 */
export function parse(expr: string | Where | Condition, notAnalysedFields?: string[]): BoolQuery;

interface Location {
    line: number;
    column: number;
    offset: number;
}

interface LocationRange {
    start: Location,
    end: Location
}

interface ExpectedItem {
    type: string;
    value?: string;
    description: string;
}

export interface SyntaxError extends Error {
    name: string;
    message: string;
    location: LocationRange;
    found?: any;
    expected?: ExpectedItem[];
    stack?: any;
}

/**
 * Class for building Property Condition to be used with `Where`.
 *
 * @param {string} [prop] Name of the property key to crate condition against
 * @param {string} [operator] Operator for the condition. One of `is`, `eq`,
 * `ne`, `lt`, `lte`, `gt`, `gte`, `exists`, `missing`, `contain`, `notcontain`
 * @param {*} [value] Value for the property condition
 */
export class Condition {
    constructor(prop?: string, operator?: string, value?: any);

    /**
     * Sets the property name for condition.
     *
     * @param {string} prop Name of the property key to crate condition
     */
    prop(prop: string): this;

    /**
     * Sets the condition type to boolean with given parameter.
     *
     * @param {boolean} trueOrFalse `true` or `false`
     */
    is(trueOrFalse: boolean): this;

    /**
     * Sets the type of condition as equality with given value.
     *
     * @param {*} value A valid string/number/date to check equality ag
     */
    eq(value: any): this;

    /**
     * Sets the type of condition as not equal to given value.
     *
     * @param {*} value A valid string/number to check inequality again
     */
    ne(value: any): this;

    /**
     * Sets the type of condition as less than given value.
     *
     * @param {*} value A valid string/number/date.
     */
    lt(value: any): this;

    /**
     * Sets the type of condition as less than or equal to given value.
     *
     * @param {*} value A valid string/number/date.
     */
    lte(value: any): this;

    /**
     * Sets the type of condition as greater than given value
     *
     * @param {*} value A valid string/number/date.
     */
    gt(value: any): this;

    /**
     * Sets the type of condition as greater than or equal to given value
     *
     * @param {*} value A valid string/number/date.
     */
    gte(value: any): this;

    /**
     * Sets the type of condition to check value exists.
     *
     */
    exists(): this;

    /**
     * Sets the type of condition to check value is missing.
     *
     */
    missing(): this;

    /**
     * Sets the type of condition to check property contains given value.
     *
     * @param {*} value A valid string
     */
    contains(value: any): this;

    /**
     * Sets the type of condition to check property does not contain given value.
     *
     * @param {*} value A valid string
     */
    notContains(value: any): this;

    /**
     * Builds and returns muto syntax for Property Condition
     *
     * Property Condition
     */
    build(): string;
}

/**
 * Returns an instance of `Condition` for building Property Condition to be used with `Where`.
 *
 * @param {string} [prop] Name of the property key to crate condition against
 * @param {string} [operator] Operator for the condition. One of `is`, `eq`,
 * `ne`, `lt`, `lte`, `gt`, `gte`, `exists`, `missing`, `contain`, `notcontain`
 * @param {*} [value] Value for the property condition
 */
export function cn(prop?: string, operator?: string, value?: any): Condition;

/**
 * Returns an instance of `Condition` for building Property Condition to be used with `Where`.
 *
 * @param {string} [prop] Name of the property key to crate condition against
 * @param {string} [operator] Operator for the condition. One of `is`, `eq`,
 * `ne`, `lt`, `lte`, `gt`, `gte`, `exists`, `missing`, `contain`, `notcontain`
 * @param {*} [value] Value for the property condition
 */
export function condition(prop?: string, operator?: string, value?: any): Condition;

/**
 * Class for building `Where` expressions.
 *
 * @param {Condition|Where|string} [condition]
 */
export class Where {
    constructor(condition?: Condition | Where | string);

    /**
     * Adds an `and` condition. The condition can be instance of `Condition`,
     * `Where`(nested expr) or just a string.
     *
     * @param {Condition|Where|string} condition The condition to b
     * @throws {Error} If `and`, `or` are called on the same instance of `Where`
     */
    and(condition: Condition | Where | string): this;

    /**
     * Adds an `or` condition. The condition can be instance of `Condition`,
     * `Where`(nested expr) or just a string.
     *
     * @param {Condition|Where|string} condition The condition to b
     * @throws {Error} If `and`, `or` are called on the same instance of `Where`
     */
    or(condition: Condition | Where | string): this;

    /**
     * Build and return muto syntax for Where Expression
     * Where Expression
     */
    build(): string;
}

/**
 * Returns an instance of `Where` for building expressions.
 *
 * @param {Condition|Where|string} [condition]
 */
export function where(condition?: Condition | Where | string): Where;

/**
 * Utility function to parse and pretty print objects to console.
 * To be used in development.
 *
 * @param {*} obj
 */
export function prettyPrint(obj: any): void;
