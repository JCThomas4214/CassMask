var cassmask = require('cassmask');

var cassandra = cassmask.cassandra;
var Schema = cassmask.Schema;
var now = cassmask.now;
var toTimeStamp = cassmask.toTimeStamp; 

var ItemPrePost = new Schema('ItemPrePosts', {
	part: {
		Type: cassandra.TEXT,
		Default: 'Item'
	},
	created: {
		Type: cassandra.TIMESTAMP,
		Default: toTimeStamp(now())
	},
	name: cassandra.TEXT,
	info: cassandra.TEXT,
	keys: ['part', 'name']
});

module.exports = ItemPrePost;