import * as isModule from '../../lib/is';
import { normalizePredicate } from '../../lib/normalize-predicate';

describe('normalizePredicate', function() {
	const predicate = () => {};

	beforeEach(function() {
		sinon.stub(isModule, 'is').returns(false);
	});

	it('checks if the predicate is an Error class', function() {
		normalizePredicate(predicate);

		expect(isModule.is).to.be.calledOnce;
		expect(isModule.is).to.be.calledWith(Error, predicate);
	});

	it('returns predicate, if it is not an Error class', function() {
		const result = normalizePredicate(predicate);

		expect(result).to.equal(predicate);
	});

	it('returns a different function, if predicate is an Error class', function() {
		isModule.is.returns(true);

		const result = normalizePredicate(predicate);

		expect(result).to.be.a('function');
		expect(result).to.not.equal(predicate);
	});

	describe('function returned when predicate is an Error class', function() {
		it('returns result of is with predicate and provided error', function() {
			const err = new Error('Omg bad error!');
			const isResult = 'result of is function';
			isModule.is.returns(true);
			const fn = normalizePredicate(predicate);
			isModule.is.reset();
			isModule.is.returns(isResult);

			const result = fn(err);

			expect(isModule.is).to.be.calledOnce;
			expect(isModule.is).to.be.calledWith(predicate, err);
			expect(result).to.equal(isResult);
		});
	});
});
