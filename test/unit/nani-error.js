import NaniError from '../../lib/nani-error';

// We need a simple subclass to test derived class behavior.
class TestError extends NaniError {}

describe('NaniError', function() {
	it('extends Error', function() {
		expect(new TestError()).to.be.an.instanceof(Error);
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
