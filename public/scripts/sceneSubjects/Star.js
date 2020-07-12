
import * as THREE from 'three';
import SceneSubject from './SceneSubject';

/**
 * @implements SceneSubject
 * @param {number} radius
 * @param {number} color
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @constructor
 */
class Star extends SceneSubject {
	constructor( radius, color, x, y, z ) {
		super();
		let geometry = new THREE.SphereBufferGeometry(radius, 16, 16);
		let material = new THREE.MeshBasicMaterial({ color: color });
		this.object = new THREE.Mesh(geometry, material);
		this.object.position.set(x, y, z);
	}

	/**
	 * @param {number} count
	 * @param {number} radius
	 * @param {number} minDistance
	 * @param {number} maxDistance
	 * @return {Array.<Star>}
	 */
	static generateStarfield(count, radius, minDistance, maxDistance) {
		let starfield = [];
		for(let i = 0; i < count; i++) {
			let coordinates = Star.getRandomCoordinates(minDistance, maxDistance);
			starfield.push(new Star(radius, 0xaaaaaa, coordinates.x, coordinates.y, coordinates.z));
		}

		return starfield;
	}


	/**
	 * @param {number} minDistance
	 * @param {number} maxDistance
	 * @return {{x: number, y: number, z: number}}
	 */
	static getRandomCoordinates(minDistance, maxDistance) {
		let distanceDifference = maxDistance - minDistance;
		let coordinates = {
			x: null,
			y: null,
			z: null
		};

		for(let plane in coordinates) {
			coordinates[plane] = (Math.floor(Math.random() * distanceDifference) + minDistance) * (Math.random() < 0.5 ? -1 : 1);
		}

		return coordinates;
	}
}


export default Star;
