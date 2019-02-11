import { is } from './is';

export function normalizePredicate(predicate) {
	return is(Error, predicate) ? (err) => is(predicate, err) : predicate;
}
