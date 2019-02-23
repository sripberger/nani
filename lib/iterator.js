import { iterateInternal } from './iterate-internal';

/**
 * Internal class that tracks state for the external `iterate` function.
 * @private
 */
export class Iterator {
	constructor() {
		// Create a set for storing errors as we encounter them.
		this.seenErrors = new Set();
	}

	/**
	 * Implements the external `iterate` function, using its instance to track
	 * state and avoid duplicate references.
	 * @param {Error} err - Error instance to iterate.
	 */
	*iterate(err) {
		for (const { err: e } of iterateInternal(err)) {
			if (this.seenErrors.has(e)) continue;
			this.seenErrors.add(e);
			yield e;
		}
	}
}
