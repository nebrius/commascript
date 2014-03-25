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

describe('Object Tests', function() {

  runTest({
    spec: 'object-literals',
    test: '01-object_literal'
  });

  runTest({
    spec: 'object-literals',
    test: '02-infer_type_error',
    error: 'Inferred type has mismatched type for "baz"',
    line: 35,
    column: 6
  });

  runTest({
    spec: 'object-literals',
    test: '03-property_type_error',
    error: 'Invalid right-hand side type in assignment: expected "string" but got "number"',
    line: 39,
    column: 10
  });

  runTest({
    spec: 'object-literals',
    test: '04-undeclared_property',
    error: 'Unknown property "foo"',
    line: 39,
    column: 0
  });

  runTest({
    spec: 'object-literals',
    test: '05-inferred_literal'
  });

  runTest({
    spec: 'object-literals',
    test: '06-inferred_literal_infer_type_error',
    error: 'Inferred type has mismatched type for "baz"',
    line: 31,
    column: 6
  });

  runTest({
    spec: 'object-literals',
    test: '07-inferred_literal_property_type_error',
    error: 'Invalid right-hand side type in assignment: expected "string" but got "number"',
    line: 31,
    column: 10
  });
});
