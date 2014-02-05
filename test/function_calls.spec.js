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

describe('Function Call Tests', function() {

  runTest({
    spec: 'function_calls',
    test: '01-void_function_call'
  });

  runTest({
    spec: 'function_calls',
    test: '02-void_function_call_with_arguments'
  });

  runTest({
    spec: 'function_calls',
    test: '03-void_function_call_with_invalid_arguments',
    error: 'Mismatched function call argument: expected argument 0 to be of type "string" but saw argument of type "number"',
    line: 33,
    column: 0
  });

  runTest({
    spec: 'function_calls',
    test: '04-void_function_call_with_mismatched_arguments',
    error: 'Mismatched number of arguments in function call: expected 1 argument but saw 2 arguments',
    line: 33,
    column: 0
  });

  runTest({
    spec: 'function_calls',
    test: '05-function_call_with_return'
  });

  runTest({
    spec: 'function_calls',
    test: '06-function_call_with_mismatched_return',
    error: 'Invalid right-hand side type in assignment: expected "number" but got "string"',
    line: 37,
    column: 4
  });

  runTest({
    spec: 'function_calls',
    test: '07-function_call_with_no_assignment'
  });
});
