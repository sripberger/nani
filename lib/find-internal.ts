import { ErrorPredicate } from './error-predicate';
import { is } from './is';
import { iterate } from './iterate-external';

/**
 * Normalizes an ErrorPredicate or Error constructor to an ErrorPredicate.
 *
 * @remarks
 * This internal function is used to support various signatures of `findCause`
 * and `filterCauses`. If the provided predicate function is an Error
 * contructor, this function returns a new predicate which checks if `is`
 * returns true with that constructor and the provided instance. Otherwise, this
 * simply returns the predicate function as-is.
 *
 * @param predicate - Predicate function to normalize.
 * @returns Normalized predicate function.
 */
export function normalizePredicate(
	predicate: ErrorPredicate|Function,
): ErrorPredicate {
	const constructor = predicate as Function;
	if (is(Error, constructor)) return (cause) => is(constructor, cause);
	return predicate as ErrorPredicate;
}

/**
 * Internal function which is part of the implementation of `find`.
 * @param err - Error instance to search.
 * @param predicate - Normalized predicate function.
 * @returns First matching error, or null if none is found.
 */
export function findByPredicate(
	err: Error,
	predicate: ErrorPredicate,
): Error|null {
	for (const e of iterate(err)) {
		if (predicate(e)) return e;
	}
	return null;
}

/**
 * Internal function which is part of the implementation of `filter`.
 * @param err - Error instance to search.
 * @param predicate - Normalized predicate function.
 * @returns Array of matched errors.
 */
export function filterByPredicate(
	err: Error,
	predicate: ErrorPredicate,
): Error[] {
	const results: Error[] = [];
	for (const e of iterate(err)) {
		if (predicate(e)) results.push(e);
	}
	return results;
}
