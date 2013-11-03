/*
The MIT License (MIT)

Copyright (c) 2013 Bryan Hughes <bryan@theoreticalideations.com> (http://theoreticalideations.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/*global
describe,
it,
expect,
runs,
waitsFor
*/

var path = require('path'),
	exec = require('child_process').exec,
	commascriptBinary = path.join(__dirname, '..', 'bin', 'commascript.js');

function runTest(source, expectedStdout, expectedStderr) {
	var finished = false,
		output;
	runs(function () {
		exec('node ' + commascriptBinary + ' ' + source, {
			cwd: __dirname
		}, function (error, stdout, stderr) {
			finished = true;
			output = {
				stdout: stdout.replace('\n\r', '\n'),
				stderr: stderr.replace('\n\r', '\n'),
				error: error
			};
		});
	});
	waitsFor(function () {
		return finished;
	});
	runs(function () {
		expect(output.stdout).toEqual(expectedStdout);
		expect(output.stderr).toEqual(expectedStderr);
		expect(output.error).toBeNull();
	});
}

describe('Function Tests', function() {

	it('Function - void function', function() {
		runTest(path.join(__dirname, 'tests', 'functions', '01-void_function.js'), '', '');
	});

	it('Function - void function definition', function() {
		runTest(path.join(__dirname, 'tests', 'functions', '02-void_function_definition.js'), '', '');
	});

	it('Function - void function with arguments', function() {
		runTest(path.join(__dirname, 'tests', 'functions', '03-void_function_with_arguments.js'), '', '');
	});

	it('Function - void function with arguments mismatch', function() {
		runTest(path.join(__dirname, 'tests', 'functions', '04-void_function_with_arguments_mismatch.js'), '',
			'Mismatched number of arguments ' +
			path.join(__dirname, 'tests', 'functions', '04-void_function_with_arguments_mismatch.js:31:34\n'));
	});

	it('Function - void function with arguments', function() {
		runTest(path.join(__dirname, 'tests', 'functions', '05-void_function_definition_with_arguments.js'), '', '');
	});

	it('Function - void function with arguments mismatch', function() {
		runTest(path.join(__dirname, 'tests', 'functions', '06-void_function_definition_with_arguments_mismatch.js'), '',
			'Mismatched number of arguments ' +
			path.join(__dirname, 'tests', 'functions', '06-void_function_definition_with_arguments_mismatch.js:31:13\n'));
	});

	it('Function - void function with arguments mismatch', function() {
		runTest(path.join(__dirname, 'tests', 'functions', '07-void_function_definition_without_type.js'), '',
			'Type "foo" is not defined ' +
			path.join(__dirname, 'tests', 'functions', '07-void_function_definition_without_type.js:27:9\n'));
	});

	it('Function - function with primitive return', function () {
		runTest(path.join(__dirname, 'tests', 'functions', '08-function_with_primitive_return.js'), '', '');
	});

	it('Function - function with primitive return error', function () {
		runTest(path.join(__dirname, 'tests', 'functions', '09-function_with_primitive_return_error.js'), '',
			'Mismatched return type ' +
			path.join(__dirname, 'tests', 'functions', '09-function_with_primitive_return_error.js:32:1\n'));
	});

	it('Function - function with multiple returns', function () {
		runTest(path.join(__dirname, 'tests', 'functions', '10-function_with_multiple_returns.js'), '', '');
	});

	it('Function - function with multiple returns error', function () {
		runTest(path.join(__dirname, 'tests', 'functions', '11-function_with_multiple_returns_error.js'), '', '');
	});

	it('Function - function with missing return path', function () {
		runTest(path.join(__dirname, 'tests', 'functions', '12-function_with_missing_return_path.js'), '', '');
	});
});