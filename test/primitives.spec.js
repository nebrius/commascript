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

describe('Primitive Tests', function() {

  runTest({
    spec: 'primitives',
    test: '01-boolean'
  });

  runTest({
    spec: 'primitives',
    test: '02-boolean_typeerror',
    error: 'Cannot cast "boolean" as "number"',
    line: 28,
    column: 6
  });

  runTest({
    spec: 'primitives',
    test: '03-number'
  });

  runTest({
    spec: 'primitives',
    test: '04-number_typeerror',
    error: 'Cannot cast "number" as "string"',
    line: 28,
    column: 6
  });

  runTest({
    spec: 'primitives',
    test: '05-number_nan'
  });

  runTest({
    spec: 'primitives',
    test: '06-number_infinity'
  });

  runTest({
    spec: 'primitives',
    test: '07-string'
  });

  runTest({
    spec: 'primitives',
    test: '08-string_typeerror',
    error: 'Cannot cast "string" as "number"',
    line: 28,
    column: 6
  });

  runTest({
    spec: 'primitives',
    test: '09-undefined',
    error: 'Undefined values are not allowed',
    line: 27,
    column: 10
  });
});
