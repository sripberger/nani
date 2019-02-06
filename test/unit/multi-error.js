import MultiError from '../../lib/multi-error';
import NaniError from '../../lib/nani-error';

describe('MultiError', function() {
	it('extends NaniError', function() {
		expect(new MultiError()).to.be.an.instanceof(NaniError);
	});

	it('supports signature with an array of errors', function() {
		const fooErr = new Error('Foo happened!');
		const barErr = new Error('Bar happened!');

		const err = new MultiError([ fooErr, barErr ]);

		expect(err.message).to.equal(`first of 2 errors : ${fooErr.message}`);
		expect(err.shortMessage).to.equal('first of 2 errors');
		expect(err.cause).to.equal(fooErr);
		expect(err.errors).to.deep.equal([ fooErr, barErr ]);
	});

	it('supports signature with errors as arguments', function() {
		const fooErr = new Error('Foo happened!');
		const barErr = new Error('Bar happened!');
		const bazErr = new Error('Baz happened!');

		const err = new MultiError(fooErr, barErr, bazErr);

		expect(err.message).to.equal(`first of 3 errors : ${fooErr.message}`);
		expect(err.shortMessage).to.equal('first of 3 errors');
		expect(err.cause).to.equal(fooErr);
		expect(err.errors).to.deep.equal([ fooErr, barErr, bazErr ]);
	});

	it('supports an empty multi-error', function() {
		const err = new MultiError();

		expect(err.message).to.equal('first of 0 errors');
		expect(err.shortMessage).to.equal('first of 0 errors');
		expect(err.cause).to.be.null;
		expect(err.errors).to.deep.equal([]);
	});
});
