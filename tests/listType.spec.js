var ItemList = require('./model/list');

describe('CassMask With LIST type', function() {
	var newSubTest;
	var newTest;

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
		ItemList.find().seam().subscribe(
			test => newTest = test,
			err => {
				expect(err).not.toBeDefined();
				done();
			},
			() => done());	
	});	

	it('should respond with and Entity with a LIST datatype', () => {
		expect(newSubTest.tmp[0]).toEqual('jack');
		expect(newSubTest.tmp[1]).toEqual('jill');
		expect(newSubTest.tmp[2]).toEqual('jason');
	});

	it('should find row with a LIST datatype', () => {
		expect(newTest.tmp[0]).toEqual('jack');
		expect(newTest.tmp[1]).toEqual('jill');
		expect(newTest.tmp[2]).toEqual('jason');
	});

});