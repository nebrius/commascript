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
    state = require('../state'),
    type = require('../type');

uglify.AST_Binary.prototype.ruleName = 'AST_Binary';

uglify.AST_Binary.prototype.getType = function getType(operation) {
  var operator = this.operator,
      leftType = this.left.getType(operation),
      rightType = this.right.getType(operation),
      numberType = type.lookupType('number'),
      stringType = type.lookupType('string'),
      booleanType = type.lookupType('boolean');

  if (['*', '/', '%', '-', '<<', '>>', '>>>', '&', '|', '^'].indexOf(operator) != -1) {
    if (!type.compareTypes(leftType, numberType) && state.isContextCommaScript()) {
      state.handleError(this.left, 'Invalid type supplied to left-hand side of numeric operator: expected "number" but got "' +
        leftType.name + '"');
    }
    if(!type.compareTypes(rightType, numberType) && state.isContextCommaScript()) {
      state.handleError(this.right, 'Invalid type supplied to right-hand side of numeric operator: expected "number" but got "' +
        rightType.name + '"');
    }
    return numberType;
  } else if (operator == '+') {
    if (type.compareTypes(leftType, numberType) && type.compareTypes(rightType, numberType)) {
      return numberType;
    } else { // Everything is coercible to a string
      return stringType;
    }
  } else if (['<', '>', '<=', '>='].indexOf(operator) != -1) {
    if (!type.compareTypes(leftType, numberType) && state.isContextCommaScript()) {
      state.handleError(this.left, 'Invalid type supplied to left-hand side of numeric operator: expected "number" but got "' +
        leftType.name + '"');
    }
    if(!type.compareTypes(rightType, numberType) && state.isContextCommaScript()) {
      state.handleError(this.right, 'Invalid type supplied to right-hand side of numeric operator: expected "number" but got "' +
        rightType.name + '"');
    }
    return booleanType;
  } else if (['==', '===', '!=', '!=='].indexOf(operator) != -1) {
    if (!type.compareTypes(leftType, rightType) && state.isContextCommaScript()) {
      state.handleError(this.left, 'Mismatched comparison: right hand side type "' + rightType.name +
        '" cannot be compared to left hand side type "' + leftType.name + '"');
    }
    return booleanType;
  } else if (operator == 'in') {
    if (!type.compareTypes(leftType, stringType) && state.isContextCommaScript()) {
      state.handleError(this.left, 'Invalid type supplied to left-hand side of "in" operator: expected "string" but got "' +
        leftType.name + '"');
    }
    if ((
      type.compareTypes(rightType, booleanType) ||
      type.compareTypes(rightType, numberType) ||
      type.compareTypes(rightType, stringType)) &&
      state.isContextCommaScript()
    ) {
      state.handleError(this.right, 'Invalid type supplied to right-hand side of "in" operator: expected an object but got "' +
        rightType.name + '"');
    }
    return booleanType;
  } else if (operator == 'instanceof') {
    return booleanType;
  } else if (['&&', '||'].indexOf(operator) != -1) {
    if (!type.compareTypes(leftType, booleanType) && state.isContextCommaScript()) {
      state.handleError(this.left, 'Invalid type supplied to left-hand side of boolean operator: expected "boolean" but got "' +
        leftType.name + '"');
    }
    if(!type.compareTypes(rightType, booleanType) && state.isContextCommaScript()) {
      state.handleError(this.right, 'Invalid type supplied to right-hand side of boolean operator: expected "boolean" but got "' +
        rightType.name + '"');
    }
    return booleanType;
  } else {
    throw new Error('Internal Error: unsupported binary expression operation');
  }
};
