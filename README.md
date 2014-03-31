CommaScript
===========

CommaScript is a backwards compatible dialect of JavaScript that provides localized, implicit static typing in
JavaScript while still feeling like JavaScript.

**WARNING: This is a work in progress! The current version of the software is ALPHA quality**

**Update: I'm working on an overhaul of the type system. Check out the (non-functional) ```type_refactor``` branch. The documentation below reflects the eventual goal of the ```type_refactor``` branch**

## Table of Contents
* [Design Goals](#design-goals)
* [Compilation](#compilation)
* [Examples](#examples)
   * [Primitives](#primitives)
   * [Objects](#objects)
   * [Functions](#functions)
   * [Constructors](#constructors)
   * [Arrays](#arrays)
* [Interfaces](#interfaces)
* [Scoping](#scoping)
* [Future Goals](#future-goals)
* [License](#license)

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

### Primitives

To create a variable typed as a primitive, simply give that variable an initial value:

```JavaScript
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

If we try and access a non-existent property, perhaps because we mistyped its
name, then CommaScript will also generate an error:

```JavaScript
obj.bax = 10;
```

### Functions

Functions are declared implicitly, just like objects:

```JavaScript
function foo(a, b) {
    return a * b;
}
```

CommaScript will infer the return type and the argument type(s), if any. In this example, the two arguments are being multiplied together, which means that the arguments must both be numbers. Two numbers multiplied together produces another number, so the return type must be a number.

Functions that return undefined in JavaScript are considered by CommaScript to not have a value, akin to void in C/C++. Trying to assign the return value of a "void" function is an error in CommaScript.

Functions are called as normal, but with type checking.

```JavaScript
// This will work fine
foo(1, 2);

// As will this
var r = 0;
r += foo(1, 2);

// But not this
foo('hello', 'world');

// Or this
var s = '';
s = foo(1, 2);
```

But what happens if the types cannot be inferred, such as with the example below?

```JavaScript
function foo(a, b) {
    return a + b; // Everything can be added together, since everything can be converted to a string
}
```

All you have to do is leave the definition ambiguous. This introduces a new concept in CommaScript: generics. Generics in CommaScript work similarly to [generics in Java](http://en.wikipedia.org/wiki/Generics_in_Java) or [templates in C++](http://en.wikipedia.org/wiki/Template_%28C%2B%2B%29). The type of the arguments and/or return type are determined by how the function is invoked:

```JavaScript
function foo(a, b) {
    return a + b;
}

 // Arguments and x are set to type "number"
var x = foo(1, 2);

// First argument is set to type "number", second argument and y are set to type "string"
var y = foo(1, '2');

// x and y are still statically typed
x = 'hello'; // Generates an error
y = false; // Generates an error
```

### Constructors

Instantiable objects (things you create with ```new```) are supported in CommaScript. What differentiates a constructor from a regular function is that a constructor must have at least one property declared on its prototype.

```JavaScript
function foo(arg) {
    this.arg = arg;
}
foo.prototype.getArg = function() {
    return this.arg;
}

// Then we can create an object
var a = new foo(10);

// And access its methods
var b = 5 + a.getArg();

// But only if they exist
var c = a.fail; // Generates an error

// And the types are correct
var d = false && a.getArg(); // Generates an error

// The call to the object constructor must also be typed correctly
var e = new foo(); // Generates an error
```

Important note: in CommaScript, object constructors MUST be invoked using the ```new``` operator, and function calls MUST NOT be called using the ```new``` operator. Doing so will generate an error.

### Arrays

Arrays are considerably restricted compared to normal JavaScript arrays. Every element in a CommaScript array must be of a homogeneous type:

```JavaScript
var foo = [1, 2, 3]; // Creates an array of numbers

// Then we can do
foo.push(4);

// We can also do
foo[4] = 5;

// But not
foo[5] = 'hello world';

// Or
foo.bar = 'baz';
```

## Interfaces

There are some instances where the above syntax is not flexible enough. This is where we introduce the concept of interfaces in CommaScript. An interface specifies a _named_ or _unnamed_ type that can be used in a number of circumstances.

An interface is defined using a special syntax that uses the comma operator (also called the sequence operator). In case you were wondering, this is where CommaScript gets its name. An interface definition has the following structure:

```JavaScript
('define(object|function|array, typename)', definition);
```

Complementing interface definitions are cast statements:

```JavaScript
('cast(typename)', value)
```

As a motivating example, what if we want to declare an object and give it an initial value of ```null```? Since we cannot infer the object type from ```null```, we create an named object type and then cast ```null``` to that type.

```JavaScript
'use commascript';

('define(object, MyObject)', {
    properties: {
        'bar': 'string',
        'baz': 'number'
    }
});

var obj = ('cast(MyObject)', null);
```

We can later assign an instance of the object to the variable:

```JavaScript
obj = {
    'bar': 'hello world',
    'baz': 10
};
```

Remember back to the case where function definitions are ambiguous. What if you don't want your function to be generic? You can create an named function type and then define a function with the same name:

```JavaScript
('define(function, MyFunction)', {
    returnType: 'number',
    argumentTypes: [
        'number',
        'number'
    ]
});

var foo = ('cast(MyFunction)', function (a, b) {
    return a + b;
});

// Then you can do
var x = 5 + foo(1, 2);

// But not
var y = '';
y = foo(1, '2');
```

We can also specify a constructor interface:

```JavaScript
('define(constructor, MyConstructor)', {
    argumentTypes: [
        'string'
    ],
    properties: {
        getArg: ('define(function)', {
            returnType: 'string'
        })
    }
});

var foo = ('cast(MyConstructor)', function (arg) {
    this.arg = arg;
}
foo.prototype.getArg = function() {
    return this.arg;
}

// Then we can create an object
var a = new foo('Hello');
```

A new feature is introduced inside the interface definition, an unnamed type. An unnamed type definition is an interface definition that is used inside of a comma declaration. Any define or cast operation that takes a named type can also take an inlined unnamed type definition.

What do you do if you want to create an empty array? In this case the array type cannot be inferred, so you created a named array type:

```JavaScript
('define(array, MyArray)', {
   elementType: 'number'
});

var foo = ('cast(MyArray)', []);

foo.push(10);
```

## Scoping

CommaScript code is localized to the current _block_ and must be enabled with a using directive, just like strict mode:

```JavaScript
'use commascript';
```

This means that you can mix and match CommaScript code with non-CommaScript code:

```JavaScript
function foo() {
    var x = true;
    x = 10;
    if (x) {
        return true;
    }
    return 'hello';
}

function bar() {
    'use commascript';
    var x = 10;
    return x && false; // Generates an error
}

foo(); // Generates no errors
bar();
```

You can also localize CommaScript to non-function blocks:

```JavaScript
if (strict) {
    'use commascript';
    var x = 10;
    x = 'fail'; // Generates an error
} else {
    var x = 10;
    x = 'fail'; // Does NOT generate an error
}
```

Once a block is declared as being CommaScript, all inner blocks are also CommaScript:

```JavaScript
function foo() {
    'use commascript';
    function bar() {
        // This is also CommaScript code
    }
    bar();
}
```

So how do you call a CommaScript function from non-CommaScript code? Create a CommaScript block that contains the function and create named types for the function and arguments, if any. It is up to the programmer to ensure that CommaScript code is being called correctly:

```JavaScript

{
    'use commascript';

    ('define(object, MyCommaScriptObject)', {
        properties: {
            foo: 'string',
            bar: 'string'
        }
    });

    ('define(function, MyCommaScriptFunction)', {
        returnType: 'string',
        argumentTypes: [
            'number',
            'MyCommaScriptObject'
        ]
    });

    var myFunction = ('cast(MyCommaScriptFunction)', function(num, obj) {
        // Do stuff
        return 'hello';
    });
}

myFunction(10, {
    foo: 'foo',
    bar: 'bar'
});
```

You can also declare commascript just inside of a function, which causes the function to be treated as a generic function:

```JavaScript
function myFunction(num, obj) {
    'use commascript';
    // Do stuff
    return 'hello';
}

myFunction(10, {
    foo: 'foo',
    bar: 'bar'
});
```

If you want the function to have stricter type checking, the use the former method way of declaring commascript code.

Conversely, how do you call a non-CommaScript function from CommaScript code? Just create a named type for the non-CommaScript function. It is up to the programmer to ensure that the non-CommaScript function conforms to the named type.

```JavaScript
'use commascript';

('extern(object, console)', {
    properties: {
        log: ('define(function), {
            argumentTypes: [
                'string'
            ]
        }),
        warn: ('define(function), {
            argumentTypes: [
                'string'
            ]
        }),
        error: ('define(function), {
            argumentTypes: [
                'string'
            ]
        })
    }
});

console.log('hi');
```

This latest example introduces a new trick: extern instance definitions. An extern definition has the same syntax as an object type definition, with the difference being that externs cannot be used in cast definitions and do not require an instantiation. Think of it like ```extern``` in C/C++.

When creating an extern type, it is not necessary to create a 100% complete definition for it. Indeed this would be impossible for most external objects because they do not conform to CommaScript interface restrictions. It is advisable to only define what you need to use from the extern object/function.

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

Copyright (c) 2013-2014 Bryan Hughes bryan@theoreticalideations.com (https://theoreticalideations.com)

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
