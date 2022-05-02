import * as iterateInternalModule from "../../lib/iterate-internal";
import * as iteratorModule from "../../lib/iterator";
import * as sinon from "sinon";
import {iterate, iterateFull} from "../../lib/iterate-external";
import {expect} from "chai";

describe("iterate-external", function() {
	describe("iterate", function() {
		it("iterates error using a new Iterator", function() {
			const fooErr = new Error("foo");
			const barErr = new Error("bar");
			const bazErr = new Error("baz");
			const iterator = sinon.createStubInstance(iteratorModule.Iterator);
			iterator.iterate.returns({
				*[Symbol.iterator]() {
					yield barErr;
					yield bazErr;
				},
			} as any);
			sinon.stub(iteratorModule, "Iterator").returns(iterator);

			const results = [...iterate(fooErr)];

			expect(iteratorModule.Iterator).to.be.calledOnce;
			expect(iteratorModule.Iterator).to.be.calledWithNew;
			expect(iterator.iterate).to.be.calledOnce;
			expect(iterator.iterate).to.be.calledWith(fooErr);
			expect(results).to.deep.equal([barErr, bazErr]);
		});
	});

	describe("iterateFull", function() {
		it("iterates error using iterateInternal directly", function() {
			const err = new Error("Omg bad error!");
			const result1 = {foo: "bar"};
			const result2 = {ba: "qux"};
			const iterateInternal = sinon.stub(
				iterateInternalModule,
				"iterateInternal",
			).returns({
				*[Symbol.iterator]() {
					yield result1;
					yield result2;
				},
			} as any);

			const results = [...iterateFull(err)];

			expect(iterateInternal).to.be.calledOnce;
			expect(iterateInternal).to.be.calledWithExactly(err);
			expect(results).to.deep.equal([result1, result2]);
		});
	});
});
