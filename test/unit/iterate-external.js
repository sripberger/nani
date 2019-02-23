import * as iteratorModule from '../../lib/iterator';
import { iterate } from '../../lib/iterate-external';

describe('External iterate utils', function() {
	describe('iterate', function() {
		it('iterates error using a new Iterator', function() {
			const err = new Error('Original error');
			const fooErr = new Error('foo');
			const barErr = new Error('bar');
			const bazErr = new Error('baz');
			const iterator = sinon.createStubInstance(iteratorModule.Iterator);
			iterator.iterate.returns({
				*[Symbol.iterator]() {
					yield fooErr;
					yield barErr;
					yield bazErr;
				},
			});
			sinon.stub(iteratorModule, 'Iterator').returns(iterator);

			const result = [ ...iterate(err) ];

			expect(iteratorModule.Iterator).to.be.calledOnce;
			expect(iteratorModule.Iterator).to.be.calledWithNew;
			expect(iterator.iterate).to.be.calledOnce;
			expect(iterator.iterate).to.be.calledWith(err);
			expect(result).to.deep.equal([ fooErr, barErr, bazErr ]);
		});
	});
});
