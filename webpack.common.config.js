const path = require('path');

const glob = require('glob');

const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');

// CSS浏览器前缀问题
const autoprefixer = require('autoprefixer');

const precss = require('precss');

const plugins = [
    // 全局依赖,根据需要补充
    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        moment: 'moment'
    }),
    // CSS文件放置在CSS目录
    new ExtractTextPlugin('./assets/css/[name].css')
    // new webpack.optimize.OccurenceOrderPlugin()
];

// 项目使用技术选型
function setPlatformEntries(entrys) {

    entrys = entrys || {};

    entrys['jquery'] = ['jquery'];

    entrys['moment'] = ['moment'];

    plugins.push(new CommonsChunkPlugin({ // 注意顺序
        name: ['moment', 'jquery'],
        minChunks: Infinity
    }));

    return entrys;
}

// 项目使用辅助类库，在libraries目录
function setLibraryEntries(entrys) {

    entrys = entrys || {};

    var src = new RegExp(__dirname.replace(/\\/g, '/') + '/src/js/libraries/');

    glob.sync(__dirname + '/src/js/libraries/**/*.js').forEach(function(name) {

        // 前缀
        var entry = name.replace(src, '');

        // 后缀
        entry = entry.replace(/\.js$/, '');

        entrys[entry] = [name];

    });

    return entrys;
};

// 具体页面
function setPageEntries(entrys) {

    entrys = entrys || {};

    var src = new RegExp(__dirname.replace(/\\/g, '/') + '/src/js/pages/');

    glob.sync(__dirname + '/src/js/pages/**/*.js').forEach(function(name) {

        // 前缀
        var entry = name.replace(src, '');

        // 后缀
        entry = entry.replace(/\.js$/, '');

        entrys[entry] = [name];

    });

    return entrys;
};

function collectEntries() {

    var entrys = {};

    setPlatformEntries(entrys);

    setLibraryEntries(entrys);

    setPageEntries(entrys);

    return entrys;
};

const loaders = [{
    test: /\.json$/,
    loader: 'json'
}, {
    test: /\.js$/,
    loaders: ['es3ify', 'babel'],
    exclude: /node_modules/
}, {
    test: /\.css$/,
    loader: ExtractTextPlugin.extract('style-loader',
        'css-loader!postcss-loader')
}, {
    test: /\.less$/,
    loader: ExtractTextPlugin.extract('style-loader',
        'css-loader!postcss-loader!less-loader')
}, {
    test: /\.scss$/,
    loader: ExtractTextPlugin.extract('style-loader',
        'css-loader!postcss-loader!sass-loader')
}, {
    test: /\.(png|jpg|gif)$/,
    loader: 'url',
    query: {
        limit: 10000,
        // CSS图片目录
        name: 'assets/images/[name].[ext]'
    }
}, {
    test: /\.(woff|woff2)(\?v=\S+)?$/,
    loader: 'url',
    query: {
        limit: 10000,
        mimetype: 'application/font-woff',
        // 字体文件放置目录
        name: 'assets/font/[name].[ext]'
    }
}, {
    test: /\.ttf(\?v=\S+)?$/,
    loader: 'url',
    query: {
        limit: 10000,
        mimetype: 'application/octet-stream',
        // 字体文件放置目录
        name: 'assets/font/[name].[ext]'
    }
}, {
    test: /\.eot(\?v=\S+)?$/,
    loader: 'file',
    query: {
        limit: 10000,
        // 字体文件放置目录
        name: 'assets/font/[name].[ext]'
    }
}, {
    test: /\.svg(\?v=\S+)?$/,
    loader: 'url',
    query: {
        limit: 10000,
        mimetype: 'application/image/svg+xml',
        // 字体文件放置目录
        name: 'assets/font/[name].[ext]'
    }
}, { // 如果要加载jQuery插件,解析路径&参数
    test: '/src/js/components/jquery/**/*.js$',
    loader: 'imports?jQuery=jquery,$=jquery,this=>window'
}];

module.exports = {
    context: __dirname,
    entry: collectEntries(),
    output: {
        // 生成文件放到assets文件夹
        path: path.resolve(__dirname, './dist'),
        // 添加http访问上下文路径
        publicPath: '/',
        // JS文件放到js文件夹
        filename: './assets/js/[name].js'
    },
    resolveLoader: {
        root: path.join(__dirname, 'node_modules')
    },
    resolve: {
        root: [path.join(__dirname, 'src'),
            path.join(__dirname, 'node_modules')
        ],
        // 自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
        extensions: ['', '.js', '.vue', '.json', '.scss'],
        // 模块别名定义，方便后续直接引用别名，无须多写长长的地址
        alias: {
            root: path.resolve(''),
            js: path.resolve('src/js'),
            shim: path.resolve('src/js/shim'),
            enhance: path.resolve('src/js/enhance'),
            css: path.resolve('src/css'),
            images: path.resolve('src/images'),
            modules: path.resolve('src/js/modules'),
            node_modules: path.resolve('node_modules'),
            components: path.resolve('src/js/components')
        }
    },
    // 当我们想在项目中require一些其他的类库或者API，而又不想让这些类库的源码被构建到运行时文件中
    // 通过引用外部文件的方式引入第三方库 via script tag
    externals: {
        // 'jquery' : 'jQuery'
        // moment: true
    },
    noParse: [ // 如果你 确定一个模块中没有其它新的依赖 就可以配置这项，webpack 将不再扫描这个文件中的依赖
    ],
    plugins: plugins,
    module: {
        loaders: loaders
    },
    postcss: function() {
        return [precss, autoprefixer];
    },
    devServer: {
        contentBase: path.resolve(__dirname, './dist'),
        historyApiFallback: true,
        noInfo: true
    },
    devtool: 'source-map'
};
