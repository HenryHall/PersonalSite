
import * as THREE from 'three';
import MoonImage from '../../assets/moontexture.jpg';
import SceneSubject from './SceneSubject';

/**
 * @implements SceneSubject
 * @param {number} radius
 * @param {number} wSegment
 * @param {number} hSegment
 * @param {number} offset
 * @constructor
 */
class Moon extends SceneSubject {
	/**
	 * @param {number} radius
	 * @param {THREE.Vector3} position
	 * @param {number} widthSegments
	 * @param {number} heightSegments
	 */
	constructor(radius, position, widthSegments, heightSegments, ) {
		super();
		this.radius = radius;
		this.position = position;
		this.widthSegments = widthSegments;
		this.heightSegments = heightSegments;
		this.object = null;
	}


	initialize() {
		return new Promise((resolve, reject) => {
			return new THREE.TextureLoader().load(MoonImage, resolve, null, reject);
		})
			.then(moonTexture => {
				let geometry = new THREE.SphereBufferGeometry(this.radius, this.widthSegments, this.heightSegments);
				let material = new THREE.MeshPhongMaterial({map: moonTexture});
				this.object = new THREE.Mesh(geometry, material);
				this.object.receiveShadow = true;
				this.object.position.copy(this.position);
				this.object.rotation.z = (Math.PI / 2);
			});
	}


	update() {
		this.object.rotation.x += .0005;
		this.object.rotation.z += .0003;
	}
}


export default Moon;
