import _ from 'lodash';

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

export function normalizeOptions(args) {
	const options = {};
	if (_.isString(args[0])) options.message = args.shift();
	if (args[0] instanceof Error) options.cause = args.shift();
	return _.assign(options, args[0]);
}
