
import * as THREE from 'three';


class Mouse {
	constructor() {
		/**
		 * @type {boolean}
		 * @private
		 */
		this._isDown = false;

		/**
		 * @type {Vector2}
		 */
		this.vector = new THREE.Vector2();

		/**
		 * @type {THREE.Vector2|null}
		 */
		this.mouseDownVector = null;

		/**
		 * @type {number}
		 */
		this.sceneWidth = 0;

		/**
		 * @type {number}
		 */
		this.sceneHeight = 0;
	}


	get isDown() {
		return this._isDown;
	}


	/**
	 * Give the mouse context about the renderer's dom element
	 * @param {HTMLCanvasElement} domElement
	 */
	setBoundaryContext(domElement) {
		this.sceneWidth = domElement.width;
		this.sceneHeight = domElement.height;
	}


	/**
	 * @param {MouseEvent} mouseEvent
	 */
	onMouseDown(mouseEvent) {
		this._isDown = true;
		this.mouseDownVector = new THREE.Vector2(mouseEvent.clientX, mouseEvent.clientY);
	}


	/**
	 * @param {MouseEvent} mouseEvent
	 */
	onMouseUp(mouseEvent) {
		this._isDown = false;
	}


	/**
	 * @param {MouseEvent} mouseEvent
	 */
	onMouseMove(mouseEvent) {
		// let vector = new THREE.Vector2((e.clientX - canvasRect.left) / canvasRect.width, (e.clientY - canvasRect.top) / canvasRect.height);
		let x = (mouseEvent.clientX / this.sceneWidth) * 2 - 1;
		let y = -(mouseEvent.clientY / this.sceneHeight) * 2 + 1;
		this.vector = new THREE.Vector2(x, y);
	}
}


export default new Mouse();
