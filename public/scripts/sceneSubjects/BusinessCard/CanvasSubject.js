
import IdGenerator from '../../IdGenerator';


/**
 * @interface
 */
class CanvasSubject {
	constructor() {
		/**
		 * @type {EphemeralId}
		 */
		this.id = IdGenerator.next();


		/**
		 * @type {boolean}
		 * @protected
		 */
		this._needsUpdate = true;


		/**
		 * @type {boolean}
		 * @protected
		 */
		this._isHovered = false;


		/**
		 * @type {boolean}
		 * @protected
		 */
		this._isClicked = false;
	}


	/**
	 * @return {boolean}
	 */
	get needsUpdate() {
		return this._needsUpdate;
	}


	/**
	 * @return {boolean}
	 */
	get isHovered() {
		return this._isHovered;
	}


	/**
	 * @return {boolean}
	 */
	get isClicked() {
		return this._isClicked;
	}


	/**
	 * @return {Promise<void>}
	 */
	initialize() {
		return Promise.resolve();
	}


	/**
	 * @param {CanvasRenderingContext2D} context
	 */
	draw(context) {
		this._needsUpdate = false;
	}


	/**
	 * @param {THREE.Vector2} point
	 * @return {boolean}
	 */
	isIntersected(point) {
		throw new Error('This function must be overridden');
	}


	/**
	 * @param {MouseEvent} mouseEvent
	 */
	onMouseDown(mouseEvent){}


	/**
	 * @param {MouseEvent} mouseEvent
	 */
	onMouseUp(mouseEvent){}


	/**
	 * @param {MouseEvent} mouseEvent
	 */
	onMouseOver(mouseEvent){}


	/**
	 * @param {MouseEvent} mouseEvent
	 */
	onMouseOut(mouseEvent){}
}


export default CanvasSubject;
