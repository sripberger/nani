import NaniError from './nani-error';
import _ from 'lodash';

export default class MultiError extends NaniError {
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

		// Store the errors.
		this.errors = errors;

		// Append the cause's short message to the instance's.
		if (cause) {
			const causeMessage = cause.shortMessage || cause.message;
			this.shortMessage += ` : ${causeMessage}`;
		}
	}
}
