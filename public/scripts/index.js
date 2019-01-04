
var scene = new THREE.Scene();
var sCanvas = document.getElementById("myCanvas");
sCanvas.height = window.innerHeight;
sCanvas.width = window.innerWidth;

var camera = new THREE.PerspectiveCamera( 50, sCanvas.width / sCanvas.height, 1, 1000 );

var renderer = new THREE.WebGLRenderer({ canvas: sCanvas, antialias: true });
var controls = new THREE.OrbitControls( camera );
var raycaster = new THREE.Raycaster();

var mouse = new Mouse();
var card = new BusinessCard();

// //Placeholder
// var moonTexture = new THREE.TextureLoader().load( "../assets/moonbackground.png" );
// moonTexture.wrapS = THREE.RepeatWrapping;
// moonTexture.wrapT = THREE.RepeatWrapping;
// moonTexture.repeat.set( 4, 4 );
// var moonMaterial = new THREE.MeshBasicMaterial( { map: moonTexture } );
// var moonMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 200, 200 ), moonMaterial );
// moonMesh.position.y = -5;
// moonMesh.rotation.x = - Math.PI / 2;
// moonMesh.receiveShadow = true;
// scene.add( moonMesh );

//Placeholder 2
var moonGeometry = new THREE.BoxBufferGeometry( 300, 300, 300 );
var moonTexture = new THREE.TextureLoader().load( "../assets/moonbackground.png" );
// moonTexture.wrapS = THREE.RepeatWrapping;
// moonTexture.wrapT = THREE.RepeatWrapping;
// moonTexture.repeat.set( 5, 5 );
var moonMaterial = new THREE.MeshBasicMaterial( { map: moonTexture, side: THREE.DoubleSide } );
var moonSphere = new THREE.Mesh( moonGeometry, moonMaterial );
moonSphere.position.y = -225;
moonSphere.rotation.z += Math.PI / 2;
scene.add( moonSphere );

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

    //If the card is intersecting, interact and set cursor style
    if( intersect && intersect.object === card.object ){
      card.interact( intersect, e );
      if( this.isDown ){
        document.body.style.cursor = 'grabbing';
      } else {
        document.body.style.cursor = 'grab';
      }
    } else {
      //Return cursor to normal
      document.body.style.cursor = 'auto';
    }
  }
}


