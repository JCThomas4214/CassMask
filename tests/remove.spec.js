var Item = require('./model');

describe('CassMask REMOVE', function() {

	describe('REMOVE without Events', function() {

		beforeAll(done => {
			Item.remove().seam().subscribe(
				test => {},
				err => console.log(err),
				() => done());
		});

		describe('REMOVE all', function() {
			var removeTest;
			var removeTestErr;

			beforeAll(done => {
				Item.remove().seam().subscribe(
					test => {},
					err => console.log(err),
					() => done());
			});

			beforeAll(done => {
				Item.find().seam().subscribe(
					test => removeTest = test,
					err => {
						removeTestErr = err
						return done();
					});
			});

			it('database table should be truncated', () => {
				expect(removeTest).not.toBeDefined();
				expect(removeTestErr).toBeDefined();			
				expect(removeTestErr.message).toEqual('No Entities were found');
				expect(removeTestErr.statusCode).toEqual(404);
			});
		});

		describe('REMOVE specific', function() {
			var rows;

			beforeAll(done => {
				Item.remove().create([{
					name: 'arrayRemove1',
					info: 'this is a arrayRemove1 test'
				}, {
					name: 'arrayRemove2',
					info: 'this is a arrayRemove2 test'
				}, {
					name: 'arrayRemove3',
					info: 'this is a arrayRemove3 test'
				}, {
					name: 'arrayRemove4',
					info: 'this is a arrayRemove4 test'
				}, {
					name: 'arrayRemove5',
					info: 'this is a arrayRemove5 test'
				}, {
					name: 'arrayRemove6',
					info: 'this is a arrayRemove6 test'
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

				expect(rows[0].name).toBe('arrayRemove1');
				expect(rows[0].info).toBe('this is a arrayRemove1 test');
				expect(rows[1].name).toBe('arrayRemove2');
				expect(rows[1].info).toBe('this is a arrayRemove2 test');
				expect(rows[2].name).toBe('arrayRemove3');
				expect(rows[2].info).toBe('this is a arrayRemove3 test');
				expect(rows[3].name).toBe('arrayRemove4');
				expect(rows[3].info).toBe('this is a arrayRemove4 test');
				expect(rows[4].name).toBe('arrayRemove5');
				expect(rows[4].info).toBe('this is a arrayRemove5 test');
				expect(rows[5].name).toBe('arrayRemove6');
				expect(rows[5].info).toBe('this is a arrayRemove6 test');
			});

			it('should remove the 2nd row in the table', done => {
				var results = [];

				Item.remove({
					part: rows[1].part, 
					name: rows[1].name
				}).find().seam().subscribe(
					test => results.push(test),
					err => console.log(err),
					() => {
						expect(results[0].name).toEqual('arrayRemove2');
						expect(results[0].part).toEqual('Item');

						expect(results[1].length).toEqual(5);
						expect(results[1][1].name).toEqual(rows[2].name);
						expect(results[1][1].part).toEqual(rows[2].part);
						expect(results[1][1].info).toEqual(rows[2].info);
						expect(results[1][1].id).toEqual(rows[2].id);
						expect(results[1][1].created).toEqual(rows[2].created);

						done();
					});
			});

			it('should remove the last row in the table', done => {
				var results = [];

				Item.remove({
					part: rows[rows.length - 1].part, 
					name: rows[rows.length - 1].name
				}).find().seam().subscribe(
					test => results.push(test),
					err => console.log(err),
					() => {
						expect(results[0].name).toEqual('arrayRemove6');
						expect(results[0].part).toEqual('Item');

						expect(results[1].length).toEqual(4);
						expect(results[1][results[1].length - 1].name).toEqual(rows[4].name);
						expect(results[1][results[1].length - 1].part).toEqual(rows[4].part);
						expect(results[1][results[1].length - 1].info).toEqual(rows[4].info);
						expect(results[1][results[1].length - 1].id).toEqual(rows[4].id);
						expect(results[1][results[1].length - 1].created).toEqual(rows[4].created);

						done();
					});
			});

			it('should remove the 4th row in the table', done => {
				var results = [];

				Item.remove({
					part: rows[3].part, 
					name: rows[3].name
				}).find().seam().subscribe(
					test => results.push(test),
					err => console.log(err),
					() => {
						expect(results[0].name).toEqual('arrayRemove4');
						expect(results[0].part).toEqual('Item');

						expect(results[1].length).toEqual(3);
						expect(results[1][2].name).toEqual(rows[4].name);
						expect(results[1][2].part).toEqual(rows[4].part);
						expect(results[1][2].info).toEqual(rows[4].info);
						expect(results[1][2].id).toEqual(rows[4].id);
						expect(results[1][2].created).toEqual(rows[4].created);

						done();
					});
			});

			it('should remove an array of items from the table', done => {
				var results = [];

				Item.remove([{
					part: rows[0].part, 
					name: rows[0].name
				}, {
					part: rows[4].part, 
					name: rows[4].name
				}]).find().seam().subscribe(
					test => results.push(test),
					err => console.log(err),
					() => {
						expect(results[0].name).toEqual('arrayRemove1');
						expect(results[0].part).toEqual('Item');

						expect(results[1].name).toEqual('arrayRemove5');
						expect(results[1].part).toEqual('Item');

						expect(results[2]).not.toEqual(jasmine.any(Array));
						expect(results[2].name).toEqual(rows[2].name);
						expect(results[2].part).toEqual(rows[2].part);
						expect(results[2].info).toEqual(rows[2].info);
						expect(results[2].id).toEqual(rows[2].id);
						expect(results[2].created).toEqual(rows[2].created);

						done();
					});
			});
		});
	});

	

});