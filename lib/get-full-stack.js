/**
 * Returns the stack of an error, with the stacks of each error in its cause
 * chain appended. This will include only the first error in the case of a
 * `MultiError`.
 * @param {Error} err - An error instance, potentially with a cause chain.
 * @returns {string} - Full error stack.
 */
export function getFullStack(err) {
	const { cause, stack } = err;
	return cause ? `${stack}\nCaused by: ${getFullStack(cause)}` : stack;
}
