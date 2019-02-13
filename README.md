# nani
Better Error handling for Node, inspired in part by
[VError](https://www.npmjs.com/package/verror).

Makes it easier to tell what happened when things explode.

## The Cause Chain
Users of VError will be familiar with cause message chains, but for those that
are not, the idea is that errors can be given a `cause` when constructed. A
cause's message will be chained to the end of the wrapping error's message,
making it easy for a human programmer to get the full story at a glance.

`nani` provides the `NaniError` class for this purpose, among other features:

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

The cause is of course optional, and defaults to `null`. If the shortMessage is
omitted, a generic default one will be used instead.

The `cause`, `shortMessage`, and full `message` will be available as properties
on the created error.

## Hiding Cause Messages
Occasionally, you will want an error's message to simply match its shortMessage,
without appending the cause's message. To do so, set the `skipCauseMessage`
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
		skipCauseMessage: true
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
`nani` provides the `collapseInfo` function, which assigns the properties from
all info objects in the chain together into a single object:

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
need when creating NaniError instances, so the constructor also supports
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
	skipCauseMessage: true,
	info: { foo: 'bar' }
});

// default everything
throw new NaniError();
```

## Iterating Through the Cause Chain
For convenience, `nani` provides a
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
In addition to the `iterate` itself, `nani` includes utility functions for
operations you're commonly going to want to do while iterating:

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

Like `VError`, `nani` provides a `MultiError` class for handling these
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
Unlike `VError`, `nani` makes it easy to iterate not just through primary
causes, but through the entire cause chain of every error in a `MultiError`, as
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


## The Dilemma of Checking Standard JS Errors

### A Solution: Full Names
