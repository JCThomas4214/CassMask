var exec = require('child_process').exec;
var glob = require('glob');

var Jasmine = require('jasmine');
var jasmine = new Jasmine();
var JasmineReporter = require('jasmine-spec-reporter').SpecReporter;

glob('tests/api/**/*.spec.ts', function(err, files) {
	exec(`tsc ${files.join(' ')} --outDir tmp`, () => {

		jasmine.loadConfig({
			spec_dir: 'tmp/tests/api',
			spec_files: [
				'queryParsing/*.spec.js',
			]
		});

		jasmine.env.clearReporters();
		jasmine.addReporter(new JasmineReporter());

		jasmine.execute();

	});
});
