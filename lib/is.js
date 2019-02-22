import { getFullName } from './get-full-name';

/**
 * Gets the fullName of both sup and err and returns true if and only if err's
 * fullName starts with sup's fullName. This allows for checking errors against
 * class heirarchies without relying on `instanceof`.
 * @param {Function} [sup] - Error constructor. If omitted or falsy, this
 *   function will return `false`.
 * @param {Error|Function} [err] - Error constructor or instance. If omitted or
 *   falsy, this function will return `false`.
 * @returns {boolean} - `true` if err fullName starts with sup fullName, `false`
 *   otherwise.
 */
export function is(sup, err) {
	const supFullName = getFullName(sup);
	const errFullName = getFullName(err);
	return Boolean(errFullName) && errFullName.startsWith(supFullName);
}
