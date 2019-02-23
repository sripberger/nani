import * as iterateInternalModule from '../../lib/iterate-internal';
import { Iterator } from '../../lib/iterator';

describe('Iterator', function() {
	let iterator;

	beforeEach(function() {
		iterator = new Iterator();
	});

	it('creates an empty set for storing seen errors', function() {
		expect(iterator.seenErrors).to.deep.equal(new Set());
	});

	describe('#iterate', function() {
		let fooErr, barErr, bazErr, iterateInternal;

		beforeEach(function() {
			fooErr = new Error('foo');
			barErr = new Error('bar');
			bazErr = new Error('baz');

			iterateInternal = sinon.stub(
				iterateInternalModule,
				'iterateInternal'
			).returns({
				*[Symbol.iterator]() {
					yield { err: barErr };
					yield { err: bazErr };
				},
			});
		});

		it('yields errors from iterateInternal, storing each in seenErrors', function() {
			const results = [ ...iterator.iterate(fooErr) ];

			expect(iterateInternal).to.be.calledOnce;
			expect(iterateInternal).to.be.calledWithExactly(fooErr);
			expect(results).to.deep.equal([ barErr, bazErr ]);
			expect(iterator.seenErrors).to.have.keys(barErr, bazErr);
		});

		it('skips errors that are already in seenErrors', function() {
			iterator.seenErrors.add(barErr);

			const results = [ ...iterator.iterate(fooErr) ];

			expect(results).to.deep.equal([ bazErr ]);
		});
	});
});
