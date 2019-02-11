import { is } from './is';
import { iterateCauses } from './iterate-causes';

export function findCauseByPredicate(err, predicate) {
	for (const cause of iterateCauses(err)) {
		if (predicate(cause)) return cause;
	}
	return null;
}

export function filterCausesByPredicate(err, predicate) {
	const result = [];
	for (const cause of iterateCauses(err)) {
		if (predicate(cause)) result.push(cause);
	}
	return result;
}

export function normalizePredicate(predicate) {
	return is(Error, predicate) ? (err) => is(predicate, err) : predicate;
}
