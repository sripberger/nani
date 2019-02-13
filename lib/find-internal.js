import { iterate } from './iterate';

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
