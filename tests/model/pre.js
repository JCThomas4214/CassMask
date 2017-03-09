var cassmask = require('cassmask');

var now = cassmask.now;
var toTimeStamp = cassmask.toTimeStamp; 

var ItemPre = new cassmask.Model('ItemPres', {
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

module.exports = ItemPre;