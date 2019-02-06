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

	it('supports checking of standard JS errors', function() {
		// Check a plain Error
		let err = new Error();
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

		// Check an EvalError
		err = new EvalError();
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

		// Check a RangeError
		err = new RangeError();
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

		// Check a ReferenceError
		err = new ReferenceError();
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

		// Check a SyntaxError
		err = new SyntaxError();
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

		// Check a TypeError
		err = new TypeError();
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

		// Check a URIError
		err = new URIError();
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
