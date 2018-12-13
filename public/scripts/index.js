

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

var geometry = new THREE.BoxGeometry( 8, 4, .05 );
var texture = new THREE.TextureLoader().load( "../assets/papertexture.png" );
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.repeat.set( 4, 4 );
var material = new THREE.MeshBasicMaterial( {map: texture} );

//Check this: http://bl.ocks.org/MAKIO135/eab7b74e85ed2be48eeb

var bizCard = new THREE.Mesh( geometry, material );

scene.add( bizCard );
camera.position.z = 10;

function animate() {
	requestAnimationFrame( animate );

  // bizCard.rotation.x += .01;
  bizCard.rotation.y -= .005;

	renderer.render( scene, camera );
}
animate();










//ANGULAR

var myApp = angular.module('myApp', []);


myApp.controller('mainController', ['$scope', function($scope){



}]);
