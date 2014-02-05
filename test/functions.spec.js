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
it
*/

var path = require('path'),
    runTest = require('./test_utils').runTest;

describe('Function Tests', function() {

  runTest({
    spec: 'functions',
    test: '01-void_function'
  });

  runTest({
    spec: 'functions',
    test: '02-void_function_definition'
  });

  runTest({
    spec: 'functions',
    test: '03-void_function_with_arguments'
  });

  runTest({
    spec: 'functions',
    test: '04-void_function_with_arguments_mismatch',
    error: 'Mismatched number of arguments',
    line: 31,
    column: 34
  });

  runTest({
    spec: 'functions',
    test: '05-void_function_definition_with_arguments'
  });

  runTest({
    spec: 'functions',
    test: '06-void_function_definition_with_arguments_mismatch',
    error: 'Mismatched number of arguments',
    line: 31,
    column: 13
  });

  runTest({
    spec: 'functions',
    test: '07-void_function_definition_without_type',
    error: 'Type "foo" is not defined',
    line: 27,
    column: 9
  });

  runTest({
    spec: 'functions',
    test: '08-function_with_primitive_return'
  });

  runTest({
    spec: 'functions',
    test: '09-function_with_primitive_return_error',
    error: 'Mismatched return type',
    line: 32,
    column: 2
  });

  runTest({
    spec: 'functions',
    test: '10-function_with_multiple_returns'
  });

  runTest({
    spec: 'functions',
    test: '11-function_with_multiple_returns_error',
    error: 'Mismatched return type',
    line: 33,
    column: 4
  });

  runTest({
    spec: 'functions',
    test: '12-function_with_missing_return_path',
    error: 'Not all code paths return a value',
    line: 31,
    column: 0
  });

  runTest({
    spec: 'functions',
    test: '13-function_with_switch'
  });

  runTest({
    spec: 'functions',
    test: '14-function_with_switch_returns'
  });

  runTest({
    spec: 'functions',
    test: '15-function_with_switch_missing_return_path',
    error: 'Not all code paths return a value',
    line: 31,
    column: 0
  });

  runTest({
    spec: 'functions',
    test: '16-function_with_switch_fallthrough'
  });

  runTest({
    spec: 'functions',
    test: '17-function_with_switch_fallthrough_error',
    error: 'Mismatched return type',
    line: 37,
    column: 6
  });

  runTest({
    spec: 'functions',
    test: '18-function_with_switch_missing_default',
    error: 'Not all code paths return a value',
    line: 31,
    column: 0
  });
});
