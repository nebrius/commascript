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

describe('Branch Tests', function() {

  runTest({
    spec: 'branches',
    test: '01-if_statement_conditional_error',
    error: 'Undeclared symbol "x"',
    line: 29,
    column: 4
  });

  runTest({
    spec: 'branches',
    test: '02-if_statement_body_error',
    error: 'Undeclared symbol "x"',
    line: 30,
    column: 2
  });

  runTest({
    spec: 'branches',
    test: '03-if_statement_alternate_error',
    error: 'Undeclared symbol "x"',
    line: 32,
    column: 2
  });

  runTest({
    spec: 'branches',
    test: '04-for_loop'
  });

  runTest({
    spec: 'branches',
    test: '05-for_loop_init_error',
    error: 'Undeclared symbol "x"',
    line: 29,
    column: 5
  });

  runTest({
    spec: 'branches',
    test: '06-for_loop_conditional_error',
    error: 'Undeclared symbol "x"',
    line: 29,
    column: 6
  });

  runTest({
    spec: 'branches',
    test: '07-for_loop_iteration_error',
    error: 'Undeclared symbol "x"',
    line: 29,
    column: 7
  });

  runTest({
    spec: 'branches',
    test: '08-for_loop_body_error',
    error: 'Undeclared symbol "x"',
    line: 30,
    column: 2
  });

  runTest({
    spec: 'branches',
    test: '09-for_in_loop'
  });

  runTest({
    spec: 'branches',
    test: '10-for_in_loop_body_error',
    error: 'Invalid right-hand side type in assignment: expected "string" but got "number"',
    line: 28,
    column: 6
  });

  runTest({
    spec: 'branches',
    test: '11-for_in_loop_init_redefinition_error',
    error: 'Redefinition of variable "y"',
    line: 29,
    column: 9
  });

  runTest({
    spec: 'branches',
    test: '12-for_in_loop_init_error',
    error: 'For loop iteration variables must be of type string',
    line: 29,
    column: 0
  });

  runTest({
    spec: 'branches',
    test: '13-do_while_loop'
  });

  runTest({
    spec: 'branches',
    test: '14-do_while_loop_condition_error',
    error: 'Undeclared symbol "x"',
    line: 31,
    column: 8
  });

  runTest({
    spec: 'branches',
    test: '15-do_while_loop_body_error',
    error: 'Undeclared symbol "x"',
    line: 30,
    column: 2
  });

  runTest({
    spec: 'branches',
    test: '16-while_loop'
  });

  runTest({
    spec: 'branches',
    test: '17-while_loop_condition_error',
    error: 'Undeclared symbol "x"',
    line: 29,
    column: 6
  });

  runTest({
    spec: 'branches',
    test: '18-while_loop_body_error',
    error: 'Undeclared symbol "x"',
    line: 30,
    column: 2
  });

  runTest({
    spec: 'branches',
    test: '19-switch_statement'
  });

  runTest({
    spec: 'branches',
    test: '20-switch_statement_with_invalid_case_type',
    error: 'Mismatched case in switch: case type "string" must match the switch expression type "number"',
    line: 32,
    column: 2
  });
});
