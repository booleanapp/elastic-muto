'use strict';

const repl = require('repl');

const muto = require('./src');

repl.start('elastic-muto > ').context.muto = muto;
