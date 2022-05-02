import * as chai from "chai";
import * as sinon from "sinon";
import * as sinonChai from "sinon-chai";

// Add assertions from sinon-chai.
chai.use(sinonChai);

// Restore sinon's static sandbox after each test.
afterEach(function() {
	sinon.restore();
});
