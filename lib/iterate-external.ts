import {IterItem} from "./iter-item";
import {Iterator} from "./iterator";
import {iterateInternal} from "./iterate-internal";

/**
 * A generator function for iterating through an error and all of its causes.
 *
 * @remarks
 * When multi-errors are encountered, this function will iterate down the entire
 * cause chain of each embedded error in sequence. If an error would appear
 * more than once in the sequence, subsequent appearances will be ignored.
 *
 * @param err - Error instance to iterate.
 */
export function *iterate(err: Error): IterableIterator<Error> {
	yield* new Iterator().iterate(err);
}

/**
 * A generator function for iterating a error's entire cause chain with the
 * context of each within the structure.
 *
 * @remarks
 * This function similar to `iterate`, except that it does not skip duplicate
 * references, and yields objects with some information about each error's
 * context within the structure instead of just the error itself. It does check
 * for circular references that would create an infinite loop, however, and
 * ignores those just to be safe.
 *
 * This function will normally give you a bit more informaiton than you need,
 * but it can be useful for writing serializers, among other things.
 *
 * @param err - Error instance to iterate.
 */
export function *iterateFull(err: Error): IterableIterator<IterItem> {
	yield* iterateInternal(err);
}
