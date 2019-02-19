# Nani
Better Error handling for Node, inspired in part by
[VError](https://www.npmjs.com/package/verror). Includes a base class for custom
error types, along with utilities for identifying your errors based on their
class hierarchy *without* relying on `instanceof`.

Makes it easier to tell what happened when things explode. :)


## The Cause Chain
Users of VError will be familiar with cause message chains, but for those that
are not, the idea is that errors can be given a `cause` when constructed. A
cause's message will be chained to the end of the wrapping error's message,
making it easy for a human programmer to get the full story at a glance.

Nani provides the `NaniError` class for this purpose, among other features:

```js
const { NaniError } = require('nani');

try {
	JSON.parse('invalid JSON');
} catch (err) {
	throw new NaniError({
		shortMessage: 'Parsing failed',
		cause: err
	});
}

/*
Running the above code produces something like the following:

NaniError: Parsing failed : Unexpected token i in JSON at position 0
    at Object.<anonymous> (/home/sripberger/projects/personal/nani/omg.js:6:8)
    at Module._compile (module.js:635:30)
    at Object.Module._extensions..js (module.js:646:10)
    at Module.load (module.js:554:32)
    at tryModuleLoad (module.js:497:12)
    at Function.Module._load (module.js:489:3)
    at Function.Module.runMain (module.js:676:10)
    at startup (bootstrap_node.js:187:16)
    at bootstrap_node.js:608:3
*/
```

The cause is of course optional, and defaults to `null`. If the `shortMessage`
is omitted, a generic default one will be used instead.

The `cause`, `shortMessage`, and full `message` will be available as properties
on the created error.


## Hiding Cause Messages
Occasionally, you will want an error's message to simply match its shortMessage,
without appending the cause's message. To do so, set the `hideCauseMessage`
option to `true`. This will cause the `NaniError` to behave somewhat like a
`WError`:

```js
const { NaniError } = require('nani');

try {
	JSON.parse('invalid JSON');
} catch (err) {
	throw new NaniError({
		shortMessage: 'Parsing failed',
		cause: err,
		hideCauseMessage: true
	});
}

/*
Running the above code produces something like the following:

NaniError: Parsing failed
    at Object.<anonymous> (/home/sripberger/projects/personal/nani/omg.js:6:8)
    at Module._compile (module.js:635:30)
    at Object.Module._extensions..js (module.js:646:10)
    at Module.load (module.js:554:32)
    at tryModuleLoad (module.js:497:12)
    at Function.Module._load (module.js:489:3)
    at Function.Module.runMain (module.js:676:10)
    at startup (bootstrap_node.js:187:16)
    at bootstrap_node.js:608:3
*/
```

This can be useful for public-facing API's where you don't want to clutter
the error messages your users see with internal stuff they don't care about,
while still preserving the underlying cause chain for your own debugging
purposes.


## Viewing the Full Stack
Node's default uncaught exception handler simply prints out the `stack` property
of the exception to `stderr` and exits. This, of course, doesn't tell you
anything about the stack traces in the cause chain. To view this, Nani provides
the `getFullStack` function:

```js
const { NaniError, getFullStack } = require('nani');

// Setting our own uncaught exception handler.
process.on('uncaughtException', (err) => {
	// Print full stack to sterr and exit.
	console.error(getFullStack(naniErr));
	process.exit(1);
});

try {
	JSON.parse('invalid JSON');
} catch (err) {
	throw new NaniError({
		shortMessage: 'Parsing failed',
		cause: err
	});
}

/*
Running the above code produces something like the following:

NaniError: Parsing failed : Unexpected token i in JSON at position 0
    at Object.<anonymous> (/home/sripberger/projects/personal/nani/omg.js:13:8)
    at Module._compile (module.js:653:30)
    at Object.Module._extensions..js (module.js:664:10)
    at Module.load (module.js:566:32)
    at tryModuleLoad (module.js:506:12)
    at Function.Module._load (module.js:498:3)
    at Function.Module.runMain (module.js:694:10)
    at startup (bootstrap_node.js:204:16)
    at bootstrap_node.js:625:3
Caused by: SyntaxError: Unexpected token i in JSON at position 0
    at JSON.parse (<anonymous>)
    at Object.<anonymous> (/home/sripberger/projects/personal/nani/omg.js:11:7)
    at Module._compile (module.js:653:30)
    at Object.Module._extensions..js (module.js:664:10)
    at Module.load (module.js:566:32)
    at tryModuleLoad (module.js:506:12)
    at Function.Module._load (module.js:498:3)
    at Function.Module.runMain (module.js:694:10)
    at startup (bootstrap_node.js:204:16)
    at bootstrap_node.js:625:3
*/
```

