import { parseQueryDelete } from '../../../src/libs/remove'; 
import { Entity } from '../../../src/libs/entity';
import * as cassmask from '../../../src';

let schema = new cassmask.Schema({
	part: {
		type: cassmask.TEXT,
		default: 'Item'
	},
	created: {
		type: cassmask.TIMESTAMP,
		default: cassmask.toTimeStamp(cassmask.now())
	},
	name: {
		type: cassmask.TEXT,
		required: true
	},
	info: cassmask.TEXT,
	keys: ['part', 'name']
});

let testModel = cassmask.model('schema', schema);

describe('REMOVE Query Parsing', function() {
	let q;

	beforeAll(() => {
		q = parseQueryDelete(new Entity({
				part: 'Item', 
				name: 'testing'
			}, testModel), {});
	});

	it('query object should have the correct query string', () => {
		expect(q.query).toEqual('DELETE FROM schemas WHERE part = ? AND name = ?');
	});

	it('query object should have the correct query params', () => {
		expect(q.params[0]).toEqual('Item');
		expect(q.params[1]).toEqual('testing');
	});
});