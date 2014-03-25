CommaScript
===========

CommaScript is a backwards compatible dialect of JavaScript that provides localized, implicit static typing in
JavaScript while still feeling like JavaScript.

**WARNING: This is a work in progress! The current version of the software is ALPHA**

## Table of Contents
* [Design Goals](#design-goals)
* [Compilation](#compilation)
* [Examples](#examples)
* [Future Goals](#future-goals)

## Design Goals

There have been several attempts at providing static typing in JavaScript, such
as [TypeScript](http://www.typescriptlang.org/) and [Dart](http://www.dartlang.org/).
Both languages are great languages, but they suffer from one fatal flaw: they aren't
JavaScript!

Mozilla has another attempt at statically typed JavaScript called [asm.js](http://asmjs.org/)
which is a proper subset of JavaScript, meaning it will run in all JavaScript
engines, even the ones that don't support asm.js. The primary flaw with asm.js is
that it looks a lot like assembly, and isn't meant to be programmed in directly.

CommaScript aims to have the backwards compatibility of asm.js combined with the
expressiveness of TypeScript and Dart. Specifically, CommaScript has the
following goals
* 100% JavaScript compliant syntax
* Compiled and uncompiled CommaScript code is semantically identical
    * As a result, uncompiled CommaScript code runs the same as compiled code
* CommaScript code should still feel like JavaScript as much as possible
    * The type system should be an aid to developers, not get in their way

## Compilation

CommaScript code can be run through an analyzer that will verify the type correctness
of the code. To install the analyzer:

```
npm install commascript
```

To run the analyzer on foo.js

```
commascript foo.js
```

Any type errors are output to the terminal.

## Examples

For detailed specification information, view the [Formal Specification](grammar.md)

CommaScript code is localized to the current scope and must be enabled with a
using directive, just like strict mode:

```JavaScript
'use commascript';
```

### Primitives

To create a variable typed as a primitive, simply give that variable an initial value:

```JavaScript
'use commascript';

var x = 0;
```

Once defined, all other uses of x must be numerical:

```JavaScript
// This is allowed
x = 10;

// So is this
x++;

// And this
var y = x + 10;

// But this will generate a compile-time error
x = 'boo';
```

Note that undefined values are not allowed in CommaScript.

### Objects

When working with object literals, it's usually just as easy as working with
primitives:

```JavaScript
var obj = {
    'bar': 'hello world',
    'baz': 10
};
```

We can also set individual properties on the object:

```JavaScript
obj.bar = 'goodbye';
obj.baz = 20;
```

Objects and their properties are strictly typed, meaning that a compile time
error is generated if you try to assign the wrong type of value to a property:

```JavaScript
obj.bar = false;
```

If we try and access a non-existent error, perhaps because we mistyped a property
name, then CommaScript will also generate an error:

```JavaScript
obj.bax = 10;
```

What if we want to declare an object and give it an initial value of null? This is
where things get a little more complicated, and introduce a special syntax that uses
the comma operator (hence the name CommaScript). Before creating a null object, an
"interface" for the class must be defined, as such:

```JavaScript
'use commascript';

('define(object, foo)', {
    properties: {
        'bar': 'string',
        'baz': 'number'
    }
});
```

Once defined, the null value can be created:

```JavaScript
var obj = ('cast(foo)', null);
```

Notice how the "cast" operation is used to indicate what type of object the null
value represents. We can later assign an instance of the object to the variable:

```JavaScript
obj = {
    'bar': 'hello world',
    'baz': 10
};
```

### Objects with prototypes

Coming soon: constructor functions and prototypes will be statically typed
similar to how object literals are typed

### Functions

Functions are declared similarly to objects:

```JavaScript
('define(function, myfunctype)', {
    returnType: 'string',
    argumentTypes: [
        'number',
        'foo'
    ]
});
```

Once defined, functions can be assigned to a variable and used

```JavaScript
var myfunc = ('cast(myfunctype)', function (num, obj) {
    // Do stuff
    return 'hi';
}
```

Function definitions can also be used, as long as the function name matches the type name

```JavaScript
function myfunctype(num, obj) {
    // Do stuff
    return 'hi';
}
```

The return type and arguments are checked for type correctness, like everything else

```JavaScript
// This will work fine
foo(10, ('cast(foo)', {
    bar: 'Hello',
    baz: 0
}));

// As will this
var str = '';
str = foo(10, ('cast(foo)', {
    bar: 'Hello',
    baz: 0
}));

// But not this
foo('hello', 'world');
```

Coming soon: implicit declarations of functions!

### Array

Coming soon: Arrays will be homogeneous, with a pre-defined type

## Future Goals

Once the basic compiler is implemented and the spec solidified, there are a few other
goals for the project:
* Implement an LLVM frontend for CommaScript that will allow it to be compiled to
native code, or to asm.js
* Implement CommaScript definitions for a few well known libraries and APIs, such
as node.js and the browser DOM
    * These definitions will most likely be proper subsets of the full APIs
* Implement customized versions of CommonJS and RequireJS that can perform validation
of source files when they are require()'d

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