`getFullStack` works even if the provided error is not an instance of
`NaniError`, so you can safely use it even if you might be dealing with a plain
old JS Error. If the error has no `cause` property, it will simply print out the
stack as normal.


## Error Info
Like `VError`, `NaniError` supports arbitrary data in the form of the `info`
object, which can be used to provide further detail about what happened. This
will be available as the `info` property on the instance:

```js
const err = new NaniError({
	shortMessage: 'Omg bad error!',
	info: { foo: 'bar', baz: 'qux' }
});

console.log(err.info.foo);
console.log(err.info.baz);
/*
Running the above code logs the following:

bar
qux
*/
```

Since digging through the whole cause chain for all of its info can be tedious,
Nani provides the `collapseInfo` function, which assigns the properties from all
info objects in the chain together into a single object:

```js
const err = new NaniError({
	shortMessage: 'Omg bad error!',
	info: { foo: 'bar' },
	cause: new NaniError({
		shortMessage: 'Cause of bad error',
		info: { baz: 'qux' }
	})
});

console.log(collapseInfo(err));

/*
Running the above code would log the following:
{
	foo: 'bar',
	baz: 'qux'
}
*/
```

If the same info property name is encountered more than once in the chain, the
value *earlier* in the chain is prioritized.


## Shorthand Constructors
Much of the time the `shortMessage` and `cause` options are the only ones you
need when creating `NaniError` instances, so the constructor also supports
shorthand signatures like so:

```js
// shortMessage only.
throw new NaniError('Omg bad error!');

// cause only.
throw new NaniError(new Error('Cause of the error'));

// shortMessage and cause.
throw new NaniError('Omg bad error!', new Error('Cause of the error'));

// shortMessage, cause, and additional options.
throw new NaniError('Omg bad error!', new Error('Cause of the error'), {
	// Additional options can be included here...
	hideCauseMessage: true,
	info: { foo: 'bar' }
});

// default everything
throw new NaniError();
```


## Iterating Through the Cause Chain
For convenience, Nani provides a
[generator function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)
called `iterate`, which makes it easy to step through an error and it's cause
chain:

```js
const { NaniError, iterate } = require('nani');

const err = new NaniError({
	shortMessage: 'foo',
	cause: new NaniError({
		shortMessage: 'bar',
		cause: new Error('baz')
	})
});

for (const e of iterate(err)) {
	console.log(e.message);
}

/*
Running the above code logs the following:

foo : bar : baz
bar : baz
baz
*/
```

As you can see, the error itself appears first, followed by each of its causes
in sequence.

`iterate` works even if the error is just a plan old JS error with no cause, so
you can safely use it even when you're not sure the cause chain will be there:

```js
const err = new Error('Omg bad error!');

for (const e of iterate(err)) {
	console.log(e.message);
}
/*
Running the above code logs the following:

Omg bad error!
*/
```


### Iteration Utilities
In addition to the `iterate` function itself, Nani includes utility functions
for operations you're commonly going to want to do while iterating:

- `find`: Returns the first error in the chain matching a predicate function.
- `filter`: Returns all errors in the chain that match a predicate function.

```js
const { NaniError, find, filter } = require('nani');

const err = new NaniError({
	shortMessage: 'foo',
	cause: new NaniError({
		shortMessage: 'bar',
		info: { isCool: true },
		cause: new NaniError({
			shortMessage: 'baz',
			info: { isCool: false },
			cause: new NaniError({
				shortMessage: 'qux',
				info: { isCool: true }
			})
		})
	})
});

console.log(find((e) => e.info && e.info.isCool));
// { NaniError: bar : baz : qux }

console.log(filter((e) => e.info && e.info.isCool));
// [ { NaniError: bar : baz : qux }, { NaniError: qux } ]
```


## MultiErrors
Sometimes you run into situations where you need to collect multiple errors
together and present them as one, instead of simply failing at the first.
Common use cases for this include validation-- where you may want to display
to the user all the problems, instead of just the first one your validation code
encountered-- or collections of async operations where some operations may fail
independently of the others.

