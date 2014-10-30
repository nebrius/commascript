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

import { handleError, handleInternalError } from './state';

class Type {
  constructor(options) {
    this.name = options.name;
    this.declarationLocation = options.declarationLocation;
  }
}

export class BooleanType extends Type {
  constructor() {
    super({ name: 'boolean' });
  }
}

export class NumberType extends Type {
  constructor() {
    super({ name: 'number' });
  }
}

export class StringType extends Type {
  constructor() {
    super({ name: 'string' });
  }
}

export class ObjectType extends Type {
  constructor(options) {
    options = options || {};
    super(options.name || 'anonymous object');
    this.properties = options.properties || {};
    this.proto = options.proto || null;
  }
}

export class ArrayType extends Type {
  constructor() {
    if (!options || !options.elementType) {
    handleInternalError('Invalid options passed to ArrayType constructor.');
  }
  super(options.name || 'anonymous array');
  this.elementType = options.elementType;
  }
}

export class FunctionType extends Type {
  constructor(options) {
    if (!options || !options.node) {
      handleInternalError('Invalid options passed to FunctionType constructor.');
    }
    super(options.name || 'anonymous function');
    this.node = options.node;
    this.argumentTypes = options.arguments || [];
    this.returnType = options.returnType || null;
  }
  applyPattern(options) {
    if (!options || !options.argumentTypes || !options.returnType) {
      handleInternalError('Invalid options passed to FunctionType constructor.');
    }
    // TODO: This is called by call expressions to solidify types. Analayzes function at this point in time.
  }
}

export class ConstructorType extends Type {
  constructor(options) {
    if (!options || !options.name || !options.instantiatedType) {
      handleInternalError('Invalid options passed to ConstructorType constructor.');
    }
    super(options.name);
    this.argumentTypes = options.argumentTypes || [];
    this.instantiatedType = options.instantiatedType;
  }
}

export function isBoolean(type) {
  return type instanceof BooleanType;
}

export function isNumber(type) {
  return type instanceof NumberType;
}

export function isString(type) {
  return type instanceof StringType;
}

export function isPrimitive(type) {
  return isBoolean(type) || isNumber(type) || isString(type);
}

export function isObject(type) {
  return type instanceof ObjectType;
}

export function isArray(type) {
  return type instanceof ArrayType;
}

export function isFunction(type) {
  return type instanceof FunctionType;
}

export function isConstructor(type) {
  return type instanceof ConstructorType;
}

export function compareTypes(type1, type2, options) {

  if (!options || !options.node) {
    handleInternalError('Invalid options passed to compareTypes.');
  }
  if (type1 == type2) {
    return true;
  }

  function handleCompareError(errorMessage) {
    handleError(options.node, 'Cannot cast "' + type1.name + '" (declared at ' + type1.declarationLocation +
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
      handleCompareError();
      return false;
    }
  }

  var p;
  if (isObject(type1) && isObject(type2)) {
    if (!compareTypes(type1.proto, type2.proto, options)) {
      return false;
    }
    if (Object.keys(type1.properties).length != Object.keys(type2.properties).length) {
      handleCompareError('Objects do not contain the same number of properties');
      return false;
    }
    for (p in type1.properties) {
      if (!type2.properties[p]) {
        handleCompareError('Object type is missing property "' + p + '"');
        return false;
      }
      if (!compareTypes(type1.properties[p], type2.properties[p], options)) {
        handleCompareError('Property "' + p + '" type mismatch');
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
      handleCompareError('Functions do not contain the same number of arguments');
      return false;
    }
    for (i = 0; i < type1.argumentTypes.length; i++) {
      if (!compareTypes(type1.argumentTypes[i], type2.argumentTypes[i], options)) {
        handleCompareError('Argument "' + i + '" type mismatch');
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
      handleCompareError('Constructors do not contain the same number of arguments');
      return false;
    }
    for (i = 0; i < type1.argumentTypes.length; i++) {
      if (!compareTypes(type1.argumentTypes[i], type2.argumentTypes[i], options)) {
        handleCompareError('Argument "' + i + '" type mismatch');
        return false;
      }
    }
    return true;
  }

  return false;
}
