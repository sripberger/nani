import * as iterateModule from '../../lib/iterate';
import { collapseInfo } from '../../lib/collapse-info';

describe('collapseInfo', function() {
	let err, fooErr, barErr, bazErr;

	beforeEach(function() {
		err = new Error('Original error');
		fooErr = new Error('Foo error');
		barErr = new Error('Bar error');
		bazErr = new Error('Baz error');

		sinon.stub(iterateModule, 'iterate').returns({
			*[Symbol.iterator]() {
				yield fooErr;
				yield barErr;
				yield bazErr;
			},
		});
	});

	it('iterates over causes of err', function() {
		collapseInfo(err);

		expect(iterateModule.iterate).to.be.calledOnce;
		expect(iterateModule.iterate).to.be.calledWith(err);
	});

	it('returns collapsed info from causes, prioritizing earlier values', function() {
		fooErr.info = { name: 'foo', isCool: true };
		bazErr.info = { name: 'baz', numberOfThings: 42 };

		const result = collapseInfo(err);

		expect(result).to.deep.equal({
			name: 'foo',
			isCool: true,
			numberOfThings: 42,
		});
	});
});
