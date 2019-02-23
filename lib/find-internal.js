import { is } from './is';
import { iterate } from './iterate-external';

/**
 * Internal function used to support various signatures of `findCause` and
 * `filterCauses`. If the provided predicate function is an Error contructor,
 * this function returns a new predicate which checks if `is` returns true
 * with that constructor and the provided instance. Otherwise, this simply
 * returns the predicate function as-is.
 * @private
 * @param {Function} predicate - Predicate function to normalize.
 * @returns {Function} - Normalized predicate function.
 */
export function normalizePredicate(predicate) {
	return is(Error, predicate) ? (cause) => is(predicate, cause) : predicate;
}

/**
 * Internal function which is part of the implementation of `find`.
 * @private
 * @param {Error} err - Error instance to search.
 * @param {Function} predicate - Normalized predicate function.
 * @returns {Error|null} - First matching error, or null if none is found.
 */
export function findByPredicate(err, predicate) {
	for (const e of iterate(err)) {
		if (predicate(e)) return e;
	}
	return null;
}

/**
 * Internal function which is part of the implementation of `filter`.
 * @private
 * @param {Error} err - Error instance to search.
 * @param {Function} predicate - Normalized predicate function.
 * @returns {Array<Error>} - Array of matched errors.
 */
export function filterByPredicate(err, predicate) {
	const results = [];
	for (const e of iterate(err)) {
		if (predicate(e)) results.push(e);
	}
	return results;
}
