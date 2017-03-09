var cassmask = require('cassmask');
var now = require('cassmask').now;
var toTimeStamp = require('cassmask').toTimeStamp;


var Item = new cassmask.Model('Items', {
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

module.exports = Item;