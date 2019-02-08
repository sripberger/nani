import { iterate } from './iterate';

export function findCause(err, predicate) {
	for (const cause of iterate(err)) {
		if (predicate(cause)) return cause;
	}
	return null;
}
