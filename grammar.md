CommaScript Formal Specification
================================

This document describes formal specification for commascript.

Note: this specification is a work in progress.

## Grammar

This grammar is an extension of the JavaScript grammar as specified in [Standard ECMA-262 edition 5.1](http://www.ecma-international.org/publications/standards/Ecma-262.htm) (e.g. ES5). As such, this grammar does not reproduce grammar rules specified in ECMA-262. Each rule is listed as an extension to a rule in the ECMA-262 specification. Rules prefaced by ```CS``` are new to this spec, otherwise it is a rule from the ECMA-262 specification.

<pre>
<em>ExpressionStatement</em> :
    ...
    <em>CSDeclaration</em>
</pre>
We start off by injecting the CommaScript declaration rule into the standard ```ExpressionStatement``` rule. ```...``` indicates that we are adding ```CSDeclaration``` to the standard ```ExpressionStatement``` rule, and leaving all the other RHS productions intact.

<pre>
<em>CSDeclaration</em> :
    ( " <em>CSDeclarationDefinition</em> " , <em>CSDeclarationExpression</em> )

<em>CSDeclarationDefinition</em> :
    define , CSTypeClass , <em>Identifier</em>
    cast , <em>Identifier</em>

<em>CSTypeClass</em> :
    function
    object

<em>CSDeclarationExpression</em> :
    <em>CSDefineExpression</em>
    <em>CSCastExpression</em>
</pre>
Here we have the primary rules for a commascript declaration that can be either a define operation or a cast operation.

<pre>
<em>CSDefineExpression</em> :
    { CSPropertyNameAndValueList }
    { CSPropertyNameAndValueList , }

<em>CSPropertyNameAndValueList</em> :
    <em>CSPropertyAssignment</em>
    <em>CSPropertyNameAndValueList</em> , <em>CSPropertyAssignment</em>

<em>CSPropertyAssignment</em> :
    <em>PropertyName</em> : <em>AssignmentExpression</em>
</pre>
Define expressions are just object literals with a few extra restrictions. Specifically, empty objects and get/set properties are not allowed. The ```CSDefineExpression``` is a proper subset of the ```ObjectLiteral``` rule from clause 11.1.5. There are additional semantic requirements for ```CSDefineExpression``` defined below.

<pre>
<em>CSCastExpression</em> :
    null
</pre>
Cast expressions are pretty basic: you can only cast ```null``` values to an object type. This is the only type of casting that requires an explicit cast operation because all other types of casts can be inferred.

## Additional Semantics

### Declarations

There are additional restrictions on the _CSDefineExpression_ production declared above.

If _CSTypeClass_ is ```object```, then the following key-value pairs are supported:

* ```properties``` (object of strings): the properties of the object. Each key-value pair defines a single property, with the key being the name of the property, and the value being the type (a string). The type must be a previously declared type, or a built-in primitive (one of 'boolean', 'number', or 'string'). Defaults to an empty object.
* ```prototype``` (string): the type of the object's prototype. The type must be a previously declared type or the base object 'object'. Defaults to 'object'.
* ```constructorArgumentTypes``` (array of strings): The ordered array of constructor argument types. The type must be a previously declared type, or a built-in primitive (one of 'boolean', 'number', or 'string'). Defaults to an empty array.

If _CSTypeClass_ is ```function```, then the following key-value pairs are supported:
* ```returnType``` (string): The return type. The type must be a previously declared type, or a built-in primitive (one of 'boolean', 'number', or 'string'). Note that there is not officially any 'void' type, so if there is no return type, then do not specify a value. Defaults to no specified return type.
* ```argumentTypes``` (array of strings): The ordered array of function argument types. The type must be a previously declared type, or a built-in primitive (one of 'boolean', 'number', or 'string'). Defaults to an empty array.

Specifying a key-value pairs other than the ones listed above is considered a syntax error.

### Expression Semantics

Coming soon!