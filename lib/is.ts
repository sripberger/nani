import { getFullName } from './get-full-name';

/**
 * Check if an error instance or constructor falls under another error
 * constructor in an error heirarchy.
 *
 * @remarks
 * This function gets the fullName of both sup and err and returns true if and
 * only if err's fullName starts with sup's fullName. This allows for checking
 * errors against class heirarchies without relying on `instanceof`.
 *
 * @param sup - Error constructor to check against.
 * @param err - Error constructor or instance to check. If omitted or falsy,
 *   this function will return `false`.
 * @returns `true` if err fullName starts with sup fullName, `false` otherwise.
 */
export function is(sup: Function, err?: Error|Function|null): boolean {
	const supFullName = getFullName(sup);
	const errFullName = getFullName(err);
	if (!supFullName || !errFullName) return false;
	return errFullName.startsWith(supFullName);
}
