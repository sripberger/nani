/**
 * Interface for objects yielded by `iterateFull`.
 */
export interface IterItem {
	/**
	 * The error instance.
	 */
	err: Error;

	/**
	 * The parent of `err`, if any. `null` otherwise.
	 */
	parent: Error|null;

	/**
	 * `true` if `err` is in an `errors` array on its parent, `false` otherwise.
	 */
	inArray: boolean;
}
