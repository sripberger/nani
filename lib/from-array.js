import { MultiError } from './multi-error';

/**
 * Converts an array of errors into a single error, wrapping it with a
 * MultiError if necessary.
 * @param {Array<Error>} errors - Array of errors to convert.
 * @returns {MultiError|Error|null} - null if `errors` is empty, the first
 *   element if `errors` has only one element, or a MultiError wrapping `errors`
 *   if `errors` has more than one element.
 */
export function fromArray(errors) {
	if (errors.length === 0) return null;
	if (errors.length === 1) return errors[0];
	return new MultiError(errors);
}
