import { parseQueryInsert } from '../../../src/libs/create'; 
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

describe('CREATE Query Parsing', function() {
	let q;

	beforeAll(() => {
		q = parseQueryInsert(new Entity({
				name: 'testing',
				info: 'this is a testing insert'
			}, testModel, {useDefaults: true}), {});
	});

	it('query object should have the correct query string', () => {
		expect(q.query).toEqual('INSERT INTO schemas (id, part, created, name, info) VALUES (uuid(), ?, toTimeStamp(now()), ?, ?)');
	});

	it('query object should have the correct query params', () => {
		expect(q.params[0]).toEqual('Item');
		expect(q.params[1]).toEqual('testing');
		expect(q.params[2]).toEqual('this is a testing insert');
	});
});