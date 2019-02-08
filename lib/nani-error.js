import _ from 'lodash';

export class NaniError extends Error {
	constructor(...args) {
		super();

		// Normalize args into an options object.
		// eslint-disable-next-line no-underscore-dangle
		const options = this.constructor._normalizeArgs(args);

		// Set properties from the options object.
		this.shortMessage = options.shortMessage;
		this.cause = options.cause || null;
		this.info = options.info || null;

		// Get the default short message, if none was provided.
		if (!this.shortMessage) {
			this.shortMessage = this.constructor.getDefaultMessage(this.info);
		}

		// Compute and set the full message.
		if (this.cause && !options.skipCauseMessage) {
			this.message = `${this.shortMessage} : ${this.cause.message}`;
		} else {
			this.message = this.shortMessage;
		}
	}

	get name() {
		return this.constructor.name;
	}

	get fullName() {
		return this.constructor.fullName;
	}

	static get fullName() {
		if (!this.hasOwnProperty('_fullName')) {
			this._fullName = this._getFullName();
		}
		return this._fullName;
	}

	static getDefaultMessage() {
		return 'An error has occurred';
	}

	static _normalizeArgs(args) {
		const options = {};
		if (_.isString(args[0])) options.shortMessage = args.shift();
		if (args[0] instanceof Error) options.cause = args.shift();
		return _.assign(options, args[0]);
	}

	static _getFullName() {
		const sup = Object.getPrototypeOf(this);
		if (!sup.fullName) return `Error.${this.name}`;
		return `${sup.fullName}.${this.name}`;
	}
}
