export function *iterateCauses(err) {
	yield err;
	const { errors, cause } = err;
	if (errors) {
		for (const e of errors) yield* iterateCauses(e);
	} else if (cause) {
		yield* iterateCauses(cause);
	}
}
