export function *iterate(err) {
	yield err;
	const { errors, cause } = err;
	if (errors) {
		for (const e of errors) yield* iterate(e);
	} else if (cause) {
		yield* iterate(cause);
	}
}
