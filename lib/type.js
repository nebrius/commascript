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

var _stateJs = require("./state.js");

var handleError = _stateJs.handleError;
var handleInternalError = _stateJs.handleInternalError;
var getRelativeCurrentFile = _stateJs.getRelativeCurrentFile;

// Note: this is a non-type that is used to represent the case where we couldn't
// determine the type because of an error

var ErrorType = exports.ErrorType = function ErrorType() {
  _classCallCheck(this, ErrorType);
};

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
//# sourceMappingURL=data:application/json;base64,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QywwREFBMEQsQ0FBQyxDQUFDO0FBQy9FLGFBQU8sS0FBSyxDQUFDO0tBQ2Q7QUFDRCxTQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQy9DLFVBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxFQUFFO0FBQzFFLDBCQUFrQixDQUFDLGFBQVksR0FBRyxDQUFDLEdBQUcsa0JBQWlCLENBQUMsQ0FBQztBQUN6RCxlQUFPLEtBQUssQ0FBQztPQUNkO0tBQ0Y7QUFDRCxXQUFPLElBQUksQ0FBQztHQUNiOztBQUVELFNBQU8sS0FBSyxDQUFDO0NBQ2QiLCJmaWxlIjoidHlwZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5UaGUgTUlUIExpY2Vuc2UgKE1JVClcblxuQ29weXJpZ2h0IChjKSAyMDEzLTIwMTQgQnJ5YW4gSHVnaGVzIDxicnlhbkB0aGVvcmV0aWNhbGlkZWF0aW9ucy5jb20+IChodHRwOi8vdGhlb3JldGljYWxpZGVhdGlvbnMuY29tKVxuXG5QZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG5vZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG5pbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG50byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG5jb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbmZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG5cblRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluXG5hbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cblxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG5GSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbkFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbkxJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG5PVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG5USEUgU09GVFdBUkUuXG4qL1xuXG5pbXBvcnQgeyBoYW5kbGVFcnJvciwgaGFuZGxlSW50ZXJuYWxFcnJvciwgZ2V0UmVsYXRpdmVDdXJyZW50RmlsZSB9IGZyb20gJy4vc3RhdGUuanMnO1xuXG4vLyBOb3RlOiB0aGlzIGlzIGEgbm9uLXR5cGUgdGhhdCBpcyB1c2VkIHRvIHJlcHJlc2VudCB0aGUgY2FzZSB3aGVyZSB3ZSBjb3VsZG4ndFxuLy8gZGV0ZXJtaW5lIHRoZSB0eXBlIGJlY2F1c2Ugb2YgYW4gZXJyb3JcbmV4cG9ydCBjbGFzcyBFcnJvclR5cGUge31cblxuY2xhc3MgVHlwZSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICB0aGlzLm5hbWUgPSBvcHRpb25zLm5hbWU7XG4gICAgdGhpcy5ub2RlID0gb3B0aW9ucy5ub2RlO1xuICAgIHRoaXMuZGVjbGFyYXRpb25Mb2NhdGlvbiA9IG9wdGlvbnMuZGVjbGFyYXRpb25Mb2NhdGlvbjtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQm9vbGVhblR5cGUgZXh0ZW5kcyBUeXBlIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIG9wdGlvbnMubmFtZSA9ICdib29sZWFuJztcbiAgICBzdXBlcihvcHRpb25zKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgTnVtYmVyVHlwZSBleHRlbmRzIFR5cGUge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgb3B0aW9ucy5uYW1lID0gJ251bWJlcic7XG4gICAgc3VwZXIob3B0aW9ucyk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFN0cmluZ1R5cGUgZXh0ZW5kcyBUeXBlIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIG9wdGlvbnMubmFtZSA9ICdzdHJpbmcnO1xuICAgIHN1cGVyKG9wdGlvbnMpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBSZWdFeHBUeXBlIGV4dGVuZHMgVHlwZSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zLm5hbWUgPSAncmVnZXhwJ1xuICAgIHN1cGVyKG9wdGlvbnMpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBOdWxsVHlwZSBleHRlbmRzIFR5cGUge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgb3B0aW9ucy5uYW1lID0gJ251bGwnO1xuICAgIHN1cGVyKG9wdGlvbnMpO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBPYmplY3RUeXBlIGV4dGVuZHMgVHlwZSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zLm5hbWUgPSBvcHRpb25zLm5hbWUgfHwgJ2Fub255bW91cyBvYmplY3QnO1xuICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIHRoaXMucHJvcGVydGllcyA9IG9wdGlvbnMucHJvcGVydGllcyB8fCB7fTtcbiAgICB0aGlzLnByb3RvID0gb3B0aW9ucy5wcm90byB8fCBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBcnJheVR5cGUgZXh0ZW5kcyBUeXBlIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIG9wdGlvbnMubmFtZSA9IG9wdGlvbnMubmFtZSB8fCAnYW5vbnltb3VzIGFycmF5JztcbiAgICBzdXBlcihvcHRpb25zKTtcbiAgICBpZiAoIW9wdGlvbnMgfHwgIW9wdGlvbnMuZWxlbWVudFR5cGUpIHtcbiAgICAgIGhhbmRsZUludGVybmFsRXJyb3IoJ0ludmFsaWQgb3B0aW9ucyBwYXNzZWQgdG8gQXJyYXlUeXBlIGNvbnN0cnVjdG9yLicpO1xuICAgIH1cbiAgICB0aGlzLmVsZW1lbnRUeXBlID0gb3B0aW9ucy5lbGVtZW50VHlwZTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRnVuY3Rpb25UeXBlIGV4dGVuZHMgVHlwZSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBvcHRpb25zLm5hbWUgPSBvcHRpb25zLm5hbWUgfHwgJ2Fub255bW91cyBmdW5jdGlvbic7XG4gICAgc3VwZXIob3B0aW9ucyk7XG4gICAgdGhpcy5hcmd1bWVudFR5cGVzID0gb3B0aW9ucy5hcmd1bWVudHMgfHwgW107XG4gICAgdGhpcy5yZXR1cm5UeXBlID0gb3B0aW9ucy5yZXR1cm5UeXBlIHx8IG51bGw7XG4gIH1cbiAgYXBwbHlDYWxsKG9wdGlvbnMpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBJbXBsZW1lbnRlZCcpO1xuICB9XG4gIGFwcGx5Q2FzdChvcHRpb25zKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgSW1wbGVtZW50ZWQnKTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ29uc3RydWN0b3JUeXBlIGV4dGVuZHMgVHlwZSB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBpZiAoIW9wdGlvbnMgfHwgIW9wdGlvbnMubmFtZSB8fCAhb3B0aW9ucy5pbnN0YW50aWF0ZWRUeXBlKSB7XG4gICAgICBoYW5kbGVJbnRlcm5hbEVycm9yKCdJbnZhbGlkIG9wdGlvbnMgcGFzc2VkIHRvIENvbnN0cnVjdG9yVHlwZSBjb25zdHJ1Y3Rvci4nKTtcbiAgICB9XG4gICAgc3VwZXIob3B0aW9ucy5uYW1lKTtcbiAgICB0aGlzLmFyZ3VtZW50VHlwZXMgPSBvcHRpb25zLmFyZ3VtZW50VHlwZXMgfHwgW107XG4gICAgdGhpcy5pbnN0YW50aWF0ZWRUeXBlID0gb3B0aW9ucy5pbnN0YW50aWF0ZWRUeXBlO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBJbnZhbGlkVHlwZSBleHRlbmRzIFR5cGUge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgb3B0aW9ucy5uYW1lID0gJ0ludmFsaWQgVHlwZSc7XG4gICAgc3VwZXIob3B0aW9ucylcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNQcmltaXRpdmUodHlwZSkge1xuICByZXR1cm4gdHlwZSBpbnN0YW5jZW9mIEJvb2xlYW5UeXBlIHx8XG4gICAgdHlwZSBpbnN0YW5jZW9mIE51bWJlclR5cGUgfHwgdHlwZSBpbnN0YW5jZW9mIFN0cmluZ1R5cGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21wYXJlVHlwZXModHlwZTEsIHR5cGUyLCBvcHRpb25zKSB7XG5cbiAgaWYgKCFvcHRpb25zIHx8ICFvcHRpb25zLm5vZGUpIHtcbiAgICBoYW5kbGVJbnRlcm5hbEVycm9yKCdJbnZhbGlkIG9wdGlvbnMgcGFzc2VkIHRvIGNvbXBhcmVUeXBlcy4nKTtcbiAgfVxuICBpZiAodHlwZTEgPT0gdHlwZTIpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZUNvbXBhcmVFcnJvcihlcnJvck1lc3NhZ2UpIHtcbiAgICBoYW5kbGVFcnJvcihvcHRpb25zLm5vZGUsICdDYW5ub3QgY2FzdCBcIicgK1xuICAgICAgdHlwZTEubmFtZSArICdcIiBhcyBcIicgKyB0eXBlMi5uYW1lICsgJ1wiJyArXG4gICAgICAoZXJyb3JNZXNzYWdlID8gJzogJyArIGVycm9yTWVzc2FnZSA6ICcnKSk7XG4gIH1cblxuICBpZiAoaXNQcmltaXRpdmUodHlwZTEpICYmIGlzUHJpbWl0aXZlKHR5cGUyKSkge1xuICAgIGlmICgodHlwZTEgaW5zdGFuY2VvZiBCb29sZWFuVHlwZSAmJiB0eXBlMiBpbnN0YW5jZW9mIEJvb2xlYW5UeXBlKSB8fFxuICAgICAgKHR5cGUxIGluc3RhbmNlb2YgTnVtYmVyVHlwZSAmJiB0eXBlMiBpbnN0YW5jZW9mIE51bWJlclR5cGUpIHx8XG4gICAgICAodHlwZTEgaW5zdGFuY2VvZiBTdHJpbmdUeXBlICYmIHR5cGUyIGluc3RhbmNlb2YgU3RyaW5nVHlwZSlcbiAgICApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBoYW5kbGVDb21wYXJlRXJyb3IoKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICB2YXIgcDtcbiAgaWYgKHR5cGUxIGluc3RhbmNlb2YgT2JqZWN0VHlwZSAmJiB0eXBlMiBpbnN0YW5jZW9mIE9iamVjdFR5cGUpIHtcbiAgICBpZiAoIWNvbXBhcmVUeXBlcyh0eXBlMS5wcm90bywgdHlwZTIucHJvdG8sIG9wdGlvbnMpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChPYmplY3Qua2V5cyh0eXBlMS5wcm9wZXJ0aWVzKS5sZW5ndGggIT0gT2JqZWN0LmtleXModHlwZTIucHJvcGVydGllcykubGVuZ3RoKSB7XG4gICAgICBoYW5kbGVDb21wYXJlRXJyb3IoJ09iamVjdHMgZG8gbm90IGNvbnRhaW4gdGhlIHNhbWUgbnVtYmVyIG9mIHByb3BlcnRpZXMnKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgZm9yIChwIGluIHR5cGUxLnByb3BlcnRpZXMpIHtcbiAgICAgIGlmICghdHlwZTIucHJvcGVydGllc1twXSkge1xuICAgICAgICBoYW5kbGVDb21wYXJlRXJyb3IoJ09iamVjdCB0eXBlIGlzIG1pc3NpbmcgcHJvcGVydHkgXCInICsgcCArICdcIicpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoIWNvbXBhcmVUeXBlcyh0eXBlMS5wcm9wZXJ0aWVzW3BdLCB0eXBlMi5wcm9wZXJ0aWVzW3BdLCBvcHRpb25zKSkge1xuICAgICAgICBoYW5kbGVDb21wYXJlRXJyb3IoJ1Byb3BlcnR5IFwiJyArIHAgKyAnXCIgdHlwZSBtaXNtYXRjaCcpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLy8gVE9ETzogTmVlZCB0byByZXRoaW5rIGluIHRlcm1zIG9mIHBhcnRpYWwgZGVmaW5pdGlvbnNcbiAgdmFyIGk7XG4gIGlmICh0eXBlMSBpbnN0YW5jZW9mIEZ1bmN0aW9uVHlwZSAmJiB0eXBlMiBpbnN0YW5jZW9mIEZ1bmN0aW9uVHlwZSkge1xuICAgIGlmICghY29tcGFyZVR5cGVzKHR5cGUxLnJldHVyblR5cGUsIHR5cGUyLnJldHVyblR5cGUsIG9wdGlvbnMpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICh0eXBlMS5hcmd1bWVudFR5cGVzLmxlbmd0aCAhPSB0eXBlMi5hcmd1bWVudFR5cGVzLmxlbmd0aCkge1xuICAgICAgaGFuZGxlQ29tcGFyZUVycm9yKCdGdW5jdGlvbnMgZG8gbm90IGNvbnRhaW4gdGhlIHNhbWUgbnVtYmVyIG9mIGFyZ3VtZW50cycpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBmb3IgKGkgPSAwOyBpIDwgdHlwZTEuYXJndW1lbnRUeXBlcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKCFjb21wYXJlVHlwZXModHlwZTEuYXJndW1lbnRUeXBlc1tpXSwgdHlwZTIuYXJndW1lbnRUeXBlc1tpXSwgb3B0aW9ucykpIHtcbiAgICAgICAgaGFuZGxlQ29tcGFyZUVycm9yKCdBcmd1bWVudCBcIicgKyBpICsgJ1wiIHR5cGUgbWlzbWF0Y2gnKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmICh0eXBlMSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yVHlwZSAmJiB0eXBlMiBpbnN0YW5jZW9mIENvbnN0cnVjdG9yVHlwZSkge1xuICAgIGlmICghY29tcGFyZVR5cGVzKHR5cGUxLmluc3RhbnRpYXRlZFR5cGUsIHR5cGUyLmluc3RhbnRpYXRlZFR5cGUsIG9wdGlvbnMpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmICh0eXBlMS5hcmd1bWVudFR5cGVzLmxlbmd0aCAhPSB0eXBlMi5hcmd1bWVudFR5cGVzLmxlbmd0aCkge1xuICAgICAgaGFuZGxlQ29tcGFyZUVycm9yKCdDb25zdHJ1Y3RvcnMgZG8gbm90IGNvbnRhaW4gdGhlIHNhbWUgbnVtYmVyIG9mIGFyZ3VtZW50cycpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBmb3IgKGkgPSAwOyBpIDwgdHlwZTEuYXJndW1lbnRUeXBlcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKCFjb21wYXJlVHlwZXModHlwZTEuYXJndW1lbnRUeXBlc1tpXSwgdHlwZTIuYXJndW1lbnRUeXBlc1tpXSwgb3B0aW9ucykpIHtcbiAgICAgICAgaGFuZGxlQ29tcGFyZUVycm9yKCdBcmd1bWVudCBcIicgKyBpICsgJ1wiIHR5cGUgbWlzbWF0Y2gnKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==