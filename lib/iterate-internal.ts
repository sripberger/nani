import {IterItem} from "./iter-item";

/**
 * Internal resursive iteration utility.
 *
 * @remarks
 * This function is ultimately responsible for all iteration operations in
 * external functions. It will generate objects for each item in an error
 * structure, including each item, its parent, and whether or not the item was
 * in an array on the parent. It will also detect any circular references and
 * terminate them, preventing infinite loops.
 *
 * @param err - Error instance to iterate.
 * @param parent - Parent of `err`, if any.
 * @param inArray - Set to true if `err` is in an `errors` array on `parent`.
 * @param seen - Set of Errors that have already been encountered along the
 *   current chain. Used to check for circular references.
 */
export function *iterateInternal(
	err: Error,
	parent: Error|null = null,
	inArray = false,
	seen: Set<Error> = new Set<Error>(),
): IterableIterator<IterItem> {
	// If we've already encountered this error along this chain, yield nothing.
	if (seen.has(err)) return;

	// Clone the set and add this error to keep track of the chain.
	seen = new Set(seen).add(err);

	// Yield this error first.
	yield {err, parent, inArray};

	// Move down into child errors.
	const {errors, cause} = err as any;
	if (errors) {
		// Proceed through each item in the errors array.
		for (const e of errors) yield* iterateInternal(e, err, true, seen);
	} else if (cause) {
		// Proceed with the single primary cause.
		yield* iterateInternal(cause, err, false, seen);
	}
}
