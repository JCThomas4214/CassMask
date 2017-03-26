
var Jasmine = require('jasmine');
var jasmine = new Jasmine();
var JasmineReporter = require('jasmine-spec-reporter').SpecReporter;

var fsbx = require('fuse-box');
var cassmask = require('../../index.js');

cassmask.connect({
  contactPoints: ['127.0.0.1'],
  protocolOptions: { port: 9042 },
  queryOptions: { consistency: 1 },
  keyspace: 'cassmask'
}, (err, result) => {
	// callback after connection

	jasmine.loadConfig({
		spec_dir: 'tests/database',
		spec_files: [
			'feature/*.integration.js',
			'dataTypes/*.integration.js'
		]
	});

	jasmine.env.clearReporters();
	jasmine.addReporter(new JasmineReporter());

	jasmine.execute();

});
