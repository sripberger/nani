import {assign, isString} from "lodash";
import {ErrorOptions} from "./error-options";

/**
 * A base class to use as a replacement for the standard Error class.
 *
 * @remarks
 * Your custom error types should inherit from this class in order to make use
 * of its constructor pattern and fullName resolution capabilities.
 */
export class NaniError extends Error {
	/**
	 * A string to prepend to error messages.
	 *
	 * @remarks
	 * The prefix will be separated from the rest of the message with spaces and
	 * a colon, the same way causes are separated in a cause chain.
	 *
	 * Seting this will affect messages for all errors of the relevant type,
	 * both in their own message properties and within the cause chanis of
	 * other errors. It will *not* affect shortMessage properties, however.
	 */
	static prefix?: string;

	/**
	 * Cached value of the fullName property to prevent recalcuation.
	 */
	private static _fullName: string;

	/**
	 * The error message without any chained cause messages.
	 */
	shortMessage: string;

	/**
	 * The cause of the error, for cause chains.
	 */
	cause: Error|null;

	/**
	 * Additional arbitary data about the error.
	 */
	info: Record<string, any> | null;

	/**
	 * True if the constructor was not provided with a short message. False
	 * otherwise. Useful for unit testing of thrown errors.
	 */
	usedDefaultMessage: boolean;

	/**
	 * Constructs a NaniError.
	 * @param options - Error options.
	 */
	constructor(options?: ErrorOptions);

	/**
	 * Constructs a NaniError.
	 * @param shortMessageOrCause - Either the short message or the cause.
	 * @param options - Additional error options.
	 */
	constructor(shortMessageOrCause: string|Error, options?: ErrorOptions);

	/**
	 * Constructs a NaniError.
	 * @param shortMessage - The error's short message.
	 * @param cause - The error's cause.
	 * @param options - Additional error options.
	 */
	constructor(shortMessage: string, cause: Error, options?: ErrorOptions);

	/**
	 * Constructor implementation.
	 * @param args - Constructor arguments.
	 */
	constructor(...args: any[]) {
		super();

		// Normalize args into an options object.
		// eslint-disable-next-line no-underscore-dangle
		const options = (this.constructor as any)._normalizeArgs(args);

		// Set properties from options.
		this.shortMessage = options.shortMessage;
		this.cause = options.cause || null;
		this.info = options.info || null;

		if (this.shortMessage) {
			/*
			 * Set usedDefaultMessage to false, since a shortMessage was
			 * provided to the constructor.
			 */
			this.usedDefaultMessage = false;
		} else {
			// Get short message from the ::getDefaultMessage method.
			const info = this.info || {};
			this.shortMessage = (this.constructor as typeof NaniError)
				.getDefaultMessage(info);

			// Set usedDefaultMessage to true.
			this.usedDefaultMessage = true;
		}

		// Apply the prefix, if any.
		let message: string;
		const {prefix} = this.constructor as typeof NaniError;
		if (prefix) {
			message = `${prefix} : ${this.shortMessage}`;
		} else {
			message = this.shortMessage;
		}

		// Compute and set the full message.
		if (this.cause && !options.hideCauseMessage) {
			this.message = `${message} : ${this.cause.message}`;
		} else {
			this.message = message;
		}
	}

	/**
	 * The dot-separated full name of the error constructor.
	 *
	 * @remarks
	 * This is a read-only property and should not be overridden, as it is
	 * critical to nani's mechanism for checking against error name heirarchies.
	 */
	static get fullName(): string {
		if (!Object.prototype.hasOwnProperty.call(this, "_fullName")) {
			this._fullName = this._getFullName();
		}
		return this._fullName;
	}

	/**
	 * Fetches the shortMessage which will be used for any instance that is not
	 * provided with one.
	 *
	 * @remarks
	 * By default, this returns a generic message, but it may be overridden to
	 * provide custom default messages for your subclasses.
	 *
	 * @param info - The value of `options.info` provided to the constructor,
	 *  if any, or an empty object otherwise. Allows you to easily include
	 *  values from `options.info` in your default messages.
	 * @returns The default shortMessage.
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	static getDefaultMessage(info: Record<string, any>): string {
		return "An error has occurred";
	}

	/**
	 * Internal method that actually determines the fullName of the constructor.
	 *
	 * @remarks
	 * This should only be called once for each class, as the result will be
	 * stored on the class itself as part of lazy evaluation of the fullName
	 * property.
	 */
	private static _getFullName(): string {
		const sup = Object.getPrototypeOf(this);
		if (!sup.fullName) return `Error.${this.name}`;
		return `${sup.fullName}.${this.name}`;
	}

	/**
	 * Internal method for normalizing NaniError constructor arguments into
	 * a single options object.
	 * @param args - Constructor arguments.
	 * @returns Constructor arguments as if they were all provided in a plain
	 *   options object.
	 */
	private static _normalizeArgs(args: any[]): ErrorOptions {
		const options: ErrorOptions = {};
		if (isString(args[0])) options.shortMessage = args.shift();
		if (args[0] instanceof Error) options.cause = args.shift();
		return assign(options, args[0]);
	}

	/**
	 * The name of the error, equivalent to the constructor name.
	 *
	 * @remarks
	 * This is a read-only property and should not be overridden, as it is
	 * critical to nani's mechanism for checking against error name heirarchies.
	 */
	get name(): string {
		return this.constructor.name;
	}

	/**
	 * The dot-separated full name of the error, equivalent to that of the
	 * constructor.
	 *
	 * @remarks
	 * This is a read-only property and should not be overridden, as it is
	 * critical to Nani's mechanism for checking against error name heirarchies.
	 */
	get fullName(): string {
		return (this.constructor as any).fullName;
	}
}
