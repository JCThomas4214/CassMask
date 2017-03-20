var cassmask = require('cassmask');
var now = require('cassmask').now;
var toTimeStamp = require('cassmask').toTimeStamp;

var ItemList = new cassmask.Schema({
	part: {
		type: cassmask.TEXT,
		default: 'Item'
	},
	created: {
		type: cassmask.TIMESTAMP,
		default: toTimeStamp(now())
	},
	name: {
		type: cassmask.TEXT,
		required: true
	},
	tmp: cassmask.LIST(cassmask.TEXT),
	keys: ['part', 'name']
});

module.exports = cassmask.model('ItemList', ItemList);
