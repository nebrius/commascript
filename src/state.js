/*
The MIT License (MIT)

Copyright (c) 2013-2014 Bryan Hughes <bryan@theoreticalideations.com> (http://theoreticalideations.com)

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

var stack = [];

module.exports = {
  currentFile: '',
  handleError: handleError,
  handleInternalError: handleInternalError,
  enterContext: enterContext,
  exitContext: exitContext,
  getCurrentContext: getCurrentContext,
  lookupNamedType: lookupNamedType,
  addNamedType: addNamedType
};

function handleError(node, message) {
  console.error(message + ' ' + exports.currentFile + ':' + node.start.line + ':' + node.start.col);
}

function handleInternalError(message) {
  throw new Error('Internal Error: ' + message +
    ' This is a bug. Please report it to the project author');
}

function enterContext(config) {
  stack.push({
    symbolTable: {},
    expectedReturnType: config.expectedReturnType
  });
}

function exitContext() {
  stack.pop();
}

function getCurrentContext() {
  return stack[stack.length - 1];
}

function lookupNamedType(name) {
  for (var i = stack.length - 1; i >= 0; i--) {
    var type = stack[i].symbolTable[name];
    if (type) {
      return type;
    }
  }
}

function addNamedType(name, type) {
  getCurrentContext().symbolTable[name] = type;
}
