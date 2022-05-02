import * as iterateInternalModule from "../../lib/iterate-internal";
import * as sinon from "sinon";
import {Iterator} from "../../lib/iterator";
import {expect} from "chai";

describe("Iterator", function() {
	let iterator: Iterator;

	beforeEach(function() {
		iterator = new Iterator();
	});

	it("creates an empty set for storing seen errors", function() {
		expect(iterator.seenErrors).to.deep.equal(new Set());
	});

	describe("#iterate", function() {
		let fooErr: Error;
		let barErr: Error;
		let bazErr: Error;
		let iterateInternal: sinon.SinonStub;

		beforeEach(function() {
			fooErr = new Error("foo");
			barErr = new Error("bar");
			bazErr = new Error("baz");

			iterateInternal = sinon.stub(
				iterateInternalModule,
				"iterateInternal",
			).returns({
				*[Symbol.iterator]() {
					yield {err: barErr};
					yield {err: bazErr};
				},
			} as any);
		});

		it("yields errors from iterateInternal, storing each in seenErrors", function() {
			const results = [...iterator.iterate(fooErr)];

			expect(iterateInternal).to.be.calledOnce;
			expect(iterateInternal).to.be.calledWithExactly(fooErr);
			expect(results).to.deep.equal([barErr, bazErr]);
			expect(iterator.seenErrors).to.have.keys(
				barErr as any,
				bazErr as any,
			);
		});

		it("skips errors that are already in seenErrors", function() {
			iterator.seenErrors.add(barErr);

			const results = [...iterator.iterate(fooErr)];

			expect(results).to.deep.equal([bazErr]);
		});
	});
});
