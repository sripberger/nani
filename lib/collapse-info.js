import { iterateCauses } from './iterate-causes';
import _ from 'lodash';

export function collapseInfo(err) {
	const result = {};
	for (const cause of iterateCauses(err)) {
		_.defaults(result, cause.info);
	}
	return result;
}
