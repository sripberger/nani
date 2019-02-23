import { Iterator } from './iterator';

/**
 * A generator function for iterating through an error and all of its causes.
 * When multi-errors are encountered, this function will iterate down the entire
 * cause chain of each embedded error in sequence. If an object appears more
 * than once in the sequence-- as can be the case if your error has duplicates
 * or circular references-- the subsequent appearances will be ignored.
 * @param {Error} err - Error instance to iterate.
 */
export function *iterate(err) {
	yield* new Iterator().iterate(err);
}
