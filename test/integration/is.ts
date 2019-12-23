import { NaniError, is } from '../../lib';
import { expect } from 'chai';

// Some simple subclasses for testing purposes...
class FooError extends NaniError {}
class BarError extends NaniError {}
class BazError extends FooError {}

describe('is (Integration)', function() {
	it('supports checking against NaniError heirarchies', function() {
		// Check a NaniError
		let err = new NaniError();
		expect(is(err, Error)).to.be.true;
		expect(is(err, EvalError)).to.be.false;
		expect(is(err, RangeError)).to.be.false;
		expect(is(err, ReferenceError)).to.be.false;
		expect(is(err, SyntaxError)).to.be.false;
		expect(is(err, TypeError)).to.be.false;
		expect(is(err, URIError)).to.be.false;
		expect(is(err, NaniError)).to.be.true;
		expect(is(err, FooError)).to.be.false;
		expect(is(err, BarError)).to.be.false;
		expect(is(err, BazError)).to.be.false;

		// Check a FooError
		err = new FooError();
		expect(is(err, Error)).to.be.true;
		expect(is(err, EvalError)).to.be.false;
		expect(is(err, RangeError)).to.be.false;
		expect(is(err, ReferenceError)).to.be.false;
		expect(is(err, SyntaxError)).to.be.false;
		expect(is(err, TypeError)).to.be.false;
		expect(is(err, URIError)).to.be.false;
		expect(is(err, NaniError)).to.be.true;
		expect(is(err, FooError)).to.be.true;
		expect(is(err, BarError)).to.be.false;
		expect(is(err, BazError)).to.be.false;

		// Check a BarError
		err = new BarError();
		expect(is(err, Error)).to.be.true;
		expect(is(err, EvalError)).to.be.false;
		expect(is(err, RangeError)).to.be.false;
		expect(is(err, ReferenceError)).to.be.false;
		expect(is(err, SyntaxError)).to.be.false;
		expect(is(err, TypeError)).to.be.false;
		expect(is(err, URIError)).to.be.false;
		expect(is(err, NaniError)).to.be.true;
		expect(is(err, FooError)).to.be.false;
		expect(is(err, BarError)).to.be.true;
		expect(is(err, BazError)).to.be.false;

		// Check a BazError
		err = new BazError();
		expect(is(err, Error)).to.be.true;
		expect(is(err, EvalError)).to.be.false;
		expect(is(err, RangeError)).to.be.false;
		expect(is(err, ReferenceError)).to.be.false;
		expect(is(err, SyntaxError)).to.be.false;
		expect(is(err, TypeError)).to.be.false;
		expect(is(err, URIError)).to.be.false;
		expect(is(err, NaniError)).to.be.true;
		expect(is(err, FooError)).to.be.true;
		expect(is(err, BarError)).to.be.false;
		expect(is(err, BazError)).to.be.true;
	});

	it('supports checking of standard JS errors', function() {
		// Check a plain Error
		let err = new Error();
		expect(is(err, Error)).to.be.true;
		expect(is(err, EvalError)).to.be.false;
		expect(is(err, RangeError)).to.be.false;
		expect(is(err, ReferenceError)).to.be.false;
		expect(is(err, SyntaxError)).to.be.false;
		expect(is(err, TypeError)).to.be.false;
		expect(is(err, URIError)).to.be.false;
		expect(is(err, NaniError)).to.be.false;
		expect(is(err, FooError)).to.be.false;
		expect(is(err, BarError)).to.be.false;
		expect(is(err, BazError)).to.be.false;

		// Check an EvalError
		err = new EvalError();
		expect(is(err, Error)).to.be.true;
		expect(is(err, EvalError)).to.be.true;
		expect(is(err, RangeError)).to.be.false;
		expect(is(err, ReferenceError)).to.be.false;
		expect(is(err, SyntaxError)).to.be.false;
		expect(is(err, TypeError)).to.be.false;
		expect(is(err, URIError)).to.be.false;
		expect(is(err, NaniError)).to.be.false;
		expect(is(err, FooError)).to.be.false;
		expect(is(err, BarError)).to.be.false;
		expect(is(err, BazError)).to.be.false;

		// Check a RangeError
		err = new RangeError();
		expect(is(err, Error)).to.be.true;
		expect(is(err, EvalError)).to.be.false;
		expect(is(err, RangeError)).to.be.true;
		expect(is(err, ReferenceError)).to.be.false;
		expect(is(err, SyntaxError)).to.be.false;
		expect(is(err, TypeError)).to.be.false;
		expect(is(err, URIError)).to.be.false;
		expect(is(err, NaniError)).to.be.false;
		expect(is(err, FooError)).to.be.false;
		expect(is(err, BarError)).to.be.false;
		expect(is(err, BazError)).to.be.false;

		// Check a ReferenceError
		err = new ReferenceError();
		expect(is(err, Error)).to.be.true;
		expect(is(err, EvalError)).to.be.false;
		expect(is(err, RangeError)).to.be.false;
		expect(is(err, ReferenceError)).to.be.true;
		expect(is(err, SyntaxError)).to.be.false;
		expect(is(err, TypeError)).to.be.false;
		expect(is(err, URIError)).to.be.false;
		expect(is(err, NaniError)).to.be.false;
		expect(is(err, FooError)).to.be.false;
		expect(is(err, BarError)).to.be.false;
		expect(is(err, BazError)).to.be.false;

		// Check a SyntaxError
		err = new SyntaxError();
		expect(is(err, Error)).to.be.true;
		expect(is(err, EvalError)).to.be.false;
		expect(is(err, RangeError)).to.be.false;
		expect(is(err, ReferenceError)).to.be.false;
		expect(is(err, SyntaxError)).to.be.true;
		expect(is(err, TypeError)).to.be.false;
		expect(is(err, URIError)).to.be.false;
		expect(is(err, NaniError)).to.be.false;
		expect(is(err, FooError)).to.be.false;
		expect(is(err, BarError)).to.be.false;
		expect(is(err, BazError)).to.be.false;

		// Check a TypeError
		err = new TypeError();
		expect(is(err, Error)).to.be.true;
		expect(is(err, EvalError)).to.be.false;
		expect(is(err, RangeError)).to.be.false;
		expect(is(err, ReferenceError)).to.be.false;
		expect(is(err, SyntaxError)).to.be.false;
		expect(is(err, TypeError)).to.be.true;
		expect(is(err, URIError)).to.be.false;
		expect(is(err, NaniError)).to.be.false;
		expect(is(err, FooError)).to.be.false;
		expect(is(err, BarError)).to.be.false;
		expect(is(err, BazError)).to.be.false;

		// Check a URIError
		err = new URIError();
		expect(is(err, Error)).to.be.true;
		expect(is(err, EvalError)).to.be.false;
		expect(is(err, RangeError)).to.be.false;
		expect(is(err, ReferenceError)).to.be.false;
		expect(is(err, SyntaxError)).to.be.false;
		expect(is(err, TypeError)).to.be.false;
		expect(is(err, URIError)).to.be.true;
		expect(is(err, NaniError)).to.be.false;
		expect(is(err, FooError)).to.be.false;
		expect(is(err, BarError)).to.be.false;
		expect(is(err, BazError)).to.be.false;
	});

	it('supports checking undefined and null', function() {
		// Check undefined
		expect(is(undefined, Error)).to.be.false;
		expect(is(undefined, EvalError)).to.be.false;
		expect(is(undefined, RangeError)).to.be.false;
		expect(is(undefined, ReferenceError)).to.be.false;
		expect(is(undefined, SyntaxError)).to.be.false;
		expect(is(undefined, TypeError)).to.be.false;
		expect(is(undefined, URIError)).to.be.false;
		expect(is(undefined, NaniError)).to.be.false;
		expect(is(undefined, FooError)).to.be.false;
		expect(is(undefined, BarError)).to.be.false;
		expect(is(undefined, BazError)).to.be.false;

		// Check null
		expect(is(null, Error)).to.be.false;
		expect(is(null, EvalError)).to.be.false;
		expect(is(null, RangeError)).to.be.false;
		expect(is(null, ReferenceError)).to.be.false;
		expect(is(null, SyntaxError)).to.be.false;
		expect(is(null, TypeError)).to.be.false;
		expect(is(null, URIError)).to.be.false;
		expect(is(null, NaniError)).to.be.false;
		expect(is(null, FooError)).to.be.false;
		expect(is(null, BarError)).to.be.false;
		expect(is(null, BazError)).to.be.false;
	});
});
