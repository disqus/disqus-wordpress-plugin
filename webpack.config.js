var path = require('path');
var webpack = require('webpack');
var I18nPlugin = require('i18n-webpack-plugin');

var OPTIMIZE = process.env.NODE_ENV === 'production';

var LANGUAGES = {
    'en': null,
};

var allConfigs = Object.keys(LANGUAGES).map(language => {
    var config = {
        entry: './frontend/src/js/index.js',
        resolve: {
            extensions: ['.js', '.jsx'],
            alias: {
                'utils': path.resolve(__dirname, 'frontend/src/js/utils'),
                'components': path.resolve(__dirname, 'frontend/src/js/components'),
                'rest': path.resolve(__dirname, 'frontend/src/js/rest'),
            },
        },
        output: {
            path: path.resolve(__dirname, 'disqus/admin/js'),
            filename: language + '.disqus-admin.bundle' + (OPTIMIZE ? '.min.js' : '.js'),
        },
        module: {
            rules: [{
                test: /.jsx?$/,
                loader: 'babel-loader',
                include: [
                    path.resolve(__dirname, 'frontend/src'),
                ],
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react'],
                },
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
