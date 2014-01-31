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

describe('Statement Tests', function() {

  it('01-assignment', function() {
    runTest(path.join(__dirname, 'tests', 'statements', '01-assignment.js'), '', '');
  });

  it('02-assignment_mismatch', function() {
    runTest(path.join(__dirname, 'tests', 'statements', '02-assignment_mismatch.js'), '',
      'Invalid right-hand side type in assignment: expected "boolean" but got "number" ' +
      path.join(__dirname, 'tests', 'statements', '02-assignment_mismatch.js:28:6\n'));
  });

  it('03-assignment_op_mismatch', function() {
    runTest(path.join(__dirname, 'tests', 'statements', '03-assignment_op_mismatch.js'), '',
      'Invalid type supplied to left-hand side of assignment: expected "number" but got "string" ' +
      path.join(__dirname, 'tests', 'statements', '03-assignment_op_mismatch.js:28:0\n'));
  });

  it('04-assignment_op_nonnumeric', function() {
    runTest(path.join(__dirname, 'tests', 'statements', '04-assignment_op_nonnumeric.js'), '',
      'Invalid type supplied to left-hand side of assignment: expected "number" but got "string" ' +
      path.join(__dirname, 'tests', 'statements', '04-assignment_op_nonnumeric.js:28:0\n'));
  });
});
