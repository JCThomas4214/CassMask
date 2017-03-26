var cassmask = require('../../../../index.js');

var now = cassmask.now;
var toTimeStamp = cassmask.toTimeStamp;

var ItemSet = new cassmask.Schema({
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
	tmp: cassmask.SET(cassmask.TEXT),
	keys: ['part', 'name']
});

module.exports = cassmask.model('ItemSet', ItemSet);
