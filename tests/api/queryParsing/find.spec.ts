import { parseQuerySelect } from '../../../src/libs/find'; 
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

describe('FIND Query Parsing', function() {
	let q;
	let qFindOne;

	beforeAll(() => {
		q = parseQuerySelect(new Entity({}, testModel), {});
		qFindOne = parseQuerySelect(new Entity({}, testModel), { limit: 1 });
	});

	it('find * query object should have the correct query string', () => {
		expect(q.query).toEqual('SELECT * FROM schemas');
	});

	it('find * query object should have the correct query params', () => {
		expect(q.params.length).toEqual(0);
	});

	it('find one query object should have the correct query string', () => {
		expect(qFindOne.query).toEqual('SELECT * FROM schemas LIMIT 1');
	});

	it('find one query object should have the correct query params', () => {
		expect(qFindOne.params.length).toEqual(0);
	});
});