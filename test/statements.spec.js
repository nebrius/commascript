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

describe('Statement Tests', function() {

  runTest({
    spec: 'statements',
    test: '01-assignment'
  });

  runTest({
    spec: 'statements',
    test: '02-assignment_mismatch',
    error: 'Invalid right-hand side type in assignment: expected "boolean" but got "number"',
    line: 28,
    column: 6
  });

  runTest({
    spec: 'statements',
    test: '03-assignment_op_mismatch',
    error: 'Invalid type supplied to left-hand side of assignment: expected "number" but got "string"',
    line: 28,
    column: 0
  });

  runTest({
    spec: 'statements',
    test: '04-assignment_op_nonnumeric',
    error: 'Invalid type supplied to left-hand side of assignment: expected "number" but got "string"',
    line: 28,
    column: 0
  });
});
