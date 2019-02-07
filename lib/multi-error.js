import NaniError from './nani-error';
import _ from 'lodash';

export default class MultiError extends NaniError {
	constructor(...args) {
		const errors = _.isArray(args[0]) ? args[0] : args;
		const [ cause ] = errors;

		let message;
		if (cause) {
			message = `First of ${errors.length} errors`;
		} else {
			message = 'Empty MultiError';
		}

		super({ message, cause });
		this.errors = errors;

		if (cause) {
			const causeMessage = cause.shortMessage || cause.message;
			this.shortMessage += ` : ${causeMessage}`;
		}
	}
}
