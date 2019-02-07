import _ from 'lodash';

const standardErrorSubclassNames = [
	'EvalError',
	'RangeError',
	'ReferenceError',
	'SyntaxError',
	'TypeError',
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

export function normalizeArgs(args) {
	const options = {};
	if (_.isString(args[0])) options.shortMessage = args.shift();
	if (args[0] instanceof Error) options.cause = args.shift();
	return _.assign(options, args[0]);
}

export function getFullStack(err) {
	const { cause, stack } = err;
	return cause ? `${stack}\nCaused by: ${getFullStack(cause)}` : stack;
}

export function *iterate(err) {
	yield err;
	const { errors, cause } = err;
	if (errors) {
		for (const e of errors) yield* iterate(e);
	} else if (cause) {
		yield* iterate(cause);
	}
}
