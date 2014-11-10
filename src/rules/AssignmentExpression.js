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

import { registerNodeProcessor, processNode } from '../node';
import { NumberType, StringType, InvalidType, compareTypes } from '../type';

registerNodeProcessor({

  name: 'AssignmentExpression',

  parseExpression(node) {
    debugger;
    switch(node.left.type) {
      case 'Identifier':
        var leftType = processNode(node.left);
        var rightType = processNode(node.right);
        if (leftType instanceof InvalidType || rightType instanceof InvalidType) {
          return leftType;
        }
        if (node.operator == '=') {
          compareTypes(leftType, processNode(node.right), {
            node: node.right
          });
          return leftType;
        } else {
          var intermediateType = processNode({
            type: 'BinaryExpression',
            operator: node.operator,
            left: node.left,
            right: node.right
          });
          if (intermediateType instanceof InvalidType) {
            return intermediateType;
          }
          compareTypes(leftType, intermediateType, {
            node: node.right
          });
          return leftType;
        }
      case 'ObjectPattern':
        throw new Error('Not Implemented');
        break;
      case 'ArrayPattern':
        throw new Error('Not Implemented');
        break;
      default:
        handleInternalError('Unknown pattern type ' + node.type);
    }
  },

  scan(node) {
    processNode(node.left);
    processNode(node.right);
  },

  declare(node) {
    throw new Error('Not Implemented');
  }

});
