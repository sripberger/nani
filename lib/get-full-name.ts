import {ErrorConstructor} from "./error-constructor";

/**
 * Returns the full name of an Error instance or constructor.
 *
 * @remarks
 * If no fullName property is found, this function attempts to determine one
 * based on the name property. If the name is simply 'Error', then so too is the
 * fullName. If the name ends with 'Error', then the fullName will be the name
 * appended to 'Error', separated by a dot. This enables some support for error
 * classes that are not subclasses of NaniError, by assuming they're at least
 * instances of Error.
 *
 * @param err - An Error instance or constructor. If omitted or falsy, this
 *   function will return null.
 * @returns Full name if it can be determined, null otherwise.
 */
export function getFullName(err?: Error|ErrorConstructor|null): string|null {
	if (!err) return null;
	if ((err as any).fullName) return (err as any).fullName;
	if (err.name === "Error") return err.name;
	if (err.name && err.name.endsWith("Error")) return `Error.${err.name}`;
	return null;
}
