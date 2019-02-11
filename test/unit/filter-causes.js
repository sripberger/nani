import * as internal from '../../lib/internal';
import { filterCauses } from '../../lib/filter-causes';

describe('filterCauses', function() {
	it('filters causes of error by normalized predicate', function() {
		const err = new Error('err');
		const causes = [ new Error('foo'), new Error('bar') ];
		const predicate = () => {};
		const normalized = () => {};
		sinon.stub(internal, 'normalizePredicate').returns(normalized);
		sinon.stub(internal, 'filterCausesByPredicate').returns(causes);

		const result = filterCauses(err, predicate);

		expect(internal.normalizePredicate).to.be.calledOnce;
		expect(internal.normalizePredicate).to.be.calledWith(predicate);
		expect(internal.filterCausesByPredicate).to.be.calledOnce;
		expect(internal.filterCausesByPredicate).to.be.calledWith(
			err,
			normalized
		);
		expect(result).to.equal(causes);
	});
});
