import NaniError from '../../lib/nani-error';

// We need a simple subclass to test derived class behavior.
class TestError extends NaniError {}

describe('NaniError', function() {
	describe('constructor', function() {
		const defaultMessage = 'default message';
		const message = 'Omg bad error!';
		const cause = new Error('Cause of bad error!');
		const info = { foo: 'bar' };

		beforeEach(function() {
			sinon.stub(TestError, 'defaultMessage').get(() => defaultMessage);
		});

		it('supports signature with options object', function() {
			const err = new TestError({ message, cause, info });

			expect(err).to.be.an.instanceof(Error);
			expect(err.cause).to.equal(cause);
			expect(err.info).to.equal(info);
			expect(err.shortMessage).to.equal(message);
			expect(err.message).to.equal(
				`${message} : ${cause.message}`
			);
		});

		it('uses default message if none is provided', function() {
			const err = new TestError({ cause, info });

			expect(err).to.be.an.instanceof(Error);
			expect(err.cause).to.equal(cause);
			expect(err.info).to.equal(info);
			expect(err.shortMessage).to.equal(defaultMessage);
			expect(err.message).to.equal(
				`${defaultMessage} : ${cause.message}`
			);
		});

		it('defaults to null cause', function() {
			const err = new TestError({ message, info });

			expect(err).to.be.an.instanceof(Error);
			expect(err.cause).to.be.null;
			expect(err.info).to.equal(info);
			expect(err.shortMessage).to.equal(message);
			expect(err.message).to.equal(message);
		});

		it('defaults to null info', function() {
			const err = new TestError({ message, cause });

			expect(err).to.be.an.instanceof(Error);
			expect(err.cause).to.equal(cause);
			expect(err.info).to.be.null;
			expect(err.shortMessage).to.equal(message);
			expect(err.message).to.equal(
				`${message} : ${cause.message}`
			);
		});

		it('supports signature with message preceding options', function() {
			const err = new TestError(message, { cause, info });

			expect(err).to.be.an.instanceof(Error);
			expect(err.cause).to.equal(cause);
			expect(err.info).to.equal(info);
			expect(err.shortMessage).to.equal(message);
			expect(err.message).to.equal(
				`${message} : ${cause.message}`
			);
		});

		it('supports signature with cause preceding options', function() {
			const err = new TestError(cause, { message, info });

			expect(err).to.be.an.instanceof(Error);
			expect(err.cause).to.equal(cause);
			expect(err.info).to.equal(info);
			expect(err.shortMessage).to.equal(message);
			expect(err.message).to.equal(
				`${message} : ${cause.message}`
			);
		});

		it('supports signature with message and cause preceding options', function() {
			const err = new TestError(message, cause, { info });

			expect(err).to.be.an.instanceof(Error);
			expect(err.cause).to.equal(cause);
			expect(err.info).to.equal(info);
			expect(err.shortMessage).to.equal(message);
			expect(err.message).to.equal(
				`${message} : ${cause.message}`
			);
		});

		it('priortizes options object over preceding arguments', function() {
			const options = { message, cause, info };
			const err = new TestError('foo', new Error('bar'), options);

			expect(err).to.be.an.instanceof(Error);
			expect(err.cause).to.equal(cause);
			expect(err.info).to.equal(info);
			expect(err.shortMessage).to.equal(message);
			expect(err.message).to.equal(
				`${message} : ${cause.message}`
			);
		});

		it('supports signature with no options object', function() {
			const err = new TestError(message, cause);

			expect(err).to.be.an.instanceof(Error);
			expect(err.cause).to.equal(cause);
			expect(err.info).to.be.null;
			expect(err.shortMessage).to.equal(message);
			expect(err.message).to.equal(
				`${message} : ${cause.message}`
			);
		});

		it('supports signature with message only', function() {
			const err = new TestError(message);

			expect(err).to.be.an.instanceof(Error);
			expect(err.cause).to.be.null;
			expect(err.info).to.be.null;
			expect(err.shortMessage).to.equal(message);
			expect(err.message).to.equal(message);
		});

		it('supports signature with cause only', function() {
			const err = new TestError(cause);

			expect(err).to.be.an.instanceof(Error);
			expect(err.cause).to.equal(cause);
			expect(err.info).to.be.null;
			expect(err.shortMessage).to.equal(defaultMessage);
			expect(err.message).to.equal(
				`${defaultMessage} : ${cause.message}`
			);
		});

		it('supports signature with no arguments', function() {
			const err = new TestError();

			expect(err).to.be.an.instanceof(Error);
			expect(err.cause).to.be.null;
			expect(err.info).to.be.null;
			expect(err.shortMessage).to.equal(defaultMessage);
			expect(err.message).to.equal(defaultMessage);
		});
	});

	describe('@name', function() {
		it('returns contructor name', function() {
			expect(new NaniError().name).to.equal('NaniError');
			expect(new TestError().name).to.equal('TestError');
		});
	});

	describe('@fullName', function() {
		it('returns constructor fullName', function() {
			const fullName = 'full name';
			sinon.stub(TestError, 'fullName').get(() => fullName);

			expect(new TestError().fullName).to.equal(fullName);
		});
	});

	describe('@@defaultMessage', function() {
		it('returns a generic error message', function() {
			expect(TestError.defaultMessage).to.equal('An error has occurred');
		});

		it('is read only', function() {
			expect(() => {
				TestError.defaultMessage = 'whatever';
			}).to.throw('Cannot set property defaultMessage');
		});
	});

	describe('@@fullName', function() {
		const fullName = 'full name';

		beforeEach(function() {
			sinon.stub(TestError, '_getFullName').returns(fullName);
		});

		afterEach(function() {
			delete TestError._fullName;
		});

		it('sets to _fullName and returns result of _getFullNane', function() {
			expect(TestError.fullName).to.equal(fullName);
			expect(TestError._fullName).to.equal(fullName);
			expect(TestError._getFullName).to.be.calledOnce;
			expect(TestError._getFullName).to.be.calledOn(TestError);
		});

		it('returns _fullName without calling _getFullName, if it is already set', function() {
			TestError._fullName = fullName;

			expect(TestError.fullName).to.equal(fullName);
			expect(TestError._getFullName).to.not.be.called;
		});
	});

	describe('::_getFullName', function() {
		it('returns fullname of superclass, with own name appended', function() {
			sinon.stub(NaniError, 'fullName').get(() => 'full name');

			expect(TestError._getFullName()).to.equal('full name.TestError');
		});

		it('returns \'Error.NaniError\' for NaniError itelf', function() {
			expect(NaniError._getFullName()).to.equal('Error.NaniError');
		});
	});
});
