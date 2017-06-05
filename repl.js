'use strict';

const repl = require('repl');

const muto = require('./');

repl.start('elastic-muto > ').context.muto = muto;
