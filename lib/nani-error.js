import _ from 'lodash';

export default class NaniError extends Error {
	constructor(...args) {
		super();

		// Get the options object.
		let options;
		if (args[0] instanceof Error) {
			// Cause-only shorthand.
			options = { cause: args.shift() };
		} else if (_.isPlainObject(args[0])) {
			// Full options object.
			options = args.shift();
		} else {
			// No options provided.
			options = {};
		}

		// Set properties from the options object.
		this.cause = options.cause || null;
		this.info = options.info || null;

		// Set the shortMessage property.
		this.shortMessage = args[0] || this.constructor.defaultMessage;

		// Compute and set the full message property.
		if (this.cause) {
			// Chain the cause message after this error's shortMessage.
			this.message = `${this.shortMessage} : ${this.cause.message}`;
		} else {
			// No cause message to chain.
			this.message = this.shortMessage;
		}
	}

	get name() {
		return this.constructor.name;
	}

	get fullName() {
		return this.constructor.fullName;
	}

	static get defaultMessage() {
		return 'An error has occurred';
	}

	static get fullName() {
		if (!this._fullName) this._fullName = this._getFullName();
		return this._fullName;
	}

	static _getFullName() {
		const sup = Object.getPrototypeOf(this);
		if (!sup.fullName) return `Error.${this.name}`;
		return `${sup.fullName}.${this.name}`;
	}
}
