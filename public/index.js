
import '@babel/polyfill';
import './index.css';
import SceneManager from './scripts/SceneManager.js';


const sceneCanvas = document.getElementById('sceneCanvas');
sceneCanvas.height = window.innerHeight;
sceneCanvas.width = window.innerWidth;

const sceneManager = new SceneManager(sceneCanvas);
run();


function registerListeners() {
	window.addEventListener('resize', onResize);
	sceneCanvas.addEventListener('mouseup', sceneManager.onMouseUp.bind(sceneManager));
	sceneCanvas.addEventListener('mousedown', sceneManager.onMouseDown.bind(sceneManager));
	sceneCanvas.addEventListener('mousemove', sceneManager.onMouseMove.bind(sceneManager));
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
