// eslint-disable-next-line jsdoc/require-returns
/**
 * Internal resursive iteration utility, ultimately responsible for all
 * iteration operations in external functions. Will generate objects for each
 * item in an error structure, including each item, its parent, and whether or
 * not the item was in an array on the parent. Will also detect any circular
 * references and terminate them, preventing infinite loops.
 * @private
 * @param {Error} err - Error instance to iterate.
 * @param {Error} [parent=null] - Parent of `err`, if any.
 * @param {boolean} [inArray=false] - Set to true if `err` is in an `errors`
 *   array on `parent`.
 * @param {Set<Error>} [seen=new Set()] - Set of Errors that have already been
 *   encountered along the current chain. Used to check for circular references.
 */
export function *iterateInternal(
	err,
	parent = null,
	inArray = false,
	seen = new Set()
) {
	// If we've already encountered this error along this chain, yield nothing.
	if (seen.has(err)) return;

	// Clone the set and add this error to keep track of the chain.
	seen = new Set(seen).add(err);

	// Yield this error first.
	yield { err, parent, inArray };

	// Move down into child errors.
	const { errors, cause } = err;
	if (errors) {
		// Proceed through each item in the errors array.
		for (const e of errors) yield* iterateInternal(e, err, true, seen);
	} else if (cause) {
		// Proceed with the single primary cause.
		yield* iterateInternal(cause, err, false, seen);
	}
}
