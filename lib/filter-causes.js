import { filterCausesByPredicate } from './find-cause-internal';
import { normalizePredicate } from './normalize-predicate';

export function filterCauses(err, predicate) {
	return filterCausesByPredicate(err, normalizePredicate(predicate));
}
