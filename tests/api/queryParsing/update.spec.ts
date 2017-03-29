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

		it('update MAP.append query object should have the correct query string and params', () => {

			let q = parseQueryUpdate(new Entity({
				part: 'Item',
				name: 'testing',
				infomap: cassmask.MAP.append({
					awesome: 'testings'
				})
			}, testModel), {});

			expect(q.query).toEqual('UPDATE schemas SET infomap = infomap + ? WHERE part = ? AND name = ? IF EXISTS');

			expect(q.params[0]).toEqual({ awesome: 'testings' });
			expect(q.params[1]).toEqual('Item');
			expect(q.params[2]).toEqual('testing');

		});

		it('update MAP.remove query object should have the correct query string and params', () => {

			let q = parseQueryUpdate(new Entity({
				part: 'Item',
				name: 'testing',
				infomap: cassmask.MAP.remove(['awesome'])
			}, testModel), {});

			expect(q.query).toEqual('UPDATE schemas SET infomap = infomap - ? WHERE part = ? AND name = ? IF EXISTS');

			expect(q.params[0]).toEqual(['awesome']);
			expect(q.params[1]).toEqual('Item');
			expect(q.params[2]).toEqual('testing');

		});

		it('update MAP.set query object should have the correct query string and params', () => {

			let q = parseQueryUpdate(new Entity({
				part: 'Item',
				name: 'testing',
				infomap: cassmask.MAP.set('awesome', 'awesomePants');
			}, testModel), {});

			expect(q.query).toEqual('UPDATE schemas SET infomap[?] = ? WHERE part = ? AND name = ? IF EXISTS');

			expect(q.params[0]).toEqual('awesome');
			expect(q.params[1]).toEqual('awesomePants');
			expect(q.params[2]).toEqual('Item');
			expect(q.params[3]).toEqual('testing');

		});

		it('update MAP.reset query object should have the correct query string and params', () => {

			let q = parseQueryUpdate(new Entity({
				part: 'Item',
				name: 'testing',
				infomap: cassmask.MAP.reset({
					banana: 'testings',
					forgo: 'testings',
					intern: 'testings'
				});
			}, testModel), {});

			expect(q.query).toEqual('UPDATE schemas SET infomap = ? WHERE part = ? AND name = ? IF EXISTS');

			expect(q.params[0]).toEqual({ banana: 'testings', forgo: 'testings', intern: 'testings'	});
			expect(q.params[1]).toEqual('Item');
			expect(q.params[2]).toEqual('testing');

		});

		it('update LIST.append query object should have the correct query string and params', () => {

			let q = parseQueryUpdate(new Entity({
				part: 'Item',
				name: 'testing',
				infolist: cassmask.LIST.append(['awesome', 'testings', 'banana']);
			}, testModel), {});

			expect(q.query).toEqual('UPDATE schemas SET infolist = infolist + ? WHERE part = ? AND name = ? IF EXISTS');

			expect(q.params[0]).toEqual(['awesome', 'testings', 'banana']);
			expect(q.params[1]).toEqual('Item');
			expect(q.params[2]).toEqual('testing');

		});

		it('update LIST.prepend query object should have the correct query string and params', () => {

			let q = parseQueryUpdate(new Entity({
				part: 'Item',
				name: 'testing',
				infolist: cassmask.LIST.prepend(['awesome', 'testings', 'banana']);
			}, testModel), {});

			expect(q.query).toEqual('UPDATE schemas SET infolist = ? + infolist WHERE part = ? AND name = ? IF EXISTS');

			expect(q.params[0]).toEqual(['awesome', 'testings', 'banana']);
			expect(q.params[1]).toEqual('Item');
			expect(q.params[2]).toEqual('testing');

		});

		it('update LIST.set query object should have the correct query string and params', () => {

			let q = parseQueryUpdate(new Entity({
				part: 'Item',
				name: 'testing',
				infolist: cassmask.LIST.set(1, 'bananaAwesome');
			}, testModel), {});

			expect(q.query).toEqual('UPDATE schemas SET infolist[?] = ? WHERE part = ? AND name = ? IF EXISTS');

			expect(q.params[0]).toEqual(1);
			expect(q.params[1]).toEqual('bananaAwesome');
			expect(q.params[2]).toEqual('Item');
			expect(q.params[3]).toEqual('testing');

		});

		it('update LIST.reset query object should have the correct query string and params', () => {

			let q = parseQueryUpdate(new Entity({
				part: 'Item',
				name: 'testing',
				infolist: cassmask.LIST.reset(['cows', 'awesome', 'banana']);
			}, testModel), {});

			expect(q.query).toEqual('UPDATE schemas SET infolist = ? WHERE part = ? AND name = ? IF EXISTS');

			expect(q.params[0]).toEqual(['cows', 'awesome', 'banana']);
			expect(q.params[1]).toEqual('Item');
			expect(q.params[2]).toEqual('testing');

		});

		it('update SET.append query object should have the correct query string and params', () => {

			let q = parseQueryUpdate(new Entity({
				part: 'Item',
				name: 'testing',
				infoset: cassmask.SET.append(['cows', 'awesome', 'banana']);
			}, testModel), {});

			expect(q.query).toEqual('UPDATE schemas SET infoset = infoset + ? WHERE part = ? AND name = ? IF EXISTS');

			expect(q.params[0]).toEqual(['cows', 'awesome', 'banana']);
			expect(q.params[1]).toEqual('Item');
			expect(q.params[2]).toEqual('testing');

		});

		it('update SET.set query object should have the correct query string and params', () => {

			let q = parseQueryUpdate(new Entity({
				part: 'Item',
				name: 'testing',
				infoset: cassmask.SET.set(2, 'bro');
			}, testModel), {});

			expect(q.query).toEqual('UPDATE schemas SET infoset[?] = ? WHERE part = ? AND name = ? IF EXISTS');

			expect(q.params[0]).toEqual(2);
			expect(q.params[1]).toEqual('bro');
			expect(q.params[2]).toEqual('Item');
			expect(q.params[3]).toEqual('testing');

		});

		it('update SET.reset query object should have the correct query string and params', () => {

			let q = parseQueryUpdate(new Entity({
				part: 'Item',
				name: 'testing',
				infoset: cassmask.SET.reset(['bro', 'apple', 'tree']);
			}, testModel), {});

			expect(q.query).toEqual('UPDATE schemas SET infoset = ? WHERE part = ? AND name = ? IF EXISTS');

			expect(q.params[0]).toEqual(['bro', 'apple', 'tree']);
			expect(q.params[1]).toEqual('Item');
			expect(q.params[2]).toEqual('testing');

		});

	});

});