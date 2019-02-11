import { findCauseByPredicate } from './internal';
import { normalizePredicate } from './normalize-predicate';

export function findCause(err, predicate) {
	return findCauseByPredicate(err, normalizePredicate(predicate));
}
