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

var util = require('util'),
    state = require('./state');

// TODO: remove IncompleteType, createTypeFromIncomplete, castIncompleteType

module.exports = {
  BooleanType: BooleanType,
  NumberType: NumberType,
  StringType: StringType,
  ObjectType: ObjectType,
  FunctionType: FunctionType,
  ConstructorType: ConstructorType,
  GenericType: GenericType,

  isBoolean: isBoolean,
  isNumber: isNumber,
  isString: isString,

  compareTypes: compareTypes
};

function Type(name) {
  this.name = name;
}

function BooleanType() {
  // TODO: look up proper way to call parent
  Type.call(this, 'boolean');
}
util.inherits(BooleanType, Type);

function NumberType() {
  Type.call(this, 'number');
}
util.inherits(NumberType, Type);

function StringType() {
  Type.call(this, 'string');
}
util.inherits(StringType, Type);

function ObjectType(options) {
  options = options || {};
  Type.call(this, options.name || 'anonymous object');
  this.properties = options.properties || {};
  this.proto = options.proto || null;
  this.constructorArgumentTypes = options.constructorArgumentTypes || [];
}
util.inherits(ObjectType, Type);

function FunctionType(options) {
  options = options || {};
  Type.call(this, options.name || 'anonymous function');
  this.argumentTypes = options.arguments || {};
  this.returnType = options.returnType;
}
util.inherits(FunctionType, Type);

function ConstructorType(options) {
  if (!options || !options.name) {
    state.handleInternalError('Invalid options passed to ConstructorType constructor.');
  }
  Type.call(this, options.name);
  this.argumentTypes = options.argumentTypes || {};
  this.properties = options.properties || {};
  this.proto = options.proto || null;
}
util.inherits(ConstructorType, Type);

function GenericType() {}
util.inherits(GenericType, Type);

function isBoolean(type) {
  return type instanceof BooleanType;
}

function isNumber(type) {
  return type instanceof NumberType;
}

function isString(type) {
  return type instanceof StringType;
}

function isPrimitive(type) {
  return isBoolean(type) || isNumber(type) || isString(type);
}

function compareTypes(type1, type2, node) {
  if (type1 == type2) {
    return true;
  } else if (isPrimitive(type1) && isPrimitive(type2)) {
    if ((isBoolean(type1) && isBoolean(type2)) ||
      (isNumber(type1) && isNumber(type2)) ||
      (isString(type1) && isString(type2))
    ) {
      return true;
    } else {
      state.handleError(node, 'Cannot cast "' + type1.name + '" as "' + type2.name + '"');
    }
  }
  // TODO: update below
  if (type1 == type2) {
    return true;
  } else if(type1.baseType == 'null') {
    return ['object', 'array', 'function'].indexOf(type2.baseType) != -1;
  } else if(type2.baseType == 'null') {
    return ['object', 'array', 'function'].indexOf(type1.baseType) != -1;
  }
  return false;
}

// TODO: update and merge with comapreTypes
function castIncompleteType(operation, node, incompleteType) {
  var definitionType = operation.name instanceof Type ? operation.name : lookupType(operation.name),
      p;
  incompleteType = incompleteType || node.getType(operation);
  if (!incompleteType || !operation.name) {
    return;
  }
  if (!definitionType) {
    state.handleError(node, 'Type "' + operation.name + '" does not exist');
    return;
  }
  if (incompleteType instanceof Type) {
    if (!compareTypes(incompleteType, definitionType)) {
      state.handleError(node, 'Cannot cast "' + incompleteType .name + '" as "' +
        definitionType.name + '"');
      return;
    }
    return incompleteType;
  } else if (incompleteType instanceof IncompleteType) {
    if (['object', 'array', 'function'].indexOf(definitionType.baseType) != -1 &&
      incompleteType.baseType == 'null'
    ) {
      return definitionType;
    }
    if (definitionType.baseType != incompleteType.baseType) {
      state.handleError(node, 'Could not cast reconcile types: incompatible base types');
      return;
    }
    switch(incompleteType.baseType) {
      case 'object':
        if (definitionType.proto) {
          state.handleError(node, 'Cannot cast inferred types to objects with prototypes');
          return;
        }
        if (definitionType.constructorArgumentTypes) {
          state.handleError(node, 'Cannot cast inferred types to objects with constructors');
          return;
        }
        for (p in definitionType.properties) {
          if (definitionType.properties.hasOwnProperty(p) &&
            !incompleteType.properties.hasOwnProperty(p)
          ) {
            state.handleError(node, 'Inferred type is missing property "' + p + '"');
            return;
          }
        }
        for (p in incompleteType.properties) {
          if (incompleteType.properties.hasOwnProperty(p)) {
            if (!definitionType.properties.hasOwnProperty(p)) {
              state.handleError(node, 'Inferred type has undeclared property "' + p + '"');
              return;
            }
            if (!compareTypes(definitionType.properties[p], incompleteType.properties[p])) {
              state.handleError(node, 'Inferred type has mismatched type for "' + p + '"');
              return;
            }
          }
        }
        return definitionType;
      case 'array':
        throw new Error('Not Implemented');
        break;
      case 'function':
        throw new Error('Not Implemented');
        break;
    }
  } else {
    state.handleInternalError('Invalid type passed to convertIncompleteType().');
  }
}