function BusinessCard(){
  this.type = 'BusinessCard';
  this.geometry = new THREE.BoxGeometry( 80, 40, .075 );
  this.geometry.computeFaceNormals();
  this.frontFace = new FrontFace();
  this.backFace = new BackFace();
  this.materialArray = [
    new THREE.MeshBasicMaterial({ color: 0xaaaaaa }),   //Left
    new THREE.MeshBasicMaterial({ color: 0xaaaaaa }),   //Right
    new THREE.MeshBasicMaterial({ color: 0xaaaaaa }),   //Top
    new THREE.MeshBasicMaterial({ color: 0xaaaaaa }),   //Bottom
    new THREE.MeshBasicMaterial({ map: this.frontFace.texture }),     //Front
    new THREE.MeshBasicMaterial({ map: this.backFace.texture })     //Back
  ];
  this.mesh = new THREE.MeshFaceMaterial( this.materialArray );
  this.object = new THREE.Mesh( this.geometry, this.mesh );


  this.init = () => {

    //Load Fonts
    var fPromise1 = document.fonts.load('12px Righteous');
    var fPromise2 = document.fonts.load('12px Roboto');

    //Once loads are done, draw the card faces
    Promise.all( [fPromise1, fPromise2] ).then( () => {
      this.frontFace.init();
      this.backFace.init();
    },
    (e) => {
      throw new Error("Not all fonts were loaded.");
    });

    // this.object.rotation.y -= Math.PI;  //Debug
  }


  this.update = () => {
    // this.object.rotation.y -= .005;  //Debug
  };//End update


  this.interact = ( intersect, e ) => {
    var x = intersect.uv.x * this.backFace.canvas.getWidth();
    var y = intersect.uv.y * this.backFace.canvas.getHeight();
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
        } else {
          btn.isMouseHovering = false;  //Reset value
        }
      });
      this.backFace.update();
      this.drawMouse(this.backFace.context, x, y );  //Used for debug
    } else {
      //Side Face
    }
  };//End interact


  //CardFace Prototype
  function CardFace(){
    this.type = 'BusinessCardFace';
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');

    //For Retina displays
    var dpi  = window.devicePixelRatio || 1;
    this.canvas.style.height = 1024 + 'px';
    this.canvas.style.width = 2048 + 'px';
    this.canvas.height = 1024 * dpi;
    this.canvas.width = 2048 * dpi;
    this.context.scale(dpi, dpi);

    this.canvas.getHeight = () => { return this.canvas.style.height.slice(0, -2); }
    this.canvas.getWidth = () => { return this.canvas.style.width.slice(0, -2); }
  }


  function FrontFace(){
    var texturePath = '../assets/papertexture.jpg';

    CardFace.call( this);

    this.font = null;
    this.pattern = null;
    this.texture = new THREE.CanvasTexture( this.canvas );
    this.texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    this.init = () => {
      var textureImg = new ImagePromise(texturePath);
      textureImg.then( (img) => {
        this.pattern = this.context.createPattern(img, 'repeat'); // Create a pattern with this image, and set it to "repeat".
        this.update();
      });
    }


    this.update = () => {
      this.context.clearRect(0, 0, this.canvas.getWidth(), this.canvas.getHeight());

      //Card Texture
      this.context.fillStyle = this.pattern;
      this.context.fillRect(0, 0, this.canvas.getWidth(), this.canvas.getHeight());

      //Card Text
      var cardText = "HENRY HALL";
      var fontName = 'Righteous';
      var fontSize = this.canvas.height / 3;

      //To fit, fontSize calculations
      this.context.font = `${fontSize}px ${fontName}`;
      while( this.context.measureText(cardText).width > this.canvas.getWidth() * .6 ){
        fontSize -= 5;
        this.context.font = `${fontSize}px ${fontName}`;
      }

      this.context.textAlign = 'center';
      // this.context.textBaseline = 'middle';
      this.context.fillStyle = "black";
      this.context.globalAlpha = 0.80;
      this.context.fillText(cardText, this.canvas.getWidth() / 2, this.canvas.getHeight() / 2 );

      //Subtext
      var subText = 'Software Developer';
      var subFontName = 'Roboto'
      var subFontSize = fontSize * .5;

      this.context.font = `${subFontSize}px ${subFontName}`;
      while( this.context.measureText(subText).width > this.canvas.getWidth() * .8 ){
        subFontSize -= 5;
        this.context.font = `${subFontSize}px ${subFontName}`;
      }
      this.context.fillText(subText, this.canvas.getWidth() / 2, ( this.canvas.getHeight() / 2 + fontSize ) );

      this.context.globalAlpha = 1;
      this.texture.needsUpdate = true;
    }//End Update
  }//End FrontFaceCanvas


  function BackFace(){
    var texturePath = '../assets/papertexture.jpg';
    // var texturePath = '../assets/moonbackground.png';

    CardFace.call( this);

    this.texture = new THREE.CanvasTexture( this.canvas );
    this.texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    this.buttons = [
      new CardButton( 'GitHub', '../assets/github.svg', 'https://github.com/HenryHall' ),
      new CardButton( 'LinkedIn', '../assets/linkedin.png', 'https://www.linkedin.com/in/henry-hall-ba2168122/' ),
      new CardButton( 'CodePen', '../assets/codepen.png', 'https://codepen.io/HenryPrime/' )
    ];

    this.init = () => {
      //Prepare canvas images
      var promises = [];
      var textureImg = new ImagePromise(texturePath);
      textureImg.then( (img) => {
        this.pattern = this.context.createPattern(img, 'repeat'); // Create a pattern with this image, and set it to "repeat".
      });

      promises.push( textureImg );
      this.buttons.forEach( (btn) => {
        let p = new ImagePromise( btn.src );
        btn.img = p.then( (img) => {btn.img = img} );
        promises.push( p );
      });

      Promise.all( promises ).then( (values) => {
        this.update();
      });
    }//End init

    this.update = () => {
      this.context.clearRect(0, 0, this.canvas.getWidth(), this.canvas.getHeight());

      //Texture
      this.context.fillStyle = this.pattern;
      this.context.fillRect(0, 0, this.canvas.getWidth(), this.canvas.getHeight());


      //Text
      // this.context.font = '50px serif';
      // this.context.textAlign = 'center';
      // this.context.fillStyle = "black";
      // this.context.fillText("Back Side", this.canvas.width / 2, this.canvas.height / 2);

      //Button Layout Calculations
      var logoSquare, shift, dx, dy;
      var isWider = this.canvas.getWidth() > this.canvas.getHeight() ? true : false;
      if( isWider ){
        logoSquare = this.canvas.getWidth() / ( this.buttons.length + 1 );
        shift = logoSquare * ( 1 / ( this.buttons.length + 1 ) );
        dx = shift;
        dy = (this.canvas.getHeight() / 2) - (logoSquare / 2);
      } else {
        logoSquare = this.canvas.getHeight() * ( 1 / ( this.buttons.length + 1 ) );
        shift = logoSquare * ( 1 / ( this.buttons.length + 1 ) );
        dx = (this.canvas.getWidth() / 2) -  (logoSquare / 2);
        dy = shift;
      }

      //Update each button
      this.buttons.forEach( (btn) => {
        btn.x = dx;
        btn.y = dy;
        btn.radius = logoSquare / 2;

        let radiusDiff = btn.radius * .05;  //Used for click and hover animation calculations

        //Draw hover animation
        if( btn.isMouseHovering ){
          // console.log(`Drawing hover animation for ${btn.name}`);   //Debug

          //Dashed outline
          let drawDash = true;
          let stepRadians = Math.PI * 2 / 50;   //50 Dashes per button
          for( let i = 0; i <= Math.PI * 2; i += stepRadians ){
            if( drawDash ){
              this.context.globalAlpha = 0.80;
              this.context.lineWidth = 15;
              this.context.strokeStyle = 'grey';
              this.context.beginPath();
              this.context.arc( btn.x + btn.radius, btn.y + btn.radius, btn.radius + radiusDiff, i, i + stepRadians );
              this.context.stroke();
              this.context.globalAlpha = 1;
            }

            drawDash = !drawDash;
          }

        } else {
          //The mouse is no longer hovering this button
          btn.isMouseHovering = false;  //Reset value

        }


        //Draw animation based on clicking status
        if( btn.isMouseDown && mouse.isDown ){
          //Mouse is down on this button
          this.context.globalAlpha = .8;
          this.context.drawImage( btn.img, dx - radiusDiff/2, dy - radiusDiff/2, logoSquare + radiusDiff, logoSquare + radiusDiff );
        } else {
          //The mouse is no longer down on this button
          btn.isMouseDown = false;  //Reset value
          this.context.globalAlpha = .8;
          this.context.drawImage( btn.img, dx, dy, logoSquare, logoSquare );
        }
        this.context.globalAlpha = 1;


        //Update next button positions
        if( isWider ){
          dx = dx + logoSquare + shift;
        } else {
          dy = dy + logoSquare + shift;
        }

      });

      this.texture.needsUpdate = true;
    }//End update


    function CardButton(name, src, url){
      this.name = name;
      this.type = 'BusinessCardFaceButton';
      this.x = null;
      this.y = null;
      this.radius = null;
      this.isMouseDown = false;

      this.src = src;
      this.url = url;
      this.img = null;

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

      this.update = ( event ) => {
        //The mouse is over this button

        this.isMouseHovering = true;
        // console.log(`${this.name} is being hovered`);   //Debug
        try {
          switch (event.type) {
            case 'mouseup':
              break;

            case 'mousedown':
              this.isMouseDown = true;
              console.log("Clicked: ", this.url);
              //open url
              window.open(this.url);
              break;

            default:
              // console.log("Unknown Event Type: ", e.type);
          }
        } catch (err) {
          console.log(err);
          throw new Error( "Event object was not present." );
        }
      }//End interact
    }//End CardButton
  }//End BackFaceCanvas


  function ImagePromise( path ){
    return new Promise( ( resolve, reject ) => {
      let img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject( new Error( 'Failed to load image: ', path ) );
      img.src = path;
    });
  }


  //Debug
  this.drawMouse = ( faceContext, x, y ) => {
    var mx = x;
    var my = faceContext.canvas.getHeight() - y;

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
  camera.position.z = 150;
  camera.updateProjectionMatrix();
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

// var myApp = angular.module('myApp', []);
//
//
// myApp.controller('mainController', ['$scope', function($scope){
//
//
//
// }]);
