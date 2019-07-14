import { NaniError } from './nani-error';
import { isArray } from 'lodash';

/**
 * Error class for representing a group of errors.
 *
 * @remarks
 * This class should not be inherited. Instead, the errors inside it should be
 * instances of Error or NaniError subclasses.
 *
 * The shortMessage of a MultiError will be based on how many errors are
 * provided to it. Only the first error will be treated as the primary cause and
 * actually included in the full message, but all errors (including that one)
 * will be stored on an `errors` property for future use.
 */
export class MultiError extends NaniError {
	/**
	 * Array of errors contained in the MultiError.
	 */
	errors: Error[];

	/**
	 * Constructs a MultiError.
	 * @param errors - Array of errors.
	 */
	constructor(errors: Error[]);

	/**
	 * Constructs a MultiError.
	 * @param errors - Error instances provided directly as arguments.
	 */
	constructor(...errors: Error[]);

	/**
	 * Constructor implementation.
	 * @param args Constructor arguments
	 */
	constructor(...args: any[]) {
		// Normalize args to an array.
		const errors = isArray(args[0]) ? args[0] : args;

		// The first error is treated as the cause.
		const [ cause ] = errors;

		// Determine the initial short message.
		let shortMessage: string;
		if (cause) {
			// Message includes the number of errors.
			shortMessage = `First of ${errors.length} errors`;
		} else {
			// Fallback for empty instances.
			shortMessage = 'Empty MultiError';
		}

		// Create the instance.
		super({ shortMessage, cause });

		// Set the errors property.
		this.errors = errors;

		// Append the cause's short message to the instance's.
		if (cause) {
			const causeMessage = cause.shortMessage || cause.message;
			this.shortMessage += ` : ${causeMessage}`;
		}
	}
}
