const gulp = require('gulp');

const extend = require('extend');

const HtmlWebpackPlugin = require('html-webpack-plugin');

const FaviconsWebpackPlugin = require('favicons-webpack-plugin');

const IsProduct = process.env.NODE_ENV === 'production';

const htmls = [new FaviconsWebpackPlugin({
    logo: './src/images/ffan.png',
    prefix: 'assets/icons/favicons/[hash:8]/',
})];

const defaults = {
    title: '',
    chunks: null,
    excludeChunks: null,
    filename: 'index.html',
    hash: false,
    showErrors: true,
    minify: !IsProduct ? false : {
        removeComments: true,
        collapseWhitespace: false
    }
};

function make(commonEntries, pageEntries) {
    for (var page of pageEntries) {
        var options = {};

        var chunks = commonEntries.map(function(it) {
            return it;
        }).reverse();

        chunks.push(page.id);

        extend(false, options, defaults, {
            chunks: chunks,
            filename: page.id + '.html',
            template: './src/html/pages/' + page.id + '.ejs'
        });

        htmls.push(new HtmlWebpackPlugin(options));
    }

    return htmls;
}

module.exports = make;
