import * as cassmask from '../../../index';

var now = cassmask.now;
var toTimeStamp = cassmask.toTimeStamp;

var ItemMap = new cassmask.Schema({
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
	infomap: cassmask.MAP(
		cassmask.INT, cassmask.TEXT),
	infomap2: cassmask.MAP(
		cassmask.TEXT, cassmask.TEXT),
	keys: ['part', 'name']
});

export default cassmask.model('ItemMap', ItemMap);
