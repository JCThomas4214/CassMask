var cassmask = require('cassmask');
var ItemSet = require('./model/set');

describe('CassMask With SET type', function() {
	var newSubTest;
	var newTest;

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
			tmp: ['jack','jill','jason']
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
		expect(newSubTest.tmp[0]).toEqual('jack');
		expect(newSubTest.tmp[1]).toEqual('jill');
		expect(newSubTest.tmp[2]).toEqual('jason');
	});

	it('should find row with a SET datatype that is ordered', () => {
		expect(newTest.tmp[0]).toEqual('jack');
		expect(newTest.tmp[2]).toEqual('jill');
		expect(newTest.tmp[1]).toEqual('jason');
	});

});