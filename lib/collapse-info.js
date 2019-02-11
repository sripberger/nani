import _ from 'lodash';
import { iterateCauses } from './iterate-causes';

export function collapseInfo(err) {
	const result = {};
	for (const cause of iterateCauses(err)) {
		_.defaults(result, cause.info);
	}
	return result;
}
