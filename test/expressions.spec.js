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
describe
*/

var runTest = require('./test_utils').runTest;

describe('Expressions Tests', function() {

  runTest({
    spec: 'expressions',
    test: '01-numeric_expression'
  });

  runTest({
    spec: 'expressions',
    test: '02-numeric_expression_type_error',
    error: 'Invalid type supplied to right-hand side of numeric operator: expected "number" but got "string"',
    line: 29,
    column: 9
  });

  runTest({
    spec: 'expressions',
    test: '03-addition'
  });

  runTest({
    spec: 'expressions',
    test: '04-addition_type_error',
    error: 'Invalid right-hand side type in assignment: expected "number" but got "string"',
    line: 29,
    column: 4
  });

  runTest({
    spec: 'expressions',
    test: '05-concatenation'
  });

  runTest({
    spec: 'expressions',
    test: '06-concatenation_type_error',
    error: 'Invalid right-hand side type in assignment: expected "string" but got "number"',
    line: 29,
    column: 4
  });

  runTest({
    spec: 'expressions',
    test: '07-numeric_comparison'
  });

  runTest({
    spec: 'expressions',
    test: '08-numeric_comparison_type_error',
    error: 'Invalid type supplied to right-hand side of numeric operator: expected "number" but got "string"',
    line: 31,
    column: 8
  });

  runTest({
    spec: 'expressions',
    test: '09-numeric_comparison_cast_error',
    error: 'Invalid right-hand side type in assignment: expected "number" but got "boolean"',
    line: 31,
    column: 4
  });

  runTest({
    spec: 'expressions',
    test: '10-generic_comparison'
  });

  runTest({
    spec: 'expressions',
    test: '11-generic_comparison_cast_error',
    error: 'Invalid right-hand side type in assignment: expected "number" but got "boolean"',
    line: 31,
    column: 4
  });

  runTest({
    spec: 'expressions',
    test: '12-generic_mismatched_equality',
    error: 'Mismatched comparison: right hand side type "boolean" cannot be compared to left hand side type "number"',
    line: 30,
    column: 0
  });

  runTest({
    spec: 'expressions',
    test: '13-boolean_expression'
  });

  runTest({
    spec: 'expressions',
    test: '14-boolean_expression_type_error',
    error: 'Invalid type supplied to right-hand side of boolean operator: expected "boolean" but got "number"',
    line: 31,
    column: 9
  });

  runTest({
    spec: 'expressions',
    test: '15-boolean_expression_cast_error',
    error: 'Invalid right-hand side type in assignment: expected "number" but got "boolean"',
    line: 31,
    column: 4
  });

  runTest({
    spec: 'expressions',
    test: '16-ternary'
  });

  runTest({
    spec: 'expressions',
    test: '17-ternary_alternative_type_error',
    error: 'Mismatched ternary arguments: the consequent is of type "number" but the alternative is of type "string" and must match the consequent type',
    line: 32,
    column: 12
  });

  runTest({
    spec: 'expressions',
    test: '18-ternary_condition_type_error',
    error: 'Invalid condition type: expected type "boolean" but instead saw type "number"',
    line: 32,
    column: 4
  });

  runTest({
    spec: 'expressions',
    test: '19-ternary_cast_error',
    error: 'Invalid right-hand side type in assignment: expected "string" but got "number"',
    line: 32,
    column: 4
  });

  runTest({
    spec: 'expressions',
    test: '20-in_expression'
  });

  runTest({
    spec: 'expressions',
    test: '21-in_expression_prop_error',
    error: 'Invalid type supplied to left-hand side of "in" operator: expected "string" but got "boolean"',
    line: 32,
    column: 4
  });

  runTest({
    spec: 'expressions',
    test: '22-in_expression_obj_error',
    error: 'Invalid type supplied to right-hand side of "in" operator: expected an object but got "number"',
    line: 29,
    column: 13
  });
});
