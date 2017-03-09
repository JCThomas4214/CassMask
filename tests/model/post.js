var cassmask = require('cassmask');

var now = cassmask.now;
var toTimeStamp = cassmask.toTimeStamp; 

var ItemPost = new cassmask.Model('ItemPosts', {
	part: {
		Type: cassmask.TEXT,
		Default: 'Item'
	},
	created: {
		Type: cassmask.TIMESTAMP,
		Default: toTimeStamp(now())
	},
	name: cassmask.TEXT,
	info: cassmask.TEXT,
	keys: ['part', 'name']
});

module.exports = ItemPost;