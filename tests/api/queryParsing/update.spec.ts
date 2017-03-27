import { parseQueryUpdate } from '../../../src/libs/update'; 
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

describe('UPDATE Query Parsing', function() {
	let q;

	beforeAll(() => {	
		q = parseQueryUpdate(new Entity({
				name: 'tests',
				info: 'updated testing insert'
			}, testModel), {});
	});

	it('query object should have the correct query string', () => {
		expect(q.query).toEqual('UPDATE schemas SET info = ? WHERE name = ? IF EXISTS');
	});

	it('query object should have the correct query params', () => {
		expect(q.params[0]).toEqual('updated testing insert');
		expect(q.params[1]).toEqual('tests');
	});
});