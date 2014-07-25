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

var state = require('./state');

module.exports = {
  BooleanType: BooleanType,
  NumberType: NumberType,
  StringType: StringType,
  ObjectType: ObjectType,
  ArrayType: ArrayType,
  FunctionType: FunctionType,
  ConstructorType: ConstructorType,

  isBoolean: isBoolean,
  isNumber: isNumber,
  isString: isString,
  isPrimitive: isPrimitive,
  isObject: isObject,
  isArray: isArray,
  isFunction: isFunction,
  isConstructor: isConstructor,

  compareTypes: compareTypes
};

function Type(options) {
  this.name = options.name;
  this.declarationLocation = options.declarationLocation;
}

function BooleanType() {
  Type.call(this, { name: 'boolean' });
}
BooleanType.prototype = Type;

function NumberType() {
  Type.call(this, { name: 'number' });
}
NumberType.prototype = Type;

function StringType() {
  Type.call(this, { name: 'string' });
}
StringType.prototype = Type;

function ObjectType(options) {
  options = options || {};
  Type.call(this, options.name || 'anonymous object');
  this.properties = options.properties || {};
  this.proto = options.proto || null;
}
ObjectType.prototype = Type;

function ArrayType(options) {
  if (!options || !options.elementType) {
    state.handleInternalError('Invalid options passed to ArrayType constructor.');
  }
  Type.call(this, options.name || 'anonymous array');
  this.elementType = options.elementType;
}
ArrayType.prototype = Type;

function FunctionType(options) {
  if (!options || !options.node) {
    state.handleInternalError('Invalid options passed to FunctionType constructor.');
  }
  Type.call(this, options.name || 'anonymous function');
  this.node = options.node;
  this.argumentTypes = options.arguments || [];
  this.returnType = options.returnType || null;
}
FunctionType.prototype = Type;
FunctionType.prototype.applyPattern = function evaluate(options) {
  if (!options || !options.argumentTypes || !options.returnType) {
    state.handleInternalError('Invalid options passed to FunctionType constructor.');
  }
  // TODO: This is called by call expressions to solidify types. Analayzes function at this point in time.
};

function ConstructorType(options) {
  if (!options || !options.name || !options.instantiatedType) {
    state.handleInternalError('Invalid options passed to ConstructorType constructor.');
  }
  Type.call(this, options.name);
  this.argumentTypes = options.argumentTypes || [];
  this.instantiatedType = options.instantiatedType;
}
ConstructorType.prototype = Type;

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

function isObject(type) {
  return type instanceof ObjectType;
}

function isArray(type) {
  return type instanceof ArrayType;
}

function isFunction(type) {
  return type instanceof FunctionType;
}

function isConstructor(type) {
  return type instanceof ConstructorType;
}

function compareTypes(type1, type2, options) {

  if (!options || !options.node) {
    state.handleInternalError('Invalid options passed to compareTypes.');
  }
  if (type1 == type2) {
    return true;
  }

  function handleError(errorMessage) {
    state.handleError(options.node, 'Cannot cast "' + type1.name + '" (declared at ' + type1.declarationLocation +
      ') as "' + type2.name + '" (declared at ' + type2.declarationLocation + ')' +
      (errorMessage ? ': ' + errorMessage : ''));
  }

  if (isPrimitive(type1) && isPrimitive(type2)) {
    if ((isBoolean(type1) && isBoolean(type2)) ||
      (isNumber(type1) && isNumber(type2)) ||
      (isString(type1) && isString(type2))
    ) {
      return true;
    } else {
      handleError();
      return false;
    }
  }

  var p;
  if (isObject(type1) && isObject(type2)) {
    if (!compareTypes(type1.proto, type2.proto, options)) {
      return false;
    }
    if (Object.keys(type1.properties).length != Object.keys(type2.properties).length) {
      handleError('Objects do not contain the same number of properties');
      return false;
    }
    for (p in type1.properties) {
      if (!type2.properties[p]) {
        handleError('Object type is missing property "' + p + '"');
        return false;
      }
      if (!compareTypes(type1.properties[p], type2.properties[p], options)) {
        handleError('Property "' + p + '" type mismatch');
        return false;
      }
    }
    return true;
  }

  // TODO: Need to rethink in terms of partial definitions
  var i;
  if (isFunction(type1) && isFunction(type2)) {
    if (!compareTypes(type1.returnType, type2.returnType, options)) {
      return false;
    }
    if (type1.argumentTypes.length != type2.argumentTypes.length) {
      handleError('Functions do not contain the same number of arguments');
      return false;
    }
    for (i = 0; i < type1.argumentTypes.length; i++) {
      if (!compareTypes(type1.argumentTypes[i], type2.argumentTypes[i], options)) {
        handleError('Argument "' + i + '" type mismatch');
        return false;
      }
    }
    return true;
  }

  if (isConstructor(type1) && isConstructor(type2)) {
    if (!compareTypes(type1.instantiatedType, type2.instantiatedType, options)) {
      return false;
    }
    if (type1.argumentTypes.length != type2.argumentTypes.length) {
      handleError('Constructors do not contain the same number of arguments');
      return false;
    }
    for (i = 0; i < type1.argumentTypes.length; i++) {
      if (!compareTypes(type1.argumentTypes[i], type2.argumentTypes[i], options)) {
        handleError('Argument "' + i + '" type mismatch');
        return false;
      }
    }
    return true;
  }

  return false;
}
