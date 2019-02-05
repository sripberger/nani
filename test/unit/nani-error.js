import * as utils from '../../lib/utils';
import NaniError from '../../lib/nani-error';

// We need a simple subclass to test derived class behavior.
class TestError extends NaniError {}

describe('NaniError', function() {
	it('extends Error', function() {
		expect(new TestError()).to.be.an.instanceof(Error);
	});

	describe('constructor', function() {
		let options;

		beforeEach(function() {
			options = {};
			sinon.stub(utils, 'normalizeArgs').returns(options);
		});

		it('normalizes arguments into options', function() {
			const args = [ 'foo', 'bar', 'baz' ];

			// eslint-disable-next-line no-new
			new TestError(...args);

			expect(utils.normalizeArgs).to.be.calledOnce;
			expect(utils.normalizeArgs).to.be.calledWith(args);
		});

		it('stores message option as shortMessage and message props', function() {
			options.message = 'Omg bad error!';

			const err = new TestError();

			expect(err.shortMessage).to.equal(options.message);
			expect(err.message).to.equal(options.message);
		});

		it('gets message using ::getDefaultMessage, if none is provided', function() {
			const defaultMessage = 'default message';
			sinon.stub(TestError, 'getDefaultMessage').returns(defaultMessage);

			const err = new TestError();

			expect(TestError.getDefaultMessage).to.be.calledOnce;
			expect(TestError.getDefaultMessage).to.be.calledOn(TestError);
			expect(err.shortMessage).to.equal(defaultMessage);
			expect(err.message).to.equal(defaultMessage);
		});

		it('stores cause and chains its message onto original message, if any', function() {
			options.message = 'Omg bad error!';
			options.cause = new Error('Omg bad error!');

			const err = new TestError();

			expect(err.cause).to.equal(options.cause);
			expect(err.shortMessage).to.equal(options.message);
			expect(err.message).to.equal(
				`${options.message} : ${options.cause.message}`
			);
		});

		it('defaults to null cause', function() {
			expect(new TestError().cause).to.be.null;
		});

		it('stores and provides info to ::getDefaultMessage, if any', function() {
			options.info = { foo: 'bar' };
			sinon.spy(TestError, 'getDefaultMessage');

			const err = new TestError();

			expect(err.info).to.equal(options.info);
			expect(TestError.getDefaultMessage).to.be.calledOnce;
			expect(TestError.getDefaultMessage).to.be.calledWith(options.info);
		});

		it('defaults to null info', function() {
			sinon.spy(TestError, 'getDefaultMessage');

			const err = new TestError();

			expect(err.info).to.be.null;
			expect(TestError.getDefaultMessage).to.be.calledOnce;
			expect(TestError.getDefaultMessage).to.be.calledWith(null);
		});

		it('supports skipCauseMessage option', function() {
			options.message = 'Omg bad error!';
			options.cause = new Error('Omg bad error!');
			options.skipCauseMessage = true;

			const err = new TestError();

			expect(err.message).to.equal(options.message);
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

	describe('::getDefaultMessage', function() {
		it('returns a generic error message', function() {
			expect(TestError.getDefaultMessage()).to.equal(
				'An error has occurred'
			);
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
