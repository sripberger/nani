import { iterateCauses } from './iterate-causes';

export function findCauseByPredicate(err, predicate) {
	for (const cause of iterateCauses(err)) {
		if (predicate(cause)) return cause;
	}
	return null;
}
