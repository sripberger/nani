import {
	filterByPredicate,
	findByPredicate,
	normalizePredicate,
} from './find-internal';

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
export function find(err, predicate) {
	return findByPredicate(err, normalizePredicate(predicate));
}

/**
 * Similar to `findCause`, except that it returns an array of *all* matched
 * errors, instead of just the first.
 * @param {Error} err - Error instance to search.
 * @param {Function} predicate - Predicate function or Error constructor.
 * @returns {Array<Error>} - Array of matching errors.
 */
export function filter(err, predicate) {
	return filterByPredicate(err, normalizePredicate(predicate));
}
