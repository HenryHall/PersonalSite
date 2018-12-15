

var scene = new THREE.Scene();
var sCanvas = document.getElementById("myCanvas");
sCanvas.height = window.innerHeight;
sCanvas.width = window.innerWidth;
var camera = new THREE.PerspectiveCamera( 40, sCanvas.width / sCanvas.height, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer = new THREE.WebGLRenderer({ canvas: sCanvas });

var raycaster = new THREE.Raycaster();
var mouseVect = new THREE.Vector2();


window.addEventListener("resize", onWindowResize);
sCanvas.addEventListener("mousemove", onMouseMove);

function onWindowResize(){
  sCanvas.height = window.innerHeight;
  sCanvas.width = window.innerWidth;
  renderer.setSize( sCanvas.width, sCanvas.height );
  camera.aspect = sCanvas.width / sCanvas.height;
  camera.updateProjectionMatrix();
}

function onMouseMove(e){
  e.preventDefault();

  var canvasRect = sCanvas.getBoundingClientRect();
  var vector = new THREE.Vector2( (e.clientX - canvasRect.left) / canvasRect.width, (e.clientY - canvasRect.top) / canvasRect.height );
  mouseVect.set( ( vector.x * 2 ) - 1, - ( vector.y * 2 ) + 1 );
  raycaster.setFromCamera( mouseVect, camera );

  //Array of objects the mouse is over, nearest to farthest
  var intersects = raycaster.intersectObjects( scene.children );

  if( intersects.length > 0 && intersects[0].uv ){
    switch (intersects[0].object) {
      case bizCard:
        console.log("Mouse over bizCard!");
        break;
      default:
        console.log("No mouse over");
    }
  }
}


var cardFrontCnvs = document.createElement('canvas');
var cfCtx = cardFrontCnvs.getContext('2d');
var frontTexture = new THREE.CanvasTexture( cardFrontCnvs );
cardFrontCnvs.height = 256;
cardFrontCnvs.width = 512;
frontTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();


var cardBackCnvs = document.createElement('canvas');
var cbCtx = cardBackCnvs.getContext('2d');
var backTexture = new THREE.CanvasTexture( cardBackCnvs );
cardBackCnvs.height = 256;
cardBackCnvs.width = 512;
backTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();


var geometry = new THREE.BoxGeometry( 8, 4, .03 );

geometry.computeFaceNormals();


var materialArray = [
  new THREE.MeshBasicMaterial({ color: 0xffffff }),   //Left
  new THREE.MeshBasicMaterial({ color: 0xffffff }),   //Right
  new THREE.MeshBasicMaterial({ color: 0xffffff }),   //Top
  new THREE.MeshBasicMaterial({ color: 0xffffff }),   //Bottom
  new THREE.MeshBasicMaterial({ map: frontTexture }),     //Front
  new THREE.MeshBasicMaterial({ map: backTexture })     //Back
];

var bizCard = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial(materialArray) );


function drawCardFront(){

  //Card Texture
  cfCtx.fillStyle = '#eeeeee';
  cfCtx.fillRect(0, 0, cardBackCnvs.width, cardBackCnvs.height);

  //Card Text
  cfCtx.font = '50px serif';
  cfCtx.textAlign = 'center';
  cfCtx.fillStyle = "black";
  cfCtx.fillText("Front Side", cardFrontCnvs.width / 2, cardFrontCnvs.height / 2);

}


function drawCardBack(){

  //Texture
  cbCtx.fillStyle = '#eeeeee';
  cbCtx.fillRect(0, 0, cardBackCnvs.width, cardBackCnvs.height);

  //Text
  // cbCtx.font = '50px serif';
  // cbCtx.textAlign = 'center';
  // cbCtx.fillStyle = "black";
  // cbCtx.fillText("Back Side", cardBackCnvs.width / 2, cardBackCnvs.height / 2);

  //Animation
  var logoSrcs = [
    '../assets/github.png',
    '../assets/linkedin.png',
    '../assets/codepen.png'
  ];

  var logoSquare, shift, dx, dy;
  if( cardBackCnvs.width > cardBackCnvs.height ){
    logoSquare = cardBackCnvs.width * ( 1 / ( logoSrcs.length + 1 ) );
    shift = logoSquare * .25;
    dx = shift;
    dy = (cardBackCnvs.height / 2) - (logoSquare / 2);
  } else {
    logoSquare = cardBackRadius.height * ( 1 / ( logoSrcs.length + 1 ) );
    shift = logoSquare * .25;
    dx = (cardBackCnvs.width / 2) -  (logoSquare / 2);
    dy = shift;
  }

  logoSrcs.forEach( (logoSrc) => {
    let img = new Image();
    img.src = logoSrc;
    cbCtx.drawImage( img, dx, dy, logoSquare, logoSquare );
    dx = dx + logoSquare + shift;
  });

}


scene.add( bizCard );
camera.position.z = 10;


function animate() {
	requestAnimationFrame( animate );
  cfCtx.clearRect(0, 0, cardFrontCnvs.width, cardFrontCnvs.height);
  cbCtx.clearRect(0, 0, cardFrontCnvs.width, cardFrontCnvs.height);

  drawCardFront();
  drawCardBack();

  frontTexture.needsUpdate = true;
  backTexture.needsUpdate = true;

  // bizCard.rotation.x += .01;
  bizCard.rotation.y -= .005;

	renderer.render( scene, camera );
}
animate();










//ANGULAR

var myApp = angular.module('myApp', []);


myApp.controller('mainController', ['$scope', function($scope){



}]);
