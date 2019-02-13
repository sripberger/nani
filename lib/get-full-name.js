const standardErrorSubclassNames = [
	'EvalError',
	'RangeError',
	'ReferenceError',
	'SyntaxError',
	'TypeError',
	'URIError',
];

/**
 * Returns the full name of an Error instance or constructor. Supports most
 * standard JS errors for convenience, but is otherwise intended to be used
 * primarily with NaniError instances.
 * @param {Error|Function} err - An Error instance or constructor.
 * @returns {string|null} - Full name if it can be determined, null otherwise.
 */
export function getFullName(err) {
	if (err.fullName) return err.fullName;
	if (err.name === 'Error') return err.name;
	if (standardErrorSubclassNames.includes(err.name)) {
		return `Error.${err.name}`;
	}
	return null;
}
