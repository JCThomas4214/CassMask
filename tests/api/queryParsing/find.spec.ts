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

	it('find * query object should have the correct query string and params', () => {
		let q = parseQuerySelect(new Entity({}, testModel), {});

		expect(q.query).toEqual('SELECT * FROM schemas');
		expect(q.params.length).toEqual(0);
	});

	it('find ONE query object should have the correct query string and params', () => {
		let q = parseQuerySelect(new Entity({}, testModel), { limit: 1 });

		expect(q.query).toEqual('SELECT * FROM schemas LIMIT 1');
		expect(q.params.length).toEqual(0);
	});

	it('find ATTR query object should have the correct query string and params', () => {
		let q = parseQuerySelect(new Entity({}, testModel), { attributes: ['created', 'name', 'info'] });

		expect(q.query).toEqual('SELECT created, name, info FROM schemas');
		expect(q.params.length).toEqual(0);
	});

	it('find ATTREX query object should have the correct query string and params', () => {
		let q = parseQuerySelect(new Entity({}, testModel), { attributes: { exclude: ['part','created'] }});

		expect(q.query).toEqual('SELECT id, name, info FROM schemas');
		expect(q.params.length).toEqual(0);
	});

	it('find FILTER query object should have the correct query string and params', () => {
		let q = parseQuerySelect(new Entity({}, testModel), { allowFiltering: true });

		expect(q.query).toEqual('SELECT * FROM schemas');
		expect(q.params.length).toEqual(0);

		let q2 = parseQuerySelect(new Entity({ id: 'awesome' }, testModel), { allowFiltering: true });

		expect(q2.query).toEqual('SELECT * FROM schemas WHERE id = ? ALLOW FILTERING');
		expect(q2.params[0]).toEqual('awesome');
	});

	it('find GROUPBY query object should have the correct query string and params', () => {
		let q = parseQuerySelect(new Entity({}, testModel), { groupBy: 'name' });

		expect(q.query).toEqual('SELECT * FROM schemas GROUP BY name');
		expect(q.params.length).toEqual(0);
	});

	it('find ORDERBY query object should have the correct query string and params', () => {
		let q = parseQuerySelect(new Entity({}, testModel), { orderBy: 'name' });

		expect(q.query).toEqual('SELECT * FROM schemas ORDER BY name');
		expect(q.params.length).toEqual(0);
	});

	it('find PPLIMIT query object should have the correct query string and params', () => {
		let q = parseQuerySelect(new Entity({}, testModel), { perPartitionLimit: 3 });

		expect(q.query).toEqual('SELECT * FROM schemas PER PARTITION LIMIT 3');
		expect(q.params.length).toEqual(0);
	});
});