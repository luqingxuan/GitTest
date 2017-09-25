const path = require('path');

const IsProduct = process.env.NODE_ENV === 'production';

const {
    entries,
    pageEntries,
    commonEntries
} = require('./webpack.entry.js');

module.exports = {
    context: __dirname,
    entry: entries,
    output: {
        // 添加http访问上下文路径
        publicPath: '/',
        path: path.resolve(__dirname, './dist'),
        // 生成文件放到assets目录下的js文件夹
        filename: IsProduct ? 'assets/js/[name].[chunkhash:8].js' : 'assets/js/[name].js',
        chunkFilename: IsProduct ? 'assets/js/[name].[chunkhash:8].js' : 'assets/js/[name].js'
    },
    plugins: require('./webpack.plugins.js')(commonEntries, pageEntries),
    module: {
        rules: require('./webpack.loaders.js')
    },
    resolve: {
        modules: [
            path.join(__dirname, 'src'),
            path.join(__dirname, 'node_modules')
        ],
        // 自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
        extensions: ['.js', 'jsx', '.ts', '.tsx', '.vue'],
        // 模块别名定义，方便后续直接引用别名，无须多写长长的地址
        alias: require('./webpack.alias.js')
    },
    resolveLoader: {},
    // 当我们想在项目中require一些其他的类库或者API，而又不想让这些类库的源码被构建到运行时文件中
    // 通过引用外部文件的方式引入第三方库 via script tag
    externals: {
        // 'jquery' : 'jQuery'
        // moment: true
    },
    devServer: require('./webpack.devServer.js'),
    node: {
        global: true,
        process: true,
        Buffer: false,
        crypto: 'empty',
        module: false,
        clearImmediate: false,
        setImmediate: false,
        clearTimeout: true,
        setTimeout: true
    }
};
