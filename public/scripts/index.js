

var scene = new THREE.Scene();
var canvas = document.getElementById("myCanvas");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
var camera = new THREE.PerspectiveCamera( 75, canvas.width / canvas.height, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();
renderer = new THREE.WebGLRenderer({ canvas: canvas });


window.addEventListener("resize", function(){
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  renderer.setSize( canvas.width, canvas.height );
  camera.aspect = canvas.width / canvas.height;
  camera.updateProjectionMatrix();
});


var cardFrontCnvs = document.createElement('canvas');
var cfCtx = cardFrontCnvs.getContext('2d');
cfCtx.fillStyle = "blue";
cfCtx.fillRect(0, 0, cardFrontCnvs.width, cardFrontCnvs.height);

var cardBackCnvs = document.createElement('canvas');
var cbCtx = cardBackCnvs.getContext('2d');
cbCtx.fillStyle = "red";
cbCtx.fillRect(0, 0, cardBackCnvs.width, cardBackCnvs.height);

var geometry = new THREE.BoxGeometry( 8, 4, .05 );

// loader.setPath( '../assets/' );
// var textureCube = loader.load(['papertexture.png', 'papertexture.png', 'papertexture.png', 'papertexture.png', 'papertexture.png', 'papertexture.png']);

var materialArray = [
  new THREE.MeshBasicMaterial({color: 0x0000ff}),   //Left
  new THREE.MeshBasicMaterial({color: 0xffffff}),   //Right
  new THREE.MeshBasicMaterial({color: 0xffffff}),   //Top
  new THREE.MeshBasicMaterial({color: 0xffffff}),   //Bottom
  // new THREE.MeshBasicMaterial({color: 0x0000ff}),   //Front
  // new THREE.MeshBasicMaterial({color: 0xff0000}),   //Back
  new THREE.MeshBasicMaterial({map: new THREE.CanvasTexture( cardFrontCnvs )}),     //Front
  new THREE.MeshBasicMaterial({map: new THREE.CanvasTexture( cardBackCnvs )})     //Back
];

var bizCard = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial(materialArray) );


//Check this: http://bl.ocks.org/MAKIO135/eab7b74e85ed2be48eeb


function updateCardFront(){
  cfCtx.fillText("Henry Hall", canvas.height, canvas.width);
}


function updateCardBack(){

}


scene.add( bizCard );
camera.position.z = 10;

function animate() {
	requestAnimationFrame( animate );

  updateCardFront();
  // updateCardBack();
  // textureCube.needsUpdate = true;

  bizCard.rotation.x += .01;
  // bizCard.rotation.y -= .01;

	renderer.render( scene, camera );
}
animate();










//ANGULAR

var myApp = angular.module('myApp', []);


myApp.controller('mainController', ['$scope', function($scope){



}]);
