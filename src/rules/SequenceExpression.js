/*
The MIT License (MIT)

Copyright (c) 2013-2014 Bryan Hughes <bryan@theoreticalideations.com>

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
import { enterState, exitState, states, addNamedType, lookupNamedType } from '../state.js';
import { handleError } from '../error.js';
import { InvalidType, ObjectType } from '../type.js'

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
    return new InvalidType({ node: node });
  }

  var commaOperation = node.expressions[0];
  var commaBody = node.expressions[1];

  if (commaOperation.type != 'Literal' || typeof commaOperation.value != 'string') {
    handleError(commaOperation, 'Expected a string');
    return new InvalidType({ node: commaOperation });
  }

  var parsedCommaOperation = operationRegex.exec(commaOperation.value);
  if (!parsedCommaOperation) {
    handleError(commaOperation, 'Invalid comma operation syntax');
    return new InvalidType({ node: commaOperation });
  }
  var commaOperationType = parsedCommaOperation[1];
  var commaOperationParameters = parsedCommaOperation[2].split(',').map(param => param.trim());

  switch (commaOperationType) {
    case 'define':
      if (commaOperationParameters.length != 2) {
        handleError(commaOperation, 'Expected two arguments to "define", received ' +
          commaOperationParameters.length);
        return new InvalidType({ node: commaOperation });
      }
      if (lookupNamedType(commaOperationParameters[1])) {
        handleError(commaOperation, 'Attempt to redefine already defined type');
        return new InvalidType({ node: commaOperation });
      }
      switch(commaOperationParameters[0]) {
        case 'object':
          parseObjectDefinition(commaOperationParameters[1], commaBody);
          break;
        case 'function':
          parseFunctionDefinition(commaOperationParameters[1], commaBody);
          break;
        case 'constructor':
          parseConstructorDefinition(commaOperationParameters[1], commaBody);
          break;
        default:
          handleError(commaOperation, 'Unknown definition type "' + commaOperationParameters[0] + '"');
          return new InvalidType({ node: commaOperation });
      }
      break;
    case 'cast':
      throw new Error('Not Implemented');
      break;
    case 'extern':
      throw new Error('Not Implemented');
      break;
    default:
      handleError(commaOperation, 'Unknown comma operation type "' + commaOperationType, '"');
      return new InvalidType({ node: commaOperation });
  }

  exitState();
}

function parseObjectDefinition(name, commaBody) {
  if (commaBody.type != 'ObjectExpression') {
    handleError(commaBody, 'Expected an object');
    return new InvalidType({ node: commaBody });
  }
  var properties = {};
  for (var i = 0; i < commaBody.properties.length; i++) {
    var definitionProp = commaBody.properties[i];
    if (definitionProp.kind != 'init') {
      handleError(definitionProp, 'Getters and setters are not supported in comma definitions');
      return new InvalidType({ node: definitionProp });
    }
    if (definitionProp.key.name != 'properties') {
      handleError(definitionProp.key, 'Unknown definition property "' + definitionProp.key + '"');
      return new InvalidType({ node: definitionProp.key });
    }
    if (definitionProp.value.type != 'ObjectExpression') {
      handleError(definitionProp.value, 'Expected an object');
      return new InvalidType({ node: definitionProp.value });
    }
    for (var j = 0; j < definitionProp.value.properties.length; j++) {
      var typeProp = definitionProp.value.properties[j];
      if (typeProp.kind != 'init') {
        handleError(typeProp, 'Getters and setters are not supported in comma definitions');
        return new InvalidType({ node: typeProp });
      }
      if (typeProp.value.type != 'Literal' || typeof typeProp.value.value != 'string') {
        handleError(typeProp.value, 'Expected a named type');
        return new InvalidType({ node: typeProp.value });
      }
      if (properties[typeProp.key.value]) {
        handleError(typeProp.key, 'Duplicate property definition "' + typeProp.key.value + '"');
      }
      var propType = lookupNamedType(typeProp.value.value);
      if (!propType) {
        handleError(typeProp.value, 'Unknown type "' + typeProp.value.value + '"');
        return new InvalidType({ node: typeProp.value });
      }
      properties[typeProp.key.value] = propType;
    }
  }
  addNamedType(name, new ObjectType({
    name: name,
    properties: properties,
    node: commaBody
  }));
}

function parseFunctionDefinition(commaBody) {
  throw new Error('Not Implemented');
}

function parseConstructorDefinition(commaBody) {
  throw new Error('Not Implemented');
}
