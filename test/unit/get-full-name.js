import { getFullName } from '../../lib/get-full-name';

describe('::getFullName', function() {
	it('returns fullName property of provided object, if any', function() {
		const fullName = 'fullName';

		expect(getFullName({ fullName })).to.equal(fullName);
	});

	context('provided object has no fullname', function() {
		function testStandardErrorName(name) {
			const expected = name === 'Error' ? 'Error' : `Error.${name}`;

			it(`returns '${expected}' if name is ${name}`, function() {
				expect(getFullName({ name })).to.equal(expected);
			});
		}

		const standardErrorNames = [
			'Error',
			'RangeError',
			'ReferenceError',
			'SyntaxError',
			'TypeError',
			'EvalError',
			'URIError',
		];

		for (const name of standardErrorNames) {
			testStandardErrorName(name);
		}

		it('returns null if name is not known', function() {
			expect(getFullName({ name: 'foo' })).to.be.null;
		});
	});
});
