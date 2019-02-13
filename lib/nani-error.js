import _ from 'lodash';

/**
 * A base class to use as a replacement for the standard Error class. Your
 * custom error types should inherit from this class in order to make use of its
 * constructor pattern and fullName resolution capabilities.
 * @constructor NaniError
 * @extends Error
 * @param {string} [shortMessage] - Same as `options.shortMessage`. The value in
 *   `options` will take priority, if both are present.
 * @param {Error} [cause] - Same as `options.cause`. The value in `options` will
 *   take priority, if both are present.
 * @param {object} [options={}] - Object containing error configuration.
 *   @param {string} [options.shortMessage] - A human-readable error message.
 *     The cause message, if any, will be chained onto the end of this to create
 *     the full error message, ensuring human programmers can easily understand
 *     the whole cause chain at a glance. If not provided, the shortMessage will
 *     be determined using the static `getDefaultMessage` method.
 *   @param {Error} [options.cause=null] - Cause of the error, for cause chains.
 *   @param {Object} [options.info=null] - Additional data about the error.
 *   @param {boolean} [options.skipCauseMessage=false] - If set to true, the
 *     cause message will not be chained to the shortMessage, and the error's
 *     full message will simply be the shortMessage. Useful for when you want to
 *     simplify error messages but still preserve the cause chain.
 */
export class NaniError extends Error {
	constructor(...args) {
		super();

		// Normalize args into an options object.
		// eslint-disable-next-line no-underscore-dangle
		const options = this.constructor._normalizeArgs(args);

		/**
		 * The error's message without any cause chain.
		 * @type {String}
		 */
		this.shortMessage = options.shortMessage;

		/**
		 * The error's cause, if any.
		 * @type {Error|null}
		 */
		this.cause = options.cause || null;

		/**
		* The error's info object, if any.
		 * @type {object|null}
		 */
		this.info = options.info || null;

		// Get the default short message, if none was provided.
		if (!this.shortMessage) {
			const info = this.info || {};
			this.shortMessage = this.constructor.getDefaultMessage(info);
		}

		// Compute and set the full message.
		if (this.cause && !options.skipCauseMessage) {
			this.message = `${this.shortMessage} : ${this.cause.message}`;
		} else {
			this.message = this.shortMessage;
		}
	}

	// eslint-disable-next-line jsdoc/require-returns
	/**
	 * The name of the error, equivalent to the constructor name.
	 *
	 * This is a read-only property and should not be overridden, as it is
	 * critical to nani's mechanism for checking against error name heirarchies.
	 * @readonly
	 * @type {string}
	 */
	get name() {
		return this.constructor.name;
	}

	// eslint-disable-next-line jsdoc/require-returns
	/**
	 * The dot-separated full name of the error, equivalent to that of the
	 * constructor.
	 *
	 * This is a read-only property and should not be overridden, as it is
	 * critical to Nani's mechanism for checking against error name heirarchies.
	 * @readonly
	 * @type {string}
	 */
	get fullName() {
		return this.constructor.fullName;
	}

	// eslint-disable-next-line jsdoc/require-returns
	/**
	 * The dot-separated full name of the error constructor. This is lazily
	 * evaluated and consists of this constructor's name apppended to the
	 * superclass's fullName, separated by a dot. If the superclass has no
	 * fullName, it is assumed to be 'Error'.
	 *
	 * This is a read-only property and should not be overridden, as it is
	 * critical to nani's mechanism for checking against error name heirarchies.
	 * @readonly
	 * @type {string}
	 */
	static get fullName() {
		if (!this.hasOwnProperty('_fullName')) {
			this._fullName = this._getFullName();
		}
		return this._fullName;
	}

	// eslint-disable-next-line jsdoc/check-param-names
	/**
	 * Fetches the shortMessage which will be used for any instance that is not
	 * provided with one. By default, it returns a generic message, but it may
	 * be overridden to provide custom default messages for your subclasses.
	 * @param {Object} info - The value of `options.info` provided to the
	 *   constructor, if any, or an empty object otherwise. Allows you to easily
	 *  include values from `options.info` in your default messages.
	 * @returns {string} - Default shortMessage.
 	 */
	static getDefaultMessage() {
		return 'An error has occurred';
	}

	/**
	 * Internal method for normalizing NaniError constructor arguments into
	 * a single options object. Responsible for the various signatures of said
	 * constructor.
	 * @private
	 * @param {Array} args - Constructor arguments.
	 * @returns {Object} - Constructor arguments as if they were all provided
	 *   in a plain options object.
	 */
	static _normalizeArgs(args) {
		const options = {};
		if (_.isString(args[0])) options.shortMessage = args.shift();
		if (args[0] instanceof Error) options.cause = args.shift();
		return _.assign(options, args[0]);
	}

	/**
	 * Internal method that actually determines the fullName of the constructor.
	 * Should only be called once for each class, as the result will be stored
	 * on the class itself as part of lazy evaluation of the fullName property.
	 * @private
	 * @returns {string} - Dot-separated full name.
	 */
	static _getFullName() {
		const sup = Object.getPrototypeOf(this);
		if (!sup.fullName) return `Error.${this.name}`;
		return `${sup.fullName}.${this.name}`;
	}
}
