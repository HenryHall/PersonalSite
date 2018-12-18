

var scene = new THREE.Scene();
var sCanvas = document.getElementById("myCanvas");
sCanvas.height = window.innerHeight;
sCanvas.width = window.innerWidth;
var camera = new THREE.PerspectiveCamera( 40, sCanvas.width / sCanvas.height, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer({ canvas: sCanvas, antialias: true });

var raycaster = new THREE.Raycaster();

var mouse = new Mouse();

var card = new BusinessCard();


window.addEventListener( 'resize', onWindowResize );
sCanvas.addEventListener ( 'mouseup', mouse.triggerEvent );
sCanvas.addEventListener( 'mousedown', mouse.triggerEvent );
sCanvas.addEventListener( 'mousemove', mouse.move );

function onWindowResize(){
  sCanvas.height = window.innerHeight;
  sCanvas.width = window.innerWidth;
  renderer.setSize( sCanvas.width, sCanvas.height );
  camera.aspect = sCanvas.width / sCanvas.height;
  camera.updateProjectionMatrix();
}

function Mouse(){
  this.vector = new THREE.Vector2(1, 1);
  this.isDown = false;

  this.move = (e) => {
    e.preventDefault();
    var canvasRect = sCanvas.getBoundingClientRect();
    var vector = new THREE.Vector2( (e.clientX - canvasRect.left) / canvasRect.width, (e.clientY - canvasRect.top) / canvasRect.height );
    this.vector.set( ( vector.x * 2 ) - 1, - ( vector.y * 2 ) + 1 );

    this.triggerEvent(e);
  }

  this.firstIntersect = () => {
    raycaster.setFromCamera( this.vector, camera );
    //Returns an array of objects the mouse is intersecting, from the camera nearest to farthest
    var intersects = raycaster.intersectObjects( scene.children );
    if( intersects.length > 0 ){
      return intersects[0];
    } else {
      return false;
    }
  }


  this.triggerEvent = (e) => {
    e.preventDefault();

    if( e.type == 'mouseup' ){
      this.isDown = false;
    } else if( e.type == 'mousedown' ){
      this.isDown = true;
    }

    //Check for button interactions
    var intersect = this.firstIntersect();

    if( intersect && intersect.object === card.object ){
      card.interact( intersect, e );
    }
    // if( intersect && intersect.interact ){
      // intersect.interact( intersect, e );
    // }
  }
}


function BusinessCard(){
  this.type = 'BusinessCard';
  this.geometry = new THREE.BoxGeometry( 8, 4, .03 );
  this.geometry.computeFaceNormals();
  this.frontFace = new FrontFace();
  this.backFace = new BackFace();
  this.materialArray = [
    new THREE.MeshBasicMaterial({ color: 0xcccccc }),   //Left
    new THREE.MeshBasicMaterial({ color: 0xcccccc }),   //Right
    new THREE.MeshBasicMaterial({ color: 0xcccccc }),   //Top
    new THREE.MeshBasicMaterial({ color: 0xcccccc }),   //Bottom
    new THREE.MeshBasicMaterial({ map: this.frontFace.texture }),     //Front
    new THREE.MeshBasicMaterial({ map: this.backFace.texture })     //Back
  ];
  this.mesh = new THREE.MeshFaceMaterial( this.materialArray );
  this.object = new THREE.Mesh( this.geometry, this.mesh );


  this.init = () => {
    this.frontFace.update();
    this.backFace.update();
    // this.object.rotation.y -= Math.PI;
  }


  this.update = () => {
    this.object.rotation.y -= .005;
  };//End update


  this.interact = ( intersect, e ) => {
    var x = intersect.uv.x * this.backFace.canvas.width;
    var y = intersect.uv.y * this.backFace.canvas.height;
    var objFace = intersect.faceIndex;
    if( [8, 9].indexOf(objFace) != -1 ){
      //Front Face
      this.frontFace.update();
      this.drawMouse(this.frontFace.context, x, y );  //Used for debug
    } else if( [10, 11].indexOf(objFace) != -1 ){
      //Back Face
      this.backFace.buttons.forEach( (btn) => {
        if( btn.checkIntersection( x, y ) ){
          btn.update(e);
        }
      });
      this.backFace.update();
      this.drawMouse(this.backFace.context, x, y );  //Used for debug
    } else {
      //Side Face
    }
  };//End interact


  function FrontFace(){
    this.type = 'BusinessCardFace';
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.canvas.height = 256;
    this.canvas.width = 512;

    this.texture = new THREE.CanvasTexture( this.canvas );
    this.texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    this.update = () => {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      //Card Texture
      this.context.fillStyle = '#eeeeee';
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

      //Card Text
      this.context.font = '10em serif';
      this.context.textAlign = 'center';
      this.context.textBaseline = 'middle';
      this.context.fillStyle = "black";
      this.context.fillText("Henry Hall", this.canvas.width / 2, this.canvas.height / 2);

      this.texture.needsUpdate = true;
    }//End Update
  }//End FrontFaceCanvas


  function BackFace(){
    this.type = 'BusinessCardFace';
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.canvas.height = 256;
    this.canvas.width = 512;

    this.texture = new THREE.CanvasTexture( this.canvas );
    this.texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    this.buttons = [
      new CardButton('../assets/github.svg', 'https://github.com/HenryHall'),
      new CardButton('../assets/linkedin.png', 'https://www.linkedin.com/in/henry-hall-ba2168122/'),
      new CardButton('../assets/codepen.png', 'https://codepen.io/HenryPrime/')
    ];

    this.update = () => {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      //Texture
      this.context.fillStyle = '#eeeeee';
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

      //Text
      // this.context.font = '50px serif';
      // this.context.textAlign = 'center';
      // this.context.fillStyle = "black";
      // this.context.fillText("Back Side", this.canvas.width / 2, this.canvas.height / 2);

      //Button Init
      var logoSquare, shift, dx, dy;
      var isWider = this.canvas.width > this.canvas.height ? true : false;
      if( isWider ){
        logoSquare = this.canvas.width * ( 1 / ( this.buttons.length + 1 ) );
        shift = logoSquare * ( 1 / ( this.buttons.length + 1 ) );
        dx = shift;
        dy = (this.canvas.height / 2) - (logoSquare / 2);
      } else {
        logoSquare = this.canvas.height * ( 1 / ( this.buttons.length + 1 ) );
        shift = logoSquare * ( 1 / ( this.buttons.length + 1 ) );
        dx = (this.canvas.width / 2) -  (logoSquare / 2);
        dy = shift;
      }

      this.buttons.forEach( (btn) => {
        btn.x = dx;
        btn.y = dy;
        btn.radius = logoSquare / 2;

        //Draw based on mouse.isDown
        if( btn.isMouseDown && mouse.isDown ){
          //Mouse is down on this button
          this.context.drawImage( btn.img, dx - logoSquare * .125, dy - logoSquare * .125, logoSquare * 1.25, logoSquare * 1.25 );

        } else {
          //Mouse is not down on this button
          btn.isMouseDown = false;
          this.context.drawImage( btn.img, dx, dy, logoSquare, logoSquare );
        }

        //Draw hover animation
        //If Yes

        //Update next button positions
        if( isWider ){
          dx = dx + logoSquare + shift;
        } else {
          dy = dy + logoSquare + shift;
        }

      });

      this.texture.needsUpdate = true;
    }//End update

    function CardButton(src, url){
      this.type = 'BusinessCardFaceButton';
      this.x = null;
      this.y = null;
      this.radius = null;
      this.isMouseDown = false;

      this.img = new Image();
      this.img.src = src;
      this.url = url;

      this.checkIntersection = ( x, y ) => {
        //Check if this button is being intersected by the mouse
        try {
          let dx = this.x + this.radius - x;
          let dy = this.y + this.radius - y;
          let distance = Math.sqrt( dx * dx + dy * dy );
          if ( distance < this.radius ) {
            return true;
          } else {
            return false;
          }
        } catch (e) {
          throw new Error("Variables x and/or y were not present in function invoke.");
        }
      };

      this.update = ( e ) => {
        this.isMouseHover = true;
        try {
          switch (e.type) {
            case 'mouseup':
              console.log("Clicked: ", this.url);
              //open url
              break;

            case 'mousedown':
              this.isMouseDown = true;
              break;

            default:
              // console.log("Unknown Event Type: ", e.type);
          }
        } catch (err) {
          console.log(err);
          throw new Error("Event object was not present.");
        }
      }//End interact
    }//End CardButton
  }//End BackFaceCanvas

  //Debug
  this.drawMouse = ( faceContext, x, y ) => {
    var mx = x;
    var my = faceContext.canvas.height - y;

    faceContext.beginPath();
    faceContext.arc(mx, my, 3, 0, 2 * Math.PI);
    faceContext.fillStyle = '#0000ff';
    faceContext.fill();
    faceContext.lineWidth = 1;
    faceContext.strokeStyle = '#ff0000';
    faceContext.stroke();
  }//End drawMouse
  //End Debug
}//End BusinessCard


scene.add( card.object );
camera.position.z = 10;


function init(){
  card.init();
}


function animate() {
	requestAnimationFrame( animate );

  card.update();

	renderer.render( scene, camera );
}

init();
animate();









//ANGULAR

var myApp = angular.module('myApp', []);


myApp.controller('mainController', ['$scope', function($scope){



}]);
