import ItemList from './models/list';
import * as cassmask from '../../index';

describe('CassMask With LIST type', function() {
	var newSubTest;
	var newTest;

	describe('CREATE with LIST type', function() {

		beforeAll(done => {
			ItemList.post('create', null);
			ItemList.post('find', null);
			ItemList.post('remove', null);
			ItemList.post('update', null);

			done();
		});

		beforeAll(done => {
			ItemList.remove().create({
				name: 'testing',
				infolist: ['jack','jill','jason']
			}).seam().subscribe(
				test => newSubTest = test,
				err => {
					expect(err).not.toBeDefined();
					done();
				},
				() => done());
		});


		beforeAll(done => {
			ItemList.find().seam().subscribe(
				test => newTest = test,
				err => {
					expect(err).not.toBeDefined();
					done();
				},
				() => done());	
		});	

		it('should respond with and Entity with a LIST datatype', () => {
			expect(newSubTest.infolist[0]).toEqual('jack');
			expect(newSubTest.infolist[1]).toEqual('jill');
			expect(newSubTest.infolist[2]).toEqual('jason');
		});

		it('should find row with a LIST datatype', () => {
			expect(newTest.infolist[0]).toEqual('jack');
			expect(newTest.infolist[1]).toEqual('jill');
			expect(newTest.infolist[2]).toEqual('jason');
		});

	});

	describe('UPDATE with LIST type', function() {

		it('should have responded with an Entity with an actions object', done => {
			ItemList.update({
				set: {
					infolist: cassmask.LIST.append(['newVal'])
				},
				where: {
					part: 'Item',
					name: 'testing'
				}
			}).seam().subscribe(
				test => {
					expect(test.infolist.type).toEqual('LIST');
					expect(test.infolist.action).toEqual('append');
					expect(test.infolist.payload).toEqual(['newVal']);
				},
				err => {
					expect(err).not.toBeDefined();
					done();
				},
				() => done());
		});

		it('should have appended the new value to the LIST', done => {
			ItemList.find().seam().subscribe(
				test => {
					expect(test.infolist[0]).toEqual('jack');
					expect(test.infolist[1]).toEqual('jill');
					expect(test.infolist[2]).toEqual('jason');
					expect(test.infolist[3]).toEqual('newVal');
				},
				err => {
					expect(err).not.toBeDefined();
					done();
				},
				() => done());
		});

		it('should have responded with an Entity with an actions object', done => {
			ItemList.update({
				set: {
					infolist: cassmask.LIST.prepend(['preNewVal'])
				},
				where: {
					part: 'Item',
					name: 'testing'
				}
			}).seam().subscribe(
				test => {
					expect(test.infolist.type).toEqual('LIST');
					expect(test.infolist.action).toEqual('prepend');
					expect(test.infolist.payload).toEqual(['preNewVal']);
				},
				err => {
					expect(err).not.toBeDefined();
					done();
				},
				() => done());
		});

		it('should have prepended the new value to the LIST', done => {
			ItemList.find().seam().subscribe(
				test => {
					expect(test.infolist[0]).toEqual('preNewVal');
					expect(test.infolist[1]).toEqual('jack');
					expect(test.infolist[2]).toEqual('jill');
					expect(test.infolist[3]).toEqual('jason');
					expect(test.infolist[4]).toEqual('newVal');
				},
				err => {
					expect(err).not.toBeDefined();
					done();
				},
				() => done());
		});

		it('should have responded with an Entity with an actions object', done => {
			ItemList.update({
				set: {
					infolist: cassmask.LIST.set(1, 'bananaVal')
				},
				where: {
					part: 'Item',
					name: 'testing'
				}
			}).seam().subscribe(
				test => {
					expect(test.infolist.type).toEqual('LIST');
					expect(test.infolist.action).toEqual('set');
					expect(test.infolist.index).toEqual(1);
					expect(test.infolist.payload).toEqual('bananaVal');
				},
				err => {
					expect(err).not.toBeDefined();
					done();
				},
				() => done());
		});

		it('should have set the value at index in the LIST', done => {
			ItemList.find().seam().subscribe(
				test => {
					expect(test.infolist[0]).toEqual('preNewVal');
					expect(test.infolist[1]).toEqual('bananaVal');
					expect(test.infolist[2]).toEqual('jill');
					expect(test.infolist[3]).toEqual('jason');
					expect(test.infolist[4]).toEqual('newVal');
				},
				err => {
					expect(err).not.toBeDefined();
					done();
				},
				() => done());
		});

		it('should have responded with an Entity with an actions object', done => {
			ItemList.update({
				set: {
					infolist: cassmask.LIST.remove(['bananaVal', 'jill'])
				},
				where: {
					part: 'Item',
					name: 'testing'
				}
			}).seam().subscribe(
				test => {
					expect(test.infolist.type).toEqual('LIST');
					expect(test.infolist.action).toEqual('remove');
					expect(test.infolist.payload).toEqual(['bananaVal', 'jill']);
				},
				err => {
					expect(err).not.toBeDefined();
					done();
				},
				() => done());
		});

		it('should have removed the values from the LIST', done => {
			ItemList.find().seam().subscribe(
				test => {
					expect(test.infolist[0]).toEqual('preNewVal');
					expect(test.infolist[1]).toEqual('jason');
					expect(test.infolist[2]).toEqual('newVal');
				},
				err => {
					expect(err).not.toBeDefined();
					done();
				},
				() => done());
		});

		it('should have responded with an Entity with an actions object', done => {
			ItemList.update({
				set: {
					infolist: cassmask.LIST.reset(['hmm', 'this', 'test']);
				},
				where: {
					part: 'Item',
					name: 'testing'
				}
			}).seam().subscribe(
				test => {
					expect(test.infolist.type).toEqual('LIST');
					expect(test.infolist.action).toEqual('reset');
					expect(test.infolist.payload).toEqual(['hmm', 'this', 'test']);
				},
				err => {
					expect(err).not.toBeDefined();
					done();
				},
				() => done());
		});

		it('should have reset the values in the LIST', done => {
			ItemList.find().seam().subscribe(
				test => {
					expect(test.infolist[0]).toEqual('hmm');
					expect(test.infolist[1]).toEqual('this');
					expect(test.infolist[2]).toEqual('test');
				},
				err => {
					expect(err).not.toBeDefined();
					done();
				},
				() => done());
		});

	});

});