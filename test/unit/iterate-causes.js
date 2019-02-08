import { iterateCauses } from '../../lib/iterate-causes';

describe('iterateCauses', function() {
	it('iterates through all causes of an error', function() {
		const fooErr = new Error('foo');
		const barErr = fooErr.cause = new Error('bar');
		const bazErr = barErr.cause = new Error('baz');

		const result = [ ...iterateCauses(fooErr) ];

		expect(result).to.deep.equal([ fooErr, barErr, bazErr ]);
	});

	it('iterates through errors property instead of cause, if any', function() {
		const fooErr = new Error('foo');
		const barErr = fooErr.cause = new Error('bar');
		const bazErr = new Error('baz');
		fooErr.errors = [ barErr, bazErr ];

		const result = [ ...iterateCauses(fooErr) ];

		expect(result).to.deep.equal([ fooErr, barErr, bazErr ]);
	});

	it('iterates causes of errors in errors property', function() {
		const fooErr = new Error('foo');
		const barErr = fooErr.cause = new Error('bar');
		const bazErr = barErr.cause = Error('baz');
		fooErr.errors = [ barErr ];

		const result = [ ...iterateCauses(fooErr) ];

		expect(result).to.deep.equal([ fooErr, barErr, bazErr ]);
	});
});
