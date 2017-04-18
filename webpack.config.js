var path = require('path');
var webpack = require('webpack');
var I18nPlugin = require('i18n-webpack-plugin');

var OPTIMIZE = process.env.NODE_ENV === 'production';

var LANGUAGES = {
    'en': null,
};

var allConfigs = Object.keys(LANGUAGES).map(language => {
    var config = {
        entry: './frontend/src/ts/index.ts',
        output: {
            path: path.resolve(__dirname, 'disqus/admin/js'),
            filename: language + '.disqus-admin.bundle' + (OPTIMIZE ? '.min.js' : '.js'),
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

    if (OPTIMIZE)
        config.plugins.push(new webpack.optimize.UglifyJsPlugin());

    return config;
});

module.exports = allConfigs;
