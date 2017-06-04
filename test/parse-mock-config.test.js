import * as bob from 'elastic-builder';
import { parse } from '../src';

jest.mock('cosmiconfig', () => () => ({
    load: () => ({
        config: {
            propertyKey: chars => `$${chars.join('')}`
        }
    })
}));

describe('parse', () => {
    it('reads custom config if applicable', () => {
        const qry = parse('["foo"] == "bar"');
        expect(qry).toEqual(bob.boolQuery().must(bob.termQuery('$foo.keyword', 'bar')));
    });
});
