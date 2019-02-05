import * as utils from '../../lib/utils';

describe('utils', function() {
	describe('::getFullName', function() {
		it('returns fullName property of provided object, if any', function() {
			const fullName = 'fullName';

			expect(utils.getFullName({ fullName })).to.equal(fullName);
		});

		context('provided object has no fullname', function() {
			function testStandardErrorName(name) {
				const expected = name === 'Error' ? 'Error' : `Error.${name}`;

				it(`returns '${expected}' if name is ${name}`, function() {
					expect(utils.getFullName({ name })).to.equal(expected);
				});
			}

			const standardErrorNames = [
				'Error',
				'AssertionError',
				'RangeError',
				'ReferenceError',
				'SyntaxError',
				'TypeError',
				'SystemError',
				'EvalError',
				'URIError',
			];

			for (const name of standardErrorNames) {
				testStandardErrorName(name);
			}

			it('returns null if name is not known', function() {
				expect(utils.getFullName({ name: 'foo' })).to.be.null;
			});
		});
	});

	describe('::normalizeOptions', function() {
		const message = 'Omg bad error!';
		const cause = new Error('Cause of bad error!');

		it('returns copy of options object, if it is the first arg', function() {
			const result = utils.normalizeOptions({ foo: 'bar' });

			expect(result).to.deep.equal({ foo: 'bar' });
		});

		it('supports message preceding options', function() {
			const result = utils.normalizeOptions(message, { foo: 'bar' });

			expect(result).to.deep.equal({ message, foo: 'bar' });
		});

		it('supports cause preceding options', function() {
			const result = utils.normalizeOptions(cause, { foo: 'bar' });

			expect(result).to.deep.equal({ cause, foo: 'bar' });
		});

		it('supports message and cause preceding options', function() {
			const result = utils.normalizeOptions(message, cause, {
				foo: 'bar',
			});

			expect(result).to.deep.equal({ message, cause, foo: 'bar' });
		});

		it('prioritizes options props over preceding args', function() {
			const result = utils.normalizeOptions('foo', new Error('bar'), {
				message,
				cause,
				baz: 'qux',
			});

			expect(result).to.deep.equal({ message, cause, baz: 'qux' });
		});
	});
});
