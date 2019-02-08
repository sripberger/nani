import * as internal from '../../lib/internal';
import { findCause } from '../../lib/find-cause';

describe('findCause', function() {
	it('finds cause in error by normalized predicate', function() {
		const err = new Error('err');
		const cause = new Error('err cause');
		const predicate = () => {};
		const normalized = () => {};
		sinon.stub(internal, 'normalizePredicate').returns(normalized);
		sinon.stub(internal, 'findCauseByPredicate').returns(cause);

		const result = findCause(err, predicate);

		expect(internal.normalizePredicate).to.be.calledOnce;
		expect(internal.normalizePredicate).to.be.calledWith(predicate);
		expect(internal.findCauseByPredicate).to.be.calledOnce;
		expect(internal.findCauseByPredicate).to.be.calledWith(err, normalized);
		expect(result).to.equal(cause);
	});
});
