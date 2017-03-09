
var exec = require('child_process').exec;
var glob = require('glob');

var Jasmine = require('jasmine');
var jasmine = new Jasmine();
var JasmineReporter = require('jasmine-spec-reporter').SpecReporter;

var cassmask = require('cassmask');

cassmask.connect({
  contactPoints: ['127.0.0.1'],
  protocolOptions: { port: 9042 },
  queryOptions: { consistency: 1 },
  keyspace: 'cassmask'
}, (err, result) => {
	// callback after connection
  			
	jasmine.loadConfig({
		spec_dir: 'tests',
		spec_files: [
			'*.spec.js'
		]
	});

	jasmine.env.clearReporters();
	jasmine.addReporter(new JasmineReporter());

	jasmine.execute();
	
});