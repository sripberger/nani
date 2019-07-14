import { expect } from 'chai';
import { getFullStack } from '../../lib/get-full-stack';
import { map } from 'lodash';

describe('getFullStack', function() {
	it('returns stack of each cause in sequence', function() {
		const fooErr: any = new Error('foo');
		const barErr: any = fooErr.cause = new Error('bar');
		const bazErr: any = barErr.cause = new Error('baz');
		const errors = [ fooErr, barErr, bazErr ];

		expect(getFullStack(fooErr)).to.deep.equal(
			map(errors, 'stack').join('\nCaused by: '),
		);
	});
});
