var Item = require('./model');

describe('CassMask UPDATE', function() {
	var rows;

	describe('UPDATE without Events', function() {

		beforeAll(done => {
			Item.remove().create([{
				name: 'arrayUpdate1',
				info: 'this is a arrayUpdate1 test'
			}, {
				name: 'arrayUpdate2',
				info: 'this is a arrayUpdate2 test'
			}, {
				name: 'arrayUpdate3',
				info: 'this is a arrayUpdate3 test'
			}, {
				name: 'arrayUpdate4',
				info: 'this is a arrayUpdate4 test'
			}, {
				name: 'arrayUpdate5',
				info: 'this is a arrayUpdate5 test'
			}, {
				name: 'arrayUpdate6',
				info: 'this is a arrayUpdate6 test'
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

			expect(rows[0].name).toBe('arrayUpdate1');
			expect(rows[0].info).toBe('this is a arrayUpdate1 test');
			expect(rows[1].name).toBe('arrayUpdate2');
			expect(rows[1].info).toBe('this is a arrayUpdate2 test');
			expect(rows[2].name).toBe('arrayUpdate3');
			expect(rows[2].info).toBe('this is a arrayUpdate3 test');
			expect(rows[3].name).toBe('arrayUpdate4');
			expect(rows[3].info).toBe('this is a arrayUpdate4 test');
			expect(rows[4].name).toBe('arrayUpdate5');
			expect(rows[4].info).toBe('this is a arrayUpdate5 test');
			expect(rows[5].name).toBe('arrayUpdate6');
			expect(rows[5].info).toBe('this is a arrayUpdate6 test');
		});

		describe('UPDATE specific single', function() {

			it('should update the 2nd row on the database table', done => {
				var results = [];

				Item.update({
					set: {
						info: 'updated ' + rows[1].info
					},
					where: {
						part: rows[1].part,
						name: rows[1].name
					}
				}).find().seam().subscribe(
					tests => results.push(tests),
					err => console.log(err),
					() => {
						expect(results[0].info).toEqual('updated this is a arrayUpdate2 test');
						expect(results[0].part).toEqual('Item');
						expect(results[0].name).toEqual('arrayUpdate2');

						expect(results[1]).toEqual(jasmine.any(Array));
						expect(results[1].length).toEqual(6);
						expect(results[1][1].info).toEqual('updated this is a arrayUpdate2 test');
						expect(results[1][1].part).toEqual('Item');
						expect(results[1][1].name).toEqual('arrayUpdate2');

						done();
					});
			});

			it('should update the last row on the database table', done => {
				var results = [];

				Item.update({
					set: {
						info: 'updated ' + rows[5].info
					},
					where: {
						part: rows[5].part,
						name: rows[5].name
					}
				}).find().seam().subscribe(
					tests => results.push(tests),
					err => console.log(err),
					() => {
						expect(results[0].info).toEqual('updated this is a arrayUpdate6 test');
						expect(results[0].part).toEqual('Item');
						expect(results[0].name).toEqual('arrayUpdate6');

						expect(results[1]).toEqual(jasmine.any(Array));
						expect(results[1].length).toEqual(6);
						expect(results[1][5].info).toEqual('updated this is a arrayUpdate6 test');
						expect(results[1][5].part).toEqual('Item');
						expect(results[1][5].name).toEqual('arrayUpdate6');

						done();
					});
			});

			it('should update the 4th row on the database table', done => {
				var results = [];

				Item.update({
					set: {
						info: 'updated ' + rows[3].info
					},
					where: {
						part: rows[3].part,
						name: rows[3].name
					}
				}).find().seam().subscribe(
					tests => results.push(tests),
					err => console.log(err),
					() => {
						expect(results[0].info).toEqual('updated this is a arrayUpdate4 test');
						expect(results[0].part).toEqual('Item');
						expect(results[0].name).toEqual('arrayUpdate4');

						expect(results[1]).toEqual(jasmine.any(Array));
						expect(results[1].length).toEqual(6);
						expect(results[1][3].info).toEqual('updated this is a arrayUpdate4 test');
						expect(results[1][3].part).toEqual('Item');
						expect(results[1][3].name).toEqual('arrayUpdate4');

						done();
					});
			});
		});

		describe('UPDATE specific array', function() {

			it('should update the 1st and 6th row on the database table', done => {
				var results = [];

				Item.update([{
					set: {
						info: 'more updated ' + rows[0].info
					},
					where: {
						part: rows[0].part,
						name: rows[0].name
					}
				}, {
					set: {
						info: 'more updated ' + rows[5].info
					},
					where: {
						part: rows[5].part,
						name: rows[5].name
					}
				}]).find().seam().subscribe(
					tests => results.push(tests),
					err => console.log(err),
					() => {
						expect(results[0].info).toEqual('more updated this is a arrayUpdate1 test');
						expect(results[0].part).toEqual('Item');
						expect(results[0].name).toEqual('arrayUpdate1');

						expect(results[1].info).toEqual('more updated this is a arrayUpdate6 test');
						expect(results[1].part).toEqual('Item');
						expect(results[1].name).toEqual('arrayUpdate6');

						expect(results[2]).toEqual(jasmine.any(Array));
						expect(results[2].length).toEqual(6);
						expect(results[2][0].info).toEqual('more updated this is a arrayUpdate1 test');
						expect(results[2][0].part).toEqual('Item');
						expect(results[2][0].name).toEqual('arrayUpdate1');
						expect(results[2][5].info).toEqual('more updated this is a arrayUpdate6 test');
						expect(results[2][5].part).toEqual('Item');
						expect(results[2][5].name).toEqual('arrayUpdate6');

						done();
					});
			});

			it('should update the 2st and 5th row on the database table', done => {
				var results = [];

				Item.update([{
					set: {
						info: 'more updated ' + rows[1].info
					},
					where: {
						part: rows[1].part,
						name: rows[1].name
					}
				}, {
					set: {
						info: 'more updated ' + rows[4].info
					},
					where: {
						part: rows[4].part,
						name: rows[4].name
					}
				}]).find().seam().subscribe(
					tests => results.push(tests),
					err => console.log(err),
					() => {
						expect(results[0].info).toEqual('more updated this is a arrayUpdate2 test');
						expect(results[0].part).toEqual('Item');
						expect(results[0].name).toEqual('arrayUpdate2');

						expect(results[1].info).toEqual('more updated this is a arrayUpdate5 test');
						expect(results[1].part).toEqual('Item');
						expect(results[1].name).toEqual('arrayUpdate5');

						expect(results[2]).toEqual(jasmine.any(Array));
						expect(results[2].length).toEqual(6);
						expect(results[2][1].info).toEqual('more updated this is a arrayUpdate2 test');
						expect(results[2][1].part).toEqual('Item');
						expect(results[2][1].name).toEqual('arrayUpdate2');
						expect(results[2][4].info).toEqual('more updated this is a arrayUpdate5 test');
						expect(results[2][4].part).toEqual('Item');
						expect(results[2][4].name).toEqual('arrayUpdate5');

						done();
					});
			});

			it('should update the 3st and 4th row on the database table', done => {
				var results = [];

				Item.update([{
					set: {
						info: 'more updated ' + rows[2].info
					},
					where: {
						part: rows[2].part,
						name: rows[2].name
					}
				}, {
					set: {
						info: 'more updated ' + rows[3].info
					},
					where: {
						part: rows[3].part,
						name: rows[3].name
					}
				}]).find().seam().subscribe(
					tests => results.push(tests),
					err => console.log(err),
					() => {
						expect(results[0].info).toEqual('more updated this is a arrayUpdate3 test');
						expect(results[0].part).toEqual('Item');
						expect(results[0].name).toEqual('arrayUpdate3');

						expect(results[1].info).toEqual('more updated this is a arrayUpdate4 test');
						expect(results[1].part).toEqual('Item');
						expect(results[1].name).toEqual('arrayUpdate4');

						expect(results[2]).toEqual(jasmine.any(Array));
						expect(results[2].length).toEqual(6);
						expect(results[2][2].info).toEqual('more updated this is a arrayUpdate3 test');
						expect(results[2][2].part).toEqual('Item');
						expect(results[2][2].name).toEqual('arrayUpdate3');
						expect(results[2][3].info).toEqual('more updated this is a arrayUpdate4 test');
						expect(results[2][3].part).toEqual('Item');
						expect(results[2][3].name).toEqual('arrayUpdate4');

						done();
					});
			});
		});
	});

	

});