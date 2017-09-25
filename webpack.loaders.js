const ExtractTextPlugin = require('extract-text-webpack-plugin');

const IsProduct = process.env.NODE_ENV === 'production';

var fonts = IsProduct ? 'assets/fonts/[name].[hash:8].[ext]' : 'assets/fonts/[name].[ext]';

var images = IsProduct ? 'assets/images/[name].[hash:8].[ext]' : 'assets/images/[name].[ext]';

module.exports = [{
    test: /\.js$/,
    use: ['babel-loader'],
    exclude: /node_modules/
}, {
    test: /\.css$/,
    use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
            loader: 'css-loader',
            options: {
                minimize: IsProduct ? true : false // css压缩
            }
        }, 'postcss-loader']
    })
}, {
    test: /\.less$/,
    use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
            loader: 'css-loader',
            options: {
                minimize: IsProduct ? true : false // css压缩
            }
        }, 'postcss-loader', 'less-loader']
    })
}, {
    test: /\.scss$/,
    use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
            loader: 'css-loader',
            options: {
                minimize: IsProduct ? true : false // css压缩
            }
        }, 'postcss-loader', 'sass-loader']
    })
}, {
    test: /\.(png|jpg|gif)$/,
    use: [{
        loader: 'url-loader',
        options: { // css images
            limit: 10000,
            name: images
        }
    }]
}, {
    test: /\.(woff|woff2)(\?v=\S+)?$/,
    use: [{
        loader: 'url-loader',
        options: { // css fonts
            limit: 10000,
            name: fonts
        }
    }]
}, {
    test: /\.ttf(\?v=\S+)?$/,
    use: [{
        loader: 'url-loader',
        options: { // css fonts
            limit: 10000,
            name: fonts
        }
    }]
}, {
    test: /\.eot(\?v=\S+)?$/,
    use: [{ // css fonts
        loader: 'file-loader',
        options: {
            limit: 10000,
            name: fonts
        }
    }]
}, {
    test: /\.svg(\?v=\S+)?$/,
    use: [{ // css fonts
        loader: 'file-loader',
        options: {
            limit: 10000,
            name: fonts
        }
    }]
}, {
    test: /\.ejs$/,
    use: [{
        loader: 'ejs-compiled-loader',
        options: {
            htmlmin: true
        }
    }],
    exclude: /node_modules/
}, {
    test: /\.html$/,
    use: ['raw-loader'],
    exclude: /node_modules/
}];
