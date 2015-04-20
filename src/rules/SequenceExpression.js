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

import { registerNodeProcessor, processBlock } from '../node.js';
import { enterState, exitState, states, addNamedType } from '../state.js';
import { ErrorType } from '../type.js'

var operationRegex = /^\s*(.*?)\s*\((.*)\)$/;

registerNodeProcessor({

  name: 'SequenceExpression',

  parseExpression(node) {
    return handleExpression(node);
  },

  scan(node) {
    return processBlock(node.expressions);
  },

  declare(node) {
    return handleExpression(node);
  }

});

function handleExpression(node) {
  enterState(states.DECLARING);

  if (node.expressions.length != 2) {
    handleError(node, 'Invalid comma definition');
    return new ErrorType();
  }

  var commaOperation = node.expressions[0];
  var commaBody = node.expressions[1];

  if (commaOperation.type != 'Literal' || typeof commaOperation.value != 'string') {
    handleError(commaOperation, 'Expected a string');
    return new ErrorType();
  }

  var parsedCommaOperation = operationRegex.exec(commaOperation.value);
  if (!parsedCommaOperation) {
    handleError(commaOperation, 'Invalid comma operation syntax');
    return new ErrorType();
  }
  var commaOperationType = parsedCommaOperation[1];
  var commaOperationParameters = parsedCommaOperation[2].split(',').map(param => param.trim());

  switch (commaOperationType) {
    case 'define':
      if (commaOperationParameters.length != 2) {
        handleError(commaOperation, 'Expected two arguments to "define", received ' +
          commaOperationParameters.length);
        return new ErrorType();
      }
      var definitionType;
      switch(commaOperationParameters[0]) {
        case 'object':
          definitionType = parseObjectDefinition(commaBody);
          break;
        case 'function':
          definitionType = parseFunctionDefinition(commaBody);
          break;
        case 'constructor':
          definitionType = parseConstructorDefinition(commaBody);
          break;
        default:
          handleError(commaOperation, 'Unknown definition type "' + commaOperationParameters[0] + '"');
          return new ErrorType();
      }
      addNamedType(commaOperationParameters[1], definitionType);
      break;
    case 'cast':
      throw new Error('Not Implemented');
      break;
    case 'extern':
      throw new Error('Not Implemented');
      break;
    default:
      handleError(commaOperation, 'Unknown comma operation type "' + commaOperationType, '"');
      return new ErrorType();
  }

  exitState();
}

function parseObjectDefinition(commaBody) {
  throw new Error('Not Implemented');
}

function parseFunctionDefinition(commaBody) {
  throw new Error('Not Implemented');
}

function parseConstructorDefinition(commaBody) {
  throw new Error('Not Implemented');
}
