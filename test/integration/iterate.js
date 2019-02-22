import { iterate } from '../../lib/iterate';

describe('iterate', function() {
	it('iterates all nested errors', function() {
		const fooErr = new Error('foo');
		const barErr = fooErr.cause = new Error('bar');
		const bazErr = barErr.cause = Error('baz');
		fooErr.errors = [ barErr ];

		const result = [ ...iterate(fooErr) ];

		expect(result).to.deep.equal([ fooErr, barErr, bazErr ]);
	});

	it('prevents circular and repeated iteration', function() {
		const fooErr = new Error('foo');
		const barErr = new Error('bar');
		const bazErr = new Error('baz');
		const quxErr = new Error('qux');
		fooErr.errors = [ fooErr, barErr, bazErr, quxErr ];
		barErr.cause = bazErr;
		bazErr.cause = barErr;
		quxErr.cause = quxErr;

		const result = [ ...iterate(fooErr) ];

		expect(result).to.deep.equal([ fooErr, barErr, bazErr, quxErr ]);
	});
});
