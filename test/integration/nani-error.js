const { NaniError } = require('../../cjs');

describe('NaniError', function() {
	const shortMessage = 'Omg bad error!';
	const cause = new Error('Cause of bad error');

	it('supports error messages, using default if omitted', function() {
		// Create with options object.
		let err = new NaniError({ shortMessage });
		expect(err).to.be.an.instanceof(Error);
		expect(err.message).to.equal(shortMessage);

		// Try again with shorthand signature.
		err = new NaniError(shortMessage);
		expect(err).to.be.an.instanceof(Error);
		expect(err.message).to.equal(shortMessage);

		// Check the default error message
		err = new NaniError();
		expect(err).to.be.an.instanceof(Error);
		expect(err.message).to.equal('An error has occurred');
	});

	it('supports overriding of the default message', function() {
		// Create a subclass that overrides ::getDefaultMessage.
		const defaultMessage = 'some other default message';
		class FooError extends NaniError {
			static getDefaultMessage() {
				return defaultMessage;
			}
		}

		// Make sure it works.
		expect(new FooError().message).to.equal(defaultMessage);
	});

	it('supports cause message chaining', function() {
		// Create with options object.
		let err = new NaniError({ shortMessage, cause });
		expect(err).to.be.an.instanceof(Error);
		expect(err.message).to.equal(`${shortMessage} : ${cause.message}`);
		expect(err.shortMessage).to.equal(shortMessage);
		expect(err.cause).to.equal(cause);

		// Try again with shorthand signature.
		err = new NaniError(shortMessage, cause);
		expect(err).to.be.an.instanceof(Error);
		expect(err.message).to.equal(`${shortMessage} : ${cause.message}`);
		expect(err.shortMessage).to.equal(shortMessage);
		expect(err.cause).to.equal(cause);

		// Try again with cause-only signature.
		err = new NaniError(cause);
		expect(err).to.be.an.instanceof(Error);
		expect(err.message).to.equal(
			`An error has occurred : ${cause.message}`
		);
		expect(err.shortMessage).to.equal('An error has occurred');
		expect(err.cause).to.equal(cause);
	});

	it('supports disabling of cause message chaining', function() {
		// Create with options object.
		let err = new NaniError({
			shortMessage,
			cause,
			hideCauseMessage: true,
		});
		expect(err).to.be.an.instanceof(Error);
		expect(err.message).to.equal(shortMessage);
		expect(err.shortMessage).to.equal(shortMessage);
		expect(err.cause).to.equal(cause);

		// Try again with shorthand signature.
		err = new NaniError(shortMessage, cause, { hideCauseMessage: true });
		expect(err).to.be.an.instanceof(Error);
		expect(err.message).to.equal(shortMessage);
		expect(err.shortMessage).to.equal(shortMessage);
		expect(err.cause).to.equal(cause);

		// Try again with default message.
		err = new NaniError(cause, { hideCauseMessage: true });
		expect(err).to.be.an.instanceof(Error);
		expect(err.message).to.equal('An error has occurred');
		expect(err.shortMessage).to.equal('An error has occurred');
		expect(err.cause).to.equal(cause);
	});

	it('supports error info', function() {
		// Create with options object.
		let err = new NaniError({ shortMessage, info: { foo: 'bar' } });
		expect(err).to.be.an.instanceof(Error);
		expect(err.message).to.equal(shortMessage);
		expect(err.info).to.deep.equal({ foo: 'bar' });

		// Try again with shorthand signature.
		err = new NaniError(shortMessage, { info: { foo: 'bar' } });
		expect(err).to.be.an.instanceof(Error);
		expect(err.message).to.equal(shortMessage);
		expect(err.info).to.deep.equal({ foo: 'bar' });

		// Try again with default message..
		err = new NaniError({ info: { foo: 'bar' } });
		expect(err).to.be.an.instanceof(Error);
		expect(err.message).to.equal('An error has occurred');
		expect(err.info).to.deep.equal({ foo: 'bar' });
	});

	it('supports default messages based on error info', function() {
		// Create another subclass that overrides ::getDefaultMessage.
		// This time, use the `info` argument of that method.
		class FooError extends NaniError {
			static getDefaultMessage(info) {
				return `Value of foo: ${info.foo}`;
			}
		}

		// Make sure it works.
		let err = new FooError({ info: { foo: 'bar' } });
		expect(err.message).to.equal('Value of foo: bar');

		// Try with some other info value.
		err = new FooError({ info: { foo: 'baz' } });
		expect(err.message).to.equal('Value of foo: baz');

		// Try with a cause chain.
		err = new FooError(cause, { info: { foo: 'qux' } });
		expect(err.message).to.equal(`Value of foo: qux : ${cause.message}`);
		expect(err.shortMessage).to.equal('Value of foo: qux');

		// Try with no info.
		err = new FooError();
		expect(err.message).to.equal('Value of foo: undefined');
	});

	it('supports name and fullName properties in subclasses', function() {
		// Make some subclasses.
		class FooError extends NaniError {}
		class BarError extends NaniError {}
		class BazError extends FooError {}

		// Check constructor names.
		expect(NaniError.name).to.equal('NaniError');
		expect(FooError.name).to.equal('FooError');
		expect(BarError.name).to.equal('BarError');
		expect(BazError.name).to.equal('BazError');

		// Check constructor full names.
		expect(NaniError.fullName).to.equal('Error.NaniError');
		expect(FooError.fullName).to.equal('Error.NaniError.FooError');
		expect(BarError.fullName).to.equal('Error.NaniError.BarError');
		expect(BazError.fullName).to.equal('Error.NaniError.FooError.BazError');

		// create some instances.
		const naniErr = new NaniError();
		const fooErr = new FooError();
		const barErr = new BarError();
		const bazErr = new BazError();

		// Check instance names.
		expect(naniErr.name).to.equal('NaniError');
		expect(fooErr.name).to.equal('FooError');
		expect(barErr.name).to.equal('BarError');
		expect(bazErr.name).to.equal('BazError');

		// Check instance full names.
		expect(naniErr.fullName).to.equal('Error.NaniError');
		expect(fooErr.fullName).to.equal('Error.NaniError.FooError');
		expect(barErr.fullName).to.equal('Error.NaniError.BarError');
		expect(bazErr.fullName).to.equal('Error.NaniError.FooError.BazError');
	});
});
