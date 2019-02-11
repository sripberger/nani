import * as internal from '../../lib/internal';
import * as normalizePredicateModule from '../../lib/normalize-predicate';
import { filterCauses } from '../../lib/filter-causes';

describe('filterCauses', function() {
	it('filters causes of error by normalized predicate', function() {
		const err = new Error('err');
		const causes = [ new Error('foo'), new Error('bar') ];
		const predicate = () => {};
		const normalized = () => {};
		const normalizePredicate = sinon.stub(
			normalizePredicateModule,
			'normalizePredicate'
		).returns(normalized);
		const filterCausesByPredicate = sinon.stub(
			internal,
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
