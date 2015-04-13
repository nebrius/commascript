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

import { handleInternalError, getState, states } from './state.js';

var processors = {};

export function isCommaScriptDirective(node) {
  return node.type == 'ExpressionStatement' &&
    node.expression.type == 'Literal' &&
    node.expression.value == 'use commascript';
}

export function registerNodeProcessor(processor) {
  processors[processor.name] = processor;
}

export function processNode(node) {
  var processor = processors[node.type];
  if (!processor) {
    handleInternalError('No processor for rule type ' + node.type);
  }
  switch (getState()) {
    case states.SCANNING:
      return processor.scan(node);
    case states.PARSING_STATEMENT:
      return processor.parseStatement(node);
    case states.PARSING_EXPRESSION:
      return processor.parseExpression(node);
    case states.DECLARING:
      return processor.declare(node);
    default:
      handleInternalError('Unknown or invalid state ' + getState() + ' in processNode');
  }
}

export function processBlock(nodes) {
  if (nodes) {
    switch(getState()) {
      case states.SCANNING:
        for (var i = 0, len = nodes.length; i < len; i++) {
          processNode(nodes[i].analyze());
        }
        break;
      case states.PARSING_STATEMENT:
        for (var i = 0, len = nodes.length; i < len; i++) {
          var result = processNode(nodes[i]);
          if (result.result == 'return' || result.result == 'throw' || result.result == 'break' || result.result == 'continue') {
            return result;
          }
        }
        break;
    default:
      handleInternalError('Unknown or invalid state ' + getState() + ' in processBlock');
    }
  }
  return {
    result: 'normal'
  };
}
