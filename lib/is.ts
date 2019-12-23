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
 * @param err - Error constructor or instance to check. If falsy, this function
 *   will return false.
 * @param sup - Error constructor to check against.
 * @returns `true` if err fullName starts with sup fullName, `false` otherwise.
 */
export function is(
	err: Error|Function|null|undefined,
	sup: Function,
): boolean {
	const errFullName = getFullName(err);
	const supFullName = getFullName(sup);
	if (!supFullName || !errFullName) return false;
	return errFullName.startsWith(supFullName);
}
