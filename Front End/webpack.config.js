var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	entry: './Resources/webpack.entry.js',
	output: {
		path: path.resolve(__dirname, 'Resources'),
		filename: 'webpack.bundle.js'
	},
	module: {
		rules: [
			{ test: /\.css$/, loader: 'style-loader!css-loader' },
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
		new webpack.optimize.UglifyJsPlugin(),
		new HtmlWebpackPlugin({ 
			filename: 'index_bundle1.html',
			template: 'index_bundle.html',
			inject: 'head'
		})
	]
}