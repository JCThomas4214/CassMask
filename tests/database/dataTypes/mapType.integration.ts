import ItemMap from './models/map';
import * as cassmask from '../../index';

describe('CassMask With MAP type', function() {
	var newSubTest;
	var newTest;

	describe('CREATE with MAP type', function() {

		beforeAll(done => {
			ItemMap.post('create', null);
			ItemMap.post('find', null);
			ItemMap.post('remove', null);
			ItemMap.post('update', null);

			done();
		});

		beforeAll(done => {
			ItemMap.remove().create({
				name: 'testing',
				infomap: {
					1: 'jack',
					2: 'jill',
					3: 'jason'
				}
			}).seam().subscribe(
				test => newSubTest = test,
				err => {
					expect(err).not.toBeDefined();
					done();
				},
				() => done());
		});


		beforeAll(done => {
			ItemMap.find().seam().subscribe(
				test => newTest = test,
				err => {
					expect(err).not.toBeDefined();
					done();
				},
				() => done());	
		});	

		it('should respond with and Entity with a MAP datatype', () => {
			expect(newSubTest.infomap[1]).toEqual('jack');
			expect(newSubTest.infomap[2]).toEqual('jill');
			expect(newSubTest.infomap[3]).toEqual('jason');
		});

		it('should find row with a MAP datatype', () => {
			expect(newTest.infomap[1]).toEqual('jack');
			expect(newTest.infomap[2]).toEqual('jill');
			expect(newTest.infomap[3]).toEqual('jason');
		});

	});

	describe('UPDATE with MAP type', function() {

		it('should have responded with an Entity with an actions object', done => {
			ItemMap.update({
				set: {
					infomap: cassmask.MAP.append({ 10: 'newKeyVal' })
				},
				where: {
					part: 'Item',
					name: 'testing'
				}
			}).seam().subscribe(
				test => {
					expect(test.infomap.type).toEqual('MAP');
					expect(test.infomap.action).toEqual('append');
					expect(test.infomap.payload).toEqual({ 10: 'newKeyVal' });
				},
				err => {
					expect(err).not.toBeDefined();
					done();
				},
				() => done());
		});

		it('should have appended the new keyValue pair to the MAP', done => {
			ItemMap.find().seam().subscribe(
				test => {
					expect(test.infomap[1]).toEqual('jack');
					expect(test.infomap[2]).toEqual('jill');
					expect(test.infomap[3]).toEqual('jason');
					expect(test.infomap[10]).toEqual('newKeyVal');
				},
				err => {
					expect(err).not.toBeDefined();
					done();
				},
				() => done());
		});

		it('should have responded with an Entity with an actions object', done => {
			ItemMap.update({
				set: {
					infomap: cassmask.MAP.set(10, 'awesomeVal')
				},
				where: {
					part: 'Item',
					name: 'testing'
				}
			}).seam().subscribe(
				test => {
					expect(test.infomap.type).toEqual('MAP');
					expect(test.infomap.action).toEqual('set');
					expect(test.infomap.index).toEqual(10);
					expect(test.infomap.payload).toEqual('awesomeVal');
				},
				err => {
					console.log(err);
					expect(err).not.toBeDefined();
					done();
				},
				() => done());
		});

		it('should have set the keyValue pair in the MAP', done => {
			ItemMap.find().seam().subscribe(
				test => {
					expect(test.infomap[1]).toEqual('jack');
					expect(test.infomap[2]).toEqual('jill');
					expect(test.infomap[3]).toEqual('jason');
					expect(test.infomap[10]).toEqual('awesomeVal');
				},
				err => {
					expect(err).not.toBeDefined();
					done();
				},
				() => done());
		});

		it('should have responded with an Entity with an actions object', done => {
			ItemMap.update({
				set: {
					infomap: cassmask.MAP.remove(['10'])
				},
				where: {
					part: 'Item',
					name: 'testing'
				}
			}).seam().subscribe(
				test => {
					expect(test.infomap.type).toEqual('MAP');
					expect(test.infomap.action).toEqual('remove');
					expect(test.infomap.payload).toEqual(['10']);
				},
				err => {
					expect(err).not.toBeDefined();
					done();
				},
				() => done());
		});

		it('should have removed the keyValue pair from the MAP', done => {
			ItemMap.find().seam().subscribe(
				test => {
					expect(test.infomap[1]).toEqual('jack');
					expect(test.infomap[2]).toEqual('jill');
					expect(test.infomap[3]).toEqual('jason');
					expect(test.infomap[10]).not.toBeDefined();
				},
				err => {
					expect(err).not.toBeDefined();
					done();
				},
				() => done());
		});

		it('should have responded with an Entity with an actions object', done => {
			ItemMap.update({
				set: {
					infomap: cassmask.MAP.reset({ 45: 'big', 90: 'leaning', 5: 'hot' });
				},
				where: {
					part: 'Item',
					name: 'testing'
				}
			}).seam().subscribe(
				test => {
					expect(test.infomap.type).toEqual('MAP');
					expect(test.infomap.action).toEqual('reset');
					expect(test.infomap.payload).toEqual({ 45: 'big', 90: 'leaning', 5: 'hot' });
				},
				err => {
					expect(err).not.toBeDefined();
					done();
				},
				() => done());
		});

		it('should have removed the keyValue pair from the MAP', done => {
			ItemMap.find().seam().subscribe(
				test => {
					expect(test.infomap[45]).toEqual('big');
					expect(test.infomap[90]).toEqual('leaning');
					expect(test.infomap[5]).toEqual('hot');
				},
				err => {
					expect(err).not.toBeDefined();
					done();
				},
				() => done());
		});

	});

});