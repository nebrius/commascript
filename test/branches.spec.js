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

describe('Branch Tests', function() {

  it('Branch - if statement conditional error', function() {
    runTest(path.join(__dirname, 'tests', 'branches', '01-if_statement_conditional_error.js'), '',
      'Undeclared symbol "x" ' +
      path.join(__dirname, 'tests', 'branches', '01-if_statement_conditional_error.js:29:4\n'));
  });

  it('Branch - if statement body error', function() {
    runTest(path.join(__dirname, 'tests', 'branches', '02-if_statement_body_error.js'), '',
      'Undeclared symbol "x" ' +
      path.join(__dirname, 'tests', 'branches', '02-if_statement_body_error.js:30:2\n'));
  });

  it('Branch - if statement alternate error', function() {
    runTest(path.join(__dirname, 'tests', 'branches', '03-if_statement_alternate_error.js'), '',
      'Undeclared symbol "x" ' +
      path.join(__dirname, 'tests', 'branches', '03-if_statement_alternate_error.js:32:2\n'));
  });

  it('Branch - for loop', function() {
    runTest(path.join(__dirname, 'tests', 'branches', '04-for_loop.js'), '', '');
  });

  it('Branch - for loop init error', function() {
    runTest(path.join(__dirname, 'tests', 'branches', '05-for_loop_init_error.js'), '',
      'Undeclared symbol "x" ' +
      path.join(__dirname, 'tests', 'branches', '05-for_loop_init_error.js:29:5\n'));
  });

  it('Branch - for loop conditional error', function() {
    runTest(path.join(__dirname, 'tests', 'branches', '06-for_loop_conditional_error.js'), '',
      'Undeclared symbol "x" ' +
      path.join(__dirname, 'tests', 'branches', '06-for_loop_conditional_error.js:29:6\n'));
  });

  it('Branch - for loop iteration error', function() {
    runTest(path.join(__dirname, 'tests', 'branches', '07-for_loop_iteration_error.js'), '',
      'Undeclared symbol "x" ' +
      path.join(__dirname, 'tests', 'branches', '07-for_loop_iteration_error.js:29:7\n'));
  });

  it('Branch - for loop body error', function() {
    runTest(path.join(__dirname, 'tests', 'branches', '08-for_loop_body_error.js'), '',
      'Undeclared symbol "x" ' +
      path.join(__dirname, 'tests', 'branches', '08-for_loop_body_error.js:30:2\n'));
  });

  it('Branch - for in loop', function() {
    runTest(path.join(__dirname, 'tests', 'branches', '09-for_in_loop.js'), '', '');
  });

  it('Branch - for in loop body error', function() {
    runTest(path.join(__dirname, 'tests', 'branches', '10-for_in_loop_body_error.js'), '',
      'Cannot cast "number" as "string" ' +
      path.join(__dirname, 'tests', 'branches', '10-for_in_loop_body_error.js:28:6\n'));
  });

  it('Branch - for in loop init redefinition error', function() {
    runTest(path.join(__dirname, 'tests', 'branches', '11-for_in_loop_init_redefinition_error.js'), '',
      'Redefinition of variable "y" ' +
      path.join(__dirname, 'tests', 'branches', '11-for_in_loop_init_redefinition_error.js:29:9\n'));
  });

  it('Branch - for in loop init error', function() {
    runTest(path.join(__dirname, 'tests', 'branches', '12-for_in_loop_init_error.js'), '',
      'For loop iteration variables must be of type string ' +
      path.join(__dirname, 'tests', 'branches', '12-for_in_loop_init_error.js:29:0\n'));
  });

  it('Branch - do while loop', function() {
    runTest(path.join(__dirname, 'tests', 'branches', '13-do_while_loop.js'), '', '');
  });

  it('Branch - do while loop condition error', function() {
    runTest(path.join(__dirname, 'tests', 'branches', '14-do_while_loop_condition_error.js'), '',
      'Undeclared symbol "x" ' +
      path.join(__dirname, 'tests', 'branches', '14-do_while_loop_condition_error.js:31:8\n'));
  });

  it('Branch - do while loop body error', function() {
    runTest(path.join(__dirname, 'tests', 'branches', '15-do_while_loop_body_error.js'), '',
      'Undeclared symbol "x" ' +
      path.join(__dirname, 'tests', 'branches', '15-do_while_loop_body_error.js:30:2\n'));
  });

  it('Branch - while loop', function() {
    runTest(path.join(__dirname, 'tests', 'branches', '16-while_loop.js'), '', '');
  });

  it('Branch - while loop condition error', function() {
    runTest(path.join(__dirname, 'tests', 'branches', '17-while_loop_condition_error.js'), '',
      'Undeclared symbol "x" ' +
      path.join(__dirname, 'tests', 'branches', '17-while_loop_condition_error.js:29:6\n'));
  });

  it('Branch - while loop body error', function() {
    runTest(path.join(__dirname, 'tests', 'branches', '18-while_loop_body_error.js'), '',
      'Undeclared symbol "x" ' +
      path.join(__dirname, 'tests', 'branches', '18-while_loop_body_error.js:30:2\n'));
  });

  it('Branch - switch statement', function() {
    runTest(path.join(__dirname, 'tests', 'branches', '19-switch_statement.js'), '', '');
  });

  it('Branch - switch statement', function() {
    runTest(path.join(__dirname, 'tests', 'branches', '20-switch_statement_with_invalid_case_type.js'), '',
      'Mismatched case in switch: case type "string" must match the switch expression type "number" ' +
      path.join(__dirname, 'tests', 'branches', '20-switch_statement_with_invalid_case_type.js:32:2\n'));
  });
});
