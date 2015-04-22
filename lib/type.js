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

var _errorJs = require("./error.js");

var handleError = _errorJs.handleError;
var handleInternalError = _errorJs.handleInternalError;

var Type = function Type(options) {
  _classCallCheck(this, Type);

  this.name = options.name;
  this.node = options.node;
};

// Note: this is a non-type that is used to represent the case where we couldn't
// determine the type because of an error

var InvalidType = exports.InvalidType = (function (_Type) {
  function InvalidType(options) {
    _classCallCheck(this, InvalidType);

    options.name = "invalid";
    _get(Object.getPrototypeOf(InvalidType.prototype), "constructor", this).call(this, options);
  }

  _inherits(InvalidType, _Type);

  return InvalidType;
})(Type);

var BooleanType = exports.BooleanType = (function (_Type2) {
  function BooleanType(options) {
    _classCallCheck(this, BooleanType);

    options.name = "boolean";
    _get(Object.getPrototypeOf(BooleanType.prototype), "constructor", this).call(this, options);
  }

  _inherits(BooleanType, _Type2);

  return BooleanType;
})(Type);

var NumberType = exports.NumberType = (function (_Type3) {
  function NumberType(options) {
    _classCallCheck(this, NumberType);

    options.name = "number";
    _get(Object.getPrototypeOf(NumberType.prototype), "constructor", this).call(this, options);
  }

  _inherits(NumberType, _Type3);

  return NumberType;
})(Type);

var StringType = exports.StringType = (function (_Type4) {
  function StringType(options) {
    _classCallCheck(this, StringType);

    options.name = "string";
    _get(Object.getPrototypeOf(StringType.prototype), "constructor", this).call(this, options);
  }

  _inherits(StringType, _Type4);

  return StringType;
})(Type);

var RegExpType = exports.RegExpType = (function (_Type5) {
  function RegExpType(options) {
    _classCallCheck(this, RegExpType);

    options.name = "regexp";
    _get(Object.getPrototypeOf(RegExpType.prototype), "constructor", this).call(this, options);
  }

  _inherits(RegExpType, _Type5);

  return RegExpType;
})(Type);

var NullType = exports.NullType = (function (_Type6) {
  function NullType(options) {
    _classCallCheck(this, NullType);

    options.name = "null";
    _get(Object.getPrototypeOf(NullType.prototype), "constructor", this).call(this, options);
  }

  _inherits(NullType, _Type6);

  return NullType;
})(Type);

var ObjectType = exports.ObjectType = (function (_Type7) {
  function ObjectType(options) {
    _classCallCheck(this, ObjectType);

    options.name = options.name || "anonymous object";
    _get(Object.getPrototypeOf(ObjectType.prototype), "constructor", this).call(this, options);
    this.properties = options.properties || {};
  }

  _inherits(ObjectType, _Type7);

  return ObjectType;
})(Type);

var ArrayType = exports.ArrayType = (function (_Type8) {
  function ArrayType(options) {
    _classCallCheck(this, ArrayType);

    options.name = options.name || "anonymous array";
    _get(Object.getPrototypeOf(ArrayType.prototype), "constructor", this).call(this, options);
    if (!options || !options.elementType) {
      handleInternalError("Invalid options passed to ArrayType constructor.");
    }
    this.elementType = options.elementType;
  }

  _inherits(ArrayType, _Type8);

  return ArrayType;
})(Type);

