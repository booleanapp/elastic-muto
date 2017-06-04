'use strict';

const assert = require('assert');

const muto = require('../../');

const qry = muto.parse('["abe"] exists');

assert.deepEqual(qry.toJSON(), {
    bool: {
        should: [
            {
                term: { $abe: 'dancing_monkey' }
            },
            {
                exists: { field: '$abe' }
            }
        ]
    }
});
