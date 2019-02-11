import {
	filterCausesByPredicate,
	findCauseByPredicate,
} from './find-cause-internal';
import { normalizePredicate } from './normalize-predicate';

export function findCause(err, predicate) {
	return findCauseByPredicate(err, normalizePredicate(predicate));
}

export function filterCauses(err, predicate) {
	return filterCausesByPredicate(err, normalizePredicate(predicate));
}
