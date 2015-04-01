"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

exports.isPrimitive = isPrimitive;
exports.compareTypes = compareTypes;
Object.defineProperty(exports, "__esModule", {
  value: true
});
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

var _state = require("./state");

var handleError = _state.handleError;
var handleInternalError = _state.handleInternalError;
var getRelativeCurrentFile = _state.getRelativeCurrentFile;

var Type = function Type(options) {
  _classCallCheck(this, Type);

  this.name = options.name;
  this.node = options.node;
  this.declarationLocation = options.declarationLocation;
};

var BooleanType = exports.BooleanType = (function (_Type) {
  function BooleanType(options) {
    _classCallCheck(this, BooleanType);

    options.name = "boolean";
    _get(Object.getPrototypeOf(BooleanType.prototype), "constructor", this).call(this, options);
  }

  _inherits(BooleanType, _Type);

  return BooleanType;
})(Type);

var NumberType = exports.NumberType = (function (_Type2) {
  function NumberType(options) {
    _classCallCheck(this, NumberType);

    options.name = "number";
    _get(Object.getPrototypeOf(NumberType.prototype), "constructor", this).call(this, options);
  }

  _inherits(NumberType, _Type2);

  return NumberType;
})(Type);

var StringType = exports.StringType = (function (_Type3) {
  function StringType(options) {
    _classCallCheck(this, StringType);

    options.name = "string";
    _get(Object.getPrototypeOf(StringType.prototype), "constructor", this).call(this, options);
  }

  _inherits(StringType, _Type3);

  return StringType;
})(Type);

var RegExpType = exports.RegExpType = (function (_Type4) {
  function RegExpType(options) {
    _classCallCheck(this, RegExpType);

    options.name = "regexp";
    _get(Object.getPrototypeOf(RegExpType.prototype), "constructor", this).call(this, options);
  }

  _inherits(RegExpType, _Type4);

  return RegExpType;
})(Type);

var NullType = exports.NullType = (function (_Type5) {
  function NullType(options) {
    _classCallCheck(this, NullType);

    options.name = "null";
    _get(Object.getPrototypeOf(NullType.prototype), "constructor", this).call(this, options);
  }

  _inherits(NullType, _Type5);

  return NullType;
})(Type);

var ObjectType = exports.ObjectType = (function (_Type6) {
  function ObjectType(options) {
    _classCallCheck(this, ObjectType);

    options.name = options.name || "anonymous object";
    _get(Object.getPrototypeOf(ObjectType.prototype), "constructor", this).call(this, options);
    this.properties = options.properties || {};
    this.proto = options.proto || null;
  }

  _inherits(ObjectType, _Type6);

  return ObjectType;
})(Type);

var ArrayType = exports.ArrayType = (function (_Type7) {
  function ArrayType(options) {
    _classCallCheck(this, ArrayType);

    options.name = options.name || "anonymous array";
    _get(Object.getPrototypeOf(ArrayType.prototype), "constructor", this).call(this, options);
    if (!options || !options.elementType) {
      handleInternalError("Invalid options passed to ArrayType constructor.");
    }
    this.elementType = options.elementType;
  }

  _inherits(ArrayType, _Type7);

  return ArrayType;
})(Type);

var FunctionType = exports.FunctionType = (function (_Type8) {
  function FunctionType(options) {
    _classCallCheck(this, FunctionType);

    options.name = options.name || "anonymous function";
    _get(Object.getPrototypeOf(FunctionType.prototype), "constructor", this).call(this, options);
    this.argumentTypes = options.arguments || [];
    this.returnType = options.returnType || null;
  }

  _inherits(FunctionType, _Type8);

  _createClass(FunctionType, {
    applyCall: {
      value: function applyCall(options) {
        throw new Error("Not Implemented");
      }
    },
    applyCast: {
      value: function applyCast(options) {
        throw new Error("Not Implemented");
      }
    }
  });

  return FunctionType;
})(Type);

