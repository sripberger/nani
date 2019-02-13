import {
	filterCausesByPredicate,
	findCauseByPredicate,
} from './find-cause-internal';
import { normalizePredicate } from './normalize-predicate';

/**
 * Iterates over an error and all of its causes, returning the first error for
 * which a predicate returns truthy. Normally, the predicate will be invoked
 * with each cause as its first argument. However, if it is an Error
 * constructor, this function will instead find a cause for which `is` returns
 * true for that constructor.
 * @param {Error} err - Error instance to search.
 * @param {Function} predicate - Predicate function or Error constructor.
 * @returns {Error|null} - First matching error, or null if none is found.
 */
export function findCause(err, predicate) {
	return findCauseByPredicate(err, normalizePredicate(predicate));
}

/**
 * Similar to `findCause`, except that it returns an array of *all* matched
 * errors, instead of just the first.
 * @param {Error} err - Error instance to search.
 * @param {Function} predicate - Predicate function or Error constructor.
 * @returns {Array<Error>} - Array of matching errors.
 */
export function filterCauses(err, predicate) {
	return filterCausesByPredicate(err, normalizePredicate(predicate));
}
