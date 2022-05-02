import {
	filterByPredicate,
	findByPredicate,
	normalizePredicate,
} from "./find-internal";

import {ErrorPredicate} from "./error-predicate";

/**
 * Find the first error in the cause chain matching a given predicate or Error
 * constructor.
 *
 * @remarks
 * Normally, the predicate will be invoked with each cause as its first
 * argument. However, if it is an Error constructor, this function will instead
 * find a cause for which `is` returns true for that constructor.
 *
 * @param err - Error instance to search.
 * @param predicate - Predicate function or Error constructor.
 * @returns First matching error, or null if none is found.
 */
export function find(
	err: Error,
	predicate: ErrorPredicate|Function,
): Error|null {
	return findByPredicate(err, normalizePredicate(predicate));
}

/**
 * Find all errors in the cause chain matching a given predicate or Error
 * constructor.
 *
 * @remarks
 * This function is similar to `findCause`, except that it returns an array of
 * *all* matched errors, instead of just the first.
 *
 * @param err - Error instance to search.
 * @param predicate - Predicate function or Error constructor.
 * @returns Array of matching errors.
 */
export function filter(
	err: Error,
	predicate: ErrorPredicate|Function,
): Error[] {
	return filterByPredicate(err, normalizePredicate(predicate));
}
