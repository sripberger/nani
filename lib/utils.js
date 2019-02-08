import _ from 'lodash';

export function normalizeArgs(args) {
	const options = {};
	if (_.isString(args[0])) options.shortMessage = args.shift();
	if (args[0] instanceof Error) options.cause = args.shift();
	return _.assign(options, args[0]);
}
