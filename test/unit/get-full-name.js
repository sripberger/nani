import { getFullName } from '../../lib/get-full-name';

describe('getFullName', function() {
	it('returns fullName property of provided object, if any', function() {
		const fullName = 'fullName';

		expect(getFullName({ fullName })).to.equal(fullName);
	});

	it('returns null if provided is null or undefined', function() {
		expect(getFullName(null)).to.be.null;
		expect(getFullName(undefined)).to.be.null;
	});

	context('provided object has no fullName', function() {
		it('returns \'Error\' if name is \'Error\'', function() {
			expect(getFullName({ name: 'Error' })).to.equal('Error');
		});

		it('returns name appended to \'Error\' if name ends in \'Error\'', function() {
			expect(getFullName({ name: 'FooError' }))
				.to.equal('Error.FooError');
			expect(getFullName({ name: 'BarError' }))
				.to.equal('Error.BarError');
		});

		it('returns null if name does not end with \'Error\'', function() {
			expect(getFullName({ name: 'Foo' })).to.be.null;
		});

		it('returns null if object has no name', function() {
			expect(getFullName({})).to.be.null;
		});
	});
});
