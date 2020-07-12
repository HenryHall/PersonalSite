
import * as THREE from 'three';
import CardFace from './CardFace';
import CardButton from './CardButton';
import GitHubSVG from '../../../assets/github.svg';
import LinkedInSVG from '../../../assets/linkedin.png';
import CodePenSVG from '../../../assets/codepen.png';


class BackFace extends CardFace {
	constructor(width, height, anisotropy) {
		super(width, height, anisotropy);
	}


	initialize() {
		Promise.resolve()
			.then(super.initialize.bind(this))
			.then(() => {
				let width = this.getObjectWidth();
				let height = this.getObjectHeight();

				let buttonDetailsList = [
					{
						name: 'Git Hub',
						path: GitHubSVG,
						url: 'https://github.com/HenryHall',
					},
					{
						name: 'LinkedIn',
						path: LinkedInSVG,
						url: 'https://www.linkedin.com/in/henry-hall-ba2168122/'
					},
					{
						name: 'Code Pen',
						path: CodePenSVG,
						url: 'https://codepen.io/HenryPrime/'
					}
				];

				//Button Layout Calculations
				let buttonZoneLength, shift, dx, dy, r;
				let horizontalLayout = width > height;
				if(horizontalLayout) {
					//Horizontal Layout
					buttonZoneLength = width / (buttonDetailsList.length + 1);
					r = buttonZoneLength / 2;
					shift = buttonZoneLength / (buttonDetailsList.length + 1);
					dx = shift + r;
					dy = (height / 2);
				} else {
					//Vertical Layout
					buttonZoneLength = height / (buttonDetailsList.length + 1);
					r = buttonZoneLength / 2;
					shift = buttonZoneLength / (buttonDetailsList.length + 1);
					dx = (width / 2);
					dy = shift + r;
				}

				buttonDetailsList.forEach(buttonDetails => {
					this.canvasSubjects.push(new CardButton(
						buttonDetails.name,
						buttonDetails.path,
						buttonDetails.url,
						new THREE.Vector2(dx, dy),
						r
					));

					if(horizontalLayout){
						dx = dx + buttonZoneLength + shift;
					} else {
						dy = dy + buttonZoneLength + shift;
					}
				});

				let canvasSubjectPromises = this.canvasSubjects.map(subject => subject.initialize());
				return Promise.allSettled(canvasSubjectPromises);
			})
			.then(results => {
				results.forEach(result => {
					if(result.status !== 'fulfilled') {
						console.error(result.reason);
					}
				});
			});
	}


	update() {
		let needsUpdate = this.canvasSubjects.some(subject => subject.needsUpdate);

		if(needsUpdate) {
			this.drawBackground();	//todo: this could be a saved state to restore

			this.canvasSubjects.forEach(subject => subject.draw( this.context ));

			this.texture.needsUpdate = true;
		}

		this.needsUpdate = false;
	}
}


export default BackFace;
