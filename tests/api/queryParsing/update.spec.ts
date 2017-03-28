import { parseQueryUpdate } from '../../../src/libs/update'; 
import { Entity } from '../../../src/libs/entity';
import * as cassmask from '../../../src';

describe('UPDATE Query Parsing', function() {

	describe('UPDATE standard', function() {

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

		it('update query object should have the correct query string and params', () => {
			let q = parseQueryUpdate(new Entity({
					name: 'tests',
					info: 'updated testing insert'
				}, testModel), {});

			expect(q.query).toEqual('UPDATE schemas SET info = ? WHERE name = ? IF EXISTS');

			expect(q.params[0]).toEqual('updated testing insert');
			expect(q.params[1]).toEqual('tests');
		});

		it('update USING query object should have the correct query string and params', () => {
			let q = parseQueryUpdate(new Entity({
					name: 'tests',
					info: 'updated testing insert'
				}, testModel), { using: 'TTL 3245' });

			expect(q.query).toEqual('UPDATE schemas USING TTL 3245 SET info = ? WHERE name = ? IF EXISTS');

			expect(q.params[0]).toEqual('updated testing insert');
			expect(q.params[1]).toEqual('tests');
		});

		it('update IF query object should have the correct query string and params', () => {
			let q = parseQueryUpdate(new Entity({
					name: 'tests',
					info: 'updated testing insert'
				}, testModel), { if: 'name = "tests"' });

			expect(q.query).toEqual('UPDATE schemas SET info = ? WHERE name = ? IF name = "tests"' );

			expect(q.params[0]).toEqual('updated testing insert');
			expect(q.params[1]).toEqual('tests');
		});

	});

	describe('UPDATE with collection types', function() {

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
			infomap: cassmask.MAP(cassmask.TEXT, cassmask.TEXT),
			infolist: cassmask.LIST(cassmask.TEXT),
			infoset: cassmask.SET(cassmask.TEXT),
			keys: ['part', 'name']
		});

		let testModel = cassmask.model('schema', schema);
		
	});

});