const path = require('path');
const common = require('./webpack.common');
const merge = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
	mode: 'production',
	output: {
		filename: '[name]-[contenthash].bundle.js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/'
	},
	optimization: {
		minimizer: [
			new TerserPlugin(),
			new HtmlWebpackPlugin({
				template: './public/index.html',
				minify: {
					removeAttributeQuotes: true,
					collapseWhitespace: true,
					removeComments: true
				}
			})
		]
	},
	module: {
		rules: [
			{
				test: /\.(svg|png|jpe?g|gif)$/,
				loader: 'file-loader',
				options: {
					name: '[contenthash].[ext]',
					outputPath: 'assets'
				}
			}
		]
	}
});
