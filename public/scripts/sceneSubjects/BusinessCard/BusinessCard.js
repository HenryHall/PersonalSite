
import * as THREE from 'three';
import Controls from '../../Controls';
import Mouse from '../../Mouse';
import SceneSubject from '../SceneSubject';
import FrontFace from './FrontFace';
import BackFace from './BackFace';


class BusinessCard extends SceneSubject {
	constructor(width, height, thickness, anisotropy) {
		super();
		this.width = width;
		this.height = height;
		this.thickness = thickness;

		let canvasWidth = width > height ? 1024 : 512;
		let canvasHeight = width > height ? 512 : 1024;
		this.frontFace = new FrontFace(canvasWidth, canvasHeight, anisotropy);
		this.backFace = new BackFace(canvasWidth, canvasHeight, anisotropy);

		/**
		 * Used to calculate rotation angle for mouse events
		 * @type {THREE.Vector2|null}
		 * @private
		 */
		this._initialRotation = null;
	}

	onMouseDown(mouseEvent, intersectionInformation) {
		let controls = Controls.getInstance();
		controls.enableRotate = false;
		this._initialRotation = this.object.rotation.y;

		let cardRotate = this.rotate.bind(this);
		window.addEventListener('mousemove', cardRotate);
		window.addEventListener('mouseup', function(){window.removeEventListener('mousemove', cardRotate); });

		let cardFace =this.getFace(intersectionInformation.faceIndex);
		cardFace.onMouseDown(mouseEvent, intersectionInformation);
	}


	onMouseUp(mouseEvent, intersectionInformation) {
		let cardFace = this.getFace(intersectionInformation.faceIndex);
		if(cardFace) {
			cardFace.onMouseUp(mouseEvent, intersectionInformation);
		}

		this._initialRotation = null;
	}


	onMouseOver(mouseEvent, intersectionInformation) {
		let cardFace = this.getFace(intersectionInformation.faceIndex);
		if(cardFace) {
			cardFace.onMouseOver(mouseEvent, intersectionInformation);
		}
	}


	/**
	 * @param {number} faceIndex
	 * @return {null|CardFace}
	 */
	getFace(faceIndex) {
		switch(faceIndex) {
		case 8:
		case 9:
			//Front Face
			return this.frontFace;
		case 10:
		case 11:
			//Back Face
			return this.backFace;
		default:
			//Side faces
			return null;
		}
	}


	/**
	 * @param {MouseEvent} moveEvent
	 */
	rotate(mouseEvent) {
		let dx = mouseEvent.clientX - Mouse.mouseDownVector.x;
		this.object.rotation.y = this._initialRotation + (Math.PI * 2 * (dx / window.innerWidth));
	}


	buildThreeObject() {
		let geometry = new THREE.BoxGeometry(this.width, this.height, this.thickness);
		let materialArray = [
			new THREE.MeshPhongMaterial({ color: 0xaaaaaa }),   //Left
			new THREE.MeshPhongMaterial({ color: 0xaaaaaa }),   //Right
			new THREE.MeshPhongMaterial({ color: 0xaaaaaa }),   //Top
			new THREE.MeshPhongMaterial({ color: 0xaaaaaa }),   //Bottom
			new THREE.MeshPhongMaterial({ map: this.frontFace.texture }),     //Front
			new THREE.MeshPhongMaterial({ map: this.backFace.texture })       //Back
		];

		geometry.computeFaceNormals();
		this.object = new THREE.Mesh(geometry, materialArray);
		this.object.castShadow = true;
	}

	initialize() {
		return Promise.resolve()
			.then(() => {
				return Promise.all([
					this.frontFace.initialize(),
					this.backFace.initialize()
				]);
			})
			.then(this.buildThreeObject.bind(this));
	}

	update() {
		this.frontFace.update();
		this.backFace.update();
	}
}


export default BusinessCard;
