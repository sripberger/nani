/**
 * Internal class that tracks state for the external `iterate` function.
 * @private
 */
export class Iterator {
	constructor() {
		// Create a set for storing errors as we encounter them.
		this.errors = new Set();
	}

	// eslint-disable-next-line jsdoc/require-returns
	/**
	 * Implements the externa `iterate` function. The instance is used to track
	 * state, enabling avoidance of duplicate and circular references.
	 * @param {Error} err - Error instance to iterate.
	 */
	*iterate(err) {
		// If we've already encountered this error, stop.
		if (this.errors.has(err)) return;

		// Add this error to the set of encountered errors.
		this.errors.add(err);

		// Yield this error first.
		yield err;

		// Move on to nested errors
		const { errors, cause } = err;
		if (errors) {
			// Proceed through each error in the errors array.
			for (const e of errors) yield* this.iterate(e);
		} else if (cause) {
			// Proceed with the single cause.
			yield* this.iterate(cause);
		}
	}
}
