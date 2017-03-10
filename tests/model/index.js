var cassmask = require('cassmask');
var now = require('cassmask').now;
var toTimeStamp = require('cassmask').toTimeStamp;

var ItemSchema = new cassmask.Schema({
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

module.exports = cassmask.model('Item', ItemSchema);