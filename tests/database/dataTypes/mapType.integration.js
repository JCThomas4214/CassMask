var ItemMap = require('./models/map');

describe('CassMask With MAP type', function() {
	var newSubTest;
	var newTest;

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
			tmp: {
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
		expect(newSubTest.tmp[1]).toEqual('jack');
		expect(newSubTest.tmp[2]).toEqual('jill');
		expect(newSubTest.tmp[3]).toEqual('jason');
	});

	it('should find row with a MAP datatype', () => {
		expect(newTest.tmp[1]).toEqual('jack');
		expect(newTest.tmp[2]).toEqual('jill');
		expect(newTest.tmp[3]).toEqual('jason');
	});

});