import { getFullName } from './utils';

export function is(sup, err) {
	const supFullName = getFullName(sup);
	const errFullName = getFullName(err);
	return Boolean(errFullName) && errFullName.startsWith(supFullName);
}
