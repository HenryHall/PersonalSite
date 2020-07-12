
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';


class Controls {
	constructor() {
		throw new Error('Please don\'t instantiate me!');
	}


	get instance() {
		return Controls._instance || new Error('Controls have not been built yet');
	}


	set instance(value) {
		if(Controls._instance) {
			throw new Error('Controls instance has already been built');
		}

		Controls._instance = value;
	}


	/**
	 * @param {THREE.Camera} camera
	 * @param {HTMLElement} domElement
	 * @return {OrbitControls}
	 */
	static build(camera, domElement, maxDistance) {
		const controls = new OrbitControls( camera, domElement );
		controls.maxDistance = maxDistance;
		controls.update();

		Controls.instance = controls;

		return controls;
	}


	static getInstance() {
		return Controls.instance;
	}
}


Controls._instance = null;


export default Controls;
