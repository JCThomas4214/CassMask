import * as cassmask from '../../../index';

var now = cassmask.now;
var toTimeStamp = cassmask.toTimeStamp;

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
	infolist: cassmask.LIST(cassmask.TEXT),
	keys: ['part', 'name']
});

export default cassmask.model('ItemList', ItemList);
