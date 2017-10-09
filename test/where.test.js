import * as muto from '../src';

const { Where, Condition } = muto;

const cn1 = new Condition('anime').notContains('fillers');
const cn2 = new Condition('elasticsearch').eq('awesome');
const strCn1 = '["one_piece"] exists';
const strCn2 = '["awesome"] is true';

describe('Where builder', () => {
    it('can be instantiated with a condition', () => {
        const where = new Where(strCn1).build();
        expect(where).toBe(`(${strCn1})`);
    });

    it('aliases work as expected', () => {
        const where = new Where(strCn1);
        expect(muto.where(strCn1)).toEqual(where);
    });

    it('calls build on condition objects', () => {
        const where = new Where(cn1);

        const spy = jest.spyOn(cn1, 'build');
        where.build();
        expect(spy).toHaveBeenCalled();

        spy.mockReset();
        spy.mockRestore();
    });

    it('can handle both string and object conditions', () => {
        const where = new Where(strCn2).and(cn1).build();
        expect(where).toBe(`(${strCn2} and ${cn1.build()})`);
    });

    it('throws error if both and, or are called', () => {
        expect(() => new Where().and(cn1).or(cn2)).toThrowError(
            'Illegal operation! Join types cannot be mixed!'
        );
    });

    it('can handle nested conditions', () => {
        const where = new Where(cn1)
            .and(cn2)
            .and(new Where(strCn1).or(strCn2))
            .build();
        expect(where).toBe(
            `(${cn1.build()} and ${cn2.build()} and (${strCn1} or ${strCn2}))`
        );
    });

    it('delegates to the build function on calling toJSON', () => {
        const where = new Where(cn1);
        const spy = jest.spyOn(where, 'build');
        where.toJSON();

        expect(spy).toHaveBeenCalled();

        spy.mockReset();

        JSON.stringify(where);
        expect(spy).toHaveBeenCalled();

        spy.mockReset();
        spy.mockRestore();
    });

    it('delegates to the build function on calling toString', () => {
        const where = new Where(cn1);
        const spy = jest.spyOn(where, 'build');
        where.toString();

        expect(spy).toHaveBeenCalled();

        spy.mockReset();
        spy.mockRestore();
    });
});
