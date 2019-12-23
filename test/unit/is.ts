import * as getFullNameModule from '../../lib/get-full-name';
import * as sinon from 'sinon';
import { expect } from 'chai';
import { is } from '../../lib/is';

describe('is', function() {
	let err: any;
	let sup: any;

	beforeEach(function() {
		err = { name: 'SubError' };
		sup = { name: 'SuperError' };
	});

	it('gets the full name of both sup and err', function() {
		sinon.stub(getFullNameModule, 'getFullName').returns('full name');

		is(err, sup);

		expect(getFullNameModule.getFullName).to.be.calledTwice;
		expect(getFullNameModule.getFullName).to.be.calledWith(sup);
		expect(getFullNameModule.getFullName).to.be.calledWith(err);
	});

	it('returns true if err fullName starts with sup fullName', function() {
		sinon.stub(getFullNameModule, 'getFullName')
			.withArgs(err).returns('Error.SuperError.SubError')
			.withArgs(sup).returns('Error.SuperError');

		expect(is(err, sup)).to.be.true;
	});

	it('returns false if err fullName does not start with sup fullName', function() {
		sinon.stub(getFullNameModule, 'getFullName')
			.withArgs(err).returns('Error.SubError')
			.withArgs(sup).returns('Error.SuperError');

		expect(is(err, sup)).to.be.false;
	});

	it('returns false if err fullName is null', function() {
		sinon.stub(getFullNameModule, 'getFullName')
			.withArgs(sup).returns('Error.SuperError')
			.withArgs(err).returns(null);

		expect(is(err, sup)).to.be.false;
	});

	it('returns false if sup fullName is null', function() {
		sinon.stub(getFullNameModule, 'getFullName')
			.withArgs(err).returns('Error.SuperError.SubError')
			.withArgs(sup).returns(null);

		expect(is(err, sup)).to.be.false;
	});
});
