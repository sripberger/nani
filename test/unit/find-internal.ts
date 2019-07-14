import * as isModule from '../../lib/is';
import * as iterateExternal from '../../lib/iterate-external';
import * as sinon from 'sinon';

import {
	filterByPredicate,
	findByPredicate,
	normalizePredicate,
} from '../../lib/find-internal';

import { expect } from 'chai';

describe('find-internal', function() {
	let is: sinon.SinonStub;

	describe('normalizePredicate', function() {
		const predicate = () => false;

		beforeEach(function() {
			is = sinon.stub(isModule, 'is').returns(false);
		});

		it('checks if the predicate is an Error class', function() {
			normalizePredicate(predicate);

			expect(is).to.be.calledOnce;
			expect(is).to.be.calledWith(Error, predicate);
		});

		it('returns predicate, if it is not an Error class', function() {
			const result = normalizePredicate(predicate);

			expect(result).to.equal(predicate);
		});

		it('returns a different function, if predicate is an Error class', function() {
			is.returns(true);

			const result = normalizePredicate(predicate);

			expect(result).to.be.a('function');
			expect(result).to.not.equal(predicate);
		});

		describe('function returned when predicate is an Error class', function() {
			it('returns result of is with predicate and provided error', function() {
				const err = new Error('Omg bad error!');
				const isResult = 'result of is function';
				is.returns(true);
				const fn = normalizePredicate(predicate);
				is.reset();
				is.returns(isResult);

				const result = fn(err);

				expect(isModule.is).to.be.calledOnce;
				expect(isModule.is).to.be.calledWith(predicate, err);
				expect(result).to.equal(isResult);
			});
		});
	});

	describe('...ByPredicate functions', function() {
		let err: Error;
		let fooErr: Error;
		let barErr: Error;
		let bazErr: Error;
		let predicate: sinon.SinonStub;

		beforeEach(function() {
			err = new Error('Original error');
			fooErr = new Error('foo');
			barErr = new Error('bar');
			bazErr = new Error('baz');
			predicate = sinon.stub().named('predicate').returns(false);

			sinon.stub(iterateExternal, 'iterate').returns({
				*[Symbol.iterator]() {
					yield fooErr;
					yield barErr;
					yield bazErr;
				},
			} as any);
		});

		describe('findByPredicate', function() {
			it('iterates over causes of err', function() {
				findByPredicate(err, predicate);

				expect(iterateExternal.iterate).to.be.calledOnce;
				expect(iterateExternal.iterate).to.be.calledWith(err);
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

				expect(iterateExternal.iterate).to.be.calledOnce;
				expect(iterateExternal.iterate).to.be.calledWith(err);
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
});
