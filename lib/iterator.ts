import {iterateInternal} from "./iterate-internal";

/**
 * Internal class that tracks state for the external `iterate` function.
 */
export class Iterator {
	/**
	 * Stores Errors as we encounter them to avoid duplication.
	 */
	seenErrors: Set<Error>;

	/**
	 * Constructs an Iterator.
	 */
	constructor() {
		// Initialize the seenErrors set.
		this.seenErrors = new Set();
	}

	/**
	 * Implements the external `iterate` function, using its instance to track
	 * state and avoid duplicate references.
	 * @param err - Error instance to iterate.
	 */
	*iterate(err: Error): IterableIterator<Error> {
		for (const {err: e} of iterateInternal(err)) {
			if (this.seenErrors.has(e)) continue;
			this.seenErrors.add(e);
			yield e;
		}
	}
}
