import * as findCauseInternalModule from '../../lib/find-cause-internal';
import * as normalizePredicateModule from '../../lib/normalize-predicate';
import { filterCauses, findCause } from '../../lib/find-cause';

describe('External cause-finding functions', function() {
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

	describe('findCause', function() {
		it('finds cause in error by normalized predicate', function() {
			const cause = new Error('err cause');
			const findCauseByPredicate = sinon.stub(
				findCauseInternalModule,
				'findCauseByPredicate'
			).returns(cause);

			const result = findCause(err, predicate);

			expect(normalizePredicate).to.be.calledOnce;
			expect(normalizePredicate).to.be.calledWith(predicate);
			expect(findCauseByPredicate).to.be.calledOnce;
			expect(findCauseByPredicate).to.be.calledWith(err, normalized);
			expect(result).to.equal(cause);
		});
	});

	describe('filterCauses', function() {
		it('filters causes of error by normalized predicate', function() {
			const causes = [ new Error('foo'), new Error('bar') ];
			const filterCausesByPredicate = sinon.stub(
				findCauseInternalModule,
				'filterCausesByPredicate'
			).returns(causes);

			const result = filterCauses(err, predicate);

			expect(normalizePredicate).to.be.calledOnce;
			expect(normalizePredicate).to.be.calledWith(predicate);
			expect(filterCausesByPredicate).to.be.calledOnce;
			expect(filterCausesByPredicate).to.be.calledWith(err, normalized);
			expect(result).to.equal(causes);
		});
	});
});
