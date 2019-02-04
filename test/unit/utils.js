import * as utils from '../../lib/utils';
import extsprintf from 'extsprintf';

describe('utils', function() {
	describe('::getFullName', function() {
		it('returns fullName property of provided object, if any', function() {
			const fullName = 'fullName';

			expect(utils.getFullName({ fullName })).to.equal(fullName);
		});

		context('provided object has no fullname', function() {
			function testStandardErrorName(name) {
				const expected = name === 'Error' ? 'Error' : `Error.${name}`;

				it(`returns '${expected}' if name is ${name}`, function() {
					expect(utils.getFullName({ name })).to.equal(expected);
				});
			}

			const standardErrorNames = [
				'Error',
				'AssertionError',
				'RangeError',
				'ReferenceError',
				'SyntaxError',
				'TypeError',
				'SystemError',
				'EvalError',
				'URIError',
			];

			for (const name of standardErrorNames) {
				testStandardErrorName(name);
			}

			it('returns null if name is not known', function() {
				expect(utils.getFullName({ name: 'foo' })).to.be.null;
			});
		});
	});

	describe('::format', function() {
		const sprintfResult = 'sprintf result';

		beforeEach(function() {
			sinon.stub(extsprintf, 'sprintf').returns(sprintfResult);
		});

		it('returns result of sprintf with provided array as arguments', function() {
			const result = utils.format([ 'foo', 'bar' ]);

			expect(extsprintf.sprintf).to.be.calledOnce;
			expect(extsprintf.sprintf).to.be.calledWith('foo', 'bar');
			expect(result).to.equal(sprintfResult);
		});

		it('returns first element without calling sprintf, if array has only one element', function() {
			const result = utils.format([ 'foo' ]);

			expect(extsprintf.sprintf).to.not.be.called;
			expect(result).to.equal('foo');
		});

		it('returns first argument without calling sprintf, if it is not an array', function() {
			const result = utils.format('foo');

			expect(extsprintf.sprintf).to.not.be.called;
			expect(result).to.equal('foo');
		});
	});
});
