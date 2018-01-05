/* eslint max-lines: "off" */

import * as bob from 'elastic-builder';
import Combinatorics from 'js-combinatorics';
import * as muto from '../src';
import {
    conditions,
    cnNamesMap,
    cnMap,
    cnQryMap,
    randCnGen
} from './helpers/condition-factory';

const { parse } = muto;

const existsCnStr = cnMap.exists.build();

describe('parse', () => {
    it('throws error for empty expression', () => {
        expect(() => parse(null)).toThrowError('Expression cannot be empty!');
    });

    it('can parse strings', () => {
        const qry = parse(existsCnStr);

        expect(qry).toBeInstanceOf(bob.BoolQuery);
        expect(qry).toEqual(bob.boolQuery().must(cnQryMap.exists));
    });

    it('can parse objects with build method', () => {
        const testObj = { build: () => existsCnStr };
        const spy = jest.spyOn(testObj, 'build');

        const qry = parse(testObj);

        expect(spy).toHaveBeenCalled();
        expect(qry).toBeInstanceOf(bob.BoolQuery);
        expect(qry).toEqual(bob.boolQuery().must(cnQryMap.exists));
    });

    it('calls toString as last resort', () => {
        const testObj = { toString: () => existsCnStr };
        const spy = jest.spyOn(testObj, 'toString');

        const qry = parse(testObj);

        expect(spy).toHaveBeenCalled();
        expect(qry).toBeInstanceOf(bob.BoolQuery);
        expect(qry).toEqual(bob.boolQuery().must(cnQryMap.exists));
    });

    describe('simple condition', () => {
        conditions.forEach(cn => {
            test(cnNamesMap[cn], () => {
                const qry = parse(cnMap[cn]);

                expect(qry).toBeInstanceOf(bob.BoolQuery);
                if (cnQryMap[cn] instanceof bob.BoolQuery) {
                    expect(qry).toEqual(cnQryMap[cn]);
                } else {
                    expect(qry).toEqual(bob.boolQuery().must(cnQryMap[cn]));
                }
            });
        });

        test('string equals for not analyzed field', () => {
            const qry = parse(cnMap.strEq, ['elasticsearch']);
            expect(qry).toBeInstanceOf(bob.BoolQuery);
            expect(qry).toEqual(
                bob.boolQuery().must(cnQryMap.strEqNotAnalyzed)
            );
        });

        test('string not equals for not analyzed field', () => {
            const qry = parse(cnMap.strNe, ['foo']);
            expect(qry).toBeInstanceOf(bob.BoolQuery);
            expect(qry).toEqual(cnQryMap.strNeNotAnalyzed);
        });
    });

    describe('condition combinations', () => {
        const cmb2 = Combinatorics.combination(conditions, 2);

        let cmb;
        while ((cmb = cmb2.next())) {
            const [cn1, cn2] = cmb;
            test(`${cnNamesMap[cn1]} and ${cnNamesMap[cn2]}`, () => {
                const qry = parse(muto.where(cnMap[cn1]).and(cnMap[cn2]));

                expect(qry).toBeInstanceOf(bob.BoolQuery);
                expect(qry).toEqual(
                    bob.boolQuery().must([cnQryMap[cn1], cnQryMap[cn2]])
                );
            });

            test(`${cnNamesMap[cn1]} or ${cnNamesMap[cn2]}`, () => {
                const qry = parse(muto.where(cnMap[cn1]).or(cnMap[cn2]));

                expect(qry).toBeInstanceOf(bob.BoolQuery);
                expect(qry).toEqual(
                    bob.boolQuery().should([cnQryMap[cn1], cnQryMap[cn2]])
                );
            });
        }
        for (let idx = 0; idx < 100; idx++) {
            const randCn = randCnGen();
            const cn1 = randCn(),
                cn2 = randCn(),
                cn3 = randCn();
            test(`${cnNamesMap[cn1]} and ${cnNamesMap[cn2]} and ${
                cnNamesMap[cn3]
            }`, () => {
                const qry = parse(
                    muto
                        .where(cnMap[cn1])
                        .and(cnMap[cn2])
                        .and(cnMap[cn3])
                );

                expect(qry).toBeInstanceOf(bob.BoolQuery);
                expect(qry).toEqual(
                    bob
                        .boolQuery()
                        .must([cnQryMap[cn1], cnQryMap[cn2], cnQryMap[cn3]])
                );
            });

            test(`${cnNamesMap[cn1]} or ${cnNamesMap[cn2]} or ${
                cnNamesMap[cn3]
            }`, () => {
                const qry = parse(
                    muto
                        .where(cnMap[cn1])
                        .or(cnMap[cn2])
                        .or(cnMap[cn3])
                );

                expect(qry).toBeInstanceOf(bob.BoolQuery);
                expect(qry).toEqual(
                    bob
                        .boolQuery()
                        .should([cnQryMap[cn1], cnQryMap[cn2], cnQryMap[cn3]])
                );
            });

            test(`(${cnNamesMap[cn1]} and ${cnNamesMap[cn2]}) or ${
                cnNamesMap[cn3]
            }`, () => {
                const qry = parse(
                    muto
                        .where(muto.where(cnMap[cn1]).and(cnMap[cn2]))
                        .or(cnMap[cn3])
                );

                expect(qry).toBeInstanceOf(bob.BoolQuery);
                expect(qry).toEqual(
                    bob
                        .boolQuery()
                        .should([
                            bob
                                .boolQuery()
                                .must([cnQryMap[cn1], cnQryMap[cn2]]),
                            cnQryMap[cn3]
                        ])
                );
            });

            test(`(${cnNamesMap[cn1]} or ${cnNamesMap[cn2]}) and ${
                cnNamesMap[cn3]
            }`, () => {
                const qry = parse(
                    muto
                        .where(muto.where(cnMap[cn1]).or(cnMap[cn2]))
                        .and(cnMap[cn3])
                );

                expect(qry).toBeInstanceOf(bob.BoolQuery);
                expect(qry).toEqual(
                    bob
                        .boolQuery()
                        .must([
                            bob
                                .boolQuery()
                                .should([cnQryMap[cn1], cnQryMap[cn2]]),
                            cnQryMap[cn3]
                        ])
                );
            });

            test(`${cnNamesMap[cn1]} and (${cnNamesMap[cn2]} or ${
                cnNamesMap[cn3]
            })`, () => {
                const qry = parse(
                    muto
                        .where(cnMap[cn1])
                        .and(muto.where(cnMap[cn2]).or(cnMap[cn3]))
                );

                expect(qry).toBeInstanceOf(bob.BoolQuery);
                expect(qry).toEqual(
                    bob
                        .boolQuery()
                        .must([
                            cnQryMap[cn1],
                            bob
                                .boolQuery()
                                .should([cnQryMap[cn2], cnQryMap[cn3]])
                        ])
                );
            });

            test(`${cnNamesMap[cn1]} or (${cnNamesMap[cn2]} and ${
                cnNamesMap[cn3]
            })`, () => {
                const qry = parse(
                    muto
                        .where(cnMap[cn1])
                        .or(muto.where(cnMap[cn2]).and(cnMap[cn3]))
                );

                expect(qry).toBeInstanceOf(bob.BoolQuery);
                expect(qry).toEqual(
                    bob
                        .boolQuery()
                        .should([
                            cnQryMap[cn1],
                            bob.boolQuery().must([cnQryMap[cn2], cnQryMap[cn3]])
                        ])
                );
            });
        }
        // const cmb3 = Combinatorics.combination(conditions, 3);
        // while ((cmb = cmb3.next())) {
        //     const [cn1, cn2, cn3] = cmb;
        // }
    });

    describe('nested expressions', () => {
        describe('2 levels', () => {
            for (let idx = 0; idx < 100; idx++) {
                const randCn = randCnGen();
                const cn1 = randCn(),
                    cn2 = randCn(),
                    cn3 = randCn(),
                    cn4 = randCn();
                test(`(${cnNamesMap[cn1]} and ${cnNamesMap[cn2]})
                    or
                    (${cnNamesMap[cn3]} and ${cnNamesMap[cn4]})`, () => {
                    const qry = parse(
                        muto
                            .where()
                            .or(muto.where(cnMap[cn1]).and(cnMap[cn2]))
                            .or(muto.where(cnMap[cn3]).and(cnMap[cn4]))
                    );

                    expect(qry).toBeInstanceOf(bob.BoolQuery);
                    expect(qry).toEqual(
                        bob
                            .boolQuery()
                            .should([
                                bob
                                    .boolQuery()
                                    .must([cnQryMap[cn1], cnQryMap[cn2]]),
                                bob
                                    .boolQuery()
                                    .must([cnQryMap[cn3], cnQryMap[cn4]])
                            ])
                    );
                });

                test(`(${cnNamesMap[cn1]} or ${cnNamesMap[cn2]})
                    and
                    (${cnNamesMap[cn3]} or ${cnNamesMap[cn4]})`, () => {
                    const qry = parse(
                        muto
                            .where()
                            .and(muto.where(cnMap[cn1]).or(cnMap[cn2]))
                            .and(muto.where(cnMap[cn3]).or(cnMap[cn4]))
                    );

                    expect(qry).toBeInstanceOf(bob.BoolQuery);
                    expect(qry).toEqual(
                        bob
                            .boolQuery()
                            .must([
                                bob
                                    .boolQuery()
                                    .should([cnQryMap[cn1], cnQryMap[cn2]]),
                                bob
                                    .boolQuery()
                                    .should([cnQryMap[cn3], cnQryMap[cn4]])
                            ])
                    );
                });
            }
        });

        describe('3 levels', () => {
            for (let idx = 0; idx < 50; idx++) {
                const randCn = randCnGen();
                const cn1 = randCn(),
                    cn2 = randCn(),
                    cn3 = randCn();
                const cn4 = randCn(),
                    cn5 = randCn(),
                    cn6 = randCn();

                test(`(${cnNamesMap[cn1]} and ${cnNamesMap[cn2]})
                    or
                    (${cnNamesMap[cn3]} and ${cnNamesMap[cn4]}
                        and
                        (${cnNamesMap[cn5]} or ${cnNamesMap[cn6]})
                    )`, () => {
                    const qry = parse(
                        muto
                            .where()
                            .or(muto.where(cnMap[cn1]).and(cnMap[cn2]))
                            .or(
                                muto
                                    .where(cnMap[cn3])
                                    .and(cnMap[cn4])
                                    .and(muto.where(cnMap[cn5]).or(cnMap[cn6]))
                            )
                    );

                    expect(qry).toBeInstanceOf(bob.BoolQuery);
                    expect(qry).toEqual(
                        bob
                            .boolQuery()
                            .should([
                                bob
                                    .boolQuery()
                                    .must([cnQryMap[cn1], cnQryMap[cn2]]),
                                bob
                                    .boolQuery()
                                    .must([
                                        cnQryMap[cn3],
                                        cnQryMap[cn4],
                                        bob
                                            .boolQuery()
                                            .should([
                                                cnQryMap[cn5],
                                                cnQryMap[cn6]
                                            ])
                                    ])
                            ])
                    );
                });

                test(`(${cnNamesMap[cn1]} or ${cnNamesMap[cn2]})
                    and
                    (${cnNamesMap[cn3]} or ${cnNamesMap[cn4]}
                        or
                        (${cnNamesMap[cn5]} and ${cnNamesMap[cn6]})
                    )`, () => {
                    const qry = parse(
                        muto
                            .where()
                            .and(muto.where(cnMap[cn1]).or(cnMap[cn2]))
                            .and(
                                muto
                                    .where(cnMap[cn3])
                                    .or(cnMap[cn4])
                                    .or(muto.where(cnMap[cn5]).and(cnMap[cn6]))
                            )
                    );

                    expect(qry).toBeInstanceOf(bob.BoolQuery);
                    expect(qry).toEqual(
                        bob
                            .boolQuery()
                            .must([
                                bob
                                    .boolQuery()
                                    .should([cnQryMap[cn1], cnQryMap[cn2]]),
                                bob
                                    .boolQuery()
                                    .should([
                                        cnQryMap[cn3],
                                        cnQryMap[cn4],
                                        bob
                                            .boolQuery()
                                            .must([
                                                cnQryMap[cn5],
                                                cnQryMap[cn6]
                                            ])
                                    ])
                            ])
                    );
                });
            }
        });

        describe('4 levels', () => {
            for (let idx = 0; idx < 50; idx++) {
                const randCn = randCnGen();
                const cn1 = randCn(),
                    cn2 = randCn(),
                    cn3 = randCn(),
                    cn4 = randCn();
                const cn5 = randCn(),
                    cn6 = randCn(),
                    cn7 = randCn(),
                    cn8 = randCn();

                test(`(${cnNamesMap[cn1]} and ${cnNamesMap[cn2]})
                    or
                    (${cnNamesMap[cn3]} and ${cnNamesMap[cn4]}
                        and
                        (${cnNamesMap[cn5]} or ${cnNamesMap[cn6]}
                            or
                            (${cnNamesMap[cn7]} and ${cnNamesMap[cn8]})
                        )
                    )`, () => {
                    const qry = parse(
                        muto
                            .where()
                            .or(muto.where(cnMap[cn1]).and(cnMap[cn2]))
                            .or(
                                muto
                                    .where(cnMap[cn3])
                                    .and(cnMap[cn4])
                                    .and(
                                        muto
                                            .where(cnMap[cn5])
                                            .or(cnMap[cn6])
                                            .or(
                                                muto
                                                    .where(cnMap[cn7])
                                                    .and(cnMap[cn8])
                                            )
                                    )
                            )
                    );

                    expect(qry).toBeInstanceOf(bob.BoolQuery);
                    expect(qry).toEqual(
                        bob
                            .boolQuery()
                            .should([
                                bob
                                    .boolQuery()
                                    .must([cnQryMap[cn1], cnQryMap[cn2]]),
                                bob
                                    .boolQuery()
                                    .must([
                                        cnQryMap[cn3],
                                        cnQryMap[cn4],
                                        bob
                                            .boolQuery()
                                            .should([
                                                cnQryMap[cn5],
                                                cnQryMap[cn6],
                                                bob
                                                    .boolQuery()
                                                    .must([
                                                        cnQryMap[cn7],
                                                        cnQryMap[cn8]
                                                    ])
                                            ])
                                    ])
                            ])
                    );
                });

                test(`(${cnNamesMap[cn1]} or ${cnNamesMap[cn2]})
                    and
                    (${cnNamesMap[cn3]} or ${cnNamesMap[cn4]}
                        or
                        (${cnNamesMap[cn5]} and ${cnNamesMap[cn6]}
                            and
                            (${cnNamesMap[cn7]} or ${cnNamesMap[cn8]})
                        )
                    )`, () => {
                    const qry = parse(
                        muto
                            .where()
                            .and(muto.where(cnMap[cn1]).or(cnMap[cn2]))
                            .and(
                                muto
                                    .where(cnMap[cn3])
                                    .or(cnMap[cn4])
                                    .or(
                                        muto
                                            .where(cnMap[cn5])
                                            .and(cnMap[cn6])
                                            .and(
                                                muto
                                                    .where(cnMap[cn7])
                                                    .or(cnMap[cn8])
                                            )
                                    )
                            )
                    );

                    expect(qry).toBeInstanceOf(bob.BoolQuery);
                    expect(qry).toEqual(
                        bob
                            .boolQuery()
                            .must([
                                bob
                                    .boolQuery()
                                    .should([cnQryMap[cn1], cnQryMap[cn2]]),
                                bob
                                    .boolQuery()
                                    .should([
                                        cnQryMap[cn3],
                                        cnQryMap[cn4],
                                        bob
                                            .boolQuery()
                                            .must([
                                                cnQryMap[cn5],
                                                cnQryMap[cn6],
                                                bob
                                                    .boolQuery()
                                                    .should([
                                                        cnQryMap[cn7],
                                                        cnQryMap[cn8]
                                                    ])
                                            ])
                                    ])
                            ])
                    );
                });
            }
        });

        describe('5 levels', () => {
            for (let idx = 0; idx < 50; idx++) {
                const randCn = randCnGen();
                const cn1 = randCn(),
                    cn2 = randCn(),
                    cn3 = randCn(),
                    cn4 = randCn();
                const cn5 = randCn(),
                    cn6 = randCn(),
                    cn7 = randCn(),
                    cn8 = randCn();
                const cn9 = randCn(),
                    cn10 = randCn();

                test(`(${cnNamesMap[cn1]} and ${cnNamesMap[cn2]})
                    or
                    (${cnNamesMap[cn3]} and ${cnNamesMap[cn4]}
                        and
                        (${cnNamesMap[cn5]} or ${cnNamesMap[cn6]}
                            or
                            (${cnNamesMap[cn7]} and ${cnNamesMap[cn8]}
                            and
                            (${cnNamesMap[cn9]} or ${cnNamesMap[cn10]})
                            )
                        )
                    )`, () => {
                    const qry = parse(
                        muto
                            .where()
                            .or(muto.where(cnMap[cn1]).and(cnMap[cn2]))
                            .or(
                                muto
                                    .where(cnMap[cn3])
                                    .and(cnMap[cn4])
                                    .and(
                                        muto
                                            .where(cnMap[cn5])
                                            .or(cnMap[cn6])
                                            .or(
                                                muto
                                                    .where(cnMap[cn7])
                                                    .and(cnMap[cn8])
                                                    .and(
                                                        muto
                                                            .where(cnMap[cn9])
                                                            .or(cnMap[cn10])
                                                    )
                                            )
                                    )
                            )
                    );

                    expect(qry).toBeInstanceOf(bob.BoolQuery);
                    expect(qry).toEqual(
                        bob
                            .boolQuery()
                            .should([
                                bob
                                    .boolQuery()
                                    .must([cnQryMap[cn1], cnQryMap[cn2]]),
                                bob
                                    .boolQuery()
                                    .must([
                                        cnQryMap[cn3],
                                        cnQryMap[cn4],
                                        bob
                                            .boolQuery()
                                            .should([
                                                cnQryMap[cn5],
                                                cnQryMap[cn6],
                                                bob
                                                    .boolQuery()
                                                    .must([
                                                        cnQryMap[cn7],
                                                        cnQryMap[cn8],
                                                        bob
                                                            .boolQuery()
                                                            .should([
                                                                cnQryMap[cn9],
                                                                cnQryMap[cn10]
                                                            ])
                                                    ])
                                            ])
                                    ])
                            ])
                    );
                });

                test(`(${cnNamesMap[cn1]} or ${cnNamesMap[cn2]})
                    and
                    (${cnNamesMap[cn3]} or ${cnNamesMap[cn4]}
                        or
                        (${cnNamesMap[cn5]} and ${cnNamesMap[cn6]}
                            and
                            (${cnNamesMap[cn7]} or ${cnNamesMap[cn8]}
                            or
                            (${cnNamesMap[cn9]} and ${cnNamesMap[cn10]})
                            )
                        )
                    )`, () => {
                    const qry = parse(
                        muto
                            .where()
                            .and(muto.where(cnMap[cn1]).or(cnMap[cn2]))
                            .and(
                                muto
                                    .where(cnMap[cn3])
                                    .or(cnMap[cn4])
                                    .or(
                                        muto
                                            .where(cnMap[cn5])
                                            .and(cnMap[cn6])
                                            .and(
                                                muto
                                                    .where(cnMap[cn7])
                                                    .or(cnMap[cn8])
                                                    .or(
                                                        muto
                                                            .where(cnMap[cn9])
                                                            .and(cnMap[cn10])
                                                    )
                                            )
                                    )
                            )
                    );

                    expect(qry).toBeInstanceOf(bob.BoolQuery);
                    expect(qry).toEqual(
                        bob
                            .boolQuery()
                            .must([
                                bob
                                    .boolQuery()
                                    .should([cnQryMap[cn1], cnQryMap[cn2]]),
                                bob
                                    .boolQuery()
                                    .should([
                                        cnQryMap[cn3],
                                        cnQryMap[cn4],
                                        bob
                                            .boolQuery()
                                            .must([
                                                cnQryMap[cn5],
                                                cnQryMap[cn6],
                                                bob
                                                    .boolQuery()
                                                    .should([
                                                        cnQryMap[cn7],
                                                        cnQryMap[cn8],
                                                        bob
                                                            .boolQuery()
                                                            .must([
                                                                cnQryMap[cn9],
                                                                cnQryMap[cn10]
                                                            ])
                                                    ])
                                            ])
                                    ])
                            ])
                    );
                });
            }
        });
    });

    it('throws error for expression with mixed `and`, `or`', () => {
        expect(() =>
            parse(
                `${cnMap.numLt} and ${cnMap.strEq} or ${cnMap.bool} or ${
                    cnMap.exists
                } and ${cnMap.missing}`
            )
        ).toThrow();
    });
});
