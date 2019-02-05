import { normalizeOptions } from './utils';

export default class NaniError extends Error {
	constructor(...args) {
		super();

		// Normalize args into an options object.
		const options = normalizeOptions(...args);

		// Set properties based on the options object.
		this.cause = options.cause || null;
		this.info = options.info || null;
		this.shortMessage = options.message || this.constructor.defaultMessage;

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
