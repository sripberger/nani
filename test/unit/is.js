import * as utils from '../../lib/utils';
import { is } from '../../lib/is';

describe('::is', function() {
	let sup, err;

	beforeEach(function() {
		sup = { name: 'SuperError' };
		err = { name: 'SubError' };
	});

	it('gets the full name of both sup and err', function() {
		sinon.stub(utils, 'getFullName').returns('full name');

		is(sup, err);

		expect(utils.getFullName).to.be.calledTwice;
		expect(utils.getFullName).to.be.calledWith(sup);
		expect(utils.getFullName).to.be.calledWith(err);
	});

	it('returns true if err fullName starts with sup fullName', function() {
		sinon.stub(utils, 'getFullName')
			.withArgs(sup).returns('Error.SuperError')
			.withArgs(err).returns('Error.SuperError.SubError');

		expect(is(sup, err)).to.be.true;
	});

	it('returns false if err fullName does not start with sup fullName', function() {
		sinon.stub(utils, 'getFullName')
			.withArgs(sup).returns('Error.SuperError')
			.withArgs(err).returns('Error.SubError');

		expect(is(sup, err)).to.be.false;
	});

	it('returns false if err fullName is null', function() {
		sinon.stub(utils, 'getFullName')
			.withArgs(sup).returns('Error.SuperError')
			.withArgs(err).returns(null);

		expect(is(sup, err)).to.be.false;
	});

	it('returns false if err fullName is null', function() {
		sinon.stub(utils, 'getFullName')
			.withArgs(sup).returns(null)
			.withArgs(err).returns('Error.SuperError.SubError');

		expect(is(sup, err)).to.be.false;
	});
});
