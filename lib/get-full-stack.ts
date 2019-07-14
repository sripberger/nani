/**
 * Returns the stack of an error, with the stacks of each error in its cause
 * chain appended. This will include only the first error in the case of a
 * `MultiError`.
 * @param err - An error instance, potentially with a cause chain.
 * @returns Full error stack.
 */
export function getFullStack(err: Error): string {
	const { cause, stack } = err as any;
	return cause ? `${stack}\nCaused by: ${getFullStack(cause)}` : stack;
}
