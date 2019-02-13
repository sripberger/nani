/**
 * A generator function for iterating through an error and all of its causes.
 * When multi-errors are encountered, this function will iterate down the entire
 * cause chain of each embedded error in sequence.
 * @param {Error} err - Error instance to iterate.
 */
export function *iterateCauses(err) {
	yield err;
	const { errors, cause } = err;
	if (errors) {
		for (const e of errors) yield* iterateCauses(e);
	} else if (cause) {
		yield* iterateCauses(cause);
	}
}
