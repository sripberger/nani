import { Iterator } from '../../lib/iterator';

describe('Iterator', function() {
	let iterator;

	beforeEach(function() {
		iterator = new Iterator();
	});

	it('creates an empty set for storing iterated errors', function() {
		expect(iterator.errors).to.deep.equal(new Set());
	});

	describe('#iterate', function() {
		it('iterates through all causes of an error, storing each in errors set', function() {
			const fooErr = new Error('foo');
			const barErr = fooErr.cause = new Error('bar');
			const bazErr = barErr.cause = new Error('baz');

			const result = [ ...iterator.iterate(fooErr) ];

			expect(result).to.deep.equal([ fooErr, barErr, bazErr ]);
			expect(iterator.errors).to.have.keys(fooErr, barErr, bazErr);
		});

		it('iterates through errors property instead of cause, if any', function() {
			const fooErr = new Error('foo');
			const barErr = fooErr.cause = new Error('bar');
			const bazErr = new Error('baz');
			fooErr.errors = [ barErr, bazErr ];

			const result = [ ...iterator.iterate(fooErr) ];

			expect(result).to.deep.equal([ fooErr, barErr, bazErr ]);
			expect(iterator.errors).to.have.keys(fooErr, barErr, bazErr);
		});

		it('iterates causes of errors in errors property', function() {
			const fooErr = new Error('foo');
			const barErr = fooErr.cause = new Error('bar');
			const bazErr = barErr.cause = Error('baz');
			fooErr.errors = [ barErr ];

			const result = [ ...iterator.iterate(fooErr) ];

			expect(result).to.deep.equal([ fooErr, barErr, bazErr ]);
			expect(iterator.errors).to.have.keys(fooErr, barErr, bazErr);
		});

		it('yields nothing if error is in errors set', function() {
			const err = new Error('whatver');
			iterator.errors.add(err);

			const result = [ ...iterator.iterate(err) ];

			expect(result).to.be.empty;
		});
	});
});
