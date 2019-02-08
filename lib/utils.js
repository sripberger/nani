import _ from 'lodash';

export function normalizeArgs(args) {
	const options = {};
	if (_.isString(args[0])) options.shortMessage = args.shift();
	if (args[0] instanceof Error) options.cause = args.shift();
	return _.assign(options, args[0]);
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
