const webpack = require('webpack');

const CopyWebpackPlugin = require('copy-webpack-plugin');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');

const IsProduct = process.env.NODE_ENV === 'production';

const plugins = [];

function make(commonEntries, pageEntries) {
    // notice reverse order
    plugins.push(new CommonsChunkPlugin({
        name: commonEntries.reverse(),
        minChunks: Infinity
    }));

    //copy external plugins resource, such as my97 & zTree
    plugins.push(new CopyWebpackPlugin([{
        from: './src/ext/plugins',
        to: 'assets/ext/plugins'
    }]));

    // inject env
    plugins.push(new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }));

    // webpack-dev-server enhancement plugins
    !IsProduct && plugins.push(new(require('webpack-dashboard/plugin'))());

    /// 按照官网说法，如果命令行添加了--hot命令，此处可以忽略
    // 如果是通过Node.js API new WebpackDevServer创建，需要手动添加此插件
    // 必须是二选一，不能同时配置
    // !IsProduct && plugins.push(new webpack.HotModuleReplacementPlugin());

    plugins.push.apply(plugins, require('./webpack.html.js')(commonEntries, pageEntries));

    // create module id
    plugins.push(new webpack[IsProduct ? 'HashedModuleIdsPlugin' : 'NamedModulesPlugin']());

    // js file ugly
    IsProduct && plugins.push(new webpack.optimize.UglifyJsPlugin({
        mangle: {
            screw_ie8: false,
            // keywords
            except: ['$super', '$', 'exwebServerPorts', 'require']

        },
        comments: false,
        compress: {
            properties: false,
            warnings: false
        },
        output: {
            beautify: false,
            quote_keys: true
        },
        sourceMap: false
    }));

    // extract css to file
    plugins.push(new ExtractTextPlugin({
        filename: IsProduct ? 'assets/css/[name].[contenthash:8].css' : 'assets/css/[name].css'
    }));

    return plugins;
}

module.exports = make;
