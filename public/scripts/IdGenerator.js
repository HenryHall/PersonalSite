
/**
 * @typedef EphemeralId
 * @type {number}
 */

/**
 * Returns a generator function for making ephemeral ids
 * @param {number} initial
 * @return {Generator<EphemeralId>}
 */
function* idGenerator(initial) {
	while(true) {
		yield initial++;
	}
}

/**
 * Ephemeral id generator
 */
class IdGenerator {
	constructor(initial) {
		Object.defineProperty(this, '_idGenerator', {
			enumerable: false,
			configurable: false,
			writable: false,
			value: idGenerator(initial)
		});
	}


	/**
	 * Returns the next ephemeral id
	 * @return {EphemeralId}
	 */
	next() {
		return this._idGenerator.next().value;
	}
}


export default new IdGenerator(1000);
