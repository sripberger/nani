import { is } from './is';
import { iterateCauses } from './iterate-causes';

export function findCauseByPredicate(err, predicate) {
	for (const cause of iterateCauses(err)) {
		if (predicate(cause)) return cause;
	}
	return null;
}

export function normalizePredicate(predicate) {
	if (!is(Error, predicate)) return predicate;
	return (err) => is(predicate, err);
}
