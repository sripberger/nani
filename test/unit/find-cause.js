import * as internal from '../../lib/internal';
import { findCause } from '../../lib/find-cause';

describe('findCause', function() {
	it('finds cause in error by predicate', function() {
		const err = new Error('err');
		const cause = new Error('err cause');
		const predicate = () => {};
		sinon.stub(internal, 'findCauseByPredicate').returns(cause);

		const result = findCause(err, predicate);

		expect(internal.findCauseByPredicate).to.be.calledOnce;
		expect(internal.findCauseByPredicate).to.be.calledWith(err, predicate);
		expect(result).to.equal(cause);
	});
});
