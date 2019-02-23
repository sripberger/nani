import { Iterator } from './iterator';
import { iterateInternal } from './iterate-internal';

/**
 * A generator function for iterating through an error and all of its causes.
 * When multi-errors are encountered, this function will iterate down the entire
 * cause chain of each embedded error in sequence. If an error would appear
 * more than once in the sequence, subsequent appearances will be ignored.
 * @param {Error} err - Error instance to iterate.
 */
export function *iterate(err) {
	yield* new Iterator().iterate(err);
}

/**
 * Another generator function, similar to `iterate`, except that it does not
 * skip duplicate references, and yields objects with some information about
 * each error's context within the structure instead of just the error itself.
 * It does check for circular references that would create an infinite loop,
 * however, and ignores those just to be safe.
 *
 * Error info is yielded in the form of objects with three properties:
 *   - `err` - The Error instance.
 *   - `parent` - The parent of `err`, if any. `null` otherwise.
 *   - `inArray` - `true` if `err` is in an `errors` array on its parent,
 *      `false` otherwise.
 *
 * This function will normally give you a bit more informaiton than you need,
 * but it can be useful for writing serializers, among other things.
 * @param {Error} err - Error instance to iterate.
 */
export function *iterateFull(err) {
	yield* iterateInternal(err);
}
