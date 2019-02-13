import { NaniError } from './nani-error';
import _ from 'lodash';

/**
 * Error class for representing a group of errors. This class should not be
 * inherited. Instead, the errors inside it should be instances of Error or
 * NaniError subclasses.
 *
 * The shortMessage of a MultiError will be based on how many errors are
 * provided to it.
 *
 * Only the first error will be treated as the primary cause and actually
 * included in the full message, but all errors (including that one) will be
 * stored on an `errors` property for future use.
 * @constructor MultiError
 * @extends NaniError
 * @param {Array<Error>} [errors] - Array of error instances to include in the
 *   group.
 * @param {...Error} errors - Error instances provided directly as arguments,
 *   instead of as an array. If provided with an errors array, these will be
 *   ignored.
 */
export class MultiError extends NaniError {
	constructor(...args) {
		// Normalize args to an array.
		const errors = _.isArray(args[0]) ? args[0] : args;

		// The first error is treated as the cause.
		const [ cause ] = errors;

		// Determine the initial short message.
		let shortMessage;
		if (cause) {
			// Message includes the number of errors.
			shortMessage = `First of ${errors.length} errors`;
		} else {
			// Fallback for empty instances.
			shortMessage = 'Empty MultiError';
		}

		// Create the instance.
		super({ shortMessage, cause });

		/**
		 * Array of errors provided to the constructor.
		 * @type {Array<Error>}
		 */
		this.errors = errors;

		// Append the cause's short message to the instance's.
		if (cause) {
			const causeMessage = cause.shortMessage || cause.message;
			this.shortMessage += ` : ${causeMessage}`;
		}
	}
}
