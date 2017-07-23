var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
	entry: './Resources/webpack.entry.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{ test: /\.css$/, loader: ExtractTextPlugin.extract('css-loader') },
			{
				test: /\.js$/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015'],
				}
			}
		]
	},
	plugins: [
		new ExtractTextPlugin('bundle.css'),
		new webpack.optimize.UglifyJsPlugin()
	],
	watch: true
}