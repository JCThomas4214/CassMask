var cassmask = require('cassmask');

var now = cassmask.now;
var toTimeStamp = cassmask.toTimeStamp; 

var ItemPreSchema = new cassmask.Schema({
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

var ItemPre = new cassmask.Model('ItemPres', ItemPreSchema);

module.exports = ItemPre;