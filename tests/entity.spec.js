var Item = require('./model');

describe('CassMask ENTITY', function() {
	var rows;

	describe('ENTITY without Events', function() {

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
	

});