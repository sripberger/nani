import { filterCausesByPredicate, normalizePredicate } from './internal';

export function filterCauses(err, predicate) {
	return filterCausesByPredicate(err, normalizePredicate(predicate));
}
