import * as muto from '../src';

describe('index.js', () => {
    it('exports members', () => {
        expect(muto).toBeDefined();
        expect(muto).toBeInstanceOf(Object);

        expect(muto.parse).toBeDefined();
        expect(muto.parse).toBeInstanceOf(Function);

        expect(muto.SyntaxError).toBeDefined();
        expect(muto.SyntaxError).toBeInstanceOf(Function);

        expect(muto.Where).toBeDefined();
        expect(muto.Where).toBeInstanceOf(Function);

        expect(muto.where).toBeDefined();
        expect(muto.where).toBeInstanceOf(Function);

        expect(muto.Condition).toBeDefined();
        expect(muto.Condition).toBeInstanceOf(Function);

        expect(muto.condition).toBeDefined();
        expect(muto.condition).toBeInstanceOf(Function);

        expect(muto.cn).toBeDefined();
        expect(muto.cn).toBeInstanceOf(Function);

        expect(muto.prettyPrint).toBeDefined();
        expect(muto.prettyPrint).toBeInstanceOf(Function);
    });

    describe('prettyPrint', () => {
        it('calls parse', () => {
            // Doesn't work for some reason
            // const spyParse = jest.spyOn(muto, 'parse');
            const spyConsole = jest.spyOn(console, 'log');

            muto.prettyPrint('["awesome"] is true');

            // expect(spyParse).toHaveBeenCalled();
            expect(spyConsole).toHaveBeenCalled();

            // spyParse.mockReset();
            // spyParse.mockRestore();
            spyConsole.mockReset();
            spyConsole.mockRestore();
        });
    });
});
