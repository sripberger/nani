import * as findInternalModule from '../../lib/find-cause-internal';
import * as normalizePredicateModule from '../../lib/normalize-predicate';
import { filter, find } from '../../lib/find-cause';

describe('External find utils', function() {
	const err = new Error('err');
	const predicate = () => {};
	const normalized = () => {};
	let normalizePredicate;

	beforeEach(function() {
		normalizePredicate = sinon.stub(
			normalizePredicateModule,
			'normalizePredicate'
		).returns(normalized);
	});

	describe('find', function() {
		it('finds cause in error by normalized predicate', function() {
			const cause = new Error('err cause');
			const findByPredicate = sinon.stub(
				findInternalModule,
				'findByPredicate'
			).returns(cause);

			const result = find(err, predicate);

			expect(normalizePredicate).to.be.calledOnce;
			expect(normalizePredicate).to.be.calledWith(predicate);
			expect(findByPredicate).to.be.calledOnce;
			expect(findByPredicate).to.be.calledWith(err, normalized);
			expect(result).to.equal(cause);
		});
	});

	describe('filter', function() {
		it('filters causes of error by normalized predicate', function() {
			const causes = [ new Error('foo'), new Error('bar') ];
			const filterByPredicate = sinon.stub(
				findInternalModule,
				'filterByPredicate'
			).returns(causes);

			const result = filter(err, predicate);

			expect(normalizePredicate).to.be.calledOnce;
			expect(normalizePredicate).to.be.calledWith(predicate);
			expect(filterByPredicate).to.be.calledOnce;
			expect(filterByPredicate).to.be.calledWith(err, normalized);
			expect(result).to.equal(causes);
		});
	});
});
