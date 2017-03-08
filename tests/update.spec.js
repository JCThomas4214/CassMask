var Item = require('./model');
var ItemPost = require('./model/post');
var ItemPre = require('./model/pre');
var ItemPrePost = require('./model/prepost');

describe('CassMask UPDATE', function() {

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

	describe('UPDATE without Events', function() {
		var rows;

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

	describe('UPDATE with POST Events', function() {
		var rows;
		var post = [];

		beforeAll(done => {
			ItemPost.remove().create([{
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
			ItemPost.find().seam().subscribe(
				tests => rows = tests,
				err => console.log(err),
				() => done());
		});

		beforeAll(done => {
			ItemPost.post('update', function(next, err) {
				post.push(this.name + ' update post hooked!');
				next(this);
			});
			done();
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

				ItemPost.update({
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

				ItemPost.update({
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

				ItemPost.update({
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

			it('post event should have been triggered', () => {
				expect(post.length).toEqual(3);

				expect(post[0]).toEqual(rows[1].name + ' update post hooked!');
				expect(post[1]).toEqual(rows[5].name + ' update post hooked!');
				expect(post[2]).toEqual(rows[3].name + ' update post hooked!');
			});
		});

		describe('UPDATE specific array', function() {

			it('should update the 1st and 6th row on the database table', done => {
				var results = [];
				post = [];

				ItemPost.update([{
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

				ItemPost.update([{
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

				ItemPost.update([{
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

			it('post event should have been triggered', () => {
				expect(post.length).toEqual(6);

				expect(post[0]).toEqual(rows[0].name + ' update post hooked!');
				expect(post[1]).toEqual(rows[5].name + ' update post hooked!');
				expect(post[2]).toEqual(rows[1].name + ' update post hooked!');
				expect(post[3]).toEqual(rows[4].name + ' update post hooked!');
				expect(post[4]).toEqual(rows[2].name + ' update post hooked!');
				expect(post[5]).toEqual(rows[3].name + ' update post hooked!');
			});
		});
	});	

	describe('UPDATE with PRE Events', function() {
		var rows;
		var pre = [];

		beforeAll(done => {
			ItemPre.remove().create([{
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
			ItemPre.find().seam().subscribe(
				tests => rows = tests,
				err => console.log(err),
				() => done());
		});

		beforeAll(done => {
			ItemPre.pre('update', function(next, err) {
				pre.push(this.name + ' update pre hooked!');
				next();
			});
			done();
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

				ItemPre.update({
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

				ItemPre.update({
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

				ItemPre.update({
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

			it('pre event should have been triggered', () => {
				expect(pre.length).toEqual(3);

				expect(pre[0]).toEqual(rows[1].name + ' update pre hooked!');
				expect(pre[1]).toEqual(rows[5].name + ' update pre hooked!');
				expect(pre[2]).toEqual(rows[3].name + ' update pre hooked!');
			});
		});

		describe('UPDATE specific array', function() {

			it('should update the 1st and 6th row on the database table', done => {
				var results = [];
				pre = [];

				ItemPre.update([{
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

				ItemPre.update([{
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

				ItemPre.update([{
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

			it('pre event should have been triggered', () => {
				expect(pre.length).toEqual(6);

				expect(pre[0]).toEqual(rows[0].name + ' update pre hooked!');
				expect(pre[1]).toEqual(rows[5].name + ' update pre hooked!');
				expect(pre[2]).toEqual(rows[1].name + ' update pre hooked!');
				expect(pre[3]).toEqual(rows[4].name + ' update pre hooked!');
				expect(pre[4]).toEqual(rows[2].name + ' update pre hooked!');
				expect(pre[5]).toEqual(rows[3].name + ' update pre hooked!');
			});
		});
	});	

	describe('UPDATE with PRE and POST Events', function() {
		var rows;
		var pre = [];
		var post = [];

		beforeAll(done => {
			ItemPrePost.remove().create([{
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
			ItemPrePost.find().seam().subscribe(
				tests => rows = tests,
				err => console.log(err),
				() => done());
		});

		beforeAll(done => {
			ItemPrePost.pre('update', function(next, err) {
				pre.push(this.name + ' update pre hooked!');
				next();
			});
			ItemPrePost.post('update', function(next, err) {
				post.push(this.name + ' update post hooked!');
				next(this);
			});
			done();
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

				ItemPrePost.update({
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

				ItemPrePost.update({
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

				ItemPrePost.update({
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

			it('pre and post event should have been triggered', () => {
				expect(pre.length).toEqual(3);

				expect(pre[0]).toEqual(rows[1].name + ' update pre hooked!');
				expect(pre[1]).toEqual(rows[5].name + ' update pre hooked!');
				expect(pre[2]).toEqual(rows[3].name + ' update pre hooked!');

				expect(post.length).toEqual(3);

				expect(post[0]).toEqual(rows[1].name + ' update post hooked!');
				expect(post[1]).toEqual(rows[5].name + ' update post hooked!');
				expect(post[2]).toEqual(rows[3].name + ' update post hooked!');
			});
		});

		describe('UPDATE specific array', function() {

			it('should update the 1st and 6th row on the database table', done => {
				var results = [];
				pre = [];
				post = [];

				ItemPrePost.update([{
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

				ItemPrePost.update([{
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

				ItemPrePost.update([{
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

			it('pre and post event should have been triggered', () => {
				expect(pre.length).toEqual(6);

				expect(pre[0]).toEqual(rows[0].name + ' update pre hooked!');
				expect(pre[1]).toEqual(rows[5].name + ' update pre hooked!');
				expect(pre[2]).toEqual(rows[1].name + ' update pre hooked!');
				expect(pre[3]).toEqual(rows[4].name + ' update pre hooked!');
				expect(pre[4]).toEqual(rows[2].name + ' update pre hooked!');
				expect(pre[5]).toEqual(rows[3].name + ' update pre hooked!');

				expect(post.length).toEqual(6);

				expect(post[0]).toEqual(rows[0].name + ' update post hooked!');
				expect(post[1]).toEqual(rows[5].name + ' update post hooked!');
				expect(post[2]).toEqual(rows[1].name + ' update post hooked!');
				expect(post[3]).toEqual(rows[4].name + ' update post hooked!');
				expect(post[4]).toEqual(rows[2].name + ' update post hooked!');
				expect(post[5]).toEqual(rows[3].name + ' update post hooked!');
			});
		});
	});	
});