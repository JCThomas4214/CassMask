var Item = require('./model');
var ItemPost = require('./model/post');
var ItemPre = require('./model/pre');
var ItemPrePost = require('./model/prepost');

describe('CassMask CREATE', function() {

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

	describe('CREATE without Events', function() {

		describe('CREATE single', function() {
			var newSubTest;
			var newTest;

			beforeAll(done => {
				Item.remove().create({
					name: 'testing',
					info: 'this is a testing insert'
				}).seam().subscribe(
					test => newSubTest = test,
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				Item.find().seam().subscribe(
					test => newTest = test,
					err => console.log(err),
					() => done());
			});

			it('subscribe result should be the same as inserted', () => {
				expect(newSubTest.name).toBe('testing');
				expect(newSubTest.info).toBe('this is a testing insert');
				expect(newSubTest.id).toBe('uuid()');
				expect(newSubTest.created).toBe('toTimeStamp(now())');
			});

			it('database should have same result as inserted', () => {
				expect(newTest).not.toEqual(jasmine.any(Array));
				expect(newTest.name).toBe('testing');
				expect(newTest.info).toBe('this is a testing insert');
				expect(newSubTest.id).toBeDefined();
				expect(newSubTest.created).toBeDefined();
			});
		});

		describe('CREATE array', function() {
			var arrayTest = [];
			var dbrows;

			beforeAll(done => {
				Item.remove().create([{
					name: 'arrayInsert1',
					info: 'this is a arrayInsert1 test'
				}, {
					name: 'arrayInsert2',
					info: 'this is a arrayInsert2 test'
				}, {
					name: 'arrayInsert3',
					info: 'this is a arrayInsert3 test'
				}, {
					name: 'arrayInsert4',
					info: 'this is a arrayInsert4 test'
				}, {
					name: 'arrayInsert5',
					info: 'this is a arrayInsert5 test'
				}, {
					name: 'arrayInsert6',
					info: 'this is a arrayInsert6 test'
				}]).seam().subscribe(
					test => arrayTest.push(test),
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				Item.find().seam().subscribe(
					tests => dbrows = tests,
					error => console.log(err),
					() => done());
			})

			it('subscribe should have responded with 6 results', () => {
				expect(arrayTest.length).toBe(6);
			});

			it('subscribe results should be the same as inserted', () => {
				expect(arrayTest[0].name).toBe('arrayInsert1');
				expect(arrayTest[0].info).toBe('this is a arrayInsert1 test');
				expect(arrayTest[0].created).toBe('toTimeStamp(now())');
				expect(arrayTest[0].id).toBe('uuid()');
				expect(arrayTest[1].name).toBe('arrayInsert2');
				expect(arrayTest[1].info).toBe('this is a arrayInsert2 test');
				expect(arrayTest[1].created).toBe('toTimeStamp(now())');
				expect(arrayTest[1].id).toBe('uuid()');
				expect(arrayTest[2].name).toBe('arrayInsert3');
				expect(arrayTest[2].info).toBe('this is a arrayInsert3 test');
				expect(arrayTest[2].created).toBe('toTimeStamp(now())');
				expect(arrayTest[2].id).toBe('uuid()');
				expect(arrayTest[3].name).toBe('arrayInsert4');
				expect(arrayTest[3].info).toBe('this is a arrayInsert4 test');
				expect(arrayTest[3].created).toBe('toTimeStamp(now())');
				expect(arrayTest[3].id).toBe('uuid()');
				expect(arrayTest[4].name).toBe('arrayInsert5');
				expect(arrayTest[4].info).toBe('this is a arrayInsert5 test');
				expect(arrayTest[4].created).toBe('toTimeStamp(now())');
				expect(arrayTest[4].id).toBe('uuid()');
				expect(arrayTest[5].name).toBe('arrayInsert6');
				expect(arrayTest[5].info).toBe('this is a arrayInsert6 test');
				expect(arrayTest[5].created).toBe('toTimeStamp(now())');
				expect(arrayTest[5].id).toBe('uuid()');
			});

			it('database should have same results as inserted', () => {
				expect(dbrows).toEqual(jasmine.any(Array));
				expect(dbrows[0].name).toBe('arrayInsert1');
				expect(dbrows[0].info).toBe('this is a arrayInsert1 test');
				expect(dbrows[0].created).not.toBe('toTimeStamp(now())');
				expect(dbrows[0].id).not.toBe('uuid()');
				expect(dbrows[1].name).toBe('arrayInsert2');
				expect(dbrows[1].info).toBe('this is a arrayInsert2 test');
				expect(dbrows[1].created).not.toBe('toTimeStamp(now())');
				expect(dbrows[1].id).not.toBe('uuid()');
				expect(dbrows[2].name).toBe('arrayInsert3');
				expect(dbrows[2].info).toBe('this is a arrayInsert3 test');
				expect(dbrows[2].created).not.toBe('toTimeStamp(now())');
				expect(dbrows[2].id).not.toBe('uuid()');
				expect(dbrows[3].name).toBe('arrayInsert4');
				expect(dbrows[3].info).toBe('this is a arrayInsert4 test');
				expect(dbrows[3].created).not.toBe('toTimeStamp(now())');
				expect(dbrows[3].id).not.toBe('uuid()');
				expect(dbrows[4].name).toBe('arrayInsert5');
				expect(dbrows[4].info).toBe('this is a arrayInsert5 test');
				expect(dbrows[4].created).not.toBe('toTimeStamp(now())');
				expect(dbrows[4].id).not.toBe('uuid()');
				expect(dbrows[5].name).toBe('arrayInsert6');
				expect(dbrows[5].info).toBe('this is a arrayInsert6 test');
				expect(dbrows[5].created).not.toBe('toTimeStamp(now())');
				expect(dbrows[5].id).not.toBe('uuid()');
			});
		});
	});

	describe('CREATE with POST events', function() {
		var post = [];

		beforeAll(function(done) {
			ItemPost.post('create', function(next, err) {
				post.push(this.name + ' create post hooked!');
				next(this);
			});
			done();
		});

		describe('CREATE single', function() {
			var newSubTest;
			var newTest;

			beforeAll(done => {
				ItemPost.remove().create({
					name: 'testing',
					info: 'this is a testing insert'
				}).seam().subscribe(
					test => newSubTest = test,
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				ItemPost.find().seam().subscribe(
					test => newTest = test,
					err => console.log(err),
					() => done());
			});

			it('subscribe result should be the same as inserted', () => {
				expect(newSubTest.name).toBe('testing');
				expect(newSubTest.info).toBe('this is a testing insert');
			});

			it('database should have same result as inserted', () => {
				expect(newTest).not.toEqual(jasmine.any(Array));
				expect(newTest.name).toBe('testing');
				expect(newTest.info).toBe('this is a testing insert');
			});

			it('post event should have triggered', () => {
				expect(post[0]).toEqual(newSubTest.name + ' create post hooked!');
			});
		});

		describe('CREATE array', function() {
			var arrayTest = [];
			var dbrows;

			beforeAll(done => {
				post = [];
				ItemPost.remove().create([{
					name: 'arrayInsert1',
					info: 'this is a arrayInsert1 test'
				}, {
					name: 'arrayInsert2',
					info: 'this is a arrayInsert2 test'
				}, {
					name: 'arrayInsert3',
					info: 'this is a arrayInsert3 test'
				}, {
					name: 'arrayInsert4',
					info: 'this is a arrayInsert4 test'
				}, {
					name: 'arrayInsert5',
					info: 'this is a arrayInsert5 test'
				}, {
					name: 'arrayInsert6',
					info: 'this is a arrayInsert6 test'
				}]).seam().subscribe(
					test => arrayTest.push(test),
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				ItemPost.find().seam().subscribe(
					tests => dbrows = tests,
					error => console.log(err),
					() => done());
			})

			it('subscribe should have responded with 6 results', () => {
				expect(arrayTest.length).toBe(6);
			});

			it('subscribe results should be the same as inserted', () => {
				expect(arrayTest[0].name).toBe('arrayInsert1');
				expect(arrayTest[0].info).toBe('this is a arrayInsert1 test');
				expect(arrayTest[0].created).toBe('toTimeStamp(now())');
				expect(arrayTest[0].id).toBe('uuid()');
				expect(arrayTest[1].name).toBe('arrayInsert2');
				expect(arrayTest[1].info).toBe('this is a arrayInsert2 test');
				expect(arrayTest[1].created).toBe('toTimeStamp(now())');
				expect(arrayTest[1].id).toBe('uuid()');
				expect(arrayTest[2].name).toBe('arrayInsert3');
				expect(arrayTest[2].info).toBe('this is a arrayInsert3 test');
				expect(arrayTest[2].created).toBe('toTimeStamp(now())');
				expect(arrayTest[2].id).toBe('uuid()');
				expect(arrayTest[3].name).toBe('arrayInsert4');
				expect(arrayTest[3].info).toBe('this is a arrayInsert4 test');
				expect(arrayTest[3].created).toBe('toTimeStamp(now())');
				expect(arrayTest[3].id).toBe('uuid()');
				expect(arrayTest[4].name).toBe('arrayInsert5');
				expect(arrayTest[4].info).toBe('this is a arrayInsert5 test');
				expect(arrayTest[4].created).toBe('toTimeStamp(now())');
				expect(arrayTest[4].id).toBe('uuid()');
				expect(arrayTest[5].name).toBe('arrayInsert6');
				expect(arrayTest[5].info).toBe('this is a arrayInsert6 test');
				expect(arrayTest[5].created).toBe('toTimeStamp(now())');
				expect(arrayTest[5].id).toBe('uuid()');
			});

			it('database should have same results as inserted', () => {
				expect(dbrows).toEqual(jasmine.any(Array));
				expect(dbrows[0].name).toBe('arrayInsert1');
				expect(dbrows[0].info).toBe('this is a arrayInsert1 test');
				expect(dbrows[0].created).not.toBe('toTimeStamp(now())');
				expect(dbrows[0].id).not.toBe('uuid()');
				expect(dbrows[1].name).toBe('arrayInsert2');
				expect(dbrows[1].info).toBe('this is a arrayInsert2 test');
				expect(dbrows[1].created).not.toBe('toTimeStamp(now())');
				expect(dbrows[1].id).not.toBe('uuid()');
				expect(dbrows[2].name).toBe('arrayInsert3');
				expect(dbrows[2].info).toBe('this is a arrayInsert3 test');
				expect(dbrows[2].created).not.toBe('toTimeStamp(now())');
				expect(dbrows[2].id).not.toBe('uuid()');
				expect(dbrows[3].name).toBe('arrayInsert4');
				expect(dbrows[3].info).toBe('this is a arrayInsert4 test');
				expect(dbrows[3].created).not.toBe('toTimeStamp(now())');
				expect(dbrows[3].id).not.toBe('uuid()');
				expect(dbrows[4].name).toBe('arrayInsert5');
				expect(dbrows[4].info).toBe('this is a arrayInsert5 test');
				expect(dbrows[4].created).not.toBe('toTimeStamp(now())');
				expect(dbrows[4].id).not.toBe('uuid()');
				expect(dbrows[5].name).toBe('arrayInsert6');
				expect(dbrows[5].info).toBe('this is a arrayInsert6 test');
				expect(dbrows[5].created).not.toBe('toTimeStamp(now())');
				expect(dbrows[5].id).not.toBe('uuid()');
			});

			it('post event should have triggered 6 times', () => {
				expect(post[0]).toEqual(dbrows[0].name + ' create post hooked!');
				expect(post[1]).toEqual(dbrows[1].name + ' create post hooked!');
				expect(post[2]).toEqual(dbrows[2].name + ' create post hooked!');
				expect(post[3]).toEqual(dbrows[3].name + ' create post hooked!');
				expect(post[4]).toEqual(dbrows[4].name + ' create post hooked!');
				expect(post[5]).toEqual(dbrows[5].name + ' create post hooked!');
			});
		});
	});

	describe('CREATE with PRE Events', function() {
		var pre = [];

		beforeAll(done => {
			ItemPre.pre('create', function(next, err) {
				this.name += ' create pre hooked!';
				pre.push(this.name);
				next();
			});
			done();
		});

		describe('CREATE single', function() {
			var newSubTest;
			var newTest;

			beforeAll(done => {
				ItemPre.remove().create({
					name: 'testing',
					info: 'this is a testing insert'
				}).seam().subscribe(
					test => newSubTest = test,
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				ItemPre.find().seam().subscribe(
					test => newTest = test,
					err => console.log(err),
					() => done());
			});

			it('subscribe result should be the same as inserted', () => {
				expect(newSubTest.name).toBe('testing create pre hooked!');
				expect(newSubTest.info).toBe('this is a testing insert');
			});

			it('database should have same result as inserted', () => {
				expect(newTest).not.toEqual(jasmine.any(Array));
				expect(newTest.name).toBe('testing create pre hooked!');
				expect(newTest.info).toBe('this is a testing insert');
			});

			it('pre event should have triggered', () => {
				expect(pre[0]).toEqual(newSubTest.name);
			});
		});

		describe('CREATE array', function() {
			var arrayTest = [];
			var dbrows;

			beforeAll(done => {
				pre = [];
				ItemPre.remove().create([{
					name: 'arrayInsert1',
					info: 'this is a arrayInsert1 test'
				}, {
					name: 'arrayInsert2',
					info: 'this is a arrayInsert2 test'
				}, {
					name: 'arrayInsert3',
					info: 'this is a arrayInsert3 test'
				}, {
					name: 'arrayInsert4',
					info: 'this is a arrayInsert4 test'
				}, {
					name: 'arrayInsert5',
					info: 'this is a arrayInsert5 test'
				}, {
					name: 'arrayInsert6',
					info: 'this is a arrayInsert6 test'
				}]).seam().subscribe(
					test => arrayTest.push(test),
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				ItemPre.find().seam().subscribe(
					tests => dbrows = tests,
					error => console.log(err),
					() => done());
			})

			it('subscribe should have responded with 6 results', () => {
				expect(arrayTest.length).toBe(6);
			});

			it('subscribe results should be the same as inserted', () => {
				expect(arrayTest[0].name).toBe('arrayInsert1 create pre hooked!');				
				expect(arrayTest[0].info).toBe('this is a arrayInsert1 test');
				expect(arrayTest[0].created).toBe('toTimeStamp(now())');
				expect(arrayTest[0].id).toBe('uuid()');
				expect(arrayTest[1].name).toBe('arrayInsert2 create pre hooked!');
				expect(arrayTest[1].info).toBe('this is a arrayInsert2 test');
				expect(arrayTest[1].created).toBe('toTimeStamp(now())');
				expect(arrayTest[1].id).toBe('uuid()');
				expect(arrayTest[2].name).toBe('arrayInsert3 create pre hooked!');
				expect(arrayTest[2].info).toBe('this is a arrayInsert3 test');
				expect(arrayTest[2].created).toBe('toTimeStamp(now())');
				expect(arrayTest[2].id).toBe('uuid()');
				expect(arrayTest[3].name).toBe('arrayInsert4 create pre hooked!');
				expect(arrayTest[3].info).toBe('this is a arrayInsert4 test');
				expect(arrayTest[3].created).toBe('toTimeStamp(now())');
				expect(arrayTest[3].id).toBe('uuid()');
				expect(arrayTest[4].name).toBe('arrayInsert5 create pre hooked!');
				expect(arrayTest[4].info).toBe('this is a arrayInsert5 test');
				expect(arrayTest[4].created).toBe('toTimeStamp(now())');
				expect(arrayTest[4].id).toBe('uuid()');
				expect(arrayTest[5].name).toBe('arrayInsert6 create pre hooked!');
				expect(arrayTest[5].info).toBe('this is a arrayInsert6 test');
				expect(arrayTest[5].created).toBe('toTimeStamp(now())');
				expect(arrayTest[5].id).toBe('uuid()');
			});

			it('database should have same results as inserted', () => {
				expect(dbrows).toEqual(jasmine.any(Array));
				expect(dbrows[0].name).toBe('arrayInsert1 create pre hooked!');				
				expect(dbrows[0].info).toBe('this is a arrayInsert1 test');
				expect(dbrows[0].created).not.toBe('toTimeStamp(now())');
				expect(dbrows[0].id).not.toBe('uuid()');
				expect(dbrows[1].name).toBe('arrayInsert2 create pre hooked!');
				expect(dbrows[1].info).toBe('this is a arrayInsert2 test');
				expect(dbrows[1].created).not.toBe('toTimeStamp(now())');
				expect(dbrows[1].id).not.toBe('uuid()');
				expect(dbrows[2].name).toBe('arrayInsert3 create pre hooked!');
				expect(dbrows[2].info).toBe('this is a arrayInsert3 test');
				expect(dbrows[2].created).not.toBe('toTimeStamp(now())');
				expect(dbrows[2].id).not.toBe('uuid()');
				expect(dbrows[3].name).toBe('arrayInsert4 create pre hooked!');
				expect(dbrows[3].info).toBe('this is a arrayInsert4 test');
				expect(dbrows[3].created).not.toBe('toTimeStamp(now())');
				expect(dbrows[3].id).not.toBe('uuid()');
				expect(dbrows[4].name).toBe('arrayInsert5 create pre hooked!');
				expect(dbrows[4].info).toBe('this is a arrayInsert5 test');
				expect(dbrows[4].created).not.toBe('toTimeStamp(now())');
				expect(dbrows[4].id).not.toBe('uuid()');
				expect(dbrows[5].name).toBe('arrayInsert6 create pre hooked!');
				expect(dbrows[5].info).toBe('this is a arrayInsert6 test');
				expect(dbrows[5].created).not.toBe('toTimeStamp(now())');
				expect(dbrows[5].id).not.toBe('uuid()');
			});

			it('pre event should have triggered 6 times', () => {
				expect(pre[0]).toEqual(dbrows[0].name);
				expect(pre[1]).toEqual(dbrows[1].name);
				expect(pre[2]).toEqual(dbrows[2].name);
				expect(pre[3]).toEqual(dbrows[3].name);
				expect(pre[4]).toEqual(dbrows[4].name);
				expect(pre[5]).toEqual(dbrows[5].name);
			});
		});
	});

	describe('CREATE with POST and PRE Events', function() {
		var post = [];
		var pre = [];

		beforeAll(done => {
			ItemPrePost.post('create', function(next, err) {
				post.push(this.name + ' and post hooked!');
				next(this);
			});
			ItemPrePost.pre('create', function(next, err) {
				this.name += ' create pre hooked!';
				pre.push(this.name);
				next();
			});
			done();
		});

		describe('CREATE single', function() {
			var newSubTestPrePost;
			var newTestPrePost;

			beforeAll(done => {
				ItemPrePost.remove().create({
					name: 'testing',
					info: 'this is a testing insert'
				}).seam().subscribe(
					test => newSubTestPrePost = test,
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				ItemPrePost.find().seam().subscribe(
					test => newTestPrePost = test,
					err => console.log(err),
					() => done());
			});

			it('subscribe result should be the same as inserted', () => {
				expect(newSubTestPrePost.name).toBe('testing create pre hooked!');
				expect(newSubTestPrePost.info).toBe('this is a testing insert');
			});

			it('database should have same result as inserted', () => {
				expect(newTestPrePost).not.toEqual(jasmine.any(Array));
				expect(newTestPrePost.name).toBe('testing create pre hooked!');
				expect(newTestPrePost.info).toBe('this is a testing insert');
			});

			it('pre and post event should have triggered', () => {
				expect(pre[0]).toEqual(newSubTestPrePost.name);
				expect(post[0]).toEqual(newSubTestPrePost.name + ' and post hooked!');
			});
		});

		describe('CREATE array', function() {
			var arrayTest = [];
			var dbrows;

			beforeAll(done => {
				post = [];
				pre = [];
				ItemPrePost.remove().create([{
					name: 'arrayInsert1',
					info: 'this is a arrayInsert1 test'
				}, {
					name: 'arrayInsert2',
					info: 'this is a arrayInsert2 test'
				}, {
					name: 'arrayInsert3',
					info: 'this is a arrayInsert3 test'
				}, {
					name: 'arrayInsert4',
					info: 'this is a arrayInsert4 test'
				}, {
					name: 'arrayInsert5',
					info: 'this is a arrayInsert5 test'
				}, {
					name: 'arrayInsert6',
					info: 'this is a arrayInsert6 test'
				}]).seam().subscribe(
					test => arrayTest.push(test),
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				ItemPrePost.find().seam().subscribe(
					tests => dbrows = tests,
					error => console.log(err),
					() => done());
			})

			it('subscribe should have responded with 6 results', () => {
				expect(arrayTest.length).toBe(6);
			});

			it('subscribe results should be the same as inserted', () => {
				expect(arrayTest[0].name).toBe('arrayInsert1 create pre hooked!');
				expect(arrayTest[0].info).toBe('this is a arrayInsert1 test');
				expect(arrayTest[1].name).toBe('arrayInsert2 create pre hooked!');
				expect(arrayTest[1].info).toBe('this is a arrayInsert2 test');
				expect(arrayTest[2].name).toBe('arrayInsert3 create pre hooked!');
				expect(arrayTest[2].info).toBe('this is a arrayInsert3 test');
				expect(arrayTest[3].name).toBe('arrayInsert4 create pre hooked!');
				expect(arrayTest[3].info).toBe('this is a arrayInsert4 test');
				expect(arrayTest[4].name).toBe('arrayInsert5 create pre hooked!');
				expect(arrayTest[4].info).toBe('this is a arrayInsert5 test');
				expect(arrayTest[5].name).toBe('arrayInsert6 create pre hooked!');
				expect(arrayTest[5].info).toBe('this is a arrayInsert6 test');
			});

			it('database should have same results as inserted', () => {
				expect(dbrows).toEqual(jasmine.any(Array));
				expect(dbrows[0].name).toBe('arrayInsert1 create pre hooked!');
				expect(dbrows[0].info).toBe('this is a arrayInsert1 test');
				expect(dbrows[1].name).toBe('arrayInsert2 create pre hooked!');
				expect(dbrows[1].info).toBe('this is a arrayInsert2 test');
				expect(dbrows[2].name).toBe('arrayInsert3 create pre hooked!');
				expect(dbrows[2].info).toBe('this is a arrayInsert3 test');
				expect(dbrows[3].name).toBe('arrayInsert4 create pre hooked!');
				expect(dbrows[3].info).toBe('this is a arrayInsert4 test');
				expect(dbrows[4].name).toBe('arrayInsert5 create pre hooked!');
				expect(dbrows[4].info).toBe('this is a arrayInsert5 test');
				expect(dbrows[5].name).toBe('arrayInsert6 create pre hooked!');
				expect(dbrows[5].info).toBe('this is a arrayInsert6 test');
			});

			it('pre and post event should have triggered 6 times', () => {
				expect(pre[0]).toEqual(dbrows[0].name);
				expect(pre[1]).toEqual(dbrows[1].name);
				expect(pre[2]).toEqual(dbrows[2].name);
				expect(pre[3]).toEqual(dbrows[3].name);
				expect(pre[4]).toEqual(dbrows[4].name);
				expect(pre[5]).toEqual(dbrows[5].name);

				expect(post[0]).toEqual(dbrows[0].name + ' and post hooked!');
				expect(post[1]).toEqual(dbrows[1].name + ' and post hooked!');
				expect(post[2]).toEqual(dbrows[2].name + ' and post hooked!');
				expect(post[3]).toEqual(dbrows[3].name + ' and post hooked!');
				expect(post[4]).toEqual(dbrows[4].name + ' and post hooked!');
				expect(post[5]).toEqual(dbrows[5].name + ' and post hooked!');
			});
		});		
	});
	
});