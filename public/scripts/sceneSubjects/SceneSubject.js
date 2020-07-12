/**
 * @interface
 */
class SceneSubject {
	constructor() {
	}

	initialize() {
		return Promise.resolve();
	}

	update(){}

	/**
	 * @param {MouseEvent} mouseEvent
	 * @param {IntersectionInformation} intersectionInformation
	 */
	onMouseDown(mouseEvent, intersectionInformation){}

	/**
	 * @param {MouseEvent} mouseEvent
	 * @param {IntersectionInformation} intersectionInformation
	 */
	onMouseUp(mouseEvent, intersectionInformation){}

	/**
	 * @param {MouseEvent} mouseEvent
	 * @param {IntersectionInformation} intersectionInformation
	 */
	onMouseOver(mouseEvent, intersectionInformation){}

	/**
	 * @param {MouseEvent} mouseEvent
	 * @param {IntersectionInformation} intersectionInformation
	 */
	onMouseOut(mouseEvent, intersectionInformation){}
}


export default SceneSubject;
