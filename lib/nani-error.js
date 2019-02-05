import _ from 'lodash';

export default class NaniError extends Error {
	constructor(...args) {
		super();

		// Normalize args into an options object.
		const options = {};
		if (_.isString(args[0])) options.message = args.shift();
		if (args[0] instanceof Error) options.cause = args.shift();
		_.assign(options, args[0]);

		// Set properties based on the options object.
		this.shortMessage = options.message || this.constructor.defaultMessage;
		this.cause = options.cause || null;
		this.info = options.info || null;

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
