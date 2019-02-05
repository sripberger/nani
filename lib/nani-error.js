import { normalizeArgs } from './utils';

export default class NaniError extends Error {
	constructor(...args) {
		super();

		// Normalize args into an options object.
		const options = normalizeArgs(args);

		// Set properties from the options object.
		this.shortMessage = options.message;
		this.cause = options.cause || null;
		this.info = options.info || null;

		// Get the default short message, if none was provided.
		if (!this.shortMessage) {
			this.shortMessage = this.constructor.getDefaultMessage(this.info);
		}

		// Compute and set the full message property.
		if (this.cause) {
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
		if (!this._fullName) this._fullName = this._getFullName();
		return this._fullName;
	}

	static getDefaultMessage() {
		return 'An error has occurred';
	}

	static _getFullName() {
		const sup = Object.getPrototypeOf(this);
		if (!sup.fullName) return `Error.${this.name}`;
		return `${sup.fullName}.${this.name}`;
	}
}
