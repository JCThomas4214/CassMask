import ItemSet from './models/set';
import * as cassmask from '../../index';

describe('CassMask With SET type', function() {
	var newSubTest;
	var newTest;

	describe('CREATE with SET type', function() {

		beforeAll(done => {
			ItemSet.post('create', null);
			ItemSet.post('find', null);
			ItemSet.post('remove', null);
			ItemSet.post('update', null);

			done();
		});

		beforeAll(done => {
			ItemSet.remove().create({
				name: 'testing',
				infoset: ['jack','jill','jason']
			}).seam().subscribe(
				test => newSubTest = test,
				err => {
					expect(err).not.toBeDefined();
					done();
				},
				() => done());
		});


		beforeAll(done => {
			ItemSet.find().seam().subscribe(
				test => newTest = test,
				err => {
					expect(err).not.toBeDefined();
					done();
				},
				() => done());	
		});	

		it('should respond with and Entity with a SET datatype', () => {
			expect(newSubTest.infoset[0]).toEqual('jack');
			expect(newSubTest.infoset[1]).toEqual('jill');
			expect(newSubTest.infoset[2]).toEqual('jason');
		});

		it('should find row with a SET datatype that is ordered', () => {
			expect(newTest.infoset[0]).toEqual('jack');
			expect(newTest.infoset[2]).toEqual('jill');
			expect(newTest.infoset[1]).toEqual('jason');
		});

	});

	describe('UPDATE with SET type', function() {

		it('should have responded with an Entity with an actions object', done => {
			ItemSet.update({
				set: {
					infoset: cassmask.SET.append(['newVal'])
				},
				where: {
					part: 'Item',
					name: 'testing'
				}
			}).seam().subscribe(
				test => {
					expect(test.infoset.type).toEqual('SET');
					expect(test.infoset.action).toEqual('append');
					expect(test.infoset.payload).toEqual(['newVal']);
				},
				err => {
					expect(err).not.toBeDefined();
					done();
				},
				() => done());
		});

		it('should have appended the new value to the SET', done => {
			ItemSet.find().seam().subscribe(
				test => {
					expect(test.infoset[0]).toEqual('jack');
					expect(test.infoset[1]).toEqual('jason');
					expect(test.infoset[2]).toEqual('jill');
					expect(test.infoset[3]).toEqual('newVal');
				},
				err => {
					expect(err).not.toBeDefined();
					done();
				},
				() => done());
		});

		// it('should have responded with an Entity with an actions object', done => {
		// 	ItemSet.update({
		// 		set: {
		// 			infoset: cassmask.SET.set('jill', 'bananaVal')
		// 		},
		// 		where: {
		// 			part: 'Item',
		// 			name: 'testing'
		// 		}
		// 	}).seam().subscribe(
		// 		test => {
		// 			expect(test.infoset.type).toEqual('SET');
		// 			expect(test.infoset.action).toEqual('set');
		// 			expect(test.infoset.index).toEqual('jill');
		// 			expect(test.infoset.payload).toEqual('bananaVal');
		// 		},
		// 		err => {
		// 			console.log(err);
		// 			expect(err).not.toBeDefined();
		// 			done();
		// 		},
		// 		() => done());
		// });

		// it('should have set the value at index in the SET', done => {
		// 	ItemSet.find().seam().subscribe(
		// 		test => {
		// 			expect(test.infoset[0]).toEqual('bananaVal');
		// 			expect(test.infoset[1]).toEqual('jack');
		// 			expect(test.infoset[2]).toEqual('jason');
		// 			expect(test.infoset[3]).toEqual('newVal');
		// 		},
		// 		err => {
		// 			expect(err).not.toBeDefined();
		// 			done();
		// 		},
		// 		() => done());
		// });

		it('should have responded with an Entity with an actions object', done => {
			ItemSet.update({
				set: {
					infoset: cassmask.SET.reset(['hmm', 'this', 'test']);
				},
				where: {
					part: 'Item',
					name: 'testing'
				}
			}).seam().subscribe(
				test => {
					expect(test.infoset.type).toEqual('SET');
					expect(test.infoset.action).toEqual('reset');
					expect(test.infoset.payload).toEqual(['hmm', 'this', 'test']);
				},
				err => {
					expect(err).not.toBeDefined();
					done();
				},
				() => done());
		});

		it('should have reset the values in the SET', done => {
			ItemSet.find().seam().subscribe(
				test => {
					expect(test.infoset[0]).toEqual('hmm');
					expect(test.infoset[1]).toEqual('test');
					expect(test.infoset[2]).toEqual('this');
				},
				err => {
					expect(err).not.toBeDefined();
					done();
				},
				() => done());
		});

	});

});