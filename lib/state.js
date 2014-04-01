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

var uglify = require('uglify-js'),
    stack,
    currentFile;

// TODO: remove isContextCommaScript calls

module.exports = {
  setFilename: setFilename,
  isCommaScriptDirective: isCommaScriptDirective,
  initScope: initScope,
  destroyScope: destroyScope,
  processBlock: processBlock,
  handleError: handleError,
  handleInternalError: handleInternalError,
  enterContext: enterContext,
  exitContext: exitContext,
  getCurrentContext: getCurrentContext,
  lookupType: lookupType,
  addType: addType
};

function setFilename(newFilename) {
  currentFile = newFilename;
}

function isCommaScriptDirective(node) {
  return (node instanceof uglify.AST_Directive && node.value == 'use commascript') ||
    node instanceof uglify.AST_SimpleStatement && node.body instanceof uglify.AST_String &&
    node.body.value == 'use commascript';
}

function initScope() {
  stack = [];
  enterContext();
}

function destroyScope() {
  exitContext();
}

function processBlock(nodes) {
  if (nodes) {
    var i, len,
        result;
    for (i = 0, len = nodes.length; i < len; i++) {
      result = nodes[i].analyze();
      if (result.result == 'return' || result.result == 'throw' || result.result == 'break' || result.result == 'continue') {
        return result;
      }
    }
  }
  return {
    result: 'normal'
  };
}

function handleError(node, message) {
  console.error(message + ' ' + currentFile + ':' + node.start.line + ':' + node.start.col);
}

function handleInternalError(message) {
  throw new Error('Internal Error: ' + message +
    ' This is a bug. Please report it to the project author');
}

function enterContext(config) {
  stack.push({
    symbolTable: {},
    expectedReturnType: config && config.expectedReturnType
  });
}

function exitContext() {
  stack.pop();
}

function getCurrentContext() {
  return stack[stack.length - 1];
}

function lookupType(name) {
  var i,
      type;
  for (i = stack.length - 1; i >= 0; i--) {
    type = stack[i].symbolTable[name];
    if (type) {
      return type;
    }
  }
}

function addType(name, type) {
  getCurrentContext().symbolTable[name] = type;
}
