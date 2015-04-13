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

import { handleError, handleInternalError, getRelativeCurrentFile } from './state.js';

class Type {
  constructor(options) {
    this.name = options.name;
    this.node = options.node;
    this.declarationLocation = options.declarationLocation;
  }
}

export class BooleanType extends Type {
  constructor(options) {
    options.name = 'boolean';
    super(options);
  }
}

export class NumberType extends Type {
  constructor(options) {
    options.name = 'number';
    super(options);
  }
}

export class StringType extends Type {
  constructor(options) {
    options.name = 'string';
    super(options);
  }
}

export class RegExpType extends Type {
  constructor(options) {
    options.name = 'regexp'
    super(options);
  }
}

export class NullType extends Type {
  constructor(options) {
    options.name = 'null';
    super(options);
  }
}

export class ObjectType extends Type {
  constructor(options) {
    options.name = options.name || 'anonymous object';
    super(options);
    this.properties = options.properties || {};
    this.proto = options.proto || null;
  }
}

export class ArrayType extends Type {
  constructor(options) {
    options.name = options.name || 'anonymous array';
    super(options);
    if (!options || !options.elementType) {
      handleInternalError('Invalid options passed to ArrayType constructor.');
    }
    this.elementType = options.elementType;
  }
}

export class FunctionType extends Type {
  constructor(options) {
    options.name = options.name || 'anonymous function';
    super(options);
    this.argumentTypes = options.arguments || [];
    this.returnType = options.returnType || null;
  }
  applyCall(options) {
    throw new Error('Not Implemented');
  }
  applyCast(options) {
    throw new Error('Not Implemented');
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

export class InvalidType extends Type {
  constructor(options) {
    options.name = 'Invalid Type';
    super(options)
  }
}

export function isPrimitive(type) {
  return type instanceof BooleanType ||
    type instanceof NumberType || type instanceof StringType;
}

export function compareTypes(type1, type2, options) {

  if (!options || !options.node) {
    handleInternalError('Invalid options passed to compareTypes.');
  }
  if (type1 == type2) {
    return true;
  }

  function handleCompareError(errorMessage) {
    handleError(options.node, 'Cannot cast "' +
      type1.name + '" as "' + type2.name + '"' +
      (errorMessage ? ': ' + errorMessage : ''));
  }

  if (isPrimitive(type1) && isPrimitive(type2)) {
    if ((type1 instanceof BooleanType && type2 instanceof BooleanType) ||
      (type1 instanceof NumberType && type2 instanceof NumberType) ||
      (type1 instanceof StringType && type2 instanceof StringType)
    ) {
      return true;
    } else {
      handleCompareError();
      return false;
    }
  }

  var p;
  if (type1 instanceof ObjectType && type2 instanceof ObjectType) {
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
  if (type1 instanceof FunctionType && type2 instanceof FunctionType) {
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

  if (type1 instanceof ConstructorType && type2 instanceof ConstructorType) {
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
