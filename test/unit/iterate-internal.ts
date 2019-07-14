import { expect } from 'chai';
import { iterateInternal } from '../../lib/iterate-internal';

describe('iterateInternal', function() {
	it('iterates through all causes of an error', function() {
		const fooErr: any = new Error('foo');
		const barErr: any = fooErr.cause = new Error('bar');
		const bazErr: any = barErr.cause = new Error('baz');

		const results = [ ...iterateInternal(fooErr) ];

		expect(results).to.deep.equal([
			{ err: fooErr, parent: null, inArray: false },
			{ err: barErr, parent: fooErr, inArray: false },
			{ err: bazErr, parent: barErr, inArray: false },
		]);
	});

	it('iterates through errors array instead of cause, if any', function() {
		const fooErr: any = new Error('foo');
		const barErr: any = fooErr.cause = new Error('bar');
		const bazErr: any = new Error('baz');
		fooErr.errors = [ barErr, bazErr ];

		const results = [ ...iterateInternal(fooErr) ];

		expect(results).to.deep.equal([
			{ err: fooErr, parent: null, inArray: false },
			{ err: barErr, parent: fooErr, inArray: true },
			{ err: bazErr, parent: fooErr, inArray: true },
		]);
	});

	it('iterates causes of errors in errors array', function() {
		const fooErr: any = new Error('foo');
		const barErr: any = fooErr.cause = new Error('bar');
		const bazErr: any = barErr.cause = Error('baz');
		fooErr.errors = [ barErr ];

		const results = [ ...iterateInternal(fooErr) ];

		expect(results).to.deep.equal([
			{ err: fooErr, parent: null, inArray: false },
			{ err: barErr, parent: fooErr, inArray: true },
			{ err: bazErr, parent: barErr, inArray: false },
		]);
	});

	it('handles circular references in cause chain', function() {
		const fooErr: any = new Error('foo');
		const barErr: any = fooErr.cause = new Error('bar');
		const bazErr: any = barErr.cause = new Error('baz');
		bazErr.cause = fooErr;

		const results = [ ...iterateInternal(fooErr) ];

		expect(results).to.deep.equal([
			{ err: fooErr, parent: null, inArray: false },
			{ err: barErr, parent: fooErr, inArray: false },
			{ err: bazErr, parent: barErr, inArray: false },
		]);
	});

	it('handles circular references in errors array', function() {
		const fooErr: any = new Error('foo');
		const barErr: any = new Error('bar');
		const bazErr: any = new Error('baz');
		barErr.cause = bazErr;
		fooErr.errors = [
			fooErr, // Should be skipped due to circular reference.
			barErr, // Should result in bar followed by baz, with bar as parent.
			bazErr, // Should result in baz again, but with foo as parent.
		];

		const results = [ ...iterateInternal(fooErr) ];

		expect(results).to.deep.equal([
			{ err: fooErr, parent: null, inArray: false },
			{ err: barErr, parent: fooErr, inArray: true },
			{ err: bazErr, parent: barErr, inArray: false },
			{ err: bazErr, parent: fooErr, inArray: true },
		]);
	});
});
