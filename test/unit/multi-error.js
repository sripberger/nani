import { MultiError } from '../../lib/multi-error';
import { NaniError } from '../../lib/nani-error';

describe('MultiError', function() {
	it('extends NaniError', function() {
		expect(new MultiError()).to.be.an.instanceof(NaniError);
		expect(MultiError.fullName).to.equal('Error.NaniError.MultiError');
	});

	it('stores provided error array', function() {
		const errors = [ new Error('foo'), new Error('bar') ];

		const err = new MultiError(errors);

		expect(err.errors).to.equal(errors);
	});

	it('stores first error as the cause', function() {
		const fooErr = new NaniError('foo');
		const barErr = new NaniError('bar');

		const err = new MultiError([ fooErr, barErr ]);

		expect(err.cause).to.equal(fooErr);
	});

	it('includes number of errors followed by cause message in the message', function() {
		const fooCause = new Error('cause of foo');
		const fooErr = new NaniError('foo', fooCause);
		const barErr = new NaniError('bar');

		const err = new MultiError([ fooErr, barErr ]);
		const otherErr = new MultiError([ barErr ]);

		expect(err.message).to.equal('First of 2 errors : foo : cause of foo');
		expect(otherErr.message).to.equal('First of 1 errors : bar');
	});

	it('appends cause shortMessage to own shortMessage', function() {
		const fooCause = new Error('cause of foo');
		const fooErr = new NaniError('foo', fooCause);
		const barErr = new NaniError('bar');

		const err = new MultiError([ fooErr, barErr ]);

		expect(err.shortMessage).to.equal('First of 2 errors : foo');
	});

	it('appends cause message to shortMessage, if cause had no shortMessage', function() {
		const fooErr = new Error('foo');

		const err = new MultiError([ fooErr ]);

		expect(err.shortMessage).to.equal('First of 1 errors : foo');
	});


	it('supports signature with errors as arguments', function() {
		const fooErr = new Error('foo');
		const barErr = new Error('bar');
		const bazErr = new Error('baz');

		const err = new MultiError(fooErr, barErr, bazErr);

		expect(err.message).to.equal('First of 3 errors : foo');
		expect(err.shortMessage).to.equal('First of 3 errors : foo');
		expect(err.cause).to.equal(fooErr);
		expect(err.errors).to.deep.equal([ fooErr, barErr, bazErr ]);
	});

	it('uses appropriate messages and defaults for an empty multi-error', function() {
		const err = new MultiError();

		expect(err.message).to.equal('Empty MultiError');
		expect(err.shortMessage).to.equal('Empty MultiError');
		expect(err.cause).to.be.null;
		expect(err.errors).to.deep.equal([]);
	});
});
