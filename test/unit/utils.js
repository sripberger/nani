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

	describe('::iterate', function() {
		it('iterates through all causes of an error', function() {
			const fooErr = new Error('foo');
			const barErr = fooErr.cause = new Error('bar');
			const bazErr = barErr.cause = new Error('baz');

			const result = Array.from(utils.iterate(fooErr));

			expect(result).to.deep.equal([ fooErr, barErr, bazErr ]);
		});

		it('iterates through errors property instead of cause, if any', function() {
			const fooErr = new Error('foo');
			const barErr = fooErr.cause = new Error('bar');
			const bazErr = new Error('baz');
			fooErr.errors = [ barErr, bazErr ];

			const result = Array.from(utils.iterate(fooErr));

			expect(result).to.deep.equal([ fooErr, barErr, bazErr ]);
		});

		it('iterates causes of errors in errors property', function() {
			const fooErr = new Error('foo');
			const barErr = fooErr.cause = new Error('bar');
			const bazErr = barErr.cause = Error('baz');
			fooErr.errors = [ barErr ];

			const result = Array.from(utils.iterate(fooErr));

			expect(result).to.deep.equal([ fooErr, barErr, bazErr ]);
		});
	});
});
