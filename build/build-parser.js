'use strict';
const fs = require('fs');

const path = require('path');

const PEG = require('pegjs');

const pegjsDefPath = path.resolve(__dirname, '../src/muto.pegjs');

const pegjsOutputPath = path.resolve(__dirname, '../src/muto-parser.js');

const options = {
    dependencies: { bob: 'elastic-builder' },
    cache: true,
    optimize: 'speed',
    format: 'commonjs',
    output: 'source',
    trace: false,
    plugins: []
};

fs.writeFileSync(
    pegjsOutputPath,
    PEG.generate(fs.readFileSync(pegjsDefPath, 'utf8'), options)
);
