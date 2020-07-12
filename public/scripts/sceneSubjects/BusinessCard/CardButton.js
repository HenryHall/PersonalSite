
import * as THREE from 'three';
import CanvasSubject from './CanvasSubject';
import Mouse from '../../Mouse';


class CardButton extends CanvasSubject {
	/**
	 * @param {string} name
	 * @param {string} path
	 * @param {string} url
	 * @param {THREE.Vector2} position
	 * @param {number} radius
	 */
	constructor(name, path, url, position, radius) {
		super();
		this.name = name;
		this.path = path;
		this.url = url;
		this.position = position;
		this.radius = radius;
	}


	initialize() {
		return new Promise((resolve, reject) => {
			let imageLoader = new THREE.ImageLoader();
			imageLoader.load(this.path, resolve, null, reject);
		})
			.then(image => {
				this.image = image;
			});
	}


	draw(context) {
		this.drawButton(context);

		if(this._isHovered) {
			this.drawOutline(context);
		}

		this._needsUpdate = false;
	}


	/**
	 * @param {CanvasRenderingContext2D} context
	 */
	drawButton(context) {
		let radiusGrowth = this.getRadiusGrowth();
		try {
			context.save();

			context.globalAlpha = .8;
			context.drawImage(
				this.image,
				this.position.x - this.radius - radiusGrowth,
				this.position.y - this.radius - radiusGrowth,
				(this.radius + radiusGrowth) * 2,
				(this.radius + radiusGrowth) * 2
			);
		} finally {
			context.restore();
		}
	}


	/**
	 * @param {CanvasRenderingContext2D} context
	 */
	drawOutline(context) {
		let radiusGrowth = this.getRadiusGrowth() * 1.2;
		let outlineRadius = this.radius + (radiusGrowth * 2);
		let outlineCircumference = 2 * Math.PI * outlineRadius;
		let outlineDashLength = outlineCircumference / 20;

		try {
			context.save();

			context.globalAlpha = 0.80;
			context.lineWidth = 10;
			context.strokeStyle = 'grey';
			context.setLineDash([outlineDashLength, outlineDashLength]);
			context.beginPath();
			context.arc(
				this.position.x,
				this.position.y,
				outlineRadius,
				0,
				Math.PI * 2
			);
			context.closePath();
			context.stroke();
		} finally {
			context.restore();
		}
	}


	/**
	 * @param {THREE.Vector2} point
	 * @return {boolean}
	 */
	isIntersected(point) {
		//Check if this button is being intersected by the mouse
		let radiusGrowth = this.getRadiusGrowth();
		let dx = point.x - this.position.x;
		let dy = point.y - this.position.y;
		let distance = Math.hypot(dx, dy);
		return distance < this.radius + radiusGrowth;
	}


	getRadiusGrowth() {
		let growth = this._isHovered ? this.radius * 0.05 : 0;
		return Mouse.isDown ? growth * 2 : growth;
	}


	onMouseOver(mouseEvent) {
		if(this._isHovered) { return; }	//Already aware!
		this._needsUpdate = true;
		this._isHovered = true;
	}


	onMouseOut(mouseEvent) {
		this._needsUpdate = true;
		this._isHovered = false;
	}


	onMouseDown(mouseEvent) {
		this._needsUpdate = true;
		this._isClicked = true;

		/**
		 * This is different than onMouseUp because we do not care if the mouse was
		 * lifted over this button.  Only that it was lifted anywhere.
		 */
		let onButtonClick = () => {
			this._isClicked = false;
			this._needsUpdate = true;

			window.removeEventListener('mouseup', onButtonClick);
		};

		window.addEventListener('mouseup', onButtonClick);
	}


	onMouseUp(mouseEvent) {
		if(this._isClicked) {
			// open url
			let windowRef = window.open(this.url);
			if(!windowRef) {
				//The popup did not open, possibly blocked
				//todo: create a modal to ask the user if they would like to navigate away
			}
		}

		this._isClicked = false;
		this._needsUpdate = true;
	}
}


export default CardButton;
