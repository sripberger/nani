import _ from 'lodash';
import { sprintf } from 'extsprintf';

const standardErrorSubclassNames = [
	'AssertionError',
	'RangeError',
	'ReferenceError',
	'SyntaxError',
	'TypeError',
	'SystemError',
	'EvalError',
	'URIError',
];

export function getFullName(err) {
	if (err.fullName) return err.fullName;
	if (err.name === 'Error') return err.name;
	if (standardErrorSubclassNames.includes(err.name)) {
		return `Error.${err.name}`;
	}
	return null;
}

export function format(args) {
	if (!_.isArray(args)) return args;
	if (args.length === 1) return args[0];
	return sprintf(...args);
}