Like `VError`, Nani provides a `MultiError` class for handling these
situations:

```js
const { MultiError } = require('nani');

const err = new MultiError([
	new Error('foo'),
	new Error('bar')
]);

// Message only shows the first error, but notes that there are more.
console.log(err.message);
// First of 2 errors: foo

// The first error in the list is treated as the primary cause:
console.log(err.cause);
// { Error: foo }

// Full error list is available as the `errors` property:
console.log(err.errors);
// [ { Error: foo }, { Error: bar } ]
```

For convenience, you can also provide the error list directly as arguments to
the constructor, instead of wrapping them in an array. The following is
equivalent to the constructor call above:

```js
const err = new MultiError(new Error('foo'), new Error('bar'));
```


### Iterating MultiErrors
Unlike VError, Nani makes it easy to iterate not just through primary causes,
but through the entire cause chain of every error in your `MultiError`s, as
well. Simply use the `iterate` function:

```js
const { NaniError, MultiError, iterate } = require('nani');

const err = new NaniError({
	shortMessage: 'outermost error',
	cause: new MultiError(
		new NaniError('inner error', new Error('innermost error')),
		new NaniError('another inner error')
	)
});

for (const e of iterate(err)) {
	console.log(e.message);
}

/*
Running the above code will log the following:

outermost error : First of 2 errors : inner error : innermost error
First of 2 errors : inner error : innermost error
inner error : innermost error
innermost error
another inner error
*/
```

As you can see, `iterate` steps through the entire cause chain of each error
in a `MultiError` before proceeding to the next. As long as you build your error
structures well, you can be certain that `iterate` will touch every Error
instance in the entire structure.

The behavior demonstrated above holds true for the previously-described
iteration utilities-- `find` and `filter`-- in addition to the `iterate`
function itself. It is also reflected in `collapseInfo`, which processes each
error in the chain in the same order.


## Customizing the Default Message
If you have an error message that you find yourself using a lot, you can easily
replace the usual generic default error message by simply inheriting from
`NaniError` and overriding the static `getDefaultMessage` method:

```js
const { NaniError } = require('nani');

class MyError extends NaniError {
	static getDefaultMessage() {
		return 'Holy crap, bad stuff happened!';
	}
}

throw new MyError();

/*
Running the above code produces something like the following:

MyError: Holy crap, bad stuff happened!
    at Object.<anonymous> (/home/sripberger/projects/personal/nani/omg.js:9:7)
    at Module._compile (module.js:635:30)
    at Object.Module._extensions..js (module.js:646:10)
    at Module.load (module.js:554:32)
    at tryModuleLoad (module.js:497:12)
    at Function.Module._load (module.js:489:3)
    at Function.Module.runMain (module.js:676:10)
    at startup (bootstrap_node.js:187:16)
    at bootstrap_node.js:608:3
*/
```


### Putting Info in the Default Message
The `getDefaultMessage` method receives a single argument, which will be a
reference to the `options.info` object, if any, or a empty object otherwise.
This makes it easy to include some of that info in your error messages:

```js
const { NaniError } = require('nani');

class MyError extends NaniError {
	static getDefaultMessage(info) {
		return `Holy crap, ${info.what || 'bad stuff'} happened!`;
	}
}

throw new MyError({ info: { what: 'terrible things' } });

/*
Running the above code produces something like the following:

MyError: Holy crap, terrible things happened!
    at Object.<anonymous> (/home/sripberger/projects/personal/nani/omg.js:9:7)
    at Module._compile (module.js:635:30)
    at Object.Module._extensions..js (module.js:646:10)
    at Module.load (module.js:554:32)
    at tryModuleLoad (module.js:497:12)
    at Function.Module._load (module.js:489:3)
    at Function.Module.runMain (module.js:676:10)
    at startup (bootstrap_node.js:187:16)
    at bootstrap_node.js:608:3

*/
```


