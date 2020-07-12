
import * as THREE from 'three';
import PaperTexture from '../../../assets/papertexture.jpg';
import SceneSubject from '../SceneSubject';


class CardFace extends SceneSubject {
	constructor(width, height, anisotropy) {
		super();
		this.width = width;
		this.height = height;
		this.canvas = null;
		this.context = null;
		this.anisotropy = anisotropy;
		this.pattern = null;
		this.texture = null;
		this.needsUpdate = true;

		/**
		 * CardFace needs to maintain a list of hovered CanvasSubjects to
		 * be able to send an event notification for onMouseOut
		 * @type {Array.<CanvasSubject>}
		 */
		this.intersectedSubjectIds = [];

		/**
		 * @type {Array.<CanvasSubject>}
		 */
		this.canvasSubjects = [];
	}


	/**
	 * Return an array of all intersected canvas subjects this face manages
	 * Also update the intersected subject ids
	 * @param {THREE.Vector2} uvCoordinates
	 * @return {Array.<CanvasSubject>}
	 */
	findIntersectedSubjects(uvCoordinates) {
		let pointX = uvCoordinates.x * this.getObjectWidth();
		let pointY = (1 - uvCoordinates.y) * this.getObjectHeight();	//Canvas Y is inverted
		let textureIntersection = new THREE.Vector2(pointX, pointY);
		return this.canvasSubjects.filter(subject => subject.isIntersected(textureIntersection));
	}


	updateIntersectedSubjectIdsArray(intersectedSubjects) {
		this.intersectedSubjectIds = intersectedSubjects.map(subject => subject.id);
	}


	onMouseDown(mouseEvent, intersectionInformation) {
		let intersectedSubjects = this.findIntersectedSubjects(intersectionInformation.uv);
		intersectedSubjects.forEach(subject => {
			subject.onMouseDown(mouseEvent);
		});
	}


	onMouseUp(mouseEvent, intersectionInformation) {
		let intersectedSubjects = this.findIntersectedSubjects(intersectionInformation.uv);
		intersectedSubjects.forEach(subject => {
			subject.onMouseUp(mouseEvent);
		});
	}


	onMouseOver(mouseEvent, intersectionInformation) {
		let intersectedSubjects = this.findIntersectedSubjects(intersectionInformation.uv);
		this.updateIntersectedSubjectIdsArray(intersectedSubjects);

		this.canvasSubjects.forEach(subject => {
			let isIntersected = this.intersectedSubjectIds.includes(subject.id);
			if(!subject.isHovered && isIntersected) {
				subject.onMouseOver(mouseEvent);
			} else if (subject.isHovered && !isIntersected) {
				subject.onMouseOut(mouseEvent);
			}
		});
	}


	onMouseOut(mouseEvent) {
		this.updateIntersectedSubjectIdsArray([]);
		this.canvasSubjects.forEach(subject => {
			if(subject.isHovered) {
				subject.onMouseOut(mouseEvent);
			}
		});
	}


	getObjectWidth() {
		return parseInt(this.canvas.style.width);
	}


	getObjectHeight() {
		return parseInt(this.canvas.style.height);
	}


	writeText(text, x, y, size, font, color, opacity, maxWidth, align) {
		font = font || 'sans-serif';
		color = color || 'black';
		opacity = opacity || 1;
		maxWidth = maxWidth || null;
		align = align || 'start';

		try {
			this.context.save();

			//To fit, fontSize calculations
			this.context.font = `${size}px ${font}`;
			while(maxWidth && this.context.measureText(text).width > maxWidth) {
				size -= 5;
				this.context.font = `${size}px ${font}`;
			}

			this.context.fillStyle = color;
			this.context.globalAlpha = opacity;
			this.context.textAlign = align;
			this.context.fillText(text, x, y);
		} finally {
			this.context.restore();
		}
	}


	initialize() {
		this.canvas = document.createElement('canvas');
		this.context = this.canvas.getContext('2d');

		//For Retina displays
		let dpi  = window.devicePixelRatio || 1;
		this.canvas.style.width = this.width + 'px';
		this.canvas.style.height = this.height + 'px';
		this.canvas.width = this.width * dpi;
		this.canvas.height = this.height * dpi;
		this.context.scale(dpi, dpi);

		this.texture = new THREE.CanvasTexture(this.canvas);
		this.texture.anisotropy = this.anisotropy;

		return CardFace.loadImage(PaperTexture)
			.then(image => {
				this.pattern = this.context.createPattern(image, 'repeat');
			});
	}


	update() {
		if(!this.needsUpdate) { return; }
		this.drawBackground();
	}


	drawBackground() {
		try {
			let width = this.canvas.width;
			let height = this.canvas.height;

			this.context.save();
			this.context.clearRect(0, 0, width, height);
			this.context.fillStyle = this.pattern;
			this.context.fillRect(0, 0, width, height);
		} finally {
			this.context.restore();
		}
	}


	/**
	 * @param {string} url
	 * @return {Promise<HTMLImageElement>}
	 */
	static loadImage(url) {
		return new Promise((resolve, reject) => {
			let imageLoader = new THREE.ImageLoader();
			imageLoader.load(url, resolve, null, reject);
		});
	}
}


export default CardFace;
