CommaScript
=========

CommaScript is a dialect of JavaScript that provides localized strong typing in JavaScript that works in existing JavaScript engines

Types are specified at variable/function declaration time by specifying a tuple of values using the comma operator. The possible types are the basic JavaScript types (undefined, boolean, string, number, and object) plus array:

```JavaScript
"use commatype";

// Primitive data types are a simple tuple
var num = ('number', 10);

// Objects are specified in object literal notation
var obj = ('object', {
	foo: ('string', 'bar')
});

// Arrays must be homogeneous and are all of the specified type
var arr = ('string', []);

// Functions are more complex. The first entry is the return type, followed by an array of argument types
var z = ('string', ['int'], function (arg) {
	return parseInt(arg);
});
```

CommaScript code is local to the current scope and works just like strict mode with a "use commascript" directive.

License
=======

The MIT License (MIT)

Copyright (c) 2013 Bryan Hughes bryan@theoreticalideations.com (http://theoreticalideations.com)

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
