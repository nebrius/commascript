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

describe('Expressions Tests', function() {

  it('01-numeric_expression', function() {
    runTest(path.join(__dirname, 'tests', 'expressions', '01-numeric_expression.js'), '', '');
  });

  it('02-numeric_expression_type_error', function() {
    runTest(path.join(__dirname, 'tests', 'expressions', '02-numeric_expression_type_error.js'), '',
      'Invalid type supplied to right-hand side of numeric operator: expected "number" but got "string" ' +
      path.join(__dirname, 'tests', 'expressions', '02-numeric_expression_type_error.js:29:9\n'));
  });

  it('03-addition', function() {
    runTest(path.join(__dirname, 'tests', 'expressions', '03-addition.js'), '', '');
  });

  it('04-addition_type_error', function() {
    runTest(path.join(__dirname, 'tests', 'expressions', '04-addition_type_error.js'), '',
      'Invalid right-hand side type in assignment: expected "number" but got "string" ' +
      path.join(__dirname, 'tests', 'expressions', '04-addition_type_error.js:29:4\n'));
  });

  it('05-concatenation', function() {
    runTest(path.join(__dirname, 'tests', 'expressions', '05-concatenation.js'), '', '');
  });

  it('06-concatenation_type_error', function() {
    runTest(path.join(__dirname, 'tests', 'expressions', '06-concatenation_type_error.js'), '',
      'Invalid right-hand side type in assignment: expected "string" but got "number" ' +
      path.join(__dirname, 'tests', 'expressions', '06-concatenation_type_error.js:29:4\n'));
  });

  it('07-numeric_comparison', function() {
    runTest(path.join(__dirname, 'tests', 'expressions', '07-numeric_comparison.js'), '', '');
  });

  it('08-numeric_comparison_type_error', function() {
    runTest(path.join(__dirname, 'tests', 'expressions', '08-numeric_comparison_type_error.js'), '',
      'Invalid type supplied to right-hand side of numeric operator: expected "number" but got "string" ' +
      path.join(__dirname, 'tests', 'expressions', '08-numeric_comparison_type_error.js:31:8\n'));
  });

  it('09-numeric_comparison_cast_error', function() {
    runTest(path.join(__dirname, 'tests', 'expressions', '09-numeric_comparison_cast_error.js'), '',
      'Invalid right-hand side type in assignment: expected "number" but got "boolean" ' +
      path.join(__dirname, 'tests', 'expressions', '09-numeric_comparison_cast_error.js:31:4\n'));
  });

  it('10-generic_comparison', function() {
    runTest(path.join(__dirname, 'tests', 'expressions', '10-generic_comparison.js'), '', '');
  });

  it('11-generic_comparison_cast_error', function() {
    runTest(path.join(__dirname, 'tests', 'expressions', '11-generic_comparison_cast_error.js'), '',
      'Invalid right-hand side type in assignment: expected "number" but got "boolean" ' +
      path.join(__dirname, 'tests', 'expressions', '11-generic_comparison_cast_error.js:31:4\n'));
  });

  it('12-generic_mismatched_equality', function() {
    runTest(path.join(__dirname, 'tests', 'expressions', '12-generic_mismatched_equality.js'), '',
      'Mismatched comparison: right hand side type "boolean" cannot be compared to left hand side type "number" ' +
      path.join(__dirname, 'tests', 'expressions', '12-generic_mismatched_equality.js:30:0\n'));
  });

  it('13-boolean_expression', function() {
    runTest(path.join(__dirname, 'tests', 'expressions', '13-boolean_expression.js'), '', '');
  });

  it('14-boolean_expression_type_error', function() {
    runTest(path.join(__dirname, 'tests', 'expressions', '14-boolean_expression_type_error.js'), '',
      'Invalid type supplied to right-hand side of boolean operator: expected "boolean" but got "number" ' +
      path.join(__dirname, 'tests', 'expressions', '14-boolean_expression_type_error.js:31:9\n'));
  });

  it('15-boolean_expression_cast_error', function() {
    runTest(path.join(__dirname, 'tests', 'expressions', '15-boolean_expression_cast_error.js'), '',
      'Invalid right-hand side type in assignment: expected "number" but got "boolean" ' +
      path.join(__dirname, 'tests', 'expressions', '15-boolean_expression_cast_error.js:31:4\n'));
  });

  it('16-ternary', function() {
    runTest(path.join(__dirname, 'tests', 'expressions', '16-ternary.js'), '', '');
  });

  it('17-ternary_alternative_type_error', function() {
    runTest(path.join(__dirname, 'tests', 'expressions', '17-ternary_alternative_type_error.js'), '',
      'Mismatched ternary arguments: the consequent is of type "number" but the alternative is of type "string" and must match the consequent type ' +
      path.join(__dirname, 'tests', 'expressions', '17-ternary_alternative_type_error.js:32:12\n'));
  });

  it('18-ternary_condition_type_error', function() {
    runTest(path.join(__dirname, 'tests', 'expressions', '18-ternary_condition_type_error.js'), '',
      'Invalid condition type: expected type "boolean" but instead saw type "number" ' +
      path.join(__dirname, 'tests', 'expressions', '18-ternary_condition_type_error.js:32:4\n'));
  });

  it('19-ternary_cast_error', function() {
    runTest(path.join(__dirname, 'tests', 'expressions', '19-ternary_cast_error.js'), '',
      'Invalid right-hand side type in assignment: expected "string" but got "number" ' +
      path.join(__dirname, 'tests', 'expressions', '19-ternary_cast_error.js:32:4\n'));
  });

  it('20-in_expression', function() {
    runTest(path.join(__dirname, 'tests', 'expressions', '20-in_expression.js'), '', '');
  });

  it('21-in_expression_prop_error', function() {
    runTest(path.join(__dirname, 'tests', 'expressions', '21-in_expression_prop_error.js'), '',
      'Invalid type supplied to left-hand side of "in" operator: expected "string" but got "boolean" ' +
      path.join(__dirname, 'tests', 'expressions', '21-in_expression_prop_error.js:32:4\n'));
  });

  it('22-in_expression_obj_error', function() {
    runTest(path.join(__dirname, 'tests', 'expressions', '22-in_expression_obj_error.js'), '',
      'Invalid type supplied to right-hand side of "in" operator: expected an object but got "number" ' +
      path.join(__dirname, 'tests', 'expressions', '22-in_expression_obj_error.js:29:13\n'));
  });
});
