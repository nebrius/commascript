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

"use strict";

var _nodeJs = require("../node.js");

var registerNodeProcessor = _nodeJs.registerNodeProcessor;
var processBlock = _nodeJs.processBlock;

var _stateJs = require("../state.js");

var enterState = _stateJs.enterState;
var exitState = _stateJs.exitState;
var states = _stateJs.states;
var addNamedType = _stateJs.addNamedType;
var lookupNamedType = _stateJs.lookupNamedType;

var handleError = require("../error.js").handleError;

var _typeJs = require("../type.js");

var InvalidType = _typeJs.InvalidType;
var ObjectType = _typeJs.ObjectType;

var operationRegex = /^\s*(.*?)\s*\((.*)\)$/;

registerNodeProcessor({

  name: "SequenceExpression",

  parseExpression: function parseExpression(node) {
    return handleExpression(node);
  },

  scan: function scan(node) {
    return processBlock(node.expressions);
  },

  declare: function declare(node) {
    return handleExpression(node);
  }

});

function handleExpression(node) {
  enterState(states.DECLARING);

  if (node.expressions.length != 2) {
    handleError(node, "Invalid comma definition");
    return new InvalidType({ node: node });
  }

  var commaOperation = node.expressions[0];
  var commaBody = node.expressions[1];

  if (commaOperation.type != "Literal" || typeof commaOperation.value != "string") {
    handleError(commaOperation, "Expected a string");
    return new InvalidType({ node: commaOperation });
  }

  var parsedCommaOperation = operationRegex.exec(commaOperation.value);
  if (!parsedCommaOperation) {
    handleError(commaOperation, "Invalid comma operation syntax");
    return new InvalidType({ node: commaOperation });
  }
  var commaOperationType = parsedCommaOperation[1];
  var commaOperationParameters = parsedCommaOperation[2].split(",").map(function (param) {
    return param.trim();
  });

  switch (commaOperationType) {
    case "define":
      if (commaOperationParameters.length != 2) {
        handleError(commaOperation, "Expected two arguments to \"define\", received " + commaOperationParameters.length);
        return new InvalidType({ node: commaOperation });
      }
      if (lookupNamedType(commaOperationParameters[1])) {
        handleError(commaOperation, "Attempt to redefine already defined type");
        return new InvalidType({ node: commaOperation });
      }
      switch (commaOperationParameters[0]) {
        case "object":
          parseObjectDefinition(commaOperationParameters[1], commaBody);
          break;
        case "function":
          parseFunctionDefinition(commaOperationParameters[1], commaBody);
          break;
        case "constructor":
          parseConstructorDefinition(commaOperationParameters[1], commaBody);
          break;
        default:
          handleError(commaOperation, "Unknown definition type \"" + commaOperationParameters[0] + "\"");
          return new InvalidType({ node: commaOperation });
      }
      break;
    case "cast":
      throw new Error("Not Implemented");
      break;
    case "extern":
      throw new Error("Not Implemented");
      break;
    default:
      handleError(commaOperation, "Unknown comma operation type \"" + commaOperationType, "\"");
      return new InvalidType({ node: commaOperation });
  }

  exitState();
}

