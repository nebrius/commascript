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

describe('Function Call Tests', function() {

  it('Function call - void function call', function() {
    runTest(path.join(__dirname, 'tests', 'function_calls', '01-void_function_call.js'), '', '');
  });

  it('Function call - void function call with arguments', function() {
    runTest(path.join(__dirname, 'tests', 'function_calls', '02-void_function_call_with_arguments.js'), '', '');
  });

  it('Function call - void function call with invalid arguments', function() {
    runTest(path.join(__dirname, 'tests', 'function_calls', '03-void_function_call_with_invalid_arguments.js'), '',
      'Mismatched function call argument: expected argument 0 to be of type "string" but saw argument of type "number" ' +
      path.join(__dirname, 'tests', 'function_calls', '03-void_function_call_with_invalid_arguments.js:33:0\n'));
  });

  it('Function call - void function call with mismatched arguments', function() {
    runTest(path.join(__dirname, 'tests', 'function_calls', '04-void_function_call_with_mismatched_arguments.js'), '',
      'Mismatched number of arguments in function call: expected 1 argument but saw 2 arguments ' +
      path.join(__dirname, 'tests', 'function_calls', '04-void_function_call_with_mismatched_arguments.js:33:0\n'));
  });

  it('Function call - function call with return', function() {
    runTest(path.join(__dirname, 'tests', 'function_calls', '05-function_call_with_return.js'), '', '');
  });

  it('Function call - function call with mismatched return', function() {
    runTest(path.join(__dirname, 'tests', 'function_calls', '06-function_call_with_mismatched_return.js'), '',
      'Cannot cast "string" as "number" ' +
      path.join(__dirname, 'tests', 'function_calls', '06-function_call_with_mismatched_return.js:37:4\n'));
  });

  it('Function call - function call with no assignment', function() {
    runTest(path.join(__dirname, 'tests', 'function_calls', '07-function_call_with_no_assignment.js'), '', '');
  });
});
