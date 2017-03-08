'use strict';

var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');
var CompressionPlugin = require("compression-webpack-plugin");

module.exports = function(env) {
	return {
	  entry: {
	    'index': './index.ts',
	  }, 

	  output: {
	  	library: 'cassmask',
	  	libraryTarget: 'umd',
	    filename: 'index.js'
	  },

	  externals: {
	  	'lodash': {
	  		commonjs: 'lodash',
	  		commonjs2: 'lodash',
	  		amd: 'lodash',
	  		root: '_'
	  	},
	  	'cassandra-driver': {
	  		commonjs: 'cassandra-driver',
	  		commonjs2: 'cassandra-driver',
	  		amd: 'cassandra-driver',
	  		root: '_'
	  	},
	  	'rxjs': {
	  		commonjs: 'rxjs',
	  		commonjs2: 'rxjs',
	  		amd: 'rxjs',
	  		root: '_'
	  	},
	  	'immutable': {
	  		commonjs: 'immutable',
	  		commonjs2: 'immutable',
	  		amd: 'immutable',
	  		root: '_'
	  	}
	  },

	  module: {
	    rules: [{ test: /\.ts$/, loader: 'awesome-typescript-loader' }]
	  },

	  resolve: {
	    extensions: ['.ts', '.js']
	  },

	  plugins: [
		  new webpack.optimize.UglifyJsPlugin({
		    compress: { warnings: false }
		  })
	  ]
	};
};