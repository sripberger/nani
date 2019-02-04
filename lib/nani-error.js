export default class NaniError extends Error {
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
