var cassmask = require('cassmask');

var now = cassmask.now;
var toTimeStamp = cassmask.toTimeStamp; 

var ItemPostSchema = new cassmask.Schema({
	part: {
		type: cassmask.TEXT,
		default: 'Item'
	},
	created: {
		type: cassmask.TIMESTAMP,
		default: toTimeStamp(now())
	},
	name: cassmask.TEXT,
	info: cassmask.TEXT,
	keys: ['part', 'name']
});

var ItemPost = new cassmask.Model('ItemPosts', ItemPostSchema);

module.exports = ItemPost;