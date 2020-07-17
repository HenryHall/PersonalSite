
import '@babel/polyfill';
import './index.css';
import SceneManager from './scripts/SceneManager.js';


console.log('Hello, I\'d love to work for you!');

const sceneCanvas = document.getElementById('sceneCanvas');
sceneCanvas.height = window.innerHeight;
sceneCanvas.width = window.innerWidth;

const sceneManager = new SceneManager(sceneCanvas);
run();


function registerListeners() {
	window.addEventListener('resize', onResize);
	sceneCanvas.addEventListener('pointerup', sceneManager.onMouseUp.bind(sceneManager));
	sceneCanvas.addEventListener('pointerdown', sceneManager.onMouseDown.bind(sceneManager));
	sceneCanvas.addEventListener('pointermove', sceneManager.onMouseMove.bind(sceneManager));
}


function animate() {
	requestAnimationFrame(animate);
	sceneManager.update();
}


function run() {
	return sceneManager.initialize()
		.then(registerListeners)
		.then(animate);
}


function onResize() {
	sceneCanvas.height = window.innerHeight;
	sceneCanvas.width = window.innerWidth;
	sceneManager.onWindowResize();
}
