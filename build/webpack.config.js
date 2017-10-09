'use strict';

const path = require('path');

const webpack = require('webpack');
const WebpackStrip = require('strip-loader');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: WebpackStrip.loader('debug')
            }
        ]
    },
    output: {
        library: 'muto',
        libraryTarget: 'umd'
    },
    plugins: [
        new webpack.NormalModuleReplacementPlugin(
            /debug/,
            path.join(__dirname, 'noop.js')
        ),

        new webpack.NormalModuleReplacementPlugin(
            /cosmiconfig/,
            path.join(__dirname, 'cosmiconfig-noop.js')
        ),
        new UglifyJSPlugin({
            sourceMap: false,
            uglifyOptions: {
                beautify: false,
                mangle: {
                    toplevel: true,
                    keep_fnames: false
                },
                compressor: {
                    warnings: false,
                    conditionals: true,
                    unused: true,
                    comparisons: true,
                    sequences: true,
                    dead_code: true,
                    evaluate: true,
                    if_return: true,
                    join_vars: true,
                    negate_iife: false
                },
                comments: false
            }
        })
    ]
};
