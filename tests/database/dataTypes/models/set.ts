import * as cassmask from '../../../index';

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

export default cassmask.model('ItemSet', ItemSet);
