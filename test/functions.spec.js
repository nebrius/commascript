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

  it('01-void_function', function() {
    runTest(path.join(__dirname, 'tests', 'functions', '01-void_function.js'), '', '');
  });

  it('02-void_function_definition', function() {
    runTest(path.join(__dirname, 'tests', 'functions', '02-void_function_definition.js'), '', '');
  });

  it('03-void_function_with_arguments', function() {
    runTest(path.join(__dirname, 'tests', 'functions', '03-void_function_with_arguments.js'), '', '');
  });

  it('04-void_function_with_arguments_mismatch', function() {
    runTest(path.join(__dirname, 'tests', 'functions', '04-void_function_with_arguments_mismatch.js'), '',
      'Mismatched number of arguments ' +
      path.join(__dirname, 'tests', 'functions', '04-void_function_with_arguments_mismatch.js:31:34\n'));
  });

  it('05-void_function_definition_with_arguments', function() {
    runTest(path.join(__dirname, 'tests', 'functions', '05-void_function_definition_with_arguments.js'), '', '');
  });

  it('06-void_function_definition_with_arguments_mismatch', function() {
    runTest(path.join(__dirname, 'tests', 'functions', '06-void_function_definition_with_arguments_mismatch.js'), '',
      'Mismatched number of arguments ' +
      path.join(__dirname, 'tests', 'functions', '06-void_function_definition_with_arguments_mismatch.js:31:13\n'));
  });

  it('07-void_function_definition_without_type', function() {
    runTest(path.join(__dirname, 'tests', 'functions', '07-void_function_definition_without_type.js'), '',
      'Type "foo" is not defined ' +
      path.join(__dirname, 'tests', 'functions', '07-void_function_definition_without_type.js:27:9\n'));
  });

  it('08-function_with_primitive_return', function () {
    runTest(path.join(__dirname, 'tests', 'functions', '08-function_with_primitive_return.js'), '', '');
  });

  it('09-function_with_primitive_return_error', function () {
    runTest(path.join(__dirname, 'tests', 'functions', '09-function_with_primitive_return_error.js'), '',
      'Mismatched return type ' +
      path.join(__dirname, 'tests', 'functions', '09-function_with_primitive_return_error.js:32:2\n'));
  });

  it('10-function_with_multiple_returns', function () {
    runTest(path.join(__dirname, 'tests', 'functions', '10-function_with_multiple_returns.js'), '', '');
  });

  it('11-function_with_multiple_returns_error', function () {
    runTest(path.join(__dirname, 'tests', 'functions', '11-function_with_multiple_returns_error.js'), '',
      'Mismatched return type ' +
      path.join(__dirname, 'tests', 'functions', '11-function_with_multiple_returns_error.js:33:4\n'));
  });

  it('12-function_with_missing_return_path', function () {
    runTest(path.join(__dirname, 'tests', 'functions', '12-function_with_missing_return_path.js'), '',
      'Not all code paths return a value ' +
      path.join(__dirname, 'tests', 'functions', '12-function_with_missing_return_path.js:31:0\n'));
  });

  it('13-function_with_switch', function () {
    runTest(path.join(__dirname, 'tests', 'functions', '13-function_with_switch.js'), '', '');
  });

  it('14-function_with_switch_returns', function () {
    runTest(path.join(__dirname, 'tests', 'functions', '14-function_with_switch_returns.js'), '', '');
  });

  it('15-function_with_switch_missing_return_path', function () {
    runTest(path.join(__dirname, 'tests', 'functions', '15-function_with_switch_missing_return_path.js'), '',
      'Not all code paths return a value ' +
      path.join(__dirname, 'tests', 'functions', '15-function_with_switch_missing_return_path.js:31:0\n'));
  });

  it('16-function_with_switch_fallthrough', function () {
    runTest(path.join(__dirname, 'tests', 'functions', '16-function_with_switch_fallthrough.js'), '', '');
  });

  it('17-function_with_switch_fallthrough_error', function () {
    runTest(path.join(__dirname, 'tests', 'functions', '17-function_with_switch_fallthrough_error.js'), '',
      'Mismatched return type ' +
      path.join(__dirname, 'tests', 'functions', '17-function_with_switch_fallthrough_error.js:37:6\n'));
  });

  it('18-function_with_switch_missing_default', function () {
    runTest(path.join(__dirname, 'tests', 'functions', '18-function_with_switch_missing_default.js'), '',
      'Not all code paths return a value ' +
      path.join(__dirname, 'tests', 'functions', '18-function_with_switch_missing_default.js:31:0\n'));
  });
});
