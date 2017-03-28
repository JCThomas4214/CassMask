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

	it('remove query object should have the correct query string and params', () => {
		let q = parseQueryDelete(new Entity({
				part: 'Item', 
				name: 'testing'
			}, testModel), {});

		expect(q.query).toEqual('DELETE FROM schemas WHERE part = ? AND name = ?');

		expect(q.params[0]).toEqual('Item');
		expect(q.params[1]).toEqual('testing');
	});

	it('remove USING query object should have the correct query string and params', () => {
		let q = parseQueryDelete(new Entity({
				part: 'Item', 
				name: 'testing'
			}, testModel), { using: 'TTL 3245' });

		expect(q.query).toEqual('DELETE FROM schemas USING TTL 3245 WHERE part = ? AND name = ?');

		expect(q.params[0]).toEqual('Item');
		expect(q.params[1]).toEqual('testing');
	});

	it('remove IF query object should have the correct query string and params', () => {
		let q = parseQueryDelete(new Entity({
				part: 'Item', 
				name: 'testing'
			}, testModel), { if: 'EXISTS' });

		expect(q.query).toEqual('DELETE FROM schemas WHERE part = ? AND name = ? IF EXISTS');

		expect(q.params[0]).toEqual('Item');
		expect(q.params[1]).toEqual('testing');
	});

});