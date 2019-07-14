/**
 * Interface for predicate functions on `find` and `filter`.
 */
export interface ErrorPredicate {
	/**
	 * Predicate signature.
	 * @param err - Error instance to check.
	 * @returns `true` if `err` matches, `false` otherwise.
	 */
	(err: Error): boolean;
}
