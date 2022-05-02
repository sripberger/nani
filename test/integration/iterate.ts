import {expect} from "chai";
import {iterate} from "../../lib/";

describe("iterate (Integration)", function() {
	it("iterates all nested errors", function() {
		const fooErr: any = new Error("foo");
		const barErr: any = fooErr.cause = new Error("bar");
		const bazErr: any = barErr.cause = Error("baz");
		fooErr.errors = [barErr];

		const result = [...iterate(fooErr)];

		expect(result).to.deep.equal([fooErr, barErr, bazErr]);
	});

	it("prevents circular and repeated iteration", function() {
		const fooErr: any = new Error("foo");
		const barErr: any = new Error("bar");
		const bazErr: any = new Error("baz");
		const quxErr: any = new Error("qux");
		fooErr.errors = [fooErr, barErr, bazErr, quxErr];
		barErr.cause = bazErr;
		bazErr.cause = barErr;
		quxErr.cause = quxErr;

		const result = [...iterate(fooErr)];

		expect(result).to.deep.equal([fooErr, barErr, bazErr, quxErr]);
	});
});
