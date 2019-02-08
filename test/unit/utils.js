import * as utils from '../../lib/utils';

describe('utils', function() {
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
