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

describe('Primitive Tests', function() {

	it('Boolean - Boolean assigned', function() {
		runTest(path.join(__dirname, 'tests', 'primitives', '1-boolean.js'), '', '');
	});

	it('Boolean - Number assigned', function() {
		runTest(path.join(__dirname, 'tests', 'primitives', '2-boolean_typeerror.js'), '',
			'Mismatched assignment: right hand side type "number" cannot be assigned ' +
			'to left hand side type "boolean" /Users/bryan/Work/commascript/test/tests' +
			'/primitives/2-boolean_typeerror.js:28:0\n');
	});

	it('Number - Number assigned', function() {
		runTest(path.join(__dirname, 'tests', 'primitives', '3-number.js'), '', '');
	});

	it('Number - String assigned', function() {
		runTest(path.join(__dirname, 'tests', 'primitives', '4-number_typeerror.js'), '',
			'Mismatched assignment: right hand side type "string" cannot be assigned ' +
			'to left hand side type "number" /Users/bryan/Work/commascript/test/tests' +
			'/primitives/4-number_typeerror.js:28:0\n');
	});

	it('Number - NaN assigned', function() {
		runTest(path.join(__dirname, 'tests', 'primitives', '5-number_nan.js'), '', '');
	});

	it('Number - Infinity assigned', function() {
		runTest(path.join(__dirname, 'tests', 'primitives', '6-number_infinity.js'), '', '');
	});

	it('String - String assigned', function() {
		runTest(path.join(__dirname, 'tests', 'primitives', '7-string.js'), '', '');
	});

	it('String - Number assigned', function() {
		runTest(path.join(__dirname, 'tests', 'primitives', '8-string_typeerror.js'), '',
			'Mismatched assignment: right hand side type "number" cannot be assigned ' +
			'to left hand side type "string" /Users/bryan/Work/commascript/test/tests' +
			'/primitives/8-string_typeerror.js:28:0\n');
	});
});