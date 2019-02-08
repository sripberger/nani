import { findCauseByPredicate } from './internal';

export function findCause(err, predicate) {
	return findCauseByPredicate(err, predicate);
}
