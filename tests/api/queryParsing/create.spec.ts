import { parseQueryInsert } from '../../../src/libs/create'; 
import { Entity } from '../../../src/libs/entity';
import * as cassmask from '../../../src';

describe('CREATE Query Parsing', function() {

	describe('CREATE standard', function() {

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

		it('create query object should have the correct query string and params', () => {
			let q = parseQueryInsert(new Entity({
					name: 'testing',
					info: 'this is a testing insert'
				}, testModel, {useDefaults: true}), {});

			expect(q.query).toEqual('INSERT INTO schemas (id, part, created, name, info) VALUES (uuid(), ?, toTimeStamp(now()), ?, ?)');

			expect(q.params[0]).toEqual('Item');
			expect(q.params[1]).toEqual('testing');
			expect(q.params[2]).toEqual('this is a testing insert');
		});

		it('create IFNOTEXISTS query object should have the correct query string and params', () => {
			let q = parseQueryInsert(new Entity({
					name: 'testing',
					info: 'this is a testing insert'
				}, testModel, {useDefaults: true}), { if: 'NOT EXISTS' });

			expect(q.query).toEqual('INSERT INTO schemas (id, part, created, name, info) VALUES (uuid(), ?, toTimeStamp(now()), ?, ?) IF NOT EXISTS');

			expect(q.params[0]).toEqual('Item');
			expect(q.params[1]).toEqual('testing');
			expect(q.params[2]).toEqual('this is a testing insert');
		});

		it('create USING query object should have the correct query string and params', () => {
			let q = parseQueryInsert(new Entity({
					name: 'testing',
					info: 'this is a testing insert'
				}, testModel, {useDefaults: true}), { using: 'TTL 3245' });

			expect(q.query).toEqual('INSERT INTO schemas (id, part, created, name, info) VALUES (uuid(), ?, toTimeStamp(now()), ?, ?) USING TTL 3245');

			expect(q.params[0]).toEqual('Item');
			expect(q.params[1]).toEqual('testing');
			expect(q.params[2]).toEqual('this is a testing insert');
		});

	});

	describe('CREATE with collection types', function() {

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

		it('create query object should have the correct query string and params', () => {
			let q = parseQueryInsert(new Entity({
				name: 'testing',
				infomap: {
					test1: 'testing1',
					test2: 'testing2',
					test3: 'testing3'
				},
				infolist: ['testing3', 'testing2', 'testing1'],
				infoset: ['testing2', 'testing3', 'testing1']
			}, testModel), {});

			expect(q.query).toEqual('INSERT INTO schemas (name, infomap, infolist, infoset) VALUES (?, ?, ?, ?)');

			expect(q.params[0]).toEqual('testing');
			expect(q.params[1]).toEqual({ test1: 'testing1', test2: 'testing2', test3: 'testing3' });
			expect(q.params[2]).toEqual(['testing3', 'testing2', 'testing1']);
			expect(q.params[3]).toEqual(['testing2', 'testing3', 'testing1']);
		});

		it('create query object should have the correct query string and params', () => {
			let q = parseQueryInsert(new Entity({
				name: 'testing',
				infomap: {
					test1: 'testing1',
					test2: 'testing2',
					test3: 'testing3'
				},
				infolist: ['testing3', 'testing2', 'testing1'],
				infoset: ['testing2', 'testing3', 'testing1']
			}, testModel), { if: 'NOT EXISTS' });

			expect(q.query).toEqual('INSERT INTO schemas (name, infomap, infolist, infoset) VALUES (?, ?, ?, ?) IF NOT EXISTS');

			expect(q.params[0]).toEqual('testing');
			expect(q.params[1]).toEqual({ test1: 'testing1', test2: 'testing2', test3: 'testing3' });
			expect(q.params[2]).toEqual(['testing3', 'testing2', 'testing1']);
			expect(q.params[3]).toEqual(['testing2', 'testing3', 'testing1']);
		});

		it('create query object should have the correct query string and params', () => {
			let q = parseQueryInsert(new Entity({
				name: 'testing',
				infomap: {
					test1: 'testing1',
					test2: 'testing2',
					test3: 'testing3'
				},
				infolist: ['testing3', 'testing2', 'testing1'],
				infoset: ['testing2', 'testing3', 'testing1']
			}, testModel), { using: 'TTL 3245' });

			expect(q.query).toEqual('INSERT INTO schemas (name, infomap, infolist, infoset) VALUES (?, ?, ?, ?) USING TTL 3245');

			expect(q.params[0]).toEqual('testing');
			expect(q.params[1]).toEqual({ test1: 'testing1', test2: 'testing2', test3: 'testing3' });
			expect(q.params[2]).toEqual(['testing3', 'testing2', 'testing1']);
			expect(q.params[3]).toEqual(['testing2', 'testing3', 'testing1']);
		});

	});

});