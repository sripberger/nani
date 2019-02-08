import _ from 'lodash';
import { getFullStack } from '../../lib/get-full-stack';

describe('::getFullStack', function() {
	it('returns stack of each cause in sequence', function() {
		const fooErr = new Error('foo');
		const barErr = fooErr.cause = new Error('bar');
		const bazErr = barErr.cause = new Error('baz');
		const errors = [ fooErr, barErr, bazErr ];

		expect(getFullStack(fooErr)).to.deep.equal(
			_.map(errors, 'stack').join('\nCaused by: ')
		);
	});
});
