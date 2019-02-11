import * as internal from '../../lib/internal';
import * as normalizePredicateModule from '../../lib/normalize-predicate';
import { findCause } from '../../lib/find-cause';

describe('findCause', function() {
	it('finds cause in error by normalized predicate', function() {
		const err = new Error('err');
		const cause = new Error('err cause');
		const predicate = () => {};
		const normalized = () => {};
		const normalizePredicate = sinon.stub(
			normalizePredicateModule,
			'normalizePredicate'
		).returns(normalized);
		const findCauseByPredicate = sinon.stub(
			internal,
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
