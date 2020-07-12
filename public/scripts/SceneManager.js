
import * as THREE from 'three';
import Controls from './Controls';
import Mouse from './Mouse';
import BusinessCard from './sceneSubjects/BusinessCard/BusinessCard';
import Moon from './sceneSubjects/Moon';
import Star from './sceneSubjects/Star';

/**
 * @param {HTMLCanvasElement} canvas
 * @constructor
 */
class SceneManager {
	constructor( canvas ) {
		this.maxRenderDistance = 5000;

		/**
		 * @type {HTMLCanvasElement}
		 */
		this.canvas = canvas;

		this.scene = this.buildScene();

		this.renderer = this.buildRenderer();

		this.raycaster = new THREE.Raycaster();

		this.camera = this.buildCamera();

		this.sceneSubjects = this.buildSceneSubjects();

		this.controls = this.buildControls();
	}


	buildScene() {
		const scene = new THREE.Scene();
		scene.background = new THREE.Color(0x000000);

		const light1 = new THREE.AmbientLight(0xaaaaaa, 1);
		const light2 = new THREE.PointLight(0x999999, 1, this.maxRenderDistance);
		light2.castShadow = true;
		light2.position.set(100, 500, 500);
		light2.shadow.mapSize.width = 1024;
		light2.shadow.mapSize.height = 1024;
		light2.shadow.camera.far = 1000;

		scene.add(light1);
		scene.add(light2);

		return scene;
	}


	buildRenderer() {
		const renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		return renderer;
	}


	buildCamera() {
		let fieldOfView = 50;
		let aspectRatio = this.canvas.width / this.canvas.height;
		let nearPlane = 1;
		let farPlane = 5000;	//maxRender
		let camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
		camera.position.set(0, 0, 200);
		camera.updateProjectionMatrix();

		return camera;
	}


	buildSceneSubjects() {
		//Todo: clean this up
		let cardWidth = 120,
			cardHeight = 60,
			cardThickness = .75,
			maxAnisotropy = this.renderer.capabilities.getMaxAnisotropy();
		const card = new BusinessCard(cardWidth, cardHeight, cardThickness, maxAnisotropy);

		let moonRadius = 300;
		let moonPosition = new THREE.Vector3(0, -(moonRadius + cardHeight), 0);
		let moonWidthSegment = 32;
		let moonHeightSegment = 32;
		const moon = new Moon(moonRadius, moonPosition, moonWidthSegment, moonHeightSegment);

		const stars = Star.generateStarfield(2000, 5, 300, this.maxRenderDistance - 50);

		return [
			card,
			moon,
			...stars
		];
	}


	buildControls() {
		let maxDistance = this.maxRenderDistance - 500;
		return Controls.build( this.camera, this.renderer.domElement, maxDistance);
	}


	initialize() {
		Mouse.setBoundaryContext(this.renderer.domElement);
		this.canvas.style.cursor = 'grab';

		let initializationPromises = this.sceneSubjects.map(subject => {
			return subject.initialize()
				.then(() => {
					this.scene.add(subject.object);
				})
				.catch(error => {
					throw new Error(`Scene subject ${subject.constructor.name} was not properly initialized.\n${error}`);
				});
		});

		return Promise.allSettled(initializationPromises)
			.then(results => {
				results.forEach(result => {
					if(result.status !== 'fulfilled') {
						console.error(result.reason);
					}
				});
			});
	}


	update() {
		this.sceneSubjects.forEach(subject => subject.update());
		this.renderer.render( this.scene, this.camera );
	}


	onWindowResize() {
		let width = this.canvas.width;
		let height = this.canvas.height;

		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(width, height);

		Mouse.setBoundaryContext(this.renderer.domElement);
	}


	onMouseDown(e) {
		this.canvas.style.cursor = 'grabbing';

		Mouse.onMouseDown(e);

		let intersectionInformation = this.findFirstIntersect();
		if(intersectionInformation) {
			let objectUnderMouse = this.findSceneSubject(intersectionInformation.object);
			objectUnderMouse.onMouseDown(e, intersectionInformation);
		}
	}


	onMouseUp(e) {
		this.canvas.style.cursor = 'grab';
		this.controls.enableRotate = true;

		Mouse.onMouseUp(e);

		let intersectionInformation = this.findFirstIntersect();
		if(intersectionInformation) {
			let objectUnderMouse = this.findSceneSubject(intersectionInformation.object);
			objectUnderMouse.onMouseUp(e, intersectionInformation);
		}
	}


	onMouseMove(e) {
		Mouse.onMouseMove(e);

		let intersectionInformation = this.findFirstIntersect();
		if(intersectionInformation) {
			let objectUnderMouse = this.findSceneSubject(intersectionInformation.object);
			objectUnderMouse.onMouseOver(e, intersectionInformation);
		}
	}


	/**
	 * @typedef IntersectionInformation
	 * @type {Object}
	 * @property {number} distance
	 * @property {THREE.Vector3} point
	 * @property {THREE.Face3} face
	 * @property {number} faceIndex
	 * @property {THREE.Object3} object
	 * @property {THREE.Vector2} uv
	 * @property {THREE.Vector2} uv2
	 * @property {number} instanceId
	 */

	/**
	 * Determines if the mouse is over a scene subject
	 * Returns information about the intersection or null
	 * @return {IntersectionInformation|null}
	 */
	findFirstIntersect() {
		this.raycaster.setFromCamera(Mouse.vector, this.camera);
		//Returns an array of objects the mouse is intersecting, from the camera nearest to farthest
		let intersects = this.raycaster.intersectObjects(this.scene.children);

		return intersects.length > 0 ? intersects[0] : null;
	}


	/**
	 * Interrogates the intersectionInformation object to find which
	 * scene subject it relates to.  Returns the intersected scene subject
	 * @param {THREE.Object3} intersectedObject
	 * @return {SceneSubject}
	 */
	findSceneSubject(intersectedObject) {
		let sceneSubject = this.sceneSubjects.find(subject => subject.object.uuid === intersectedObject.uuid);
		if(!sceneSubject) { throw Error('No scene subject match found!'); }

		return sceneSubject;
	}
}


//todo: turn this into a service
export default SceneManager;
