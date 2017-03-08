var Item = require('./model');
var ItemPost = require('./model/post');
var ItemPre = require('./model/pre');
var ItemPrePost = require('./model/prepost');

describe('CassMask FIND', function() {

	beforeAll(done => {
		ItemPost.post('create', null);
		ItemPost.post('find', null);
		ItemPost.post('remove', null);
		ItemPost.post('update', null);

		ItemPre.pre('create', null);
		ItemPre.pre('find', null);
		ItemPre.pre('remove', null);
		ItemPre.pre('update', null);

		ItemPrePost.post('create', null);
		ItemPrePost.post('find', null);
		ItemPrePost.post('remove', null);
		ItemPrePost.post('update', null);

		ItemPrePost.pre('create', null);
		ItemPrePost.pre('find', null);
		ItemPrePost.pre('remove', null);
		ItemPrePost.pre('update', null);

		done();
	});

	describe('FIND without Events', function() {
		var rows;

		beforeAll(done => {
			Item.remove().create([{
				name: 'arrayFind1',
				info: 'this is a arrayFind1 test'
			}, {
				name: 'arrayFind2',
				info: 'this is a arrayFind2 test'
			}, {
				name: 'arrayFind3',
				info: 'this is a arrayFind3 test'
			}, {
				name: 'arrayFind4',
				info: 'this is a arrayFind4 test'
			}, {
				name: 'arrayFind5',
				info: 'this is a arrayFind5 test'
			}, {
				name: 'arrayFind6',
				info: 'this is a arrayFind6 test'
			}]).seam().subscribe(
				test => {},
				err => console.log(err),
				() => done());
		});

		beforeAll(done => {
			Item.find().seam().subscribe(
				tests => rows = tests,
				err => console.log(err),
				() => done());
		});

		it('database should contain testing rows', () => {
			expect(rows).toEqual(jasmine.any(Array));

			expect(rows[0].name).toBe('arrayFind1');
			expect(rows[0].info).toBe('this is a arrayFind1 test');
			expect(rows[1].name).toBe('arrayFind2');
			expect(rows[1].info).toBe('this is a arrayFind2 test');
			expect(rows[2].name).toBe('arrayFind3');
			expect(rows[2].info).toBe('this is a arrayFind3 test');
			expect(rows[3].name).toBe('arrayFind4');
			expect(rows[3].info).toBe('this is a arrayFind4 test');
			expect(rows[4].name).toBe('arrayFind5');
			expect(rows[4].info).toBe('this is a arrayFind5 test');
			expect(rows[5].name).toBe('arrayFind6');
			expect(rows[5].info).toBe('this is a arrayFind6 test');
		});

		describe('FIND all', function() {
			var findTest;
			var findTestInclude;
			var findTestExclude;

			beforeAll(done => {
				Item.find().seam().subscribe(
					tests => findTest = tests,
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				Item.find({}, {
					attributes: ['name', 'info']
				}).seam().subscribe(
					tests => findTestInclude = tests,
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				Item.find({}, {
					attributes: { exclude: ['created', 'id', 'part'] }
				}).seam().subscribe(
					tests => findTestExclude = tests,
					err => console.log(err),
					() => done());
			});

			it('subscribe should respond with array', () => {
				expect(findTest).toEqual(jasmine.any(Array));
				expect(findTestInclude).toEqual(jasmine.any(Array));
				expect(findTestExclude).toEqual(jasmine.any(Array));
			});

			it('subscribe should respond with database results', () => {
				expect(findTest[0].name).toEqual(rows[0].name);
				expect(findTest[0].info).toEqual(rows[0].info);
				expect(findTest[0].id).toEqual(rows[0].id);
				expect(findTest[0].created).toEqual(rows[0].created);
				expect(findTest[0].part).toEqual(rows[0].part);

				expect(findTest[1].name).toEqual(rows[1].name);
				expect(findTest[1].info).toEqual(rows[1].info);
				expect(findTest[1].id).toEqual(rows[1].id);
				expect(findTest[1].created).toEqual(rows[1].created);
				expect(findTest[1].part).toEqual(rows[1].part);

				expect(findTest[2].name).toEqual(rows[2].name);
				expect(findTest[2].info).toEqual(rows[2].info);
				expect(findTest[2].id).toEqual(rows[2].id);
				expect(findTest[2].created).toEqual(rows[2].created);
				expect(findTest[2].part).toEqual(rows[2].part);

				expect(findTest[3].name).toEqual(rows[3].name);
				expect(findTest[3].info).toEqual(rows[3].info);
				expect(findTest[3].id).toEqual(rows[3].id);
				expect(findTest[3].created).toEqual(rows[3].created);
				expect(findTest[3].part).toEqual(rows[3].part);

				expect(findTest[4].name).toEqual(rows[4].name);
				expect(findTest[4].info).toEqual(rows[4].info);
				expect(findTest[4].id).toEqual(rows[4].id);
				expect(findTest[4].created).toEqual(rows[4].created);
				expect(findTest[4].part).toEqual(rows[4].part);

				expect(findTest[5].name).toEqual(rows[5].name);
				expect(findTest[5].info).toEqual(rows[5].info);
				expect(findTest[5].id).toEqual(rows[5].id);
				expect(findTest[5].created).toEqual(rows[5].created);
				expect(findTest[5].part).toEqual(rows[5].part);
			});

			it('subscribe should respond with database results with included columns', () => {
				expect(findTestInclude[0].name).toEqual(rows[0].name);
				expect(findTestInclude[0].info).toEqual(rows[0].info);
				expect(findTestInclude[0].id).not.toBeDefined();
				expect(findTestInclude[0].created).not.toBeDefined();
				expect(findTestInclude[0].part).not.toBeDefined();

				expect(findTestInclude[1].name).toEqual(rows[1].name);
				expect(findTestInclude[1].info).toEqual(rows[1].info);
				expect(findTestInclude[1].id).not.toBeDefined();
				expect(findTestInclude[1].created).not.toBeDefined();
				expect(findTestInclude[1].part).not.toBeDefined();

				expect(findTestInclude[2].name).toEqual(rows[2].name);
				expect(findTestInclude[2].info).toEqual(rows[2].info);
				expect(findTestInclude[2].id).not.toBeDefined();
				expect(findTestInclude[2].created).not.toBeDefined();
				expect(findTestInclude[2].part).not.toBeDefined();

				expect(findTestInclude[3].name).toEqual(rows[3].name);
				expect(findTestInclude[3].info).toEqual(rows[3].info);
				expect(findTestInclude[3].id).not.toBeDefined();
				expect(findTestInclude[3].created).not.toBeDefined();
				expect(findTestInclude[3].part).not.toBeDefined();

				expect(findTestInclude[4].name).toEqual(rows[4].name);
				expect(findTestInclude[4].info).toEqual(rows[4].info);
				expect(findTestInclude[4].id).not.toBeDefined();
				expect(findTestInclude[4].created).not.toBeDefined();
				expect(findTestInclude[4].part).not.toBeDefined();

				expect(findTestInclude[5].name).toEqual(rows[5].name);
				expect(findTestInclude[5].info).toEqual(rows[5].info);
				expect(findTestInclude[5].id).not.toBeDefined();
				expect(findTestInclude[5].created).not.toBeDefined();
				expect(findTestInclude[5].part).not.toBeDefined();
			});

			it('subscribe should respond with database results without excluded columns', () => {
				expect(findTestExclude[0].name).toEqual(rows[0].name);
				expect(findTestExclude[0].info).toEqual(rows[0].info);
				expect(findTestExclude[0].id).not.toBeDefined();
				expect(findTestExclude[0].created).not.toBeDefined();
				expect(findTestExclude[0].part).not.toBeDefined();

				expect(findTestExclude[1].name).toEqual(rows[1].name);
				expect(findTestExclude[1].info).toEqual(rows[1].info);
				expect(findTestExclude[1].id).not.toBeDefined();
				expect(findTestExclude[1].created).not.toBeDefined();
				expect(findTestExclude[1].part).not.toBeDefined();

				expect(findTestExclude[2].name).toEqual(rows[2].name);
				expect(findTestExclude[2].info).toEqual(rows[2].info);
				expect(findTestExclude[2].id).not.toBeDefined();
				expect(findTestExclude[2].created).not.toBeDefined();
				expect(findTestExclude[2].part).not.toBeDefined();

				expect(findTestExclude[3].name).toEqual(rows[3].name);
				expect(findTestExclude[3].info).toEqual(rows[3].info);
				expect(findTestExclude[3].id).not.toBeDefined();
				expect(findTestExclude[3].created).not.toBeDefined();
				expect(findTestExclude[3].part).not.toBeDefined();

				expect(findTestExclude[4].name).toEqual(rows[4].name);
				expect(findTestExclude[4].info).toEqual(rows[4].info);
				expect(findTestExclude[4].id).not.toBeDefined();
				expect(findTestExclude[4].created).not.toBeDefined();
				expect(findTestExclude[4].part).not.toBeDefined();

				expect(findTestExclude[5].name).toEqual(rows[5].name);
				expect(findTestExclude[5].info).toEqual(rows[5].info);
				expect(findTestExclude[5].id).not.toBeDefined();
				expect(findTestExclude[5].created).not.toBeDefined();
				expect(findTestExclude[5].part).not.toBeDefined();
			});
		});

		describe('FIND one', function() {
			var findOneTestWO;
			var findOneTestW;
			var findOneTestInclude;
			var findOneTestExclude;
			var findOneTestDesc;

			beforeAll(done => {
				Item.findOne().seam().subscribe(
					tests => findOneTestWO = tests,
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				Item.find({}, { limit: 1 }).seam().subscribe(
					tests => findOneTestW = tests,
					err => console.log(err),
					() => done());
			});


			beforeAll(done => {
				Item.find({}, {
					limit: 1,
					attributes: ['name', 'info']
				}).seam().subscribe(
					tests => findOneTestInclude = tests,
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				Item.find({}, {
					limit: 1,
					attributes: { exclude: ['created', 'id', 'part'] }
				}).seam().subscribe(
					tests => findOneTestExclude = tests,
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				Item.find({ part: 'Item' }, {
					limit: 1,
					orderBy: 'name desc'
				}).seam().subscribe(
					tests => findOneTestDesc = tests,
					err => console.log(err),
					() => done());
			});

			it('subscribe should not respond with array', () => {
				expect(findOneTestWO).not.toEqual(jasmine.any(Array));
				expect(findOneTestW).not.toEqual(jasmine.any(Array));
				expect(findOneTestInclude).not.toEqual(jasmine.any(Array));
				expect(findOneTestExclude).not.toEqual(jasmine.any(Array));			
				expect(findOneTestDesc).not.toEqual(jasmine.any(Array));
			});

			it('subscribe should respond with database result (Without arguments)', () => {
				expect(findOneTestWO.name).toEqual(rows[0].name);
				expect(findOneTestWO.info).toEqual(rows[0].info);
				expect(findOneTestWO.id).toEqual(rows[0].id);
				expect(findOneTestWO.created).toEqual(rows[0].created);
				expect(findOneTestWO.part).toEqual(rows[0].part);
			});

			it('subscribe should respond with database result (With arguments)', () => {
				expect(findOneTestW.name).toEqual(rows[0].name);
				expect(findOneTestW.info).toEqual(rows[0].info);
				expect(findOneTestW.id).toEqual(rows[0].id);
				expect(findOneTestW.created).toEqual(rows[0].created);
				expect(findOneTestW.part).toEqual(rows[0].part);
			});

			it('subscribe should respond with database result with included columns', () => {
				expect(findOneTestInclude.name).toEqual(rows[0].name);
				expect(findOneTestInclude.info).toEqual(rows[0].info);
				expect(findOneTestInclude.id).not.toBeDefined();
				expect(findOneTestInclude.created).not.toBeDefined();
				expect(findOneTestInclude.part).not.toBeDefined();
			});

			it('subscribe should respond with database result without excluded columns', () => {
				expect(findOneTestExclude.name).toEqual(rows[0].name);
				expect(findOneTestExclude.info).toEqual(rows[0].info);
				expect(findOneTestExclude.id).not.toBeDefined();
				expect(findOneTestExclude.created).not.toBeDefined();
				expect(findOneTestExclude.part).not.toBeDefined();
			});

			it('subscribe should respond with last database result', () => {
				expect(findOneTestDesc.name).toEqual(rows[5].name);
				expect(findOneTestDesc.info).toEqual(rows[5].info);
				expect(findOneTestDesc.id).toEqual(rows[5].id);
				expect(findOneTestDesc.created).toEqual(rows[5].created);
				expect(findOneTestDesc.part).toEqual(rows[5].part);
			});
		});

		describe('FIND specific', function() {
			var findSpecificPrim;
			var findSpecificSec;
			var findSpecificSec2;

			beforeAll(done => {
				Item.find({
					part: rows[2].part,
					name: rows[2].name
				}).seam().subscribe(
					test => findSpecificPrim = test,
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				Item.find({
					id: rows[2].id
				}).seam().subscribe(
					test => findSpecificSec = test,
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				Item.findById(rows[2].id).seam().subscribe(
					test => findSpecificSec2 = test,
					err => console.log(err),
					() => done());
			});

			it('subscribe should not respond with array', () => {
				expect(findSpecificPrim).not.toEqual(jasmine.any(Array));
				expect(findSpecificSec).not.toEqual(jasmine.any(Array));
				expect(findSpecificSec2).not.toEqual(jasmine.any(Array));
			});

			it('subscribe should respond with database result (With Primary Keys)', () => {
				expect(findSpecificPrim.name).toEqual(rows[2].name);
				expect(findSpecificPrim.info).toEqual(rows[2].info);
				expect(findSpecificPrim.id).toEqual(rows[2].id);
				expect(findSpecificPrim.created).toEqual(rows[2].created);
				expect(findSpecificPrim.part).toEqual(rows[2].part);

				expect(findSpecificPrim.name).toEqual(findSpecificSec.name);
				expect(findSpecificPrim.info).toEqual(findSpecificSec.info);
				expect(findSpecificPrim.id).toEqual(findSpecificSec.id);
				expect(findSpecificPrim.created).toEqual(findSpecificSec.created);
				expect(findSpecificPrim.part).toEqual(findSpecificSec.part);

				expect(findSpecificPrim.name).toEqual(findSpecificSec2.name);
				expect(findSpecificPrim.info).toEqual(findSpecificSec2.info);
				expect(findSpecificPrim.id).toEqual(findSpecificSec2.id);
				expect(findSpecificPrim.created).toEqual(findSpecificSec2.created);
				expect(findSpecificPrim.part).toEqual(findSpecificSec2.part);
			});

			it('subscribe should respond with database result (With Secondary Key using find)', () => {
				expect(findSpecificSec.name).toEqual(rows[2].name);
				expect(findSpecificSec.info).toEqual(rows[2].info);
				expect(findSpecificSec.id).toEqual(rows[2].id);
				expect(findSpecificSec.created).toEqual(rows[2].created);
				expect(findSpecificSec.part).toEqual(rows[2].part);
			});

			it('subscribe should respond with database result (With Secondary Key using findById)', () => {
				expect(findSpecificSec2.name).toEqual(rows[2].name);
				expect(findSpecificSec2.info).toEqual(rows[2].info);
				expect(findSpecificSec2.id).toEqual(rows[2].id);
				expect(findSpecificSec2.created).toEqual(rows[2].created);
				expect(findSpecificSec2.part).toEqual(rows[2].part);
			});

			it('Primary Using find should be the same as Secondary using findById', () => {
				expect(findSpecificPrim.name).toEqual(findSpecificSec2.name);
				expect(findSpecificPrim.info).toEqual(findSpecificSec2.info);
				expect(findSpecificPrim.id).toEqual(findSpecificSec2.id);
				expect(findSpecificPrim.created).toEqual(findSpecificSec2.created);
				expect(findSpecificPrim.part).toEqual(findSpecificSec2.part);
			});

			it('Primary Using find should be the same as Secondary using find', () => {
				expect(findSpecificPrim.name).toEqual(findSpecificSec.name);
				expect(findSpecificPrim.info).toEqual(findSpecificSec.info);
				expect(findSpecificPrim.id).toEqual(findSpecificSec.id);
				expect(findSpecificPrim.created).toEqual(findSpecificSec.created);
				expect(findSpecificPrim.part).toEqual(findSpecificSec.part);
			});

			it('Secondary Using find should be the same as Secondary using findById', () => {
				expect(findSpecificSec.name).toEqual(findSpecificSec2.name);
				expect(findSpecificSec.info).toEqual(findSpecificSec2.info);
				expect(findSpecificSec.id).toEqual(findSpecificSec2.id);
				expect(findSpecificSec.created).toEqual(findSpecificSec2.created);
				expect(findSpecificSec.part).toEqual(findSpecificSec2.part);
			});
		});
	});

	describe('FIND with POST Events', function() {
		var rows;
		var post = [];

		beforeAll(done => {
			ItemPost.remove().create([{
				name: 'arrayFind1',
				info: 'this is a arrayFind1 test'
			}, {
				name: 'arrayFind2',
				info: 'this is a arrayFind2 test'
			}, {
				name: 'arrayFind3',
				info: 'this is a arrayFind3 test'
			}, {
				name: 'arrayFind4',
				info: 'this is a arrayFind4 test'
			}, {
				name: 'arrayFind5',
				info: 'this is a arrayFind5 test'
			}, {
				name: 'arrayFind6',
				info: 'this is a arrayFind6 test'
			}]).seam().subscribe(
				test => {},
				err => console.log(err),
				() => done());
		});

		beforeAll(done => {
			ItemPost.find().seam().subscribe(
				tests => rows = tests,
				err => console.log(err),
				() => done());
		});

		beforeAll(() => {
			ItemPost.post('find', (next, err, items) => {
				if (Array.isArray(items)) items.forEach(val => post.push(val.name + ' find post hooked!'));	 
				else post.push(items.name + ' find post hooked!');
				next(items);
			});
		});

		it('database should contain testing rows', () => {
			expect(rows).toEqual(jasmine.any(Array));

			expect(rows[0].name).toBe('arrayFind1');
			expect(rows[0].info).toBe('this is a arrayFind1 test');
			expect(rows[1].name).toBe('arrayFind2');
			expect(rows[1].info).toBe('this is a arrayFind2 test');
			expect(rows[2].name).toBe('arrayFind3');
			expect(rows[2].info).toBe('this is a arrayFind3 test');
			expect(rows[3].name).toBe('arrayFind4');
			expect(rows[3].info).toBe('this is a arrayFind4 test');
			expect(rows[4].name).toBe('arrayFind5');
			expect(rows[4].info).toBe('this is a arrayFind5 test');
			expect(rows[5].name).toBe('arrayFind6');
			expect(rows[5].info).toBe('this is a arrayFind6 test');
		});

		describe('FIND all', function() {
			var findTest;
			var findTestInclude;
			var findTestExclude;

			beforeAll(done => {
				ItemPost.find().seam().subscribe(
					tests => findTest = tests,
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				ItemPost.find({}, {
					attributes: ['name', 'info']
				}).seam().subscribe(
					tests => findTestInclude = tests,
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				ItemPost.find({}, {
					attributes: { exclude: ['created', 'id', 'part'] }
				}).seam().subscribe(
					tests => findTestExclude = tests,
					err => console.log(err),
					() => done());
			});

			it('subscribe should respond with array', () => {
				expect(findTest).toEqual(jasmine.any(Array));
				expect(findTestInclude).toEqual(jasmine.any(Array));
				expect(findTestExclude).toEqual(jasmine.any(Array));
			});

			it('subscribe should respond with database results', () => {
				expect(findTest[0].name).toEqual(rows[0].name);
				expect(findTest[0].info).toEqual(rows[0].info);
				expect(findTest[0].id).toEqual(rows[0].id);
				expect(findTest[0].created).toEqual(rows[0].created);
				expect(findTest[0].part).toEqual(rows[0].part);

				expect(findTest[1].name).toEqual(rows[1].name);
				expect(findTest[1].info).toEqual(rows[1].info);
				expect(findTest[1].id).toEqual(rows[1].id);
				expect(findTest[1].created).toEqual(rows[1].created);
				expect(findTest[1].part).toEqual(rows[1].part);

				expect(findTest[2].name).toEqual(rows[2].name);
				expect(findTest[2].info).toEqual(rows[2].info);
				expect(findTest[2].id).toEqual(rows[2].id);
				expect(findTest[2].created).toEqual(rows[2].created);
				expect(findTest[2].part).toEqual(rows[2].part);

				expect(findTest[3].name).toEqual(rows[3].name);
				expect(findTest[3].info).toEqual(rows[3].info);
				expect(findTest[3].id).toEqual(rows[3].id);
				expect(findTest[3].created).toEqual(rows[3].created);
				expect(findTest[3].part).toEqual(rows[3].part);

				expect(findTest[4].name).toEqual(rows[4].name);
				expect(findTest[4].info).toEqual(rows[4].info);
				expect(findTest[4].id).toEqual(rows[4].id);
				expect(findTest[4].created).toEqual(rows[4].created);
				expect(findTest[4].part).toEqual(rows[4].part);

				expect(findTest[5].name).toEqual(rows[5].name);
				expect(findTest[5].info).toEqual(rows[5].info);
				expect(findTest[5].id).toEqual(rows[5].id);
				expect(findTest[5].created).toEqual(rows[5].created);
				expect(findTest[5].part).toEqual(rows[5].part);
			});

			it('subscribe should respond with database results with included columns', () => {
				expect(findTestInclude[0].name).toEqual(rows[0].name);
				expect(findTestInclude[0].info).toEqual(rows[0].info);
				expect(findTestInclude[0].id).not.toBeDefined();
				expect(findTestInclude[0].created).not.toBeDefined();
				expect(findTestInclude[0].part).not.toBeDefined();

				expect(findTestInclude[1].name).toEqual(rows[1].name);
				expect(findTestInclude[1].info).toEqual(rows[1].info);
				expect(findTestInclude[1].id).not.toBeDefined();
				expect(findTestInclude[1].created).not.toBeDefined();
				expect(findTestInclude[1].part).not.toBeDefined();

				expect(findTestInclude[2].name).toEqual(rows[2].name);
				expect(findTestInclude[2].info).toEqual(rows[2].info);
				expect(findTestInclude[2].id).not.toBeDefined();
				expect(findTestInclude[2].created).not.toBeDefined();
				expect(findTestInclude[2].part).not.toBeDefined();

				expect(findTestInclude[3].name).toEqual(rows[3].name);
				expect(findTestInclude[3].info).toEqual(rows[3].info);
				expect(findTestInclude[3].id).not.toBeDefined();
				expect(findTestInclude[3].created).not.toBeDefined();
				expect(findTestInclude[3].part).not.toBeDefined();

				expect(findTestInclude[4].name).toEqual(rows[4].name);
				expect(findTestInclude[4].info).toEqual(rows[4].info);
				expect(findTestInclude[4].id).not.toBeDefined();
				expect(findTestInclude[4].created).not.toBeDefined();
				expect(findTestInclude[4].part).not.toBeDefined();

				expect(findTestInclude[5].name).toEqual(rows[5].name);
				expect(findTestInclude[5].info).toEqual(rows[5].info);
				expect(findTestInclude[5].id).not.toBeDefined();
				expect(findTestInclude[5].created).not.toBeDefined();
				expect(findTestInclude[5].part).not.toBeDefined();
			});

			it('subscribe should respond with database results without excluded columns', () => {
				expect(findTestExclude[0].name).toEqual(rows[0].name);
				expect(findTestExclude[0].info).toEqual(rows[0].info);
				expect(findTestExclude[0].id).not.toBeDefined();
				expect(findTestExclude[0].created).not.toBeDefined();
				expect(findTestExclude[0].part).not.toBeDefined();

				expect(findTestExclude[1].name).toEqual(rows[1].name);
				expect(findTestExclude[1].info).toEqual(rows[1].info);
				expect(findTestExclude[1].id).not.toBeDefined();
				expect(findTestExclude[1].created).not.toBeDefined();
				expect(findTestExclude[1].part).not.toBeDefined();

				expect(findTestExclude[2].name).toEqual(rows[2].name);
				expect(findTestExclude[2].info).toEqual(rows[2].info);
				expect(findTestExclude[2].id).not.toBeDefined();
				expect(findTestExclude[2].created).not.toBeDefined();
				expect(findTestExclude[2].part).not.toBeDefined();

				expect(findTestExclude[3].name).toEqual(rows[3].name);
				expect(findTestExclude[3].info).toEqual(rows[3].info);
				expect(findTestExclude[3].id).not.toBeDefined();
				expect(findTestExclude[3].created).not.toBeDefined();
				expect(findTestExclude[3].part).not.toBeDefined();

				expect(findTestExclude[4].name).toEqual(rows[4].name);
				expect(findTestExclude[4].info).toEqual(rows[4].info);
				expect(findTestExclude[4].id).not.toBeDefined();
				expect(findTestExclude[4].created).not.toBeDefined();
				expect(findTestExclude[4].part).not.toBeDefined();

				expect(findTestExclude[5].name).toEqual(rows[5].name);
				expect(findTestExclude[5].info).toEqual(rows[5].info);
				expect(findTestExclude[5].id).not.toBeDefined();
				expect(findTestExclude[5].created).not.toBeDefined();
				expect(findTestExclude[5].part).not.toBeDefined();
			});

			it('post events should have been triggered', () => {
				expect(post.length).toEqual(18);

				expect(post[0]).toEqual(findTest[0].name + ' find post hooked!');
				expect(post[1]).toEqual(findTest[1].name + ' find post hooked!');
				expect(post[2]).toEqual(findTest[2].name + ' find post hooked!');
				expect(post[3]).toEqual(findTest[3].name + ' find post hooked!');
				expect(post[4]).toEqual(findTest[4].name + ' find post hooked!');
				expect(post[5]).toEqual(findTest[5].name + ' find post hooked!');

				expect(post[6]).toEqual(findTestInclude[0].name + ' find post hooked!');
				expect(post[7]).toEqual(findTestInclude[1].name + ' find post hooked!');
				expect(post[8]).toEqual(findTestInclude[2].name + ' find post hooked!');
				expect(post[9]).toEqual(findTestInclude[3].name + ' find post hooked!');
				expect(post[10]).toEqual(findTestInclude[4].name + ' find post hooked!');
				expect(post[11]).toEqual(findTestInclude[5].name + ' find post hooked!');

				expect(post[12]).toEqual(findTestExclude[0].name + ' find post hooked!');
				expect(post[13]).toEqual(findTestExclude[1].name + ' find post hooked!');
				expect(post[14]).toEqual(findTestExclude[2].name + ' find post hooked!');
				expect(post[15]).toEqual(findTestExclude[3].name + ' find post hooked!');
				expect(post[16]).toEqual(findTestExclude[4].name + ' find post hooked!');
				expect(post[17]).toEqual(findTestExclude[5].name + ' find post hooked!');
			});
		});

		describe('FIND one', function() {
			var findOneTestWO;
			var findOneTestW;
			var findOneTestInclude;
			var findOneTestExclude;
			var findOneTestDesc;

			beforeAll(done => {
				post = [];
				ItemPost.findOne().seam().subscribe(
					tests => findOneTestWO = tests,
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				ItemPost.find({}, { limit: 1 }).seam().subscribe(
					tests => findOneTestW = tests,
					err => console.log(err),
					() => done());
			});


			beforeAll(done => {
				ItemPost.find({}, {
					limit: 1,
					attributes: ['name', 'info']
				}).seam().subscribe(
					tests => findOneTestInclude = tests,
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				ItemPost.find({}, {
					limit: 1,
					attributes: { exclude: ['created', 'id', 'part'] }
				}).seam().subscribe(
					tests => findOneTestExclude = tests,
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				ItemPost.find({ part: 'Item' }, {
					limit: 1,
					orderBy: 'name desc'
				}).seam().subscribe(
					tests => findOneTestDesc = tests,
					err => console.log(err),
					() => done());
			});

			it('subscribe should not respond with array', () => {
				expect(findOneTestWO).not.toEqual(jasmine.any(Array));
				expect(findOneTestW).not.toEqual(jasmine.any(Array));
				expect(findOneTestInclude).not.toEqual(jasmine.any(Array));
				expect(findOneTestExclude).not.toEqual(jasmine.any(Array));			
				expect(findOneTestDesc).not.toEqual(jasmine.any(Array));
			});

			it('subscribe should respond with database result (Without arguments)', () => {
				expect(findOneTestWO.name).toEqual(rows[0].name);
				expect(findOneTestWO.info).toEqual(rows[0].info);
				expect(findOneTestWO.id).toEqual(rows[0].id);
				expect(findOneTestWO.created).toEqual(rows[0].created);
				expect(findOneTestWO.part).toEqual(rows[0].part);
			});

			it('subscribe should respond with database result (With arguments)', () => {
				expect(findOneTestW.name).toEqual(rows[0].name);
				expect(findOneTestW.info).toEqual(rows[0].info);
				expect(findOneTestW.id).toEqual(rows[0].id);
				expect(findOneTestW.created).toEqual(rows[0].created);
				expect(findOneTestW.part).toEqual(rows[0].part);
			});

			it('subscribe should respond with database result with included columns', () => {
				expect(findOneTestInclude.name).toEqual(rows[0].name);
				expect(findOneTestInclude.info).toEqual(rows[0].info);
				expect(findOneTestInclude.id).not.toBeDefined();
				expect(findOneTestInclude.created).not.toBeDefined();
				expect(findOneTestInclude.part).not.toBeDefined();
			});

			it('subscribe should respond with database result without excluded columns', () => {
				expect(findOneTestExclude.name).toEqual(rows[0].name);
				expect(findOneTestExclude.info).toEqual(rows[0].info);
				expect(findOneTestExclude.id).not.toBeDefined();
				expect(findOneTestExclude.created).not.toBeDefined();
				expect(findOneTestExclude.part).not.toBeDefined();
			});

			it('subscribe should respond with last database result', () => {
				expect(findOneTestDesc.name).toEqual(rows[5].name);
				expect(findOneTestDesc.info).toEqual(rows[5].info);
				expect(findOneTestDesc.id).toEqual(rows[5].id);
				expect(findOneTestDesc.created).toEqual(rows[5].created);
				expect(findOneTestDesc.part).toEqual(rows[5].part);
			});

			it('post events should have triggered', () => {
				expect(post[0]).toEqual(rows[0].name + ' find post hooked!');
				expect(post[1]).toEqual(rows[0].name + ' find post hooked!');
				expect(post[2]).toEqual(rows[0].name + ' find post hooked!');
				expect(post[3]).toEqual(rows[0].name + ' find post hooked!');
				expect(post[4]).toEqual(rows[5].name + ' find post hooked!');
			});
		});

		describe('FIND specific', function() {
			var findSpecificPrim;
			var findSpecificSec;
			var findSpecificSec2;

			beforeAll(done => {
				post = [];
				ItemPost.find({
					part: rows[2].part,
					name: rows[2].name
				}).seam().subscribe(
					test => findSpecificPrim = test,
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				ItemPost.find({
					id: rows[2].id
				}).seam().subscribe(
					test => findSpecificSec = test,
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				ItemPost.findById(rows[2].id).seam().subscribe(
					test => findSpecificSec2 = test,
					err => console.log(err),
					() => done());
			});

			it('subscribe should not respond with array', () => {
				expect(findSpecificPrim).not.toEqual(jasmine.any(Array));
				expect(findSpecificSec).not.toEqual(jasmine.any(Array));
				expect(findSpecificSec2).not.toEqual(jasmine.any(Array));
			});

			it('subscribe should respond with database result (With Primary Keys)', () => {
				expect(findSpecificPrim.name).toEqual(rows[2].name);
				expect(findSpecificPrim.info).toEqual(rows[2].info);
				expect(findSpecificPrim.id).toEqual(rows[2].id);
				expect(findSpecificPrim.created).toEqual(rows[2].created);
				expect(findSpecificPrim.part).toEqual(rows[2].part);

				expect(findSpecificPrim.name).toEqual(findSpecificSec.name);
				expect(findSpecificPrim.info).toEqual(findSpecificSec.info);
				expect(findSpecificPrim.id).toEqual(findSpecificSec.id);
				expect(findSpecificPrim.created).toEqual(findSpecificSec.created);
				expect(findSpecificPrim.part).toEqual(findSpecificSec.part);

				expect(findSpecificPrim.name).toEqual(findSpecificSec2.name);
				expect(findSpecificPrim.info).toEqual(findSpecificSec2.info);
				expect(findSpecificPrim.id).toEqual(findSpecificSec2.id);
				expect(findSpecificPrim.created).toEqual(findSpecificSec2.created);
				expect(findSpecificPrim.part).toEqual(findSpecificSec2.part);
			});

			it('subscribe should respond with database result (With Secondary Key using find)', () => {
				expect(findSpecificSec.name).toEqual(rows[2].name);
				expect(findSpecificSec.info).toEqual(rows[2].info);
				expect(findSpecificSec.id).toEqual(rows[2].id);
				expect(findSpecificSec.created).toEqual(rows[2].created);
				expect(findSpecificSec.part).toEqual(rows[2].part);
			});

			it('subscribe should respond with database result (With Secondary Key using findById)', () => {
				expect(findSpecificSec2.name).toEqual(rows[2].name);
				expect(findSpecificSec2.info).toEqual(rows[2].info);
				expect(findSpecificSec2.id).toEqual(rows[2].id);
				expect(findSpecificSec2.created).toEqual(rows[2].created);
				expect(findSpecificSec2.part).toEqual(rows[2].part);
			});

			it('Primary Using find should be the same as Secondary using findById', () => {
				expect(findSpecificPrim.name).toEqual(findSpecificSec2.name);
				expect(findSpecificPrim.info).toEqual(findSpecificSec2.info);
				expect(findSpecificPrim.id).toEqual(findSpecificSec2.id);
				expect(findSpecificPrim.created).toEqual(findSpecificSec2.created);
				expect(findSpecificPrim.part).toEqual(findSpecificSec2.part);
			});

			it('Primary Using find should be the same as Secondary using find', () => {
				expect(findSpecificPrim.name).toEqual(findSpecificSec.name);
				expect(findSpecificPrim.info).toEqual(findSpecificSec.info);
				expect(findSpecificPrim.id).toEqual(findSpecificSec.id);
				expect(findSpecificPrim.created).toEqual(findSpecificSec.created);
				expect(findSpecificPrim.part).toEqual(findSpecificSec.part);
			});

			it('Secondary Using find should be the same as Secondary using findById', () => {
				expect(findSpecificSec.name).toEqual(findSpecificSec2.name);
				expect(findSpecificSec.info).toEqual(findSpecificSec2.info);
				expect(findSpecificSec.id).toEqual(findSpecificSec2.id);
				expect(findSpecificSec.created).toEqual(findSpecificSec2.created);
				expect(findSpecificSec.part).toEqual(findSpecificSec2.part);
			});

			it('port event should have been triggered', () => {
				expect(post[0]).toEqual(rows[2].name + ' find post hooked!');
				expect(post[1]).toEqual(rows[2].name + ' find post hooked!');
				expect(post[2]).toEqual(rows[2].name + ' find post hooked!');
			});
		});
	});

	describe('FIND with PRE Events', function() {
		var rows;
		var pre = [];

		beforeAll(done => {
			ItemPre.remove().create([{
				name: 'arrayFind1',
				info: 'this is a arrayFind1 test'
			}, {
				name: 'arrayFind2',
				info: 'this is a arrayFind2 test'
			}, {
				name: 'arrayFind3',
				info: 'this is a arrayFind3 test'
			}, {
				name: 'arrayFind4',
				info: 'this is a arrayFind4 test'
			}, {
				name: 'arrayFind5',
				info: 'this is a arrayFind5 test'
			}, {
				name: 'arrayFind6',
				info: 'this is a arrayFind6 test'
			}]).seam().subscribe(
				test => {},
				err => console.log(err),
				() => done());
		});

		beforeAll(done => {
			ItemPre.find().seam().subscribe(
				tests => rows = tests,
				err => console.log(err),
				() => done());
		});

		beforeAll(() => {
			ItemPre.pre('find', (next, err) => { 
				pre.push('find pre hooked!');
				next();
			});
		});

		it('database should contain testing rows', () => {
			expect(rows).toEqual(jasmine.any(Array));

			expect(rows[0].name).toBe('arrayFind1');
			expect(rows[0].info).toBe('this is a arrayFind1 test');
			expect(rows[1].name).toBe('arrayFind2');
			expect(rows[1].info).toBe('this is a arrayFind2 test');
			expect(rows[2].name).toBe('arrayFind3');
			expect(rows[2].info).toBe('this is a arrayFind3 test');
			expect(rows[3].name).toBe('arrayFind4');
			expect(rows[3].info).toBe('this is a arrayFind4 test');
			expect(rows[4].name).toBe('arrayFind5');
			expect(rows[4].info).toBe('this is a arrayFind5 test');
			expect(rows[5].name).toBe('arrayFind6');
			expect(rows[5].info).toBe('this is a arrayFind6 test');
		});

		describe('FIND all', function() {
			var findTest;
			var findTestInclude;
			var findTestExclude;

			beforeAll(done => {
				ItemPre.find().seam().subscribe(
					tests => findTest = tests,
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				ItemPre.find({}, {
					attributes: ['name', 'info']
				}).seam().subscribe(
					tests => findTestInclude = tests,
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				ItemPre.find({}, {
					attributes: { exclude: ['created', 'id', 'part'] }
				}).seam().subscribe(
					tests => findTestExclude = tests,
					err => console.log(err),
					() => done());
			});

			it('subscribe should respond with array', () => {
				expect(findTest).toEqual(jasmine.any(Array));
				expect(findTestInclude).toEqual(jasmine.any(Array));
				expect(findTestExclude).toEqual(jasmine.any(Array));
			});

			it('subscribe should respond with database results', () => {
				expect(findTest[0].name).toEqual(rows[0].name);
				expect(findTest[0].info).toEqual(rows[0].info);
				expect(findTest[0].id).toEqual(rows[0].id);
				expect(findTest[0].created).toEqual(rows[0].created);
				expect(findTest[0].part).toEqual(rows[0].part);

				expect(findTest[1].name).toEqual(rows[1].name);
				expect(findTest[1].info).toEqual(rows[1].info);
				expect(findTest[1].id).toEqual(rows[1].id);
				expect(findTest[1].created).toEqual(rows[1].created);
				expect(findTest[1].part).toEqual(rows[1].part);

				expect(findTest[2].name).toEqual(rows[2].name);
				expect(findTest[2].info).toEqual(rows[2].info);
				expect(findTest[2].id).toEqual(rows[2].id);
				expect(findTest[2].created).toEqual(rows[2].created);
				expect(findTest[2].part).toEqual(rows[2].part);

				expect(findTest[3].name).toEqual(rows[3].name);
				expect(findTest[3].info).toEqual(rows[3].info);
				expect(findTest[3].id).toEqual(rows[3].id);
				expect(findTest[3].created).toEqual(rows[3].created);
				expect(findTest[3].part).toEqual(rows[3].part);

				expect(findTest[4].name).toEqual(rows[4].name);
				expect(findTest[4].info).toEqual(rows[4].info);
				expect(findTest[4].id).toEqual(rows[4].id);
				expect(findTest[4].created).toEqual(rows[4].created);
				expect(findTest[4].part).toEqual(rows[4].part);

				expect(findTest[5].name).toEqual(rows[5].name);
				expect(findTest[5].info).toEqual(rows[5].info);
				expect(findTest[5].id).toEqual(rows[5].id);
				expect(findTest[5].created).toEqual(rows[5].created);
				expect(findTest[5].part).toEqual(rows[5].part);
			});

			it('subscribe should respond with database results with included columns', () => {
				expect(findTestInclude[0].name).toEqual(rows[0].name);
				expect(findTestInclude[0].info).toEqual(rows[0].info);
				expect(findTestInclude[0].id).not.toBeDefined();
				expect(findTestInclude[0].created).not.toBeDefined();
				expect(findTestInclude[0].part).not.toBeDefined();

				expect(findTestInclude[1].name).toEqual(rows[1].name);
				expect(findTestInclude[1].info).toEqual(rows[1].info);
				expect(findTestInclude[1].id).not.toBeDefined();
				expect(findTestInclude[1].created).not.toBeDefined();
				expect(findTestInclude[1].part).not.toBeDefined();

				expect(findTestInclude[2].name).toEqual(rows[2].name);
				expect(findTestInclude[2].info).toEqual(rows[2].info);
				expect(findTestInclude[2].id).not.toBeDefined();
				expect(findTestInclude[2].created).not.toBeDefined();
				expect(findTestInclude[2].part).not.toBeDefined();

				expect(findTestInclude[3].name).toEqual(rows[3].name);
				expect(findTestInclude[3].info).toEqual(rows[3].info);
				expect(findTestInclude[3].id).not.toBeDefined();
				expect(findTestInclude[3].created).not.toBeDefined();
				expect(findTestInclude[3].part).not.toBeDefined();

				expect(findTestInclude[4].name).toEqual(rows[4].name);
				expect(findTestInclude[4].info).toEqual(rows[4].info);
				expect(findTestInclude[4].id).not.toBeDefined();
				expect(findTestInclude[4].created).not.toBeDefined();
				expect(findTestInclude[4].part).not.toBeDefined();

				expect(findTestInclude[5].name).toEqual(rows[5].name);
				expect(findTestInclude[5].info).toEqual(rows[5].info);
				expect(findTestInclude[5].id).not.toBeDefined();
				expect(findTestInclude[5].created).not.toBeDefined();
				expect(findTestInclude[5].part).not.toBeDefined();
			});

			it('subscribe should respond with database results without excluded columns', () => {
				expect(findTestExclude[0].name).toEqual(rows[0].name);
				expect(findTestExclude[0].info).toEqual(rows[0].info);
				expect(findTestExclude[0].id).not.toBeDefined();
				expect(findTestExclude[0].created).not.toBeDefined();
				expect(findTestExclude[0].part).not.toBeDefined();

				expect(findTestExclude[1].name).toEqual(rows[1].name);
				expect(findTestExclude[1].info).toEqual(rows[1].info);
				expect(findTestExclude[1].id).not.toBeDefined();
				expect(findTestExclude[1].created).not.toBeDefined();
				expect(findTestExclude[1].part).not.toBeDefined();

				expect(findTestExclude[2].name).toEqual(rows[2].name);
				expect(findTestExclude[2].info).toEqual(rows[2].info);
				expect(findTestExclude[2].id).not.toBeDefined();
				expect(findTestExclude[2].created).not.toBeDefined();
				expect(findTestExclude[2].part).not.toBeDefined();

				expect(findTestExclude[3].name).toEqual(rows[3].name);
				expect(findTestExclude[3].info).toEqual(rows[3].info);
				expect(findTestExclude[3].id).not.toBeDefined();
				expect(findTestExclude[3].created).not.toBeDefined();
				expect(findTestExclude[3].part).not.toBeDefined();

				expect(findTestExclude[4].name).toEqual(rows[4].name);
				expect(findTestExclude[4].info).toEqual(rows[4].info);
				expect(findTestExclude[4].id).not.toBeDefined();
				expect(findTestExclude[4].created).not.toBeDefined();
				expect(findTestExclude[4].part).not.toBeDefined();

				expect(findTestExclude[5].name).toEqual(rows[5].name);
				expect(findTestExclude[5].info).toEqual(rows[5].info);
				expect(findTestExclude[5].id).not.toBeDefined();
				expect(findTestExclude[5].created).not.toBeDefined();
				expect(findTestExclude[5].part).not.toBeDefined();
			});

			it('pre events should have been triggered', () => {
				expect(pre.length).toEqual(3);

				expect(pre[0]).toEqual('find pre hooked!');
				expect(pre[1]).toEqual('find pre hooked!');
				expect(pre[2]).toEqual('find pre hooked!');
			});
		});

		describe('FIND one', function() {
			var findOneTestWO;
			var findOneTestW;
			var findOneTestInclude;
			var findOneTestExclude;
			var findOneTestDesc;

			beforeAll(done => {
				pre = [];
				ItemPre.findOne().seam().subscribe(
					tests => findOneTestWO = tests,
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				ItemPre.find({}, { limit: 1 }).seam().subscribe(
					tests => findOneTestW = tests,
					err => console.log(err),
					() => done());
			});


			beforeAll(done => {
				ItemPre.find({}, {
					limit: 1,
					attributes: ['name', 'info']
				}).seam().subscribe(
					tests => findOneTestInclude = tests,
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				ItemPre.find({}, {
					limit: 1,
					attributes: { exclude: ['created', 'id', 'part'] }
				}).seam().subscribe(
					tests => findOneTestExclude = tests,
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				ItemPre.find({ part: 'Item' }, {
					limit: 1,
					orderBy: 'name desc'
				}).seam().subscribe(
					tests => findOneTestDesc = tests,
					err => console.log(err),
					() => done());
			});

			it('subscribe should not respond with array', () => {
				expect(findOneTestWO).not.toEqual(jasmine.any(Array));
				expect(findOneTestW).not.toEqual(jasmine.any(Array));
				expect(findOneTestInclude).not.toEqual(jasmine.any(Array));
				expect(findOneTestExclude).not.toEqual(jasmine.any(Array));			
				expect(findOneTestDesc).not.toEqual(jasmine.any(Array));
			});

			it('subscribe should respond with database result (Without arguments)', () => {
				expect(findOneTestWO.name).toEqual(rows[0].name);
				expect(findOneTestWO.info).toEqual(rows[0].info);
				expect(findOneTestWO.id).toEqual(rows[0].id);
				expect(findOneTestWO.created).toEqual(rows[0].created);
				expect(findOneTestWO.part).toEqual(rows[0].part);
			});

			it('subscribe should respond with database result (With arguments)', () => {
				expect(findOneTestW.name).toEqual(rows[0].name);
				expect(findOneTestW.info).toEqual(rows[0].info);
				expect(findOneTestW.id).toEqual(rows[0].id);
				expect(findOneTestW.created).toEqual(rows[0].created);
				expect(findOneTestW.part).toEqual(rows[0].part);
			});

			it('subscribe should respond with database result with included columns', () => {
				expect(findOneTestInclude.name).toEqual(rows[0].name);
				expect(findOneTestInclude.info).toEqual(rows[0].info);
				expect(findOneTestInclude.id).not.toBeDefined();
				expect(findOneTestInclude.created).not.toBeDefined();
				expect(findOneTestInclude.part).not.toBeDefined();
			});

			it('subscribe should respond with database result without excluded columns', () => {
				expect(findOneTestExclude.name).toEqual(rows[0].name);
				expect(findOneTestExclude.info).toEqual(rows[0].info);
				expect(findOneTestExclude.id).not.toBeDefined();
				expect(findOneTestExclude.created).not.toBeDefined();
				expect(findOneTestExclude.part).not.toBeDefined();
			});

			it('subscribe should respond with last database result', () => {
				expect(findOneTestDesc.name).toEqual(rows[5].name);
				expect(findOneTestDesc.info).toEqual(rows[5].info);
				expect(findOneTestDesc.id).toEqual(rows[5].id);
				expect(findOneTestDesc.created).toEqual(rows[5].created);
				expect(findOneTestDesc.part).toEqual(rows[5].part);
			});

			it('pre events should have triggered', () => {
				expect(pre[0]).toEqual('find pre hooked!');
				expect(pre[1]).toEqual('find pre hooked!');
				expect(pre[2]).toEqual('find pre hooked!');
				expect(pre[3]).toEqual('find pre hooked!');
				expect(pre[4]).toEqual('find pre hooked!');
			});
		});

		describe('FIND specific', function() {
			var findSpecificPrim;
			var findSpecificSec;
			var findSpecificSec2;

			beforeAll(done => {
				pre = [];
				ItemPre.find({
					part: rows[2].part,
					name: rows[2].name
				}).seam().subscribe(
					test => findSpecificPrim = test,
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				ItemPre.find({
					id: rows[2].id
				}).seam().subscribe(
					test => findSpecificSec = test,
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				ItemPre.findById(rows[2].id).seam().subscribe(
					test => findSpecificSec2 = test,
					err => console.log(err),
					() => done());
			});

			it('subscribe should not respond with array', () => {
				expect(findSpecificPrim).not.toEqual(jasmine.any(Array));
				expect(findSpecificSec).not.toEqual(jasmine.any(Array));
				expect(findSpecificSec2).not.toEqual(jasmine.any(Array));
			});

			it('subscribe should respond with database result (With Primary Keys)', () => {
				expect(findSpecificPrim.name).toEqual(rows[2].name);
				expect(findSpecificPrim.info).toEqual(rows[2].info);
				expect(findSpecificPrim.id).toEqual(rows[2].id);
				expect(findSpecificPrim.created).toEqual(rows[2].created);
				expect(findSpecificPrim.part).toEqual(rows[2].part);

				expect(findSpecificPrim.name).toEqual(findSpecificSec.name);
				expect(findSpecificPrim.info).toEqual(findSpecificSec.info);
				expect(findSpecificPrim.id).toEqual(findSpecificSec.id);
				expect(findSpecificPrim.created).toEqual(findSpecificSec.created);
				expect(findSpecificPrim.part).toEqual(findSpecificSec.part);

				expect(findSpecificPrim.name).toEqual(findSpecificSec2.name);
				expect(findSpecificPrim.info).toEqual(findSpecificSec2.info);
				expect(findSpecificPrim.id).toEqual(findSpecificSec2.id);
				expect(findSpecificPrim.created).toEqual(findSpecificSec2.created);
				expect(findSpecificPrim.part).toEqual(findSpecificSec2.part);
			});

			it('subscribe should respond with database result (With Secondary Key using find)', () => {
				expect(findSpecificSec.name).toEqual(rows[2].name);
				expect(findSpecificSec.info).toEqual(rows[2].info);
				expect(findSpecificSec.id).toEqual(rows[2].id);
				expect(findSpecificSec.created).toEqual(rows[2].created);
				expect(findSpecificSec.part).toEqual(rows[2].part);
			});

			it('subscribe should respond with database result (With Secondary Key using findById)', () => {
				expect(findSpecificSec2.name).toEqual(rows[2].name);
				expect(findSpecificSec2.info).toEqual(rows[2].info);
				expect(findSpecificSec2.id).toEqual(rows[2].id);
				expect(findSpecificSec2.created).toEqual(rows[2].created);
				expect(findSpecificSec2.part).toEqual(rows[2].part);
			});

			it('Primary Using find should be the same as Secondary using findById', () => {
				expect(findSpecificPrim.name).toEqual(findSpecificSec2.name);
				expect(findSpecificPrim.info).toEqual(findSpecificSec2.info);
				expect(findSpecificPrim.id).toEqual(findSpecificSec2.id);
				expect(findSpecificPrim.created).toEqual(findSpecificSec2.created);
				expect(findSpecificPrim.part).toEqual(findSpecificSec2.part);
			});

			it('Primary Using find should be the same as Secondary using find', () => {
				expect(findSpecificPrim.name).toEqual(findSpecificSec.name);
				expect(findSpecificPrim.info).toEqual(findSpecificSec.info);
				expect(findSpecificPrim.id).toEqual(findSpecificSec.id);
				expect(findSpecificPrim.created).toEqual(findSpecificSec.created);
				expect(findSpecificPrim.part).toEqual(findSpecificSec.part);
			});

			it('Secondary Using find should be the same as Secondary using findById', () => {
				expect(findSpecificSec.name).toEqual(findSpecificSec2.name);
				expect(findSpecificSec.info).toEqual(findSpecificSec2.info);
				expect(findSpecificSec.id).toEqual(findSpecificSec2.id);
				expect(findSpecificSec.created).toEqual(findSpecificSec2.created);
				expect(findSpecificSec.part).toEqual(findSpecificSec2.part);
			});

			it('pre event should have been triggered', () => {
				expect(pre[0]).toEqual('find pre hooked!');
				expect(pre[1]).toEqual('find pre hooked!');
				expect(pre[2]).toEqual('find pre hooked!');
			});
		});
	});

	describe('FIND with POST and PRE Events', function() {
		var rows;
		var pre = [];
		var post = [];

		beforeAll(done => {
			ItemPrePost.remove().create([{
				name: 'arrayFind1',
				info: 'this is a arrayFind1 test'
			}, {
				name: 'arrayFind2',
				info: 'this is a arrayFind2 test'
			}, {
				name: 'arrayFind3',
				info: 'this is a arrayFind3 test'
			}, {
				name: 'arrayFind4',
				info: 'this is a arrayFind4 test'
			}, {
				name: 'arrayFind5',
				info: 'this is a arrayFind5 test'
			}, {
				name: 'arrayFind6',
				info: 'this is a arrayFind6 test'
			}]).seam().subscribe(
				test => {},
				err => console.log(err),
				() => done());
		});

		beforeAll(done => {
			ItemPrePost.find().seam().subscribe(
				tests => rows = tests,
				err => console.log(err),
				() => done());
		});

		beforeAll(() => {
			ItemPrePost.pre('find', (next, err) => { 
				pre.push('find pre hooked!');
				next();
			});
			ItemPrePost.post('find', (next, err, items) => {
				if (Array.isArray(items)) items.forEach(val => post.push(val.name + ' find post hooked!'));	 
				else post.push(items.name + ' find post hooked!');
				next(items);
			});
		});

		it('database should contain testing rows', () => {
			expect(rows).toEqual(jasmine.any(Array));

			expect(rows[0].name).toBe('arrayFind1');
			expect(rows[0].info).toBe('this is a arrayFind1 test');
			expect(rows[1].name).toBe('arrayFind2');
			expect(rows[1].info).toBe('this is a arrayFind2 test');
			expect(rows[2].name).toBe('arrayFind3');
			expect(rows[2].info).toBe('this is a arrayFind3 test');
			expect(rows[3].name).toBe('arrayFind4');
			expect(rows[3].info).toBe('this is a arrayFind4 test');
			expect(rows[4].name).toBe('arrayFind5');
			expect(rows[4].info).toBe('this is a arrayFind5 test');
			expect(rows[5].name).toBe('arrayFind6');
			expect(rows[5].info).toBe('this is a arrayFind6 test');
		});

		describe('FIND all', function() {
			var findTest;
			var findTestInclude;
			var findTestExclude;

			beforeAll(done => {
				ItemPrePost.find().seam().subscribe(
					tests => findTest = tests,
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				ItemPrePost.find({}, {
					attributes: ['name', 'info']
				}).seam().subscribe(
					tests => findTestInclude = tests,
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				ItemPrePost.find({}, {
					attributes: { exclude: ['created', 'id', 'part'] }
				}).seam().subscribe(
					tests => findTestExclude = tests,
					err => console.log(err),
					() => done());
			});

			it('subscribe should respond with array', () => {
				expect(findTest).toEqual(jasmine.any(Array));
				expect(findTestInclude).toEqual(jasmine.any(Array));
				expect(findTestExclude).toEqual(jasmine.any(Array));
			});

			it('subscribe should respond with database results', () => {
				expect(findTest[0].name).toEqual(rows[0].name);
				expect(findTest[0].info).toEqual(rows[0].info);
				expect(findTest[0].id).toEqual(rows[0].id);
				expect(findTest[0].created).toEqual(rows[0].created);
				expect(findTest[0].part).toEqual(rows[0].part);

				expect(findTest[1].name).toEqual(rows[1].name);
				expect(findTest[1].info).toEqual(rows[1].info);
				expect(findTest[1].id).toEqual(rows[1].id);
				expect(findTest[1].created).toEqual(rows[1].created);
				expect(findTest[1].part).toEqual(rows[1].part);

				expect(findTest[2].name).toEqual(rows[2].name);
				expect(findTest[2].info).toEqual(rows[2].info);
				expect(findTest[2].id).toEqual(rows[2].id);
				expect(findTest[2].created).toEqual(rows[2].created);
				expect(findTest[2].part).toEqual(rows[2].part);

				expect(findTest[3].name).toEqual(rows[3].name);
				expect(findTest[3].info).toEqual(rows[3].info);
				expect(findTest[3].id).toEqual(rows[3].id);
				expect(findTest[3].created).toEqual(rows[3].created);
				expect(findTest[3].part).toEqual(rows[3].part);

				expect(findTest[4].name).toEqual(rows[4].name);
				expect(findTest[4].info).toEqual(rows[4].info);
				expect(findTest[4].id).toEqual(rows[4].id);
				expect(findTest[4].created).toEqual(rows[4].created);
				expect(findTest[4].part).toEqual(rows[4].part);

				expect(findTest[5].name).toEqual(rows[5].name);
				expect(findTest[5].info).toEqual(rows[5].info);
				expect(findTest[5].id).toEqual(rows[5].id);
				expect(findTest[5].created).toEqual(rows[5].created);
				expect(findTest[5].part).toEqual(rows[5].part);
			});

			it('subscribe should respond with database results with included columns', () => {
				expect(findTestInclude[0].name).toEqual(rows[0].name);
				expect(findTestInclude[0].info).toEqual(rows[0].info);
				expect(findTestInclude[0].id).not.toBeDefined();
				expect(findTestInclude[0].created).not.toBeDefined();
				expect(findTestInclude[0].part).not.toBeDefined();

				expect(findTestInclude[1].name).toEqual(rows[1].name);
				expect(findTestInclude[1].info).toEqual(rows[1].info);
				expect(findTestInclude[1].id).not.toBeDefined();
				expect(findTestInclude[1].created).not.toBeDefined();
				expect(findTestInclude[1].part).not.toBeDefined();

				expect(findTestInclude[2].name).toEqual(rows[2].name);
				expect(findTestInclude[2].info).toEqual(rows[2].info);
				expect(findTestInclude[2].id).not.toBeDefined();
				expect(findTestInclude[2].created).not.toBeDefined();
				expect(findTestInclude[2].part).not.toBeDefined();

				expect(findTestInclude[3].name).toEqual(rows[3].name);
				expect(findTestInclude[3].info).toEqual(rows[3].info);
				expect(findTestInclude[3].id).not.toBeDefined();
				expect(findTestInclude[3].created).not.toBeDefined();
				expect(findTestInclude[3].part).not.toBeDefined();

				expect(findTestInclude[4].name).toEqual(rows[4].name);
				expect(findTestInclude[4].info).toEqual(rows[4].info);
				expect(findTestInclude[4].id).not.toBeDefined();
				expect(findTestInclude[4].created).not.toBeDefined();
				expect(findTestInclude[4].part).not.toBeDefined();

				expect(findTestInclude[5].name).toEqual(rows[5].name);
				expect(findTestInclude[5].info).toEqual(rows[5].info);
				expect(findTestInclude[5].id).not.toBeDefined();
				expect(findTestInclude[5].created).not.toBeDefined();
				expect(findTestInclude[5].part).not.toBeDefined();
			});

			it('subscribe should respond with database results without excluded columns', () => {
				expect(findTestExclude[0].name).toEqual(rows[0].name);
				expect(findTestExclude[0].info).toEqual(rows[0].info);
				expect(findTestExclude[0].id).not.toBeDefined();
				expect(findTestExclude[0].created).not.toBeDefined();
				expect(findTestExclude[0].part).not.toBeDefined();

				expect(findTestExclude[1].name).toEqual(rows[1].name);
				expect(findTestExclude[1].info).toEqual(rows[1].info);
				expect(findTestExclude[1].id).not.toBeDefined();
				expect(findTestExclude[1].created).not.toBeDefined();
				expect(findTestExclude[1].part).not.toBeDefined();

				expect(findTestExclude[2].name).toEqual(rows[2].name);
				expect(findTestExclude[2].info).toEqual(rows[2].info);
				expect(findTestExclude[2].id).not.toBeDefined();
				expect(findTestExclude[2].created).not.toBeDefined();
				expect(findTestExclude[2].part).not.toBeDefined();

				expect(findTestExclude[3].name).toEqual(rows[3].name);
				expect(findTestExclude[3].info).toEqual(rows[3].info);
				expect(findTestExclude[3].id).not.toBeDefined();
				expect(findTestExclude[3].created).not.toBeDefined();
				expect(findTestExclude[3].part).not.toBeDefined();

				expect(findTestExclude[4].name).toEqual(rows[4].name);
				expect(findTestExclude[4].info).toEqual(rows[4].info);
				expect(findTestExclude[4].id).not.toBeDefined();
				expect(findTestExclude[4].created).not.toBeDefined();
				expect(findTestExclude[4].part).not.toBeDefined();

				expect(findTestExclude[5].name).toEqual(rows[5].name);
				expect(findTestExclude[5].info).toEqual(rows[5].info);
				expect(findTestExclude[5].id).not.toBeDefined();
				expect(findTestExclude[5].created).not.toBeDefined();
				expect(findTestExclude[5].part).not.toBeDefined();
			});

			it('pre and post events should have been triggered', () => {
				expect(pre.length).toEqual(3);

				expect(pre[0]).toEqual('find pre hooked!');
				expect(pre[1]).toEqual('find pre hooked!');
				expect(pre[2]).toEqual('find pre hooked!');

				expect(post.length).toEqual(18);

				expect(post[0]).toEqual(findTest[0].name + ' find post hooked!');
				expect(post[1]).toEqual(findTest[1].name + ' find post hooked!');
				expect(post[2]).toEqual(findTest[2].name + ' find post hooked!');
				expect(post[3]).toEqual(findTest[3].name + ' find post hooked!');
				expect(post[4]).toEqual(findTest[4].name + ' find post hooked!');
				expect(post[5]).toEqual(findTest[5].name + ' find post hooked!');

				expect(post[6]).toEqual(findTestInclude[0].name + ' find post hooked!');
				expect(post[7]).toEqual(findTestInclude[1].name + ' find post hooked!');
				expect(post[8]).toEqual(findTestInclude[2].name + ' find post hooked!');
				expect(post[9]).toEqual(findTestInclude[3].name + ' find post hooked!');
				expect(post[10]).toEqual(findTestInclude[4].name + ' find post hooked!');
				expect(post[11]).toEqual(findTestInclude[5].name + ' find post hooked!');

				expect(post[12]).toEqual(findTestExclude[0].name + ' find post hooked!');
				expect(post[13]).toEqual(findTestExclude[1].name + ' find post hooked!');
				expect(post[14]).toEqual(findTestExclude[2].name + ' find post hooked!');
				expect(post[15]).toEqual(findTestExclude[3].name + ' find post hooked!');
				expect(post[16]).toEqual(findTestExclude[4].name + ' find post hooked!');
				expect(post[17]).toEqual(findTestExclude[5].name + ' find post hooked!');
			});
		});

		describe('FIND one', function() {
			var findOneTestWO;
			var findOneTestW;
			var findOneTestInclude;
			var findOneTestExclude;
			var findOneTestDesc;

			beforeAll(done => {
				pre = [];
				post = [];
				ItemPrePost.findOne().seam().subscribe(
					tests => findOneTestWO = tests,
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				ItemPrePost.find({}, { limit: 1 }).seam().subscribe(
					tests => findOneTestW = tests,
					err => console.log(err),
					() => done());
			});


			beforeAll(done => {
				ItemPrePost.find({}, {
					limit: 1,
					attributes: ['name', 'info']
				}).seam().subscribe(
					tests => findOneTestInclude = tests,
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				ItemPrePost.find({}, {
					limit: 1,
					attributes: { exclude: ['created', 'id', 'part'] }
				}).seam().subscribe(
					tests => findOneTestExclude = tests,
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				ItemPrePost.find({ part: 'Item' }, {
					limit: 1,
					orderBy: 'name desc'
				}).seam().subscribe(
					tests => findOneTestDesc = tests,
					err => console.log(err),
					() => done());
			});

			it('subscribe should not respond with array', () => {
				expect(findOneTestWO).not.toEqual(jasmine.any(Array));
				expect(findOneTestW).not.toEqual(jasmine.any(Array));
				expect(findOneTestInclude).not.toEqual(jasmine.any(Array));
				expect(findOneTestExclude).not.toEqual(jasmine.any(Array));			
				expect(findOneTestDesc).not.toEqual(jasmine.any(Array));
			});

			it('subscribe should respond with database result (Without arguments)', () => {
				expect(findOneTestWO.name).toEqual(rows[0].name);
				expect(findOneTestWO.info).toEqual(rows[0].info);
				expect(findOneTestWO.id).toEqual(rows[0].id);
				expect(findOneTestWO.created).toEqual(rows[0].created);
				expect(findOneTestWO.part).toEqual(rows[0].part);
			});

			it('subscribe should respond with database result (With arguments)', () => {
				expect(findOneTestW.name).toEqual(rows[0].name);
				expect(findOneTestW.info).toEqual(rows[0].info);
				expect(findOneTestW.id).toEqual(rows[0].id);
				expect(findOneTestW.created).toEqual(rows[0].created);
				expect(findOneTestW.part).toEqual(rows[0].part);
			});

			it('subscribe should respond with database result with included columns', () => {
				expect(findOneTestInclude.name).toEqual(rows[0].name);
				expect(findOneTestInclude.info).toEqual(rows[0].info);
				expect(findOneTestInclude.id).not.toBeDefined();
				expect(findOneTestInclude.created).not.toBeDefined();
				expect(findOneTestInclude.part).not.toBeDefined();
			});

			it('subscribe should respond with database result without excluded columns', () => {
				expect(findOneTestExclude.name).toEqual(rows[0].name);
				expect(findOneTestExclude.info).toEqual(rows[0].info);
				expect(findOneTestExclude.id).not.toBeDefined();
				expect(findOneTestExclude.created).not.toBeDefined();
				expect(findOneTestExclude.part).not.toBeDefined();
			});

			it('subscribe should respond with last database result', () => {
				expect(findOneTestDesc.name).toEqual(rows[5].name);
				expect(findOneTestDesc.info).toEqual(rows[5].info);
				expect(findOneTestDesc.id).toEqual(rows[5].id);
				expect(findOneTestDesc.created).toEqual(rows[5].created);
				expect(findOneTestDesc.part).toEqual(rows[5].part);
			});

			it('pre and post events should have triggered', () => {
				expect(pre[0]).toEqual('find pre hooked!');
				expect(pre[1]).toEqual('find pre hooked!');
				expect(pre[2]).toEqual('find pre hooked!');
				expect(pre[3]).toEqual('find pre hooked!');
				expect(pre[4]).toEqual('find pre hooked!');

				expect(post[0]).toEqual(rows[0].name + ' find post hooked!');
				expect(post[1]).toEqual(rows[0].name + ' find post hooked!');
				expect(post[2]).toEqual(rows[0].name + ' find post hooked!');
				expect(post[3]).toEqual(rows[0].name + ' find post hooked!');
				expect(post[4]).toEqual(rows[5].name + ' find post hooked!');
			});
		});

		describe('FIND specific', function() {
			var findSpecificPrim;
			var findSpecificSec;
			var findSpecificSec2;

			beforeAll(done => {
				pre = [];
				post = [];
				ItemPrePost.find({
					part: rows[2].part,
					name: rows[2].name
				}).seam().subscribe(
					test => findSpecificPrim = test,
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				ItemPrePost.find({
					id: rows[2].id
				}).seam().subscribe(
					test => findSpecificSec = test,
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				ItemPrePost.findById(rows[2].id).seam().subscribe(
					test => findSpecificSec2 = test,
					err => console.log(err),
					() => done());
			});

			it('subscribe should not respond with array', () => {
				expect(findSpecificPrim).not.toEqual(jasmine.any(Array));
				expect(findSpecificSec).not.toEqual(jasmine.any(Array));
				expect(findSpecificSec2).not.toEqual(jasmine.any(Array));
			});

			it('subscribe should respond with database result (With Primary Keys)', () => {
				expect(findSpecificPrim.name).toEqual(rows[2].name);
				expect(findSpecificPrim.info).toEqual(rows[2].info);
				expect(findSpecificPrim.id).toEqual(rows[2].id);
				expect(findSpecificPrim.created).toEqual(rows[2].created);
				expect(findSpecificPrim.part).toEqual(rows[2].part);

				expect(findSpecificPrim.name).toEqual(findSpecificSec.name);
				expect(findSpecificPrim.info).toEqual(findSpecificSec.info);
				expect(findSpecificPrim.id).toEqual(findSpecificSec.id);
				expect(findSpecificPrim.created).toEqual(findSpecificSec.created);
				expect(findSpecificPrim.part).toEqual(findSpecificSec.part);

				expect(findSpecificPrim.name).toEqual(findSpecificSec2.name);
				expect(findSpecificPrim.info).toEqual(findSpecificSec2.info);
				expect(findSpecificPrim.id).toEqual(findSpecificSec2.id);
				expect(findSpecificPrim.created).toEqual(findSpecificSec2.created);
				expect(findSpecificPrim.part).toEqual(findSpecificSec2.part);
			});

			it('subscribe should respond with database result (With Secondary Key using find)', () => {
				expect(findSpecificSec.name).toEqual(rows[2].name);
				expect(findSpecificSec.info).toEqual(rows[2].info);
				expect(findSpecificSec.id).toEqual(rows[2].id);
				expect(findSpecificSec.created).toEqual(rows[2].created);
				expect(findSpecificSec.part).toEqual(rows[2].part);
			});

			it('subscribe should respond with database result (With Secondary Key using findById)', () => {
				expect(findSpecificSec2.name).toEqual(rows[2].name);
				expect(findSpecificSec2.info).toEqual(rows[2].info);
				expect(findSpecificSec2.id).toEqual(rows[2].id);
				expect(findSpecificSec2.created).toEqual(rows[2].created);
				expect(findSpecificSec2.part).toEqual(rows[2].part);
			});

			it('Primary Using find should be the same as Secondary using findById', () => {
				expect(findSpecificPrim.name).toEqual(findSpecificSec2.name);
				expect(findSpecificPrim.info).toEqual(findSpecificSec2.info);
				expect(findSpecificPrim.id).toEqual(findSpecificSec2.id);
				expect(findSpecificPrim.created).toEqual(findSpecificSec2.created);
				expect(findSpecificPrim.part).toEqual(findSpecificSec2.part);
			});

			it('Primary Using find should be the same as Secondary using find', () => {
				expect(findSpecificPrim.name).toEqual(findSpecificSec.name);
				expect(findSpecificPrim.info).toEqual(findSpecificSec.info);
				expect(findSpecificPrim.id).toEqual(findSpecificSec.id);
				expect(findSpecificPrim.created).toEqual(findSpecificSec.created);
				expect(findSpecificPrim.part).toEqual(findSpecificSec.part);
			});

			it('Secondary Using find should be the same as Secondary using findById', () => {
				expect(findSpecificSec.name).toEqual(findSpecificSec2.name);
				expect(findSpecificSec.info).toEqual(findSpecificSec2.info);
				expect(findSpecificSec.id).toEqual(findSpecificSec2.id);
				expect(findSpecificSec.created).toEqual(findSpecificSec2.created);
				expect(findSpecificSec.part).toEqual(findSpecificSec2.part);
			});

			it('pre and post event should have been triggered', () => {
				expect(pre[0]).toEqual('find pre hooked!');
				expect(pre[1]).toEqual('find pre hooked!');
				expect(pre[2]).toEqual('find pre hooked!');

				expect(post[0]).toEqual(rows[2].name + ' find post hooked!');
				expect(post[1]).toEqual(rows[2].name + ' find post hooked!');
				expect(post[2]).toEqual(rows[2].name + ' find post hooked!');
			});
		});
	});

});