export default class NaniError {
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

	static _getFullName() {
		const sup = Object.getPrototypeOf(this);
		return sup.fullName ? `${sup.fullName}.${this.name}` : this.name;
	}
}
