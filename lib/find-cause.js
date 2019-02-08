import { findCauseByPredicate, normalizePredicate } from './internal';

export function findCause(err, predicate) {
	return findCauseByPredicate(err, normalizePredicate(predicate));
}
