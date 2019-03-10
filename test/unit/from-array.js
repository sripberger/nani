import { MultiError } from '../../lib/multi-error';
import { fromArray } from '../../lib/from-array';

describe('fromArray', function() {
	it('returns null if array is empty', function() {
		expect(fromArray([])).to.be.null;
	});

	it('returns first element if array has one element', function() {
		const err = new Error('omg');

		expect(fromArray([ err ])).to.equal(err);
	});

	it('wraps array in a MultiError if it has more than one element', function() {
		const errors = [ new Error('foo'), new Error('bar') ];

		const result = fromArray(errors);

		expect(result).to.be.an.instanceof(MultiError);
		expect(result.errors).to.equal(errors);
	});
});