var ConstructorType = exports.ConstructorType = (function (_Type9) {
  function ConstructorType(options) {
    _classCallCheck(this, ConstructorType);

    if (!options || !options.name || !options.instantiatedType) {
      handleInternalError("Invalid options passed to ConstructorType constructor.");
    }
    _get(Object.getPrototypeOf(ConstructorType.prototype), "constructor", this).call(this, options.name);
    this.argumentTypes = options.argumentTypes || [];
    this.instantiatedType = options.instantiatedType;
  }

  _inherits(ConstructorType, _Type9);

  return ConstructorType;
})(Type);

var InvalidType = exports.InvalidType = (function (_Type10) {
  function InvalidType(options) {
    _classCallCheck(this, InvalidType);

    options.name = "Invalid Type";
    _get(Object.getPrototypeOf(InvalidType.prototype), "constructor", this).call(this, options);
  }

  _inherits(InvalidType, _Type10);

  return InvalidType;
})(Type);

function isPrimitive(type) {
  return type instanceof BooleanType || type instanceof NumberType || type instanceof StringType;
}

function compareTypes(type1, type2, options) {

  if (!options || !options.node) {
    handleInternalError("Invalid options passed to compareTypes.");
  }
  if (type1 == type2) {
    return true;
  }

  function handleCompareError(errorMessage) {
    handleError(options.node, "Cannot cast \"" + type1.name + "\" as \"" + type2.name + "\"" + (errorMessage ? ": " + errorMessage : ""));
  }

  if (isPrimitive(type1) && isPrimitive(type2)) {
    if (type1 instanceof BooleanType && type2 instanceof BooleanType || type1 instanceof NumberType && type2 instanceof NumberType || type1 instanceof StringType && type2 instanceof StringType) {
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
      handleCompareError("Objects do not contain the same number of properties");
      return false;
    }
    for (p in type1.properties) {
      if (!type2.properties[p]) {
        handleCompareError("Object type is missing property \"" + p + "\"");
        return false;
      }
      if (!compareTypes(type1.properties[p], type2.properties[p], options)) {
        handleCompareError("Property \"" + p + "\" type mismatch");
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
      handleCompareError("Functions do not contain the same number of arguments");
      return false;
    }
    for (i = 0; i < type1.argumentTypes.length; i++) {
      if (!compareTypes(type1.argumentTypes[i], type2.argumentTypes[i], options)) {
        handleCompareError("Argument \"" + i + "\" type mismatch");
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
      handleCompareError("Constructors do not contain the same number of arguments");
      return false;
    }
    for (i = 0; i < type1.argumentTypes.length; i++) {
      if (!compareTypes(type1.argumentTypes[i], type2.argumentTypes[i], options)) {
        handleCompareError("Argument \"" + i + "\" type mismatch");
        return false;
      }
    }
    return true;
  }

  return false;
}
//# sourceMappingURL=data:application/json;base64,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Q0QsU0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUMvQyxVQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsRUFBRTtBQUMxRSwwQkFBa0IsQ0FBQyxhQUFZLEdBQUcsQ0FBQyxHQUFHLGtCQUFpQixDQUFDLENBQUM7QUFDekQsZUFBTyxLQUFLLENBQUM7T0FDZDtLQUNGO0FBQ0QsV0FBTyxJQUFJLENBQUM7R0FDYjs7QUFFRCxTQUFPLEtBQUssQ0FBQztDQUNkIiwiZmlsZSI6InR5cGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuVGhlIE1JVCBMaWNlbnNlIChNSVQpXG5cbkNvcHlyaWdodCAoYykgMjAxMy0yMDE0IEJyeWFuIEh1Z2hlcyA8YnJ5YW5AdGhlb3JldGljYWxpZGVhdGlvbnMuY29tPiAoaHR0cDovL3RoZW9yZXRpY2FsaWRlYXRpb25zLmNvbSlcblxuUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxub2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbFxuaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0c1xudG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLCBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbFxuY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdCBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzXG5mdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlIGZvbGxvd2luZyBjb25kaXRpb25zOlxuXG5UaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG5cblRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1JcbklNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG5BVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG5MSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuVEhFIFNPRlRXQVJFLlxuKi9cblxuaW1wb3J0IHsgaGFuZGxlRXJyb3IsIGhhbmRsZUludGVybmFsRXJyb3IsIGdldFJlbGF0aXZlQ3VycmVudEZpbGUgfSBmcm9tICcuL3N0YXRlJztcblxuY2xhc3MgVHlwZSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICB0aGlzLm5hbWUgPSBvcHRpb25zLm5hbWU7XG4gICAgdGhpcy5ub2RlID0gb3B0aW9ucy5ub2RlO1xuICAgIHRoaXMuZGVjbGFyYXRpb25Mb2NhdGlvbiA9IG9wdGlvbnMuZGVjbGFyYXRpb25Mb2NhdGlvbjtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQm9vbGVhblR5cGUgZXh0ZW5kcyBUeXBlIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIG9wdGlvbnMubmFtZSA9ICdib29sZWFuJztcbiAgICBzdXBlcihvcHRpb25zKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTnVtYmVyVHlwZSBleHRlbmRzIFR5cGUge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgb3B0aW9ucy5uYW1lID0gJ251bWJlcic7XG4gICAgc3VwZXIob3B0aW9ucyk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFN0cmluZ1R5cGUgZXh0ZW5kcyBUeXBlIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIG9wdGlvbnMubmFtZSA9ICdzdHJpbmcnO1xuICAgIHN1cGVyKG9wdGlvbnMpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBSZWdFeHBUeXBlIGV4dGVuZHMgVHlwZSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zLm5hbWUgPSAncmVnZXhwJ1xuICAgIHN1cGVyKG9wdGlvbnMpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBOdWxsVHlwZSBleHRlbmRzIFR5cGUge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgb3B0aW9ucy5uYW1lID0gJ251bGwnO1xuICAgIHN1cGVyKG9wdGlvbnMpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBPYmplY3RUeXBlIGV4dGVuZHMgVHlwZSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zLm5hbWUgPSBvcHRpb25zLm5hbWUgfHwgJ2Fub255bW91cyBvYmplY3QnO1xuICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIHRoaXMucHJvcGVydGllcyA9IG9wdGlvbnMucHJvcGVydGllcyB8fCB7fTtcbiAgICB0aGlzLnByb3RvID0gb3B0aW9ucy5wcm90byB8fCBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBcnJheVR5cGUgZXh0ZW5kcyBUeXBlIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIG9wdGlvbnMubmFtZSA9IG9wdGlvbnMubmFtZSB8fCAnYW5vbnltb3VzIGFycmF5JztcbiAgICBzdXBlcihvcHRpb25zKTtcbiAgICBpZiAoIW9wdGlvbnMgfHwgIW9wdGlvbnMuZWxlbWVudFR5cGUpIHtcbiAgICAgIGhhbmRsZUludGVybmFsRXJyb3IoJ0ludmFsaWQgb3B0aW9ucyBwYXNzZWQgdG8gQXJyYXlUeXBlIGNvbnN0cnVjdG9yLicpO1xuICAgIH1cbiAgICB0aGlzLmVsZW1lbnRUeXBlID0gb3B0aW9ucy5lbGVtZW50VHlwZTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRnVuY3Rpb25UeXBlIGV4dGVuZHMgVHlwZSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zLm5hbWUgPSBvcHRpb25zLm5hbWUgfHwgJ2Fub255bW91cyBmdW5jdGlvbic7XG4gICAgc3VwZXIob3B0aW9ucyk7XG4gICAgdGhpcy5hcmd1bWVudFR5cGVzID0gb3B0aW9ucy5hcmd1bWVudHMgfHwgW107XG4gICAgdGhpcy5yZXR1cm5UeXBlID0gb3B0aW9ucy5yZXR1cm5UeXBlIHx8IG51bGw7XG4gIH1cbiAgYXBwbHlDYWxsKG9wdGlvbnMpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBJbXBsZW1lbnRlZCcpO1xuICB9XG4gIGFwcGx5Q2FzdChvcHRpb25zKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgSW1wbGVtZW50ZWQnKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ29uc3RydWN0b3JUeXBlIGV4dGVuZHMgVHlwZSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBpZiAoIW9wdGlvbnMgfHwgIW9wdGlvbnMubmFtZSB8fCAhb3B0aW9ucy5pbnN0YW50aWF0ZWRUeXBlKSB7XG4gICAgICBoYW5kbGVJbnRlcm5hbEVycm9yKCdJbnZhbGlkIG9wdGlvbnMgcGFzc2VkIHRvIENvbnN0cnVjdG9yVHlwZSBjb25zdHJ1Y3Rvci4nKTtcbiAgICB9XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lKTtcbiAgICB0aGlzLmFyZ3VtZW50VHlwZXMgPSBvcHRpb25zLmFyZ3VtZW50VHlwZXMgfHwgW107XG4gICAgdGhpcy5pbnN0YW50aWF0ZWRUeXBlID0gb3B0aW9ucy5pbnN0YW50aWF0ZWRUeXBlO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBJbnZhbGlkVHlwZSBleHRlbmRzIFR5cGUge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgb3B0aW9ucy5uYW1lID0gJ0ludmFsaWQgVHlwZSc7XG4gICAgc3VwZXIob3B0aW9ucylcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNQcmltaXRpdmUodHlwZSkge1xuICByZXR1cm4gdHlwZSBpbnN0YW5jZW9mIEJvb2xlYW5UeXBlIHx8XG4gICAgdHlwZSBpbnN0YW5jZW9mIE51bWJlclR5cGUgfHwgdHlwZSBpbnN0YW5jZW9mIFN0cmluZ1R5cGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21wYXJlVHlwZXModHlwZTEsIHR5cGUyLCBvcHRpb25zKSB7XG5cbiAgaWYgKCFvcHRpb25zIHx8ICFvcHRpb25zLm5vZGUpIHtcbiAgICBoYW5kbGVJbnRlcm5hbEVycm9yKCdJbnZhbGlkIG9wdGlvbnMgcGFzc2VkIHRvIGNvbXBhcmVUeXBlcy4nKTtcbiAgfVxuICBpZiAodHlwZTEgPT0gdHlwZTIpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZUNvbXBhcmVFcnJvcihlcnJvck1lc3NhZ2UpIHtcbiAgICBoYW5kbGVFcnJvcihvcHRpb25zLm5vZGUsICdDYW5ub3QgY2FzdCBcIicgK1xuICAgICAgdHlwZTEubmFtZSArICdcIiBhcyBcIicgKyB0eXBlMi5uYW1lICsgJ1wiJyArXG4gICAgICAoZXJyb3JNZXNzYWdlID8gJzogJyArIGVycm9yTWVzc2FnZSA6ICcnKSk7XG4gIH1cblxuICBpZiAoaXNQcmltaXRpdmUodHlwZTEpICYmIGlzUHJpbWl0aXZlKHR5cGUyKSkge1xuICAgIGlmICgodHlwZTEgaW5zdGFuY2VvZiBCb29sZWFuVHlwZSAmJiB0eXBlMiBpbnN0YW5jZW9mIEJvb2xlYW5UeXBlKSB8fFxuICAgICAgKHR5cGUxIGluc3RhbmNlb2YgTnVtYmVyVHlwZSAmJiB0eXBlMiBpbnN0YW5jZW9mIE51bWJlclR5cGUpIHx8XG4gICAgICAodHlwZTEgaW5zdGFuY2VvZiBTdHJpbmdUeXBlICYmIHR5cGUyIGluc3RhbmNlb2YgU3RyaW5nVHlwZSlcbiAgICApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBoYW5kbGVDb21wYXJlRXJyb3IoKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICB2YXIgcDtcbiAgaWYgKHR5cGUxIGluc3RhbmNlb2YgT2JqZWN0VHlwZSAmJiB0eXBlMiBpbnN0YW5jZW9mIE9iamVjdFR5cGUpIHtcbiAgICBpZiAoIWNvbXBhcmVUeXBlcyh0eXBlMS5wcm90bywgdHlwZTIucHJvdG8sIG9wdGlvbnMpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChPYmplY3Qua2V5cyh0eXBlMS5wcm9wZXJ0aWVzKS5sZW5ndGggIT0gT2JqZWN0LmtleXModHlwZTIucHJvcGVydGllcykubGVuZ3RoKSB7XG4gICAgICBoYW5kbGVDb21wYXJlRXJyb3IoJ09iamVjdHMgZG8gbm90IGNvbnRhaW4gdGhlIHNhbWUgbnVtYmVyIG9mIHByb3BlcnRpZXMnKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgZm9yIChwIGluIHR5cGUxLnByb3BlcnRpZXMpIHtcbiAgICAgIGlmICghdHlwZTIucHJvcGVydGllc1twXSkge1xuICAgICAgICBoYW5kbGVDb21wYXJlRXJyb3IoJ09iamVjdCB0eXBlIGlzIG1pc3NpbmcgcHJvcGVydHkgXCInICsgcCArICdcIicpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoIWNvbXBhcmVUeXBlcyh0eXBlMS5wcm9wZXJ0aWVzW3BdLCB0eXBlMi5wcm9wZXJ0aWVzW3BdLCBvcHRpb25zKSkge1xuICAgICAgICBoYW5kbGVDb21wYXJlRXJyb3IoJ1Byb3BlcnR5IFwiJyArIHAgKyAnXCIgdHlwZSBtaXNtYXRjaCcpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLy8gVE9ETzogTmVlZCB0byByZXRoaW5rIGluIHRlcm1zIG9mIHBhcnRpYWwgZGVmaW5pdGlvbnNcbiAgdmFyIGk7XG4gIGlmICh0eXBlMSBpbnN0YW5jZW9mIEZ1bmN0aW9uVHlwZSAmJiB0eXBlMiBpbnN0YW5jZW9mIEZ1bmN0aW9uVHlwZSkge1xuICAgIGlmICghY29tcGFyZVR5cGVzKHR5cGUxLnJldHVyblR5cGUsIHR5cGUyLnJldHVyblR5cGUsIG9wdGlvbnMpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICh0eXBlMS5hcmd1bWVudFR5cGVzLmxlbmd0aCAhPSB0eXBlMi5hcmd1bWVudFR5cGVzLmxlbmd0aCkge1xuICAgICAgaGFuZGxlQ29tcGFyZUVycm9yKCdGdW5jdGlvbnMgZG8gbm90IGNvbnRhaW4gdGhlIHNhbWUgbnVtYmVyIG9mIGFyZ3VtZW50cycpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBmb3IgKGkgPSAwOyBpIDwgdHlwZTEuYXJndW1lbnRUeXBlcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKCFjb21wYXJlVHlwZXModHlwZTEuYXJndW1lbnRUeXBlc1tpXSwgdHlwZTIuYXJndW1lbnRUeXBlc1tpXSwgb3B0aW9ucykpIHtcbiAgICAgICAgaGFuZGxlQ29tcGFyZUVycm9yKCdBcmd1bWVudCBcIicgKyBpICsgJ1wiIHR5cGUgbWlzbWF0Y2gnKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmICh0eXBlMSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yVHlwZSAmJiB0eXBlMiBpbnN0YW5jZW9mIENvbnN0cnVjdG9yVHlwZSkge1xuICAgIGlmICghY29tcGFyZVR5cGVzKHR5cGUxLmluc3RhbnRpYXRlZFR5cGUsIHR5cGUyLmluc3RhbnRpYXRlZFR5cGUsIG9wdGlvbnMpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICh0eXBlMS5hcmd1bWVudFR5cGVzLmxlbmd0aCAhPSB0eXBlMi5hcmd1bWVudFR5cGVzLmxlbmd0aCkge1xuICAgICAgaGFuZGxlQ29tcGFyZUVycm9yKCdDb25zdHJ1Y3RvcnMgZG8gbm90IGNvbnRhaW4gdGhlIHNhbWUgbnVtYmVyIG9mIGFyZ3VtZW50cycpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBmb3IgKGkgPSAwOyBpIDwgdHlwZTEuYXJndW1lbnRUeXBlcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKCFjb21wYXJlVHlwZXModHlwZTEuYXJndW1lbnRUeXBlc1tpXSwgdHlwZTIuYXJndW1lbnRUeXBlc1tpXSwgb3B0aW9ucykpIHtcbiAgICAgICAgaGFuZGxlQ29tcGFyZUVycm9yKCdBcmd1bWVudCBcIicgKyBpICsgJ1wiIHR5cGUgbWlzbWF0Y2gnKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==