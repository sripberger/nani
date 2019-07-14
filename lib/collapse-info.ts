import { defaults } from 'lodash';
import { iterate } from './iterate-external';

/**
 * Collapse all info properties into a single object.
 *
 * @remarks
 * This function iterates the entire cause chain, assigning any info properties
 * together onto the same object. Values encountered earlier in the cause chain
 * are prioritized.
 *
 * @param err - Error instance from which to fetch info.
 * @returns A plain object containing all info properties.
 */
export function collapseInfo(err: Error): {} {
	const result = {};
	for (const e of iterate(err)) {
		defaults(result, (e as any).info);
	}
	return result;
}
