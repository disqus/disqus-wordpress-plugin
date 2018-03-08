var package = require('./package.json');
var path = require('path');
var webpack = require('webpack');
var I18nPlugin = require('i18n-webpack-plugin');

var OPTIMIZE = process.env.NODE_ENV === 'production';

var LANGUAGES = {
    'en': null,
};

var allConfigs = Object.keys(LANGUAGES).map(function (language) {
    var config = {
        entry: './frontend/src/ts/index.ts',
        output: {
            path: path.resolve(__dirname, 'disqus/admin/bundles/js'),
            filename: language + '.disqus-admin.bundle.' + package.version + (OPTIMIZE ? '.min.js' : '.js'),
        },
        devtool: 'source-map',
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        },
        module: {
            rules: [{
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader',
            }, {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader',
            }],
        },
        plugins: [
            new I18nPlugin(LANGUAGES[language]),
        ],
    };

    if (OPTIMIZE) {
        // Tells React to use production build: https://facebook.github.io/react/docs/optimizing-performance.html#use-the-production-build
        config.plugins.push(new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
            },
        }));
    }

    return config;
});

module.exports = allConfigs;
