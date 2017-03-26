var Item = require('./models');
var ItemPost = require('./models/post');
var ItemPre = require('./models/pre');
var ItemPrePost = require('./models/prepost');

describe('CassMask ENTITY', function() {

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

	describe('ENTITY without Events', function() {
		var rows;

		beforeAll(done => {
			Item.remove().create([{
				name: 'arrayEntity1',
				info: 'this is a arrayEntity1 test'
			}, {
				name: 'arrayEntity2',
				info: 'this is a arrayEntity2 test'
			}, {
				name: 'arrayEntity3',
				info: 'this is a arrayEntity3 test'
			}, {
				name: 'arrayEntity4',
				info: 'this is a arrayEntity4 test'
			}, {
				name: 'arrayEntity5',
				info: 'this is a arrayEntity5 test'
			}, {
				name: 'arrayEntity6',
				info: 'this is a arrayEntity6 test'
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

			expect(rows[0].name).toBe('arrayEntity1');
			expect(rows[0].info).toBe('this is a arrayEntity1 test');
			expect(rows[1].name).toBe('arrayEntity2');
			expect(rows[1].info).toBe('this is a arrayEntity2 test');
			expect(rows[2].name).toBe('arrayEntity3');
			expect(rows[2].info).toBe('this is a arrayEntity3 test');
			expect(rows[3].name).toBe('arrayEntity4');
			expect(rows[3].info).toBe('this is a arrayEntity4 test');
			expect(rows[4].name).toBe('arrayEntity5');
			expect(rows[4].info).toBe('this is a arrayEntity5 test');
			expect(rows[5].name).toBe('arrayEntity6');
			expect(rows[5].info).toBe('this is a arrayEntity6 test');
		});

		describe('ENTITY SAVE', function() {
			var newRows;

			beforeAll(done => {
				rows[1].info = 'Entity saved test1';

				rows[1].save().subscribe(
					test => {},
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				rows[4].info = 'Entity saved test2';

				rows[4].save().subscribe(
					test => {},
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				rows[2].info = 'Entity saved test3';

				rows[2].save().subscribe(
					test => {},
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				Item.find().seam().subscribe(
					tests => newRows = tests,
					err => console.log(err),
					() => done());
			});

			it('should have updated the 2nd row', () => {
				expect(newRows[1].info).toEqual('Entity saved test1');
				expect(newRows[1].name).toEqual(rows[1].name);
				expect(newRows[1].part).toEqual(rows[1].part);
				expect(newRows[1].id).toEqual(rows[1].id);
				expect(newRows[1].created).toEqual(rows[1].created);
			});

			it('should have updated the 5th row', () => {
				expect(newRows[4].info).toEqual('Entity saved test2');
				expect(newRows[4].name).toEqual(rows[4].name);
				expect(newRows[4].part).toEqual(rows[4].part);
				expect(newRows[4].id).toEqual(rows[4].id);
				expect(newRows[4].created).toEqual(rows[4].created);
			});

			it('should have updated the 3rd row', () => {
				expect(newRows[2].info).toEqual('Entity saved test3');
				expect(newRows[2].name).toEqual(rows[2].name);
				expect(newRows[2].part).toEqual(rows[2].part);
				expect(newRows[2].id).toEqual(rows[2].id);
				expect(newRows[2].created).toEqual(rows[2].created);
			});

			it('the 4th row should not be changed', () => {
				expect(newRows[3].info).toEqual(rows[3].info);
				expect(newRows[3].name).toEqual(rows[3].name);
				expect(newRows[3].part).toEqual(rows[3].part);
				expect(newRows[3].id).toEqual(rows[3].id);
				expect(newRows[3].created).toEqual(rows[3].created);
			});

			it('the 1st row should not be changed', () => {
				expect(newRows[0].info).toEqual(rows[0].info);
				expect(newRows[0].name).toEqual(rows[0].name);
				expect(newRows[0].part).toEqual(rows[0].part);
				expect(newRows[0].id).toEqual(rows[0].id);
				expect(newRows[0].created).toEqual(rows[0].created);
			});

			it('the 6th row should not be changed', () => {
				expect(newRows[5].info).toEqual(rows[5].info);
				expect(newRows[5].name).toEqual(rows[5].name);
				expect(newRows[5].part).toEqual(rows[5].part);
				expect(newRows[5].id).toEqual(rows[5].id);
				expect(newRows[5].created).toEqual(rows[5].created);
			});
		});

		describe('ENTITY REMOVE', function() {
			var newRows;

			beforeAll(done => {
				rows[1].remove().subscribe(
					test => {},
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				rows[5].remove().subscribe(
					test => {},
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				rows[4].remove().subscribe(
					test => {},
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				Item.find().seam().subscribe(
					tests => newRows = tests,
					err => console.log(err),
					() => done());
			});

			it('database table should only have 3 rows', () => {
				expect(newRows.length).toEqual(3);
			});	

			it('database table should no longer have deleted rows', () => {
				expect(newRows[0].info).toEqual(rows[0].info);
				expect(newRows[0].name).toEqual(rows[0].name);
				expect(newRows[0].part).toEqual(rows[0].part);
				expect(newRows[0].id).toEqual(rows[0].id);
				expect(newRows[0].created).toEqual(rows[0].created);

				expect(newRows[1].info).toEqual(rows[2].info);
				expect(newRows[1].name).toEqual(rows[2].name);
				expect(newRows[1].part).toEqual(rows[2].part);
				expect(newRows[1].id).toEqual(rows[2].id);
				expect(newRows[1].created).toEqual(rows[2].created);

				expect(newRows[2].info).toEqual(rows[3].info);
				expect(newRows[2].name).toEqual(rows[3].name);
				expect(newRows[2].part).toEqual(rows[3].part);
				expect(newRows[2].id).toEqual(rows[3].id);
				expect(newRows[2].created).toEqual(rows[3].created);
			});
		});		
	});

	describe('ENTITY with POST Events', function() {
		var rows;
		var postu = [];
		var postc = [];
		var postr = [];

		beforeAll(done => {
			ItemPost.remove().create([{
				name: 'arrayEntity1',
				info: 'this is a arrayEntity1 test'
			}, {
				name: 'arrayEntity2',
				info: 'this is a arrayEntity2 test'
			}, {
				name: 'arrayEntity3',
				info: 'this is a arrayEntity3 test'
			}, {
				name: 'arrayEntity4',
				info: 'this is a arrayEntity4 test'
			}, {
				name: 'arrayEntity5',
				info: 'this is a arrayEntity5 test'
			}, {
				name: 'arrayEntity6',
				info: 'this is a arrayEntity6 test'
			}]).seam().subscribe(
				test => {},
				err => console.log(err),
				() => done());
		});

		beforeAll(done => {
			ItemPost.post('update', function(next, err) {
				postu.push(this.name + ' update post hooked!');
				next(this);
			});
			ItemPost.post('create', function(next, err) {
				postc.push(this.name + ' create post hooked!');
				next(this);
			});
			ItemPost.post('remove', function(next, err) {
				postr.push(this.name + ' remove post hooked!');
				next(this);
			});
			done();
		});

		beforeAll(done => {
			ItemPost.find().seam().subscribe(
				tests => rows = tests,
				err => console.log(err),
				() => done());
		});

		it('database should contain testing rows', () => {
			expect(rows).toEqual(jasmine.any(Array));

			expect(rows[0].name).toBe('arrayEntity1');
			expect(rows[0].info).toBe('this is a arrayEntity1 test');
			expect(rows[1].name).toBe('arrayEntity2');
			expect(rows[1].info).toBe('this is a arrayEntity2 test');
			expect(rows[2].name).toBe('arrayEntity3');
			expect(rows[2].info).toBe('this is a arrayEntity3 test');
			expect(rows[3].name).toBe('arrayEntity4');
			expect(rows[3].info).toBe('this is a arrayEntity4 test');
			expect(rows[4].name).toBe('arrayEntity5');
			expect(rows[4].info).toBe('this is a arrayEntity5 test');
			expect(rows[5].name).toBe('arrayEntity6');
			expect(rows[5].info).toBe('this is a arrayEntity6 test');
		});

		describe('ENTITY SAVE', function() {
			var newRows;

			beforeAll(done => {
				rows[1].info = 'Entity saved test1';

				rows[1].save().subscribe(
					test => {},
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				rows[4].info = 'Entity saved test2';

				rows[4].save('create').subscribe(
					test => {},
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				rows[2].info = 'Entity saved test3';

				rows[2].save('find').subscribe(
					test => {},
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				rows[5].info = 'Entity saved test4';

				rows[5].save('remove').subscribe(
					test => {},
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				ItemPost.find().seam().subscribe(
					tests => newRows = tests,
					err => console.log(err),
					() => done());
			});

			it('should have updated the 2nd row', () => {
				expect(newRows[1].info).toEqual('Entity saved test1');
				expect(newRows[1].name).toEqual(rows[1].name);
				expect(newRows[1].part).toEqual(rows[1].part);
				expect(newRows[1].id).toEqual(rows[1].id);
				expect(newRows[1].created).toEqual(rows[1].created);
			});

			it('should have updated the 5th row', () => {
				expect(newRows[4].info).toEqual('Entity saved test2');
				expect(newRows[4].name).toEqual(rows[4].name);
				expect(newRows[4].part).toEqual(rows[4].part);
				expect(newRows[4].id).toEqual(rows[4].id);
				expect(newRows[4].created).toEqual(rows[4].created);
			});

			it('should have updated the 3rd row', () => {
				expect(newRows[2].info).toEqual('Entity saved test3');
				expect(newRows[2].name).toEqual(rows[2].name);
				expect(newRows[2].part).toEqual(rows[2].part);
				expect(newRows[2].id).toEqual(rows[2].id);
				expect(newRows[2].created).toEqual(rows[2].created);
			});

			it('should have updated the 6th row', () => {
				expect(newRows[5].info).toEqual('Entity saved test4');
				expect(newRows[5].name).toEqual(rows[5].name);
				expect(newRows[5].part).toEqual(rows[5].part);
				expect(newRows[5].id).toEqual(rows[5].id);
				expect(newRows[5].created).toEqual(rows[5].created);
			});

			it('the 4th row should not be changed', () => {
				expect(newRows[3].info).toEqual(rows[3].info);
				expect(newRows[3].name).toEqual(rows[3].name);
				expect(newRows[3].part).toEqual(rows[3].part);
				expect(newRows[3].id).toEqual(rows[3].id);
				expect(newRows[3].created).toEqual(rows[3].created);
			});

			it('the 1st row should not be changed', () => {
				expect(newRows[0].info).toEqual(rows[0].info);
				expect(newRows[0].name).toEqual(rows[0].name);
				expect(newRows[0].part).toEqual(rows[0].part);
				expect(newRows[0].id).toEqual(rows[0].id);
				expect(newRows[0].created).toEqual(rows[0].created);
			});

			it('post event should have been triggered', () => {
				expect(postu.length).toEqual(2);
				expect(postc.length).toEqual(1);
				expect(postr.length).toEqual(1);

				expect(postu[0]).toEqual(rows[1].name + ' update post hooked!');
				expect(postc[0]).toEqual(rows[4].name + ' create post hooked!');
				expect(postu[1]).toEqual(rows[2].name + ' update post hooked!');
				expect(postr[0]).toEqual(rows[5].name + ' remove post hooked!');
			});
		});

		describe('ENTITY REMOVE', function() {
			var newRows;

			beforeAll(done => {
				postu = [];
				postc = [];
				postr = [];
				rows[1].remove('update').subscribe(
					test => {},
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				rows[5].remove('create').subscribe(
					test => {},
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				rows[4].remove('find').subscribe(
					test => {},
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				rows[2].remove().subscribe(
					test => {},
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				ItemPost.find().seam().subscribe(
					tests => newRows = tests,
					err => console.log(err),
					() => done());
			});

			it('database table should only have 2 rows', () => {
				expect(newRows.length).toEqual(2);
			});	

			it('database table should no longer have deleted rows', () => {
				expect(newRows[0].info).toEqual(rows[0].info);
				expect(newRows[0].name).toEqual(rows[0].name);
				expect(newRows[0].part).toEqual(rows[0].part);
				expect(newRows[0].id).toEqual(rows[0].id);
				expect(newRows[0].created).toEqual(rows[0].created);

				expect(newRows[1].info).toEqual(rows[3].info);
				expect(newRows[1].name).toEqual(rows[3].name);
				expect(newRows[1].part).toEqual(rows[3].part);
				expect(newRows[1].id).toEqual(rows[3].id);
				expect(newRows[1].created).toEqual(rows[3].created);
			});

			it('post event should have been triggered', () => {
				expect(postu.length).toEqual(1);
				expect(postc.length).toEqual(1);
				expect(postr.length).toEqual(2);

				expect(postu[0]).toEqual(rows[1].name + ' update post hooked!');
				expect(postc[0]).toEqual(rows[5].name + ' create post hooked!');
				expect(postr[0]).toEqual(rows[4].name + ' remove post hooked!');
				expect(postr[1]).toEqual(rows[2].name + ' remove post hooked!');
			});
		});		
	});
	

});