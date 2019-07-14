import { expect } from 'chai';
import { getFullName } from '../../lib/get-full-name';

describe('getFullName', function() {
	it('returns fullName property of provided object, if any', function() {
		const fullName = 'fullName';

		expect(getFullName({ fullName } as any)).to.equal(fullName);
	});

	it('returns null if provided is null or undefined', function() {
		expect(getFullName(null as any)).to.be.null;
		expect(getFullName(undefined as any)).to.be.null;
	});

	context('provided object has no fullName', function() {
		it('returns \'Error\' if name is \'Error\'', function() {
			expect(getFullName({ name: 'Error' } as any)).to.equal('Error');
		});

		it('returns name appended to \'Error\' if name ends in \'Error\'', function() {
			expect(getFullName({ name: 'FooError' } as any))
				.to.equal('Error.FooError');
			expect(getFullName({ name: 'BarError' } as any))
				.to.equal('Error.BarError');
		});

		it('returns null if name does not end with \'Error\'', function() {
			expect(getFullName({ name: 'Foo' } as any)).to.be.null;
		});

		it('returns null if object has no name', function() {
			expect(getFullName({} as any)).to.be.null;
		});
	});
});
