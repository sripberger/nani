/* eslint max-classes-per-file: off */

const { NaniError, is } = require('../../cjs');

// Some simple subclasses for testing purposes...
class FooError extends NaniError {}
class BarError extends NaniError {}
class BazError extends FooError {}

describe('is', function() {
	it('supports checking against NaniError heirarchies', function() {
		// Check a NaniError
		let err = new NaniError();
		expect(is(Error, err)).to.be.true;
		expect(is(EvalError, err)).to.be.false;
		expect(is(RangeError, err)).to.be.false;
		expect(is(ReferenceError, err)).to.be.false;
		expect(is(SyntaxError, err)).to.be.false;
		expect(is(TypeError, err)).to.be.false;
		expect(is(URIError, err)).to.be.false;
		expect(is(NaniError, err)).to.be.true;
		expect(is(FooError, err)).to.be.false;
		expect(is(BarError, err)).to.be.false;
		expect(is(BazError, err)).to.be.false;

		// Check a FooError
		err = new FooError();
		expect(is(Error, err)).to.be.true;
		expect(is(EvalError, err)).to.be.false;
		expect(is(RangeError, err)).to.be.false;
		expect(is(ReferenceError, err)).to.be.false;
		expect(is(SyntaxError, err)).to.be.false;
		expect(is(TypeError, err)).to.be.false;
		expect(is(URIError, err)).to.be.false;
		expect(is(NaniError, err)).to.be.true;
		expect(is(FooError, err)).to.be.true;
		expect(is(BarError, err)).to.be.false;
		expect(is(BazError, err)).to.be.false;

		// Check a BarError
		err = new BarError();
		expect(is(Error, err)).to.be.true;
		expect(is(EvalError, err)).to.be.false;
		expect(is(RangeError, err)).to.be.false;
		expect(is(ReferenceError, err)).to.be.false;
		expect(is(SyntaxError, err)).to.be.false;
		expect(is(TypeError, err)).to.be.false;
		expect(is(URIError, err)).to.be.false;
		expect(is(NaniError, err)).to.be.true;
		expect(is(FooError, err)).to.be.false;
		expect(is(BarError, err)).to.be.true;
		expect(is(BazError, err)).to.be.false;

		// Check a BazError
		err = new BazError();
		expect(is(Error, err)).to.be.true;
		expect(is(EvalError, err)).to.be.false;
		expect(is(RangeError, err)).to.be.false;
		expect(is(ReferenceError, err)).to.be.false;
		expect(is(SyntaxError, err)).to.be.false;
		expect(is(TypeError, err)).to.be.false;
		expect(is(URIError, err)).to.be.false;
		expect(is(NaniError, err)).to.be.true;
		expect(is(FooError, err)).to.be.true;
		expect(is(BarError, err)).to.be.false;
		expect(is(BazError, err)).to.be.true;
	});

	it('can check a plain Error', function() {
		const err = new Error();

		expect(is(Error, err)).to.be.true;
		expect(is(EvalError, err)).to.be.false;
		expect(is(RangeError, err)).to.be.false;
		expect(is(ReferenceError, err)).to.be.false;
		expect(is(SyntaxError, err)).to.be.false;
		expect(is(TypeError, err)).to.be.false;
		expect(is(URIError, err)).to.be.false;
		expect(is(NaniError, err)).to.be.false;
		expect(is(FooError, err)).to.be.false;
		expect(is(BarError, err)).to.be.false;
		expect(is(BazError, err)).to.be.false;
	});

	it('can check an EvalError', function() {
		const err = new EvalError();

		expect(is(Error, err)).to.be.true;
		expect(is(EvalError, err)).to.be.true;
		expect(is(RangeError, err)).to.be.false;
		expect(is(ReferenceError, err)).to.be.false;
		expect(is(SyntaxError, err)).to.be.false;
		expect(is(TypeError, err)).to.be.false;
		expect(is(URIError, err)).to.be.false;
		expect(is(NaniError, err)).to.be.false;
		expect(is(FooError, err)).to.be.false;
		expect(is(BarError, err)).to.be.false;
		expect(is(BazError, err)).to.be.false;
	});

	it('can check a RangeError', function() {
		const err = new RangeError();

		expect(is(Error, err)).to.be.true;
		expect(is(EvalError, err)).to.be.false;
		expect(is(RangeError, err)).to.be.true;
		expect(is(ReferenceError, err)).to.be.false;
		expect(is(SyntaxError, err)).to.be.false;
		expect(is(TypeError, err)).to.be.false;
		expect(is(URIError, err)).to.be.false;
		expect(is(NaniError, err)).to.be.false;
		expect(is(FooError, err)).to.be.false;
		expect(is(BarError, err)).to.be.false;
		expect(is(BazError, err)).to.be.false;
	});

	it('can check a ReferenceError', function() {
		const err = new ReferenceError();

		expect(is(Error, err)).to.be.true;
		expect(is(EvalError, err)).to.be.false;
		expect(is(RangeError, err)).to.be.false;
		expect(is(ReferenceError, err)).to.be.true;
		expect(is(SyntaxError, err)).to.be.false;
		expect(is(TypeError, err)).to.be.false;
		expect(is(URIError, err)).to.be.false;
		expect(is(NaniError, err)).to.be.false;
		expect(is(FooError, err)).to.be.false;
		expect(is(BarError, err)).to.be.false;
		expect(is(BazError, err)).to.be.false;
	});

	it('can check a SyntaxError', function() {
		const err = new SyntaxError();

		expect(is(Error, err)).to.be.true;
		expect(is(EvalError, err)).to.be.false;
		expect(is(RangeError, err)).to.be.false;
		expect(is(ReferenceError, err)).to.be.false;
		expect(is(SyntaxError, err)).to.be.true;
		expect(is(TypeError, err)).to.be.false;
		expect(is(URIError, err)).to.be.false;
		expect(is(NaniError, err)).to.be.false;
		expect(is(FooError, err)).to.be.false;
		expect(is(BarError, err)).to.be.false;
		expect(is(BazError, err)).to.be.false;
	});

	it('can check a TypeError', function() {
		const err = new TypeError();

		expect(is(Error, err)).to.be.true;
		expect(is(EvalError, err)).to.be.false;
		expect(is(RangeError, err)).to.be.false;
		expect(is(ReferenceError, err)).to.be.false;
		expect(is(SyntaxError, err)).to.be.false;
		expect(is(TypeError, err)).to.be.true;
		expect(is(URIError, err)).to.be.false;
		expect(is(NaniError, err)).to.be.false;
		expect(is(FooError, err)).to.be.false;
		expect(is(BarError, err)).to.be.false;
		expect(is(BazError, err)).to.be.false;
	});

	it('can check a URIError', function() {
		const err = new URIError();

		expect(is(Error, err)).to.be.true;
		expect(is(EvalError, err)).to.be.false;
		expect(is(RangeError, err)).to.be.false;
		expect(is(ReferenceError, err)).to.be.false;
		expect(is(SyntaxError, err)).to.be.false;
		expect(is(TypeError, err)).to.be.false;
		expect(is(URIError, err)).to.be.true;
		expect(is(NaniError, err)).to.be.false;
		expect(is(FooError, err)).to.be.false;
		expect(is(BarError, err)).to.be.false;
		expect(is(BazError, err)).to.be.false;
	});
});
