const { NaniError, getFullName } = require('../../cjs');

// Some simple subclasses for testing purposes...
class FooError extends NaniError {}
class BarError extends NaniError {}
class BazError extends FooError {}

describe('getFullName', function() {
	it('returns the full name of a provided error class', function() {
		// Standard JS errors.
		expect(getFullName(Error)).to.equal('Error');
		expect(getFullName(EvalError)).to.equal('Error.EvalError');
		expect(getFullName(RangeError)).to.equal('Error.RangeError');
		expect(getFullName(ReferenceError)).to.equal('Error.ReferenceError');
		expect(getFullName(SyntaxError)).to.equal('Error.SyntaxError');
		expect(getFullName(TypeError)).to.equal('Error.TypeError');
		expect(getFullName(URIError)).to.equal('Error.URIError');

		// nani errors.
		expect(getFullName(NaniError)).to.equal('Error.NaniError');
		expect(getFullName(FooError)).to.equal('Error.NaniError.FooError');
		expect(getFullName(BarError)).to.equal('Error.NaniError.BarError');
		expect(getFullName(BazError)).to.equal(
			'Error.NaniError.FooError.BazError'
		);
	});

	it('returns the full name of a provided error instance', function() {
		// Standard JS error instances.
		expect(getFullName(new Error())).to.equal('Error');
		expect(getFullName(new EvalError())).to.equal('Error.EvalError');
		expect(getFullName(new RangeError())).to.equal('Error.RangeError');
		expect(getFullName(new ReferenceError())).to.equal(
			'Error.ReferenceError'
		);
		expect(getFullName(new SyntaxError())).to.equal('Error.SyntaxError');
		expect(getFullName(new TypeError())).to.equal('Error.TypeError');
		expect(getFullName(new URIError())).to.equal('Error.URIError');

		// nani error instances
		expect(getFullName(new NaniError())).to.equal('Error.NaniError');
		expect(getFullName(new FooError())).to.equal(
			'Error.NaniError.FooError'
		);
		expect(getFullName(new BarError())).to.equal(
			'Error.NaniError.BarError'
		);
		expect(getFullName(new BazError())).to.equal(
			'Error.NaniError.FooError.BazError'
		);
	});
});