## The Dilemma: Identifying Standard JS Errors
Though it is generally favored by most JS developers, the practice of
[duck typing](https://en.wikipedia.org/wiki/Duck_typing) tends to fall flat
when it comes to error handling. `Error` instances are all fairly similar to
each other and don't really have any behavior-- i.e. methods-- to use as your
'does it walk' or 'does it quack' tests.

To identify what kind of error you're looking at, you need some other mechanism.
One way is to look at the properties of the error itself. An `Error` instance
has only two standard properties-- `message` and `name`.

`message` doesn't work because error messages are meant to be human-readable and
are frequently subject to change. Identifying errors based on their message can
thus be messy and quite unreliable.

`name` potentially works, and is the preferred method of many developers. Every
kind of error can have a unique `name` which is machine-readable unlikely to
change. Unfortunately, this approach can be rather limiting compared to
traditional type systems, as it does not support hierarchies.

For example, if you wanted a set of possible password validation errors--
one that indicates that the password is too short, one that indicates that
the password doesn't have at least one uppercase character, and another
that indicates the password doesn't have at least one number, you might
construct and throw them like so:

```js
const err = new Error('Too short');
err.name = 'TooShortError';
throw err;
```
```js
const err = new Error('Needs at least one uppercase letter');
err.name = 'NoUppercaseError';
throw err;
```
```js
const err = new Error('Needs at least one number');
errr.name = 'NoNumberError';
throw err;
```

Now you can easily tell these errors apart in consuming code by checking their
names:

```js
try {
	validatePassword(password);
} catch (err) {
	if (error.name === 'TooShortError') {
		// Handle TooShortError.
	} else if (error.name === 'NoUppercaseError') {
		// Handle NoUppercaseError
	} else if (error.name === 'NoNumberError') {
		// Handle NoNumberError
	} else {
		// Rethrow an unknown error.
		throw err;
	}
}
```

Now, what if you decide you want to specify some more general code, to handle
any kind of password validation error without necessarily caring about which
specific *kind* of password validation error it is?

Without changing the error names, all we really can do is check for each
possible name, which as you can imagine gets out of hand rather quickly as you
add more kinds of errors:

```js
try {
	validatePassword(password);
} catch (err) {
	if (
		error.name === 'TooShortError' ||
		error.name === 'NoUppercaseError' ||
		error.name === 'NoNumberError'
	) {
		// Handle any kind of password validation error.
	} else {
		// Rethrow an unknown error.
		throw err;
	}
}
```

This approach is also a huge pain for anybody consuming your code. You might
add a new kind of password validation error, and they'll potentially have to
update all of their handling code to check for it.

Another possible approach is to start prefixing our error names in some way,
and check for the prefix instead of checking the entire name:

```js
const err = new Error('Too short');
err.name = 'PasswordTooShortError';
throw err;
```
```js
const err = new Error('Needs at least one uppercase letter');
err.name = 'PasswordNoUppercaseError';
throw err;
```
```js
const err = new Error('Needs at least one number');
errr.name = 'PasswordNoNumberError';
throw err;
```


```js
try {
	validatePassword(password);
} catch (err) {
	if (err.name.startsWith('Password')) {
		// Handle any kind of password validation error.
	} else {
		// Rethrow an unknown error.
		throw err;
	}
}
```

This last approach isn't terrible, but figuring out the proper prefix can be
difficult and prone to mistakes as there's no standard to follow. Collisions
with prefixes and names from elsewhere are likely, and again... if you change
the names of any of your errors, all of the handling code has to change.

While we've discussed `message` and `name`, there are also plenty of
non-standard properties out there that you'll find for accomplishing something
like this. Node itself tends to use `code`, which is a machine-readable string
that is unlikely to change. Others might have numeric `code` or `errno`
properties. Aside from their separation from the standard `name` property that
effects the stack trace of the error, these are generally subject to the same
limitations that `name` is subject to. There's no standard, and there is no way
of easily supporting error type hierarchies. Numeric identifiers in particular
can be a pain, because they force you to look them up in documentation instead
of just knowing what they are by reading them.

Long story short, identifying errors in JS kind of sucks. :\


### What About `typeof` and `instanceof`?
Those who are unfamiliar with the quirks Node development and JS as a language
may be tempted to look into JS's standard
[typeof](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof)
and
[instanceof](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/instanceof)
operators to accomplish something similar to the static-type-based error
handling of languages like Java and C#.

The problem you'll run into *immediately* with `typeof` is that it generally
tells you next to nothing about non-primitives (which includes Error instances):

```js
console.log(typeof 42);
// number

console.log(typeof 'asdf');
// string

console.log(typeof true);
// boolean

// Ok, so far so good, now let's try some error instances.

console.log(typeof new Error('omg'));
// object

console.log(typeof new TypeError('wow'));
// object
```

Right, so that isn't useful. How about `instanceof`? After all, we can easily
make our error types into subclasses using ES6 class syntax:

```js
class PasswordValidationError extends Error {}
class TooShortError extends PasswordValidationError {}
class NoUppercaseError extends PasswordValidationError {}
class NoNumberError extends PasswordValidationError {}
```

You could also use its approximate equivalent in ES5:

```js
function PasswordValidationError(message) {
	Error.call(this, message)
}
PasswordValidationError.prototype = Object.create(Error.prototype);

function TooShortError(message) {
	PasswordValidationError.call(this, message)
}
TooShortError.prototype = Object.create(PasswordValidationError.prototype);

function NoUppercaseError(message) {
	PasswordValidationError.call(this, message)
}
NoUppercaseError.prototype = Object.create(PasswordValidationError.prototype);


function NoNumberError(message) {
	PasswordValidationError.call(this, message)
}
NoNumberError.prototype = Object.create(NoNumberError.prototype);
```

With either of these, you can then create and throw your errors like this:

```js
throw new TooShortError('Password is too short');
```
```js
throw new NoUppercaseError('Password must have an uppercase letter');
```
```js
throw new NoNumberError('Password must have a number');
```

Then, ideally, you can handle your errors like this:

```js
try {
	validatePassword(password);
} catch (err) {
	if (err instanceof TooShortError) {
		// Handle the too short error.
	} else if (err instanceof PasswordValidationError) {
		// Handle any other kind of password validation error.
	} else {
		// Rethrow an unknown error.
		throw err;
	}
}
```

If you try this approach, the results might seem promising at first, but there
is a relatively subtle limitation of `instanceof` that can and will cause you
some major headaches.

While it may seem similar at a glance `instanceof` is *not* an equivalent to
true static type checking, which is not possible in vanilla JS. `instanceof`
merely approximates, by searching the first operand's prototype chain to see
if it ever contains the exact same object as the `prototype` property of its
second operand.

This will never give you a false positive, but it *can* give you false negatives
if you're ever in a situation where an object was created with a *copy* of the
second operand. Yes, the prototype objects might be similar, but they are not
literally the exact same object, which causes the check to fail.

The classic example of this from web browsers is when dealing with instances
passed across frames and/or iframes. In Node, this same issue might happen when
you have multiple versions of the same constructor in your dependency tree,
a not-uncommon situation that can arise when:

- Conflicting dependency semver expressions require two different versions of
  the same module.
- Some installed modules can share the same version, but not yet been deduped.
- `npm link` is used for anything whatsoever.

Additionally, when you're transferring errors between various services and
instances of services-- as is common in Node architectures-- you may need to
serialize them and then rebuild them elsewhere. In order for `instanceof` to
keep working, you would need to re-instantiate every error, and every error in
its cause chain, using the same constructors. This can be complicated and
fairly prone to mistakes.

In any of the above scenarios, the above `catch` block could rethrow a
`PasswordValidationError`. If that error is not caught somewhere further up the
call stack, it could of course crash your entire app.

Obviously this is a huge problem, so long story short: `instanceof`, while it
has its uses, is not really robust enough for this purpose.


### A Solution: Full Names
To solve this dilemma-- allowing you to do something like traditional error
type-checking without relying on `instanceof`-- Nani uses a property called
`fullName`. It's similar to the prefixing solution discussed above, except that
full names follow a simple, predictable format and are easy to generate based on
syntax you may already be using.

The basic idea is this: An error class's name is simply the name of its
constructor function. It's fullName, however, is a dot-separated list of all of
the constructor names in its inheritance chain. Both of these properties are
available on all instances of error constructors, as well.

The `NaniError` class implements these properties, so as long as you include it
at the base of your hierarchies, generating fullNames requires no effort on
your part.

For example, to make the password validation hierarchy discussed above, it's
just this simple:

```js
const { NaniError } = require('nani');

class PasswordValidationError extends NaniError {}
class TooShortError extends PasswordValidationError {}
class NoUppercaseError extends PasswordValidationError {}
class NoNumberError extends PasswordValidationError {}

console.log(PasswordValidationError.fullName);
// Error.NaniError.PasswordValidationError

console.log(TooShortError.fullName);
// Error.NaniError.PasswordValidationError.TooShortError

console.log(NoUppercaseError.fullName);
// Error.NaniError.PasswordValidationError.NoUppercaseError

console.log(NoNumberError.fullName);
// Error.NaniError.PasswordValidationError.NoNumberError

// Name and fullName are automatically available on instances as well.
const err = new NoUppercaseError();

console.log(err.name);
// NoUppercaseError

console.log(err.fullName)
// Error.NaniError.PasswordValidationError.NoUppercaseError
```

Of course, not every error instance or error class you're going to be dealing
with will inherit from `NaniError`, so Nani provides the function `getFullName`,
which, for convenience, attempts to support these through a simple mechanism:

1. If a fullName property exists, use that.
2. If if the name property is 'Error', the fullName is also assumed to be
   'Error'.
3. If the name property *ends with* 'Error', the fullName is assumed to be the
   name property appended to 'Error', separated by a dot.
4. In all other cases, the fullName is assumed to be `null`, indicating that it
   can't be identified.

For example:
```js
const { NaniError, getFullName } = require('nani');

class PasswordValidationError extends NaniError {}
class TooShortError extends PasswordValidationError {}
class MyCustomError extends Error {}

console.log(getFullName(PasswordValidationError));
// Error.NaniError.PasswordValidationError

console.log(getFullName(TooShortError));
// Error.NaniError.PasswordValidationError.TooShortError

console.log(getFullName(Error));
// Error

console.log(getFullName(TypeError));
// Error.TypeError

console.log(getFullName(MyCustomError));
// Error.MyCustomError
```

Since all standard Error subclass names end in 'Error'-- as do most custom
ones-- you can reliably use `getFullName` much of the time. Of course, if you
already have your own error name hierarchies that aren't based on the `fullName`
property, these will not be supported.


### Using Full Names to Identify Errors
To make easy use of full names for identification, Nani provides the `is`
function. `is` will get the full name of both of its arguments, and will return
true if and only if both full names can be identified and the second argument's
full name *starts with* the first argument's full name. This makes checks
against your hierarchies read quite naturally.

Going back to our password validation example, you can declare your error
classes like so:
```js
class PasswordValidationError extends NaniError {}
class TooShortError extends PasswordValidationError {}
class NoUppercaseError extends PasswordValidationError {}
class NoNumberError extends PasswordValidationError {}
```

Throw your errors like so:
```js
throw new TooShortError('Password is too short');
```
```js
throw new NoUppercaseError('Password must have an uppercase letter');
```
```js
throw new NoNumberError('Password must have a number');
```

And handle your errors like so:
```js
const { is } = require('nani');

try {
	validatePassword(password);
} catch (err) {
	if (is(TooShortError, err)) {
		// Handle the too short error.
	} else if (is(PasswordValidationError, err)) {
		// Handle any other kind of password validation error.
	} else {
		// Rethrow an unknown error.
		throw err;
	}
}
```

This mechanism therefore gives you the advantages of `instanceof`, without
actually relying on `instanceof`.


### Shorthand Forms for Iteration Utilities
Since the `is` function is likely to be used quite a bit with them, the `find`
and `filter` iteration utilities support a shorthand form. If the predicate is
an Error constructor-- i.e. it has a fullName that starts with `Error`-- the
predicate will return true for any iterated item that `is` that constructor.

For example:

```js
const { find, filter, is } = require('nani');

const err = new NaniError();

let result;

// These two statements are effectively equivalent:
result = find(err, (e) => is(NaniError, e));
result = find(err, NaniError);

// As are these two:
result = filter(err, (e) => is(NaniError, e));
result = filter(err, NaniError);
```


### Namespacing Your Errors
Considering the way full names work, it *is* possible to have collisions,
especially if you use fairly general error names that others are likely to use
in their own projects, like `ValidationError` or `InternalError`. To deal with
this, I recommend that you make a single base error for all of your hierarchies,
preferably named based on your organization, or the name of your project.

If you're writing a validation library called `foobar`, for example, instead of
just doing this:

```js
const { NaniError } = require('NaniError')

class ValidationError extends NaniError {}
```

Try doing something like this:

```js
const { NaniError } = require('NaniError')

class FoobarError extends NaniError {}
class ValidationError extends FoobarError {}
```
