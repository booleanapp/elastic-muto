'use strict';

const mutoParser = require('./muto-parser');
const parse = require('./parse');
const Where = require('./where');
const Condition = require('./condition');

exports.parse = parse;

/**
 * Syntax error thrown by PEG.js on trying to parse an invalid expression
 *
 * @extends Error
 */
exports.SyntaxError = mutoParser.SyntaxError;

exports.Where = Where;
exports.where = condition => new Where(condition);

exports.Condition = Condition;
exports.condition = exports.cn = (...args) => new Condition(...args);

exports.prettyPrint = function prettyPrint(expr) {
    console.log(JSON.stringify(parse(expr), null, 2));
};
