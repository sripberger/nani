import NaniError from './nani-error';
import _ from 'lodash';

export default class MultiError extends NaniError {
	constructor(...args) {
		const errors = _.isArray(args[0]) ? args[0] : args;
		super({
			message: `first of ${errors.length} errors`,
			cause: errors[0],
		});
		this.errors = errors;
	}
}