function parseObjectDefinition(name, commaBody) {
  if (commaBody.type != "ObjectExpression") {
    handleError(commaBody, "Expected an object");
    return new InvalidType({ node: commaBody });
  }
  var properties = {};
  for (var i = 0; i < commaBody.properties.length; i++) {
    var definitionProp = commaBody.properties[i];
    if (definitionProp.kind != "init") {
      handleError(definitionProp, "Getters and setters are not supported in comma definitions");
      return new InvalidType({ node: definitionProp });
    }
    if (definitionProp.key.name != "properties") {
      handleError(definitionProp.key, "Unknown definition property \"" + definitionProp.key + "\"");
      return new InvalidType({ node: definitionProp.key });
    }
    if (definitionProp.value.type != "ObjectExpression") {
      handleError(definitionProp.value, "Expected an object");
      return new InvalidType({ node: definitionProp.value });
    }
    for (var j = 0; j < definitionProp.value.properties.length; j++) {
      var typeProp = definitionProp.value.properties[j];
      if (typeProp.kind != "init") {
        handleError(typeProp, "Getters and setters are not supported in comma definitions");
        return new InvalidType({ node: typeProp });
      }
      if (typeProp.value.type != "Literal" || typeof typeProp.value.value != "string") {
        handleError(typeProp.value, "Expected a named type");
        return new InvalidType({ node: typeProp.value });
      }
      if (properties[typeProp.key.value]) {
        handleError(typeProp.key, "Duplicate property definition \"" + typeProp.key.value + "\"");
      }
      var propType = lookupNamedType(typeProp.value.value);
      if (!propType) {
        handleError(typeProp.value, "Unknown type \"" + typeProp.value.value + "\"");
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
  throw new Error("Not Implemented");
}

function parseConstructorDefinition(commaBody) {
  throw new Error("Not Implemented");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJ1bGVzL1NlcXVlbmNlRXhwcmVzc2lvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztzQkF3Qm9ELFlBQVk7O0lBQXZELHFCQUFxQixXQUFyQixxQkFBcUI7SUFBRSxZQUFZLFdBQVosWUFBWTs7dUJBQ2lDLGFBQWE7O0lBQWpGLFVBQVUsWUFBVixVQUFVO0lBQUUsU0FBUyxZQUFULFNBQVM7SUFBRSxNQUFNLFlBQU4sTUFBTTtJQUFFLFlBQVksWUFBWixZQUFZO0lBQUUsZUFBZSxZQUFmLGVBQWU7O0lBQzVELFdBQVcsV0FBUSxhQUFhLEVBQWhDLFdBQVc7O3NCQUNvQixZQUFZOztJQUEzQyxXQUFXLFdBQVgsV0FBVztJQUFFLFVBQVUsV0FBVixVQUFVOztBQUVoQyxJQUFJLGNBQWMsR0FBRyx1QkFBdUIsQ0FBQzs7QUFFN0MscUJBQXFCLENBQUM7O0FBRXBCLE1BQUksRUFBRSxvQkFBb0I7O0FBRTFCLGlCQUFlLEVBQUEseUJBQUMsSUFBSSxFQUFFO0FBQ3BCLFdBQU8sZ0JBQWdCLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDL0I7O0FBRUQsTUFBSSxFQUFBLGNBQUMsSUFBSSxFQUFFO0FBQ1QsV0FBTyxZQUFZLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0dBQ3ZDOztBQUVELFNBQU8sRUFBQSxpQkFBQyxJQUFJLEVBQUU7QUFDWixXQUFPLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO0dBQy9COztDQUVGLENBQUMsQ0FBQzs7QUFFSCxTQUFTLGdCQUFnQixDQUFDLElBQUksRUFBRTtBQUM5QixZQUFVLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDOztBQUU3QixNQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtBQUNoQyxlQUFXLENBQUMsSUFBSSxFQUFFLDBCQUEwQixDQUFDLENBQUM7QUFDOUMsV0FBTyxJQUFJLFdBQVcsQ0FBQyxFQUFFLElBQUks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YixtQkFBVyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsaUJBQWdCLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBRyxDQUFDLENBQUM7QUFDM0UsZUFBTyxJQUFJLFdBQVcsQ0FBQyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztPQUNsRDtBQUNELGdCQUFVLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxRQUFRLENBQUM7S0FDM0M7R0FDRjtBQUNELGNBQVksQ0FBQyxJQUFJLEVBQUUsSUFBSSxVQUFVLENBQUM7QUFDaEMsUUFBSSxFQUFFLElBQUk7QUFDVixjQUFVLEVBQUUsVUFBVTtBQUN0QixRQUFJLEVBQUUsU0FBUztHQUNoQixDQUFDLENBQUMsQ0FBQztDQUNMOztBQUVELFNBQVMsdUJBQXVCLENBQUMsU0FBUyxFQUFFO0FBQzFDLFFBQU0sSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsQ0FBQztDQUNwQzs7QUFFRCxTQUFTLDBCQUEwQixDQUFDLFNBQVMsRUFBRTtBQUM3QyxRQUFNLElBQUksS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7Q0FDcEMiLCJmaWxlIjoicnVsZXMvU2VxdWVuY2VFeHByZXNzaW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblRoZSBNSVQgTGljZW5zZSAoTUlUKVxuXG5Db3B5cmlnaHQgKGMpIDIwMTMtMjAxNCBCcnlhbiBIdWdoZXMgPGJyeWFuQHRoZW9yZXRpY2FsaWRlYXRpb25zLmNvbT5cblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuVEhFIFNPRlRXQVJFLlxuKi9cblxuaW1wb3J0IHsgcmVnaXN0ZXJOb2RlUHJvY2Vzc29yLCBwcm9jZXNzQmxvY2sgfSBmcm9tICcuLi9ub2RlLmpzJztcbmltcG9ydCB7IGVudGVyU3RhdGUsIGV4aXRTdGF0ZSwgc3RhdGVzLCBhZGROYW1lZFR5cGUsIGxvb2t1cE5hbWVkVHlwZSB9IGZyb20gJy4uL3N0YXRlLmpzJztcbmltcG9ydCB7IGhhbmRsZUVycm9yIH0gZnJvbSAnLi4vZXJyb3IuanMnO1xuaW1wb3J0IHsgSW52YWxpZFR5cGUsIE9iamVjdFR5cGUgfSBmcm9tICcuLi90eXBlLmpzJ1xuXG52YXIgb3BlcmF0aW9uUmVnZXggPSAvXlxccyooLio/KVxccypcXCgoLiopXFwpJC87XG5cbnJlZ2lzdGVyTm9kZVByb2Nlc3Nvcih7XG5cbiAgbmFtZTogJ1NlcXVlbmNlRXhwcmVzc2lvbicsXG5cbiAgcGFyc2VFeHByZXNzaW9uKG5vZGUpIHtcbiAgICByZXR1cm4gaGFuZGxlRXhwcmVzc2lvbihub2RlKTtcbiAgfSxcblxuICBzY2FuKG5vZGUpIHtcbiAgICByZXR1cm4gcHJvY2Vzc0Jsb2NrKG5vZGUuZXhwcmVzc2lvbnMpO1xuICB9LFxuXG4gIGRlY2xhcmUobm9kZSkge1xuICAgIHJldHVybiBoYW5kbGVFeHByZXNzaW9uKG5vZGUpO1xuICB9XG5cbn0pO1xuXG5mdW5jdGlvbiBoYW5kbGVFeHByZXNzaW9uKG5vZGUpIHtcbiAgZW50ZXJTdGF0ZShzdGF0ZXMuREVDTEFSSU5HKTtcblxuICBpZiAobm9kZS5leHByZXNzaW9ucy5sZW5ndGggIT0gMikge1xuICAgIGhhbmRsZUVycm9yKG5vZGUsICdJbnZhbGlkIGNvbW1hIGRlZmluaXRpb24nKTtcbiAgICByZXR1cm4gbmV3IEludmFsaWRUeXBlKHsgbm9kZTogbm9kZSB9KTtcbiAgfVxuXG4gIHZhciBjb21tYU9wZXJhdGlvbiA9IG5vZGUuZXhwcmVzc2lvbnNbMF07XG4gIHZhciBjb21tYUJvZHkgPSBub2RlLmV4cHJlc3Npb25zWzFdO1xuXG4gIGlmIChjb21tYU9wZXJhdGlvbi50eXBlICE9ICdMaXRlcmFsJyB8fCB0eXBlb2YgY29tbWFPcGVyYXRpb24udmFsdWUgIT0gJ3N0cmluZycpIHtcbiAgICBoYW5kbGVFcnJvcihjb21tYU9wZXJhdGlvbiwgJ0V4cGVjdGVkIGEgc3RyaW5nJyk7XG4gICAgcmV0dXJuIG5ldyBJbnZhbGlkVHlwZSh7IG5vZGU6IGNvbW1hT3BlcmF0aW9uIH0pO1xuICB9XG5cbiAgdmFyIHBhcnNlZENvbW1hT3BlcmF0aW9uID0gb3BlcmF0aW9uUmVnZXguZXhlYyhjb21tYU9wZXJhdGlvbi52YWx1ZSk7XG4gIGlmICghcGFyc2VkQ29tbWFPcGVyYXRpb24pIHtcbiAgICBoYW5kbGVFcnJvcihjb21tYU9wZXJhdGlvbiwgJ0ludmFsaWQgY29tbWEgb3BlcmF0aW9uIHN5bnRheCcpO1xuICAgIHJldHVybiBuZXcgSW52YWxpZFR5cGUoeyBub2RlOiBjb21tYU9wZXJhdGlvbiB9KTtcbiAgfVxuICB2YXIgY29tbWFPcGVyYXRpb25UeXBlID0gcGFyc2VkQ29tbWFPcGVyYXRpb25bMV07XG4gIHZhciBjb21tYU9wZXJhdGlvblBhcmFtZXRlcnMgPSBwYXJzZWRDb21tYU9wZXJhdGlvblsyXS5zcGxpdCgnLCcpLm1hcChwYXJhbSA9PiBwYXJhbS50cmltKCkpO1xuXG4gIHN3aXRjaCAoY29tbWFPcGVyYXRpb25UeXBlKSB7XG4gICAgY2FzZSAnZGVmaW5lJzpcbiAgICAgIGlmIChjb21tYU9wZXJhdGlvblBhcmFtZXRlcnMubGVuZ3RoICE9IDIpIHtcbiAgICAgICAgaGFuZGxlRXJyb3IoY29tbWFPcGVyYXRpb24sICdFeHBlY3RlZCB0d28gYXJndW1lbnRzIHRvIFwiZGVmaW5lXCIsIHJlY2VpdmVkICcgK1xuICAgICAgICAgIGNvbW1hT3BlcmF0aW9uUGFyYW1ldGVycy5sZW5ndGgpO1xuICAgICAgICByZXR1cm4gbmV3IEludmFsaWRUeXBlKHsgbm9kZTogY29tbWFPcGVyYXRpb24gfSk7XG4gICAgICB9XG4gICAgICBpZiAobG9va3VwTmFtZWRUeXBlKGNvbW1hT3BlcmF0aW9uUGFyYW1ldGVyc1sxXSkpIHtcbiAgICAgICAgaGFuZGxlRXJyb3IoY29tbWFPcGVyYXRpb24sICdBdHRlbXB0IHRvIHJlZGVmaW5lIGFscmVhZHkgZGVmaW5lZCB0eXBlJyk7XG4gICAgICAgIHJldHVybiBuZXcgSW52YWxpZFR5cGUoeyBub2RlOiBjb21tYU9wZXJhdGlvbiB9KTtcbiAgICAgIH1cbiAgICAgIHN3aXRjaChjb21tYU9wZXJhdGlvblBhcmFtZXRlcnNbMF0pIHtcbiAgICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgICBwYXJzZU9iamVjdERlZmluaXRpb24oY29tbWFPcGVyYXRpb25QYXJhbWV0ZXJzWzFdLCBjb21tYUJvZHkpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdmdW5jdGlvbic6XG4gICAgICAgICAgcGFyc2VGdW5jdGlvbkRlZmluaXRpb24oY29tbWFPcGVyYXRpb25QYXJhbWV0ZXJzWzFdLCBjb21tYUJvZHkpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdjb25zdHJ1Y3Rvcic6XG4gICAgICAgICAgcGFyc2VDb25zdHJ1Y3RvckRlZmluaXRpb24oY29tbWFPcGVyYXRpb25QYXJhbWV0ZXJzWzFdLCBjb21tYUJvZHkpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGhhbmRsZUVycm9yKGNvbW1hT3BlcmF0aW9uLCAnVW5rbm93biBkZWZpbml0aW9uIHR5cGUgXCInICsgY29tbWFPcGVyYXRpb25QYXJhbWV0ZXJzWzBdICsgJ1wiJyk7XG4gICAgICAgICAgcmV0dXJuIG5ldyBJbnZhbGlkVHlwZSh7IG5vZGU6IGNvbW1hT3BlcmF0aW9uIH0pO1xuICAgICAgfVxuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnY2FzdCc6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBJbXBsZW1lbnRlZCcpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnZXh0ZXJuJzpcbiAgICAgIHRocm93IG5ldyBFcnJvcignTm90IEltcGxlbWVudGVkJyk7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgaGFuZGxlRXJyb3IoY29tbWFPcGVyYXRpb24sICdVbmtub3duIGNvbW1hIG9wZXJhdGlvbiB0eXBlIFwiJyArIGNvbW1hT3BlcmF0aW9uVHlwZSwgJ1wiJyk7XG4gICAgICByZXR1cm4gbmV3IEludmFsaWRUeXBlKHsgbm9kZTogY29tbWFPcGVyYXRpb24gfSk7XG4gIH1cblxuICBleGl0U3RhdGUoKTtcbn1cblxuZnVuY3Rpb24gcGFyc2VPYmplY3REZWZpbml0aW9uKG5hbWUsIGNvbW1hQm9keSkge1xuICBpZiAoY29tbWFCb2R5LnR5cGUgIT0gJ09iamVjdEV4cHJlc3Npb24nKSB7XG4gICAgaGFuZGxlRXJyb3IoY29tbWFCb2R5LCAnRXhwZWN0ZWQgYW4gb2JqZWN0Jyk7XG4gICAgcmV0dXJuIG5ldyBJbnZhbGlkVHlwZSh7IG5vZGU6IGNvbW1hQm9keSB9KTtcbiAgfVxuICB2YXIgcHJvcGVydGllcyA9IHt9O1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbW1hQm9keS5wcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGRlZmluaXRpb25Qcm9wID0gY29tbWFCb2R5LnByb3BlcnRpZXNbaV07XG4gICAgaWYgKGRlZmluaXRpb25Qcm9wLmtpbmQgIT0gJ2luaXQnKSB7XG4gICAgICBoYW5kbGVFcnJvcihkZWZpbml0aW9uUHJvcCwgJ0dldHRlcnMgYW5kIHNldHRlcnMgYXJlIG5vdCBzdXBwb3J0ZWQgaW4gY29tbWEgZGVmaW5pdGlvbnMnKTtcbiAgICAgIHJldHVybiBuZXcgSW52YWxpZFR5cGUoeyBub2RlOiBkZWZpbml0aW9uUHJvcCB9KTtcbiAgICB9XG4gICAgaWYgKGRlZmluaXRpb25Qcm9wLmtleS5uYW1lICE9ICdwcm9wZXJ0aWVzJykge1xuICAgICAgaGFuZGxlRXJyb3IoZGVmaW5pdGlvblByb3Aua2V5LCAnVW5rbm93biBkZWZpbml0aW9uIHByb3BlcnR5IFwiJyArIGRlZmluaXRpb25Qcm9wLmtleSArICdcIicpO1xuICAgICAgcmV0dXJuIG5ldyBJbnZhbGlkVHlwZSh7IG5vZGU6IGRlZmluaXRpb25Qcm9wLmtleSB9KTtcbiAgICB9XG4gICAgaWYgKGRlZmluaXRpb25Qcm9wLnZhbHVlLnR5cGUgIT0gJ09iamVjdEV4cHJlc3Npb24nKSB7XG4gICAgICBoYW5kbGVFcnJvcihkZWZpbml0aW9uUHJvcC52YWx1ZSwgJ0V4cGVjdGVkIGFuIG9iamVjdCcpO1xuICAgICAgcmV0dXJuIG5ldyBJbnZhbGlkVHlwZSh7IG5vZGU6IGRlZmluaXRpb25Qcm9wLnZhbHVlIH0pO1xuICAgIH1cbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IGRlZmluaXRpb25Qcm9wLnZhbHVlLnByb3BlcnRpZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgIHZhciB0eXBlUHJvcCA9IGRlZmluaXRpb25Qcm9wLnZhbHVlLnByb3BlcnRpZXNbal07XG4gICAgICBpZiAodHlwZVByb3Aua2luZCAhPSAnaW5pdCcpIHtcbiAgICAgICAgaGFuZGxlRXJyb3IodHlwZVByb3AsICdHZXR0ZXJzIGFuZCBzZXR0ZXJzIGFyZSBub3Qgc3VwcG9ydGVkIGluIGNvbW1hIGRlZmluaXRpb25zJyk7XG4gICAgICAgIHJldHVybiBuZXcgSW52YWxpZFR5cGUoeyBub2RlOiB0eXBlUHJvcCB9KTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlUHJvcC52YWx1ZS50eXBlICE9ICdMaXRlcmFsJyB8fCB0eXBlb2YgdHlwZVByb3AudmFsdWUudmFsdWUgIT0gJ3N0cmluZycpIHtcbiAgICAgICAgaGFuZGxlRXJyb3IodHlwZVByb3AudmFsdWUsICdFeHBlY3RlZCBhIG5hbWVkIHR5cGUnKTtcbiAgICAgICAgcmV0dXJuIG5ldyBJbnZhbGlkVHlwZSh7IG5vZGU6IHR5cGVQcm9wLnZhbHVlIH0pO1xuICAgICAgfVxuICAgICAgaWYgKHByb3BlcnRpZXNbdHlwZVByb3Aua2V5LnZhbHVlXSkge1xuICAgICAgICBoYW5kbGVFcnJvcih0eXBlUHJvcC5rZXksICdEdXBsaWNhdGUgcHJvcGVydHkgZGVmaW5pdGlvbiBcIicgKyB0eXBlUHJvcC5rZXkudmFsdWUgKyAnXCInKTtcbiAgICAgIH1cbiAgICAgIHZhciBwcm9wVHlwZSA9IGxvb2t1cE5hbWVkVHlwZSh0eXBlUHJvcC52YWx1ZS52YWx1ZSk7XG4gICAgICBpZiAoIXByb3BUeXBlKSB7XG4gICAgICAgIGhhbmRsZUVycm9yKHR5cGVQcm9wLnZhbHVlLCAnVW5rbm93biB0eXBlIFwiJyArIHR5cGVQcm9wLnZhbHVlLnZhbHVlICsgJ1wiJyk7XG4gICAgICAgIHJldHVybiBuZXcgSW52YWxpZFR5cGUoeyBub2RlOiB0eXBlUHJvcC52YWx1ZSB9KTtcbiAgICAgIH1cbiAgICAgIHByb3BlcnRpZXNbdHlwZVByb3Aua2V5LnZhbHVlXSA9IHByb3BUeXBlO1xuICAgIH1cbiAgfVxuICBhZGROYW1lZFR5cGUobmFtZSwgbmV3IE9iamVjdFR5cGUoe1xuICAgIG5hbWU6IG5hbWUsXG4gICAgcHJvcGVydGllczogcHJvcGVydGllcyxcbiAgICBub2RlOiBjb21tYUJvZHlcbiAgfSkpO1xufVxuXG5mdW5jdGlvbiBwYXJzZUZ1bmN0aW9uRGVmaW5pdGlvbihjb21tYUJvZHkpIHtcbiAgdGhyb3cgbmV3IEVycm9yKCdOb3QgSW1wbGVtZW50ZWQnKTtcbn1cblxuZnVuY3Rpb24gcGFyc2VDb25zdHJ1Y3RvckRlZmluaXRpb24oY29tbWFCb2R5KSB7XG4gIHRocm93IG5ldyBFcnJvcignTm90IEltcGxlbWVudGVkJyk7XG59XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=