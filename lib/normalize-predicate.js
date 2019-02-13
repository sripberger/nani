import { is } from './is';

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
