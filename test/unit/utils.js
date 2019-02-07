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
				expect(utils.getFullName({ name: 'foo' })).to.be.null;
			});
		});
	});

	describe('::normalizeArgs', function() {
		const shortMessage = 'Omg bad error!';
		const cause = new Error('Cause of bad error!');

		it('returns copy of options object, if it is the first arg', function() {
			const result = utils.normalizeArgs([ { foo: 'bar' } ]);

			expect(result).to.deep.equal({ foo: 'bar' });
		});

		it('supports shortMessage preceding options', function() {
			const result = utils.normalizeArgs([
				shortMessage,
				{ foo: 'bar' },
			]);

			expect(result).to.deep.equal({ shortMessage, foo: 'bar' });
		});

		it('supports cause preceding options', function() {
			const result = utils.normalizeArgs([ cause, { foo: 'bar' } ]);

			expect(result).to.deep.equal({ cause, foo: 'bar' });
		});

		it('supports shortMessage and cause preceding options', function() {
			const result = utils.normalizeArgs([
				shortMessage,
				cause,
				{ foo: 'bar' },
			]);

			expect(result).to.deep.equal({ shortMessage, cause, foo: 'bar' });
		});

		it('prioritizes options props over preceding args', function() {
			const result = utils.normalizeArgs([
				'foo',
				new Error('bar'),
				{ shortMessage, cause, baz: 'qux' },
			]);

			expect(result).to.deep.equal({ shortMessage, cause, baz: 'qux' });
		});

		it('returns an empty object, if no args are provided', function() {
			const result = utils.normalizeArgs([]);

			expect(result).to.deep.equal({});
		});
	});
});
