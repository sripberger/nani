export function getFullStack(err) {
	const { cause, stack } = err;
	return cause ? `${stack}\nCaused by: ${getFullStack(cause)}` : stack;
}
