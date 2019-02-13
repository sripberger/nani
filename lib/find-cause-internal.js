import { iterateCauses } from './iterate-causes';

/**
 * Internal function which is part of the implementation of `findCause`.
 * Actually finds the first matching cause, but must be provided with a
 * normalized predicate.
 * @private
 * @param {Error} err - Error instance to search.
 * @param {Function} predicate - Normalized predicate function.
 * @returns {Error|null} - First matching error, or null if none is found.
 */
export function findCauseByPredicate(err, predicate) {
	for (const cause of iterateCauses(err)) {
		if (predicate(cause)) return cause;
	}
	return null;
}

/**
 * Internal function which is part of the implementation of `filterCauses`.
 * Actually finds the matching causes, but must be provided with a normalized
 * predicate.
 * @private
 * @param {Error} err - Error instance to search.
 * @param {Function} predicate - Normalized predicate function.
 * @returns {Array} - Array of matched causes.
 */
export function filterCausesByPredicate(err, predicate) {
	const result = [];
	for (const cause of iterateCauses(err)) {
		if (predicate(cause)) result.push(cause);
	}
	return result;
}
