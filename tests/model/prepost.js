var cassmask = require('cassmask');

var now = cassmask.now;
var toTimeStamp = cassmask.toTimeStamp; 

var ItemPrePostSchema = new cassmask.Schema({
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

module.exports = cassmask.model('ItemPrePost', ItemPrePostSchema);;