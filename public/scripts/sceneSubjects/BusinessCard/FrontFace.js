
import CardFace from './CardFace';
import RighteousFont from '../../../assets/Righteous.ttf';
import RobotoFont from '../../../assets/Roboto.ttf';


class FrontFace extends CardFace{
	constructor(width, height, anisotropy){
		super(width, height, anisotropy);
		this.font = null;
		this.texture = null;
	}


	initialize() {
		return Promise.resolve()
			.then(super.initialize.bind(this))
			.then(() => {
				let righteousFont = new FontFace('Righteous', `url(${RighteousFont})`);
				let robotoFont = new FontFace('Roboto', `url(${RobotoFont})`);

				return Promise.all([righteousFont.load(), robotoFont.load()])
					.then(fontArray => {
						fontArray.forEach(font => document.fonts.add(font));
					});
			});
	}


	update() {
		if(!this.needsUpdate) { return; }

		this.drawBackground();

		let objectWidth = this.getObjectWidth();
		let objectHeight = this.getObjectHeight();

		let nameFontSize = objectHeight / 3;
		let textX = objectWidth / 2;
		let textY = objectHeight / 2;
		let textMaxWidth = objectWidth * 0.7;

		this.writeText(
			'HENRY HALL',
			textX,
			textY,
			nameFontSize,
			'Righteous',
			'black',
			0.8,
			textMaxWidth,
			'center'
		);

		this.writeText(
			'Software Developer',
			textX,
			textY + (nameFontSize / 2),
			nameFontSize * 0.5,
			'Roboto',
			'black',
			1,
			textMaxWidth * 0.7,
			'center'
		);

		this.texture.needsUpdate = true;
		this.needsUpdate = false;
	}
}


export default FrontFace;
