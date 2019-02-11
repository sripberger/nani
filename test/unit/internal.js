import * as iterateCausesModule from '../../lib/iterate-causes';
import {
	filterCausesByPredicate,
	findCauseByPredicate,
} from '../../lib/internal';

describe('internal functions', function() {
	let err, fooErr, barErr, bazErr, predicate;

	beforeEach(function() {
		err = new Error('Original error');
		fooErr = new Error('foo');
		barErr = new Error('bar');
		bazErr = new Error('baz');
		predicate = sinon.stub().named('predicate').returns(false);

		sinon.stub(iterateCausesModule, 'iterateCauses').returns({
			*[Symbol.iterator]() {
				yield fooErr;
				yield barErr;
				yield bazErr;
			},
		});
	});

	describe('findCauseByPredicate', function() {
		it('iterates over causes of err', function() {
			findCauseByPredicate(err, predicate);

			expect(iterateCausesModule.iterateCauses).to.be.calledOnce;
			expect(iterateCausesModule.iterateCauses).to.be.calledWith(err);
		});

		it('invokes predicate with each cause', function() {
			findCauseByPredicate(err, predicate);

			expect(predicate).to.be.calledThrice;
			expect(predicate).to.be.calledWith(fooErr);
			expect(predicate).to.be.calledWith(barErr);
			expect(predicate).to.be.calledWith(bazErr);
		});

		it('returns first cause where predicate returns true', function() {
			predicate.withArgs(barErr).returns(true);

			const result = findCauseByPredicate(err, predicate);

			expect(predicate).to.be.calledTwice;
			expect(predicate).to.be.calledWith(fooErr);
			expect(predicate).to.be.calledWith(barErr);
			expect(result).to.equal(barErr);
		});

		it('returns null if predicate never returns true', function() {
			const result = findCauseByPredicate(err, predicate);

			expect(result).to.be.null;
		});
	});

	describe('filterCausesByPredicate', function() {
		it('iterates over causes of err', function() {
			filterCausesByPredicate(err, predicate);

			expect(iterateCausesModule.iterateCauses).to.be.calledOnce;
			expect(iterateCausesModule.iterateCauses).to.be.calledWith(err);
		});

		it('invokes predicate with each cause', function() {
			filterCausesByPredicate(err, predicate);

			expect(predicate).to.be.calledThrice;
			expect(predicate).to.be.calledWith(fooErr);
			expect(predicate).to.be.calledWith(barErr);
			expect(predicate).to.be.calledWith(bazErr);
		});

		it('returns an array of causes for which predicate returns true', function() {
			predicate
				.withArgs(fooErr).returns(true)
				.withArgs(bazErr).returns(true);

			const result = filterCausesByPredicate(err, predicate);

			expect(result).to.deep.equal([ fooErr, bazErr ]);
		});

		it('returns an empty array if predicate never returns true', function() {
			const result = filterCausesByPredicate(err, predicate);

			expect(result).to.deep.equal([]);
		});
	});
});
