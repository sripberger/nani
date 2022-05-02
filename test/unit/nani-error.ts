import * as sinon from "sinon";
import {ErrorOptions} from "../../lib/error-options";
import {NaniError} from "../../lib/nani-error";
import {expect} from "chai";

class TestError extends NaniError {}

class PrefixedTestError extends TestError {
	static prefix = "Some prefix";
}

describe("NaniError", function() {
	it("extends Error", function() {
		expect(new TestError()).to.be.an.instanceof(Error);
	});

	describe("constructor", function() {
		let options: ErrorOptions;
		let normalizeArgs: sinon.SinonStub;

		beforeEach(function() {
			options = {};
			normalizeArgs = sinon.stub(
				TestError as any,
				"_normalizeArgs",
			).returns(options);
		});

		it("normalizes arguments into options", function() {
			const args = ["short message", new Error("cause"), {}];

			// eslint-disable-next-line no-new
			new TestError(...args);

			expect(normalizeArgs).to.be.calledOnce;
			expect(normalizeArgs).to.be.calledWith(args);
		});

		it("stores message option as shortMessage and message props", function() {
			options.shortMessage = "Omg bad error!";

			const err = new TestError();

			expect(err.shortMessage).to.equal(options.shortMessage);
			expect(err.message).to.equal(options.shortMessage);
		});

		it("stores cause and chains its message onto original message, if any", function() {
			options.shortMessage = "Omg bad error!";
			options.cause = new Error("Omg bad error!");

			const err = new TestError();

			expect(err.cause).to.equal(options.cause);
			expect(err.shortMessage).to.equal(options.shortMessage);
			expect(err.message).to.equal(
				`${options.shortMessage} : ${options.cause.message}`,
			);
		});

		it("defaults to null cause", function() {
			expect(new TestError().cause).to.be.null;
		});

		it("stores provided info", function() {
			options.info = {foo: "bar"};

			const err = new TestError();

			expect(err.info).to.equal(options.info);
		});

		it("defaults to null info", function() {
			const err = new TestError();

			expect(err.info).to.be.null;
		});

		it("supports hideCauseMessage option", function() {
			options.shortMessage = "Omg bad error!";
			options.cause = new Error("Omg bad error!");
			options.hideCauseMessage = true;

			const err = new TestError();

			expect(err.message).to.equal(options.shortMessage);
		});

		it("prepends the prefix to the message, if any", function() {
			options.shortMessage = "Omg bad error!";

			const err = new PrefixedTestError();

			expect(err.message).to.equal("Some prefix : Omg bad error!");
			expect(err.shortMessage).to.equal(options.shortMessage);
		});

		it("supports both prefixes and cause chains at once", function() {
			options.shortMessage = "Omg bad error!";
			options.cause = new Error("Cause of error");

			const err = new PrefixedTestError();

			expect(err.message).to.equal(
				"Some prefix : Omg bad error! : Cause of error",
			);
			expect(err.shortMessage).to.equal(options.shortMessage);
		});

		it("sets usedDefaultMessage to false if there is a provided shortMessage", function() {
			options.shortMessage = "Omg bad error!";

			const err = new TestError();

			expect(err.usedDefaultMessage).to.be.false;
		});

		context("no short message is provided", function() {
			const defaultMessage = "default message";
			let getDefaultMessage: sinon.SinonStub;

			beforeEach(function() {
				getDefaultMessage = sinon.stub(TestError, "getDefaultMessage")
					.returns(defaultMessage);
			});

			it("gets the short message using ::getDefaultMessage", function() {
				const err = new TestError();

				expect(getDefaultMessage).to.be.calledOnce;
				expect(getDefaultMessage).to.be.calledOn(TestError);
				expect(err.shortMessage).to.equal(defaultMessage);
				expect(err.message).to.equal(defaultMessage);
			});

			it("sets the usedDefaultMessage property to true", function() {
				const err = new TestError();

				expect(err);
			});

			it("supports cause message chained onto the default message", function() {
				options.cause = new Error("Omg bad error!");

				const err = new TestError();

				expect(err.cause).to.equal(options.cause);
				expect(err.shortMessage).to.equal(defaultMessage);
				expect(err.message).to.equal(
					`${defaultMessage} : ${options.cause.message}`,
				);
			});

			it("provides info to ::getDefaultMessage, if any", function() {
				options.info = {foo: "bar"};

				new TestError(); // eslint-disable-line no-new

				expect(getDefaultMessage).to.be.calledOnce;
				expect(getDefaultMessage).to.be.calledWith(options.info);
			});

			it("provides empty object to ::getDefaultMessage, if no info", function() {
				new TestError(); // eslint-disable-line no-new

				expect(getDefaultMessage).to.be.calledOnce;
				expect(getDefaultMessage).to.be.calledWith({});
			});
		});
	});

	describe("@@fullName", function() {
		const fullName = "full name";

		beforeEach(function() {
			(NaniError as any)._fullName = "superclass full name";
			sinon.stub(TestError as any, "_getFullName").returns(fullName);
		});

		afterEach(function() {
			delete (NaniError as any)._fullName;
			delete (TestError as any)._fullName;
		});

		it("sets to own _fullName and returns result of _getFullNane", function() {
			expect(TestError.fullName).to.equal(fullName);
			expect((TestError as any)._fullName).to.equal(fullName);
			expect((TestError as any)._getFullName).to.be.calledOnce;
			expect((TestError as any)._getFullName).to.be.calledOn(TestError);
		});

		it("returns own _fullName without calling _getFullName, if it is already set", function() {
			(TestError as any)._fullName = fullName;

			expect((TestError as any).fullName).to.equal(fullName);
			expect((TestError as any)._getFullName).to.not.be.called;
		});
	});

	describe("::getDefaultMessage", function() {
		it("returns a generic error message", function() {
			expect(TestError.getDefaultMessage({})).to.equal(
				"An error has occurred",
			);
		});
	});

	describe("::_getFullName", function() {
		it("returns fullname of superclass, with own name appended", function() {
			sinon.stub(NaniError, "fullName").get(() => "full name");

			expect((TestError as any)._getFullName())
				.to.equal("full name.TestError");
		});

		it("returns 'Error.NaniError' for NaniError itelf", function() {
			expect((NaniError as any)._getFullName())
				.to.equal("Error.NaniError");
		});
	});

	describe("::_normalizeArgs", function() {
		const shortMessage = "Omg bad error!";
		const cause = new Error("Cause of bad error!");
		const info = {foo: "bar"};

		it("returns a copy of options object, if it is the first arg", function() {
			const result = (NaniError as any)
				._normalizeArgs([{shortMessage, info}]);

			expect(result).to.deep.equal({shortMessage, info});
		});

		it("supports shortMessage preceding options", function() {
			const result = (NaniError as any)
				._normalizeArgs([shortMessage, {info}]);

			expect(result).to.deep.equal({shortMessage, info});
		});

		it("supports cause preceding options", function() {
			const result = (NaniError as any)
				._normalizeArgs([cause, {info}]);

			expect(result).to.deep.equal({cause, info});
		});

		it("supports shortMessage and cause preceding options", function() {
			const result = (NaniError as any)._normalizeArgs([
				shortMessage,
				cause,
				{info},
			]);

			expect(result).to.deep.equal({shortMessage, cause, info});
		});

		it("prioritizes options props over preceding args", function() {
			const result = (NaniError as any)._normalizeArgs([
				"foo",
				new Error("bar"),
				{shortMessage, cause, info},
			]);

			expect(result).to.deep.equal({shortMessage, cause, info});
		});

		it("returns an empty object, if no args are provided", function() {
			const result = (NaniError as any)._normalizeArgs([]);

			expect(result).to.deep.equal({});
		});
	});

	describe("@name", function() {
		it("returns the contructor name", function() {
			expect(new NaniError().name).to.equal("NaniError");
			expect(new TestError().name).to.equal("TestError");
		});
	});

	describe("@fullName", function() {
		it("returns the constructor fullName", function() {
			const fullName = "full name";
			sinon.stub(TestError, "fullName").get(() => fullName);

			expect(new TestError().fullName).to.equal(fullName);
		});
	});
});
