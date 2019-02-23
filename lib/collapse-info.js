import _ from 'lodash';
import { iterate } from './iterate-external';

/**
 * Iterates through the info properties of an error and all of its causes,
 * collapsing all properties into a single object. Values encountered earlier
 * in the cause chain are prioritized.
 * @param {Error} err - Error instance from which to fetch info.
 * @returns {Object} - A plain object containing all info properties.
 */
export function collapseInfo(err) {
	const result = {};
	for (const e of iterate(err)) {
		_.defaults(result, e.info);
	}
	return result;
}
