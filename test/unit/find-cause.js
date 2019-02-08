import * as iterateCausesModule from '../../lib/iterate-causes';
import { findCause } from '../../lib/find-cause';

describe('findCause', function() {
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

	it('iterates over causes of err', function() {
		findCause(err, predicate);

		expect(iterateCausesModule.iterateCauses).to.be.calledOnce;
		expect(iterateCausesModule.iterateCauses).to.be.calledWith(err);
	});

	it('invokes predicate with each cause', function() {
		findCause(err, predicate);

		expect(predicate).to.be.calledThrice;
		expect(predicate).to.be.calledWith(fooErr);
		expect(predicate).to.be.calledWith(barErr);
		expect(predicate).to.be.calledWith(bazErr);
	});

	it('returns first cause where predicate returns true', function() {
		predicate.withArgs(barErr).returns(true);

		const result = findCause(err, predicate);

		expect(predicate).to.be.calledTwice;
		expect(predicate).to.be.calledWith(fooErr);
		expect(predicate).to.be.calledWith(barErr);
		expect(result).to.equal(barErr);
	});

	it('returns null if predicate never returns true', function() {
		const result = findCause(err, predicate);

		expect(result).to.be.null;
	});
});
