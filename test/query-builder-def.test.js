import * as bob from 'elastic-builder';
import qryBldrDef from '../src/query-builder-def';
import {
    conditions,
    cnNamesMap,
    cnQryMap,
    qryBldrArgs
} from './helpers/condition-factory';

describe('query builder default', () => {
    describe('has definition for', () => {
        conditions.forEach(cn => {
            test(cnNamesMap[cn], () => {
                expect(qryBldrDef[cn]).toBeDefined();
                expect(qryBldrDef[cn]).toBeInstanceOf(Function);
            });
        });
    });

    it('has method for generating property key', () => {
        expect(qryBldrDef.propertyKey).toBeDefined();
        expect(qryBldrDef.propertyKey).toBeInstanceOf(Function);
    });

    describe('build condition', () => {
        conditions.forEach(cn => {
            test(cnNamesMap[cn], () => {
                const qry = qryBldrDef[cn](...qryBldrArgs[cn]);

                expect(qry).toBeInstanceOf(cnQryMap[cn].constructor);
                expect(qry).toEqual(cnQryMap[cn]);
            });
        });

        test('string equals for not analyzed field', () => {
            const qry = qryBldrDef.strEq(...qryBldrArgs.strEqNotAnalyzed);

            expect(qry).toBeInstanceOf(bob.TermQuery);
            expect(qry).toEqual(cnQryMap.strEqNotAnalyzed);
        });

        test('string not equals for not analyzed field', () => {
            const qry = qryBldrDef.strNe(...qryBldrArgs.strNeNotAnalyzed);
            expect(qry).toBeInstanceOf(bob.BoolQuery);
            expect(qry).toEqual(cnQryMap.strNeNotAnalyzed);
        });
    });

    it('builds the property key from char array', () => {
        expect(qryBldrDef.propertyKey('blistering_barnacles'.split(''))).toBe(
            'blistering_barnacles'
        );
    });
});
