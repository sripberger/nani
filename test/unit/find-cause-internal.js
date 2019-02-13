import * as iterateModule from '../../lib/iterate-causes';
import {
	filterByPredicate,
	findByPredicate,
} from '../../lib/find-cause-internal';

describe('Internal find utils', function() {
	let err, fooErr, barErr, bazErr, predicate;

	beforeEach(function() {
		err = new Error('Original error');
		fooErr = new Error('foo');
		barErr = new Error('bar');
		bazErr = new Error('baz');
		predicate = sinon.stub().named('predicate').returns(false);

		sinon.stub(iterateModule, 'iterate').returns({
			*[Symbol.iterator]() {
				yield fooErr;
				yield barErr;
				yield bazErr;
			},
		});
	});

	describe('findByPredicate', function() {
		it('iterates over causes of err', function() {
			findByPredicate(err, predicate);

			expect(iterateModule.iterate).to.be.calledOnce;
			expect(iterateModule.iterate).to.be.calledWith(err);
		});

		it('invokes predicate with each cause', function() {
			findByPredicate(err, predicate);

			expect(predicate).to.be.calledThrice;
			expect(predicate).to.be.calledWith(fooErr);
			expect(predicate).to.be.calledWith(barErr);
			expect(predicate).to.be.calledWith(bazErr);
		});

		it('returns first cause where predicate returns true', function() {
			predicate.withArgs(barErr).returns(true);

			const result = findByPredicate(err, predicate);

			expect(predicate).to.be.calledTwice;
			expect(predicate).to.be.calledWith(fooErr);
			expect(predicate).to.be.calledWith(barErr);
			expect(result).to.equal(barErr);
		});

		it('returns null if predicate never returns true', function() {
			const result = findByPredicate(err, predicate);

			expect(result).to.be.null;
		});
	});

	describe('filterByPredicate', function() {
		it('iterates over causes of err', function() {
			filterByPredicate(err, predicate);

			expect(iterateModule.iterate).to.be.calledOnce;
			expect(iterateModule.iterate).to.be.calledWith(err);
		});

		it('invokes predicate with each cause', function() {
			filterByPredicate(err, predicate);

			expect(predicate).to.be.calledThrice;
			expect(predicate).to.be.calledWith(fooErr);
			expect(predicate).to.be.calledWith(barErr);
			expect(predicate).to.be.calledWith(bazErr);
		});

		it('returns an array of causes for which predicate returns true', function() {
			predicate
				.withArgs(fooErr).returns(true)
				.withArgs(bazErr).returns(true);

			const result = filterByPredicate(err, predicate);

			expect(result).to.deep.equal([ fooErr, bazErr ]);
		});

		it('returns an empty array if predicate never returns true', function() {
			const result = filterByPredicate(err, predicate);

			expect(result).to.deep.equal([]);
		});
	});
});
