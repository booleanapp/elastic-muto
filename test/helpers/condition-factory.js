import * as bob from 'elastic-builder';
import * as muto from '../../src';

const d1 = new Date('October 13, 2013 11:13:00');
const d2 = new Date('October 13, 2016 11:13:00');

export const conditions = [
    'numLt',
    'numLte',
    'numGt',
    'numGte',
    'numEq',
    'numNe',
    'dateLt',
    'dateLte',
    'dateGt',
    'dateGte',
    'dateEq',
    'strContains',
    'strNotContains',
    'strEq',
    // 'strEqNotAnalyzed', // special case
    'strNe',
    // 'strNeNotAnalyzed',
    'bool',
    'exists',
    'missing'
];

/**
 * Helper function to get random condition excluding given set
 * @private
 * @param {Set} exclude
 * @returns {function}
 */
export function randCnGen() {
    const exclude = new Set();
    return () => {
        let randCn;
        do {
            randCn = conditions[Math.floor(Math.random() * conditions.length)];
        } while (exclude.has(randCn));
        exclude.add(randCn);
        return randCn;
    };
}

export const cnNamesMap = {
    numLt: 'number less than',
    numLte: 'number less than or equal to',
    numGt: 'number greater than',
    numGte: 'number greater than or equal to',
    numEq: 'number equal to',
    numNe: 'number not equal to',
    dateLt: 'date less than',
    dateLte: 'date less than or equal to',
    dateGt: 'date greater than',
    dateGte: 'date greater than or equal to',
    dateEq: 'date equal to',
    strContains: 'string contains',
    strNotContains: 'string not contains',
    strEq: 'string equals',
    // 'strEqNotAnalyzed': 'string equals for not analyzed field', // special case
    strNe: 'string not equals',
    // 'strNeNotAnalyzed': 'string not equals for not analyzed field', // special case
    bool: 'bool',
    exists: 'exists',
    missing: 'missing'
};

export const cnMap = {
    numLt: muto.cn('num_idiots').lt(0),
    numLte: muto.cn('num_idiots').lte(0),
    numGt: muto.cn('contributors').gt(1),
    numGte: muto.cn('contributors').gte(1),
    numEq: muto.cn('idiots').eq(0),
    numNe: muto.cn('idiots').ne(1),
    dateLt: muto.cn('date_fld').lt(d2),
    dateLte: muto.cn('date_fld').lte(d2),
    dateGt: muto.cn('date_fld').gt(d1),
    dateGte: muto.cn('date_fld').gte(d1),
    dateEq: muto.cn('date_fld').eq(d1),
    strContains: muto.cn('life').contains('friends'),
    strNotContains: muto.cn('anime').notContains('fillers'),
    strEq: muto.cn('elasticsearch').eq('awesome'),
    // 'strEqNotAnalyzed',
    strNe: muto.cn('foo').ne('bar'),
    // 'strNeNotAnalyzed',
    bool: muto.cn('prophecy').is(true),
    exists: muto.cn('unicorn').exists(),
    missing: muto.cn('turds').missing()
};

export const cnQryMap = {
    numLt: bob.rangeQuery('num_idiots').lt(0),
    numLte: bob.rangeQuery('num_idiots').lte(0),
    numGt: bob.rangeQuery('contributors').gt(1),
    numGte: bob.rangeQuery('contributors').gte(1),
    numEq: bob.termQuery('idiots', 0),
    numNe: bob
        .boolQuery()
        .must(bob.existsQuery('idiots'))
        .mustNot(bob.termQuery('idiots', 1)),
    dateLt: bob.rangeQuery('date_fld').lt(d2.getTime()),
    dateLte: bob.rangeQuery('date_fld').lte(d2.getTime()),
    dateGt: bob.rangeQuery('date_fld').gt(d1.getTime()),
    dateGte: bob.rangeQuery('date_fld').gte(d1.getTime()),
    dateEq: bob
        .rangeQuery('date_fld')
        .gte(`${d1.getTime()}||/d`)
        .lte(`${d1.getTime()}||+1d/d`),
    strContains: bob.matchQuery('life', 'friends'),
    strNotContains: bob
        .boolQuery()
        .must(bob.existsQuery('anime'))
        .mustNot(bob.matchQuery('anime', 'fillers')),
    strEq: bob.termQuery('elasticsearch.keyword', 'awesome'),
    strEqNotAnalyzed: bob.termQuery('elasticsearch', 'awesome'),
    strNe: bob
        .boolQuery()
        .must(bob.existsQuery('foo'))
        .mustNot(bob.termQuery('foo.keyword', 'bar')),
    strNeNotAnalyzed: bob
        .boolQuery()
        .must(bob.existsQuery('foo'))
        .mustNot(bob.termQuery('foo', 'bar')),
    bool: bob.termQuery('prophecy', true),
    exists: bob.existsQuery('unicorn'),
    missing: bob.cookMissingQuery('turds')
};

export const qryBldrArgs = {
    numLt: ['num_idiots', 0],
    numLte: ['num_idiots', 0],
    numGt: ['contributors', 1],
    numGte: ['contributors', 1],
    numEq: ['idiots', 0],
    numNe: ['idiots', 1],
    dateLt: ['date_fld', d2],
    dateLte: ['date_fld', d2],
    dateGt: ['date_fld', d1],
    dateGte: ['date_fld', d1],
    dateEq: ['date_fld', d1],
    strContains: ['life', 'friends'],
    strNotContains: ['anime', 'fillers'],
    strEq: ['elasticsearch', 'awesome', new Set()],
    strEqNotAnalyzed: ['elasticsearch', 'awesome', new Set(['elasticsearch'])],
    strNe: ['foo', 'bar', new Set()],
    strNeNotAnalyzed: ['foo', 'bar', new Set(['foo'])],
    bool: ['prophecy', true],
    exists: ['unicorn'],
    missing: ['turds']
};