var FunctionType = exports.FunctionType = (function (_Type9) {
  function FunctionType(options) {
    _classCallCheck(this, FunctionType);

    options.name = options.name || "anonymous function";
    _get(Object.getPrototypeOf(FunctionType.prototype), "constructor", this).call(this, options);
    this.argumentTypes = options.arguments || [];
    this.returnType = options.returnType || null;
  }

  _inherits(FunctionType, _Type9);

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

var ConstructorType = exports.ConstructorType = (function (_Type10) {
  function ConstructorType(options) {
    _classCallCheck(this, ConstructorType);

    if (!options || !options.name || !options.instantiatedType) {
      handleInternalError("Invalid options passed to ConstructorType constructor.");
    }
    _get(Object.getPrototypeOf(ConstructorType.prototype), "constructor", this).call(this, options.name);
    this.argumentTypes = options.argumentTypes || [];
    this.instantiatedType = options.instantiatedType;
  }

  _inherits(ConstructorType, _Type10);

  return ConstructorType;
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
//# sourceMappingURL=data:application/json;base64,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LENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLEVBQUU7QUFDMUUsMEJBQWtCLENBQUMsYUFBWSxHQUFHLENBQUMsR0FBRyxrQkFBaUIsQ0FBQyxDQUFDO0FBQ3pELGVBQU8sS0FBSyxDQUFDO09BQ2Q7S0FDRjtBQUNELFdBQU8sSUFBSSxDQUFDO0dBQ2I7O0FBRUQsU0FBTyxLQUFLLENBQUM7Q0FDZCIsImZpbGUiOiJ0eXBlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLypcblRoZSBNSVQgTGljZW5zZSAoTUlUKVxuXG5Db3B5cmlnaHQgKGMpIDIwMTMtMjAxNCBCcnlhbiBIdWdoZXMgPGJyeWFuQHRoZW9yZXRpY2FsaWRlYXRpb25zLmNvbT4gKGh0dHA6Ly90aGVvcmV0aWNhbGlkZWF0aW9ucy5jb20pXG5cblBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbm9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbmluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbnRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbmNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcblxuVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbmFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG5JTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbkZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbk9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU5cblRIRSBTT0ZUV0FSRS5cbiovXG5cbmltcG9ydCB7IGhhbmRsZUVycm9yLCBoYW5kbGVJbnRlcm5hbEVycm9yIH0gZnJvbSAnLi9lcnJvci5qcyc7XG5cbmNsYXNzIFR5cGUge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgdGhpcy5uYW1lID0gb3B0aW9ucy5uYW1lO1xuICAgIHRoaXMubm9kZSA9IG9wdGlvbnMubm9kZTtcbiAgfVxufVxuXG4vLyBOb3RlOiB0aGlzIGlzIGEgbm9uLXR5cGUgdGhhdCBpcyB1c2VkIHRvIHJlcHJlc2VudCB0aGUgY2FzZSB3aGVyZSB3ZSBjb3VsZG4ndFxuLy8gZGV0ZXJtaW5lIHRoZSB0eXBlIGJlY2F1c2Ugb2YgYW4gZXJyb3JcbmV4cG9ydCBjbGFzcyBJbnZhbGlkVHlwZSBleHRlbmRzIFR5cGUge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgb3B0aW9ucy5uYW1lID0gJ2ludmFsaWQnO1xuICAgIHN1cGVyKG9wdGlvbnMpXG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEJvb2xlYW5UeXBlIGV4dGVuZHMgVHlwZSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zLm5hbWUgPSAnYm9vbGVhbic7XG4gICAgc3VwZXIob3B0aW9ucyk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIE51bWJlclR5cGUgZXh0ZW5kcyBUeXBlIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIG9wdGlvbnMubmFtZSA9ICdudW1iZXInO1xuICAgIHN1cGVyKG9wdGlvbnMpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBTdHJpbmdUeXBlIGV4dGVuZHMgVHlwZSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zLm5hbWUgPSAnc3RyaW5nJztcbiAgICBzdXBlcihvcHRpb25zKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgUmVnRXhwVHlwZSBleHRlbmRzIFR5cGUge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgb3B0aW9ucy5uYW1lID0gJ3JlZ2V4cCc7XG4gICAgc3VwZXIob3B0aW9ucyk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIE51bGxUeXBlIGV4dGVuZHMgVHlwZSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zLm5hbWUgPSAnbnVsbCc7XG4gICAgc3VwZXIob3B0aW9ucyk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIE9iamVjdFR5cGUgZXh0ZW5kcyBUeXBlIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIG9wdGlvbnMubmFtZSA9IG9wdGlvbnMubmFtZSB8fCAnYW5vbnltb3VzIG9iamVjdCc7XG4gICAgc3VwZXIob3B0aW9ucyk7XG4gICAgdGhpcy5wcm9wZXJ0aWVzID0gb3B0aW9ucy5wcm9wZXJ0aWVzIHx8IHt9O1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBcnJheVR5cGUgZXh0ZW5kcyBUeXBlIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIG9wdGlvbnMubmFtZSA9IG9wdGlvbnMubmFtZSB8fCAnYW5vbnltb3VzIGFycmF5JztcbiAgICBzdXBlcihvcHRpb25zKTtcbiAgICBpZiAoIW9wdGlvbnMgfHwgIW9wdGlvbnMuZWxlbWVudFR5cGUpIHtcbiAgICAgIGhhbmRsZUludGVybmFsRXJyb3IoJ0ludmFsaWQgb3B0aW9ucyBwYXNzZWQgdG8gQXJyYXlUeXBlIGNvbnN0cnVjdG9yLicpO1xuICAgIH1cbiAgICB0aGlzLmVsZW1lbnRUeXBlID0gb3B0aW9ucy5lbGVtZW50VHlwZTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRnVuY3Rpb25UeXBlIGV4dGVuZHMgVHlwZSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zLm5hbWUgPSBvcHRpb25zLm5hbWUgfHwgJ2Fub255bW91cyBmdW5jdGlvbic7XG4gICAgc3VwZXIob3B0aW9ucyk7XG4gICAgdGhpcy5hcmd1bWVudFR5cGVzID0gb3B0aW9ucy5hcmd1bWVudHMgfHwgW107XG4gICAgdGhpcy5yZXR1cm5UeXBlID0gb3B0aW9ucy5yZXR1cm5UeXBlIHx8IG51bGw7XG4gIH1cbiAgYXBwbHlDYWxsKG9wdGlvbnMpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBJbXBsZW1lbnRlZCcpO1xuICB9XG4gIGFwcGx5Q2FzdChvcHRpb25zKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgSW1wbGVtZW50ZWQnKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ29uc3RydWN0b3JUeXBlIGV4dGVuZHMgVHlwZSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBpZiAoIW9wdGlvbnMgfHwgIW9wdGlvbnMubmFtZSB8fCAhb3B0aW9ucy5pbnN0YW50aWF0ZWRUeXBlKSB7XG4gICAgICBoYW5kbGVJbnRlcm5hbEVycm9yKCdJbnZhbGlkIG9wdGlvbnMgcGFzc2VkIHRvIENvbnN0cnVjdG9yVHlwZSBjb25zdHJ1Y3Rvci4nKTtcbiAgICB9XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lKTtcbiAgICB0aGlzLmFyZ3VtZW50VHlwZXMgPSBvcHRpb25zLmFyZ3VtZW50VHlwZXMgfHwgW107XG4gICAgdGhpcy5pbnN0YW50aWF0ZWRUeXBlID0gb3B0aW9ucy5pbnN0YW50aWF0ZWRUeXBlO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1ByaW1pdGl2ZSh0eXBlKSB7XG4gIHJldHVybiB0eXBlIGluc3RhbmNlb2YgQm9vbGVhblR5cGUgfHxcbiAgICB0eXBlIGluc3RhbmNlb2YgTnVtYmVyVHlwZSB8fCB0eXBlIGluc3RhbmNlb2YgU3RyaW5nVHlwZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbXBhcmVUeXBlcyh0eXBlMSwgdHlwZTIsIG9wdGlvbnMpIHtcblxuICBpZiAoIW9wdGlvbnMgfHwgIW9wdGlvbnMubm9kZSkge1xuICAgIGhhbmRsZUludGVybmFsRXJyb3IoJ0ludmFsaWQgb3B0aW9ucyBwYXNzZWQgdG8gY29tcGFyZVR5cGVzLicpO1xuICB9XG4gIGlmICh0eXBlMSA9PSB0eXBlMikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlQ29tcGFyZUVycm9yKGVycm9yTWVzc2FnZSkge1xuICAgIGhhbmRsZUVycm9yKG9wdGlvbnMubm9kZSwgJ0Nhbm5vdCBjYXN0IFwiJyArXG4gICAgICB0eXBlMS5uYW1lICsgJ1wiIGFzIFwiJyArIHR5cGUyLm5hbWUgKyAnXCInICtcbiAgICAgIChlcnJvck1lc3NhZ2UgPyAnOiAnICsgZXJyb3JNZXNzYWdlIDogJycpKTtcbiAgfVxuXG4gIGlmIChpc1ByaW1pdGl2ZSh0eXBlMSkgJiYgaXNQcmltaXRpdmUodHlwZTIpKSB7XG4gICAgaWYgKCh0eXBlMSBpbnN0YW5jZW9mIEJvb2xlYW5UeXBlICYmIHR5cGUyIGluc3RhbmNlb2YgQm9vbGVhblR5cGUpIHx8XG4gICAgICAodHlwZTEgaW5zdGFuY2VvZiBOdW1iZXJUeXBlICYmIHR5cGUyIGluc3RhbmNlb2YgTnVtYmVyVHlwZSkgfHxcbiAgICAgICh0eXBlMSBpbnN0YW5jZW9mIFN0cmluZ1R5cGUgJiYgdHlwZTIgaW5zdGFuY2VvZiBTdHJpbmdUeXBlKVxuICAgICkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhhbmRsZUNvbXBhcmVFcnJvcigpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHZhciBwO1xuICBpZiAodHlwZTEgaW5zdGFuY2VvZiBPYmplY3RUeXBlICYmIHR5cGUyIGluc3RhbmNlb2YgT2JqZWN0VHlwZSkge1xuICAgIGlmICghY29tcGFyZVR5cGVzKHR5cGUxLnByb3RvLCB0eXBlMi5wcm90bywgb3B0aW9ucykpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKE9iamVjdC5rZXlzKHR5cGUxLnByb3BlcnRpZXMpLmxlbmd0aCAhPSBPYmplY3Qua2V5cyh0eXBlMi5wcm9wZXJ0aWVzKS5sZW5ndGgpIHtcbiAgICAgIGhhbmRsZUNvbXBhcmVFcnJvcignT2JqZWN0cyBkbyBub3QgY29udGFpbiB0aGUgc2FtZSBudW1iZXIgb2YgcHJvcGVydGllcycpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBmb3IgKHAgaW4gdHlwZTEucHJvcGVydGllcykge1xuICAgICAgaWYgKCF0eXBlMi5wcm9wZXJ0aWVzW3BdKSB7XG4gICAgICAgIGhhbmRsZUNvbXBhcmVFcnJvcignT2JqZWN0IHR5cGUgaXMgbWlzc2luZyBwcm9wZXJ0eSBcIicgKyBwICsgJ1wiJyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmICghY29tcGFyZVR5cGVzKHR5cGUxLnByb3BlcnRpZXNbcF0sIHR5cGUyLnByb3BlcnRpZXNbcF0sIG9wdGlvbnMpKSB7XG4gICAgICAgIGhhbmRsZUNvbXBhcmVFcnJvcignUHJvcGVydHkgXCInICsgcCArICdcIiB0eXBlIG1pc21hdGNoJyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyBUT0RPOiBOZWVkIHRvIHJldGhpbmsgaW4gdGVybXMgb2YgcGFydGlhbCBkZWZpbml0aW9uc1xuICB2YXIgaTtcbiAgaWYgKHR5cGUxIGluc3RhbmNlb2YgRnVuY3Rpb25UeXBlICYmIHR5cGUyIGluc3RhbmNlb2YgRnVuY3Rpb25UeXBlKSB7XG4gICAgaWYgKCFjb21wYXJlVHlwZXModHlwZTEucmV0dXJuVHlwZSwgdHlwZTIucmV0dXJuVHlwZSwgb3B0aW9ucykpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHR5cGUxLmFyZ3VtZW50VHlwZXMubGVuZ3RoICE9IHR5cGUyLmFyZ3VtZW50VHlwZXMubGVuZ3RoKSB7XG4gICAgICBoYW5kbGVDb21wYXJlRXJyb3IoJ0Z1bmN0aW9ucyBkbyBub3QgY29udGFpbiB0aGUgc2FtZSBudW1iZXIgb2YgYXJndW1lbnRzJyk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGZvciAoaSA9IDA7IGkgPCB0eXBlMS5hcmd1bWVudFR5cGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoIWNvbXBhcmVUeXBlcyh0eXBlMS5hcmd1bWVudFR5cGVzW2ldLCB0eXBlMi5hcmd1bWVudFR5cGVzW2ldLCBvcHRpb25zKSkge1xuICAgICAgICBoYW5kbGVDb21wYXJlRXJyb3IoJ0FyZ3VtZW50IFwiJyArIGkgKyAnXCIgdHlwZSBtaXNtYXRjaCcpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKHR5cGUxIGluc3RhbmNlb2YgQ29uc3RydWN0b3JUeXBlICYmIHR5cGUyIGluc3RhbmNlb2YgQ29uc3RydWN0b3JUeXBlKSB7XG4gICAgaWYgKCFjb21wYXJlVHlwZXModHlwZTEuaW5zdGFudGlhdGVkVHlwZSwgdHlwZTIuaW5zdGFudGlhdGVkVHlwZSwgb3B0aW9ucykpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHR5cGUxLmFyZ3VtZW50VHlwZXMubGVuZ3RoICE9IHR5cGUyLmFyZ3VtZW50VHlwZXMubGVuZ3RoKSB7XG4gICAgICBoYW5kbGVDb21wYXJlRXJyb3IoJ0NvbnN0cnVjdG9ycyBkbyBub3QgY29udGFpbiB0aGUgc2FtZSBudW1iZXIgb2YgYXJndW1lbnRzJyk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGZvciAoaSA9IDA7IGkgPCB0eXBlMS5hcmd1bWVudFR5cGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoIWNvbXBhcmVUeXBlcyh0eXBlMS5hcmd1bWVudFR5cGVzW2ldLCB0eXBlMi5hcmd1bWVudFR5cGVzW2ldLCBvcHRpb25zKSkge1xuICAgICAgICBoYW5kbGVDb21wYXJlRXJyb3IoJ0FyZ3VtZW50IFwiJyArIGkgKyAnXCIgdHlwZSBtaXNtYXRjaCcpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9