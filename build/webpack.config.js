'use strict';

const path = require('path');

const webpack = require('webpack');
const WebpackStrip = require('strip-loader');

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
        new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            mangle: {
                screw_ie8: true,
                keep_fnames: false
            },
            compress: {
                screw_ie8: true,
                warnings: false,
                // Drop console statements
                drop_console: true
            },
            comments: false
        })
    ]
};
