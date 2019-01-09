
function BusinessCard(width, height, thickness){
  var clickX = 0;   //Used for rotating the card

  this.type = 'BusinessCard';
  this.geometry = new THREE.BoxGeometry(width, height, thickness);
  this.geometry.computeFaceNormals();
  this.frontFace = new FrontFace();
  this.backFace = new BackFace();
  this.materialArray = [
    new THREE.MeshPhongMaterial({ color: 0xaaaaaa }),   //Left
    new THREE.MeshPhongMaterial({ color: 0xaaaaaa }),   //Right
    new THREE.MeshPhongMaterial({ color: 0xaaaaaa }),   //Top
    new THREE.MeshPhongMaterial({ color: 0xaaaaaa }),   //Bottom
    new THREE.MeshPhongMaterial({ map: this.frontFace.texture }),     //Front
    new THREE.MeshPhongMaterial({ map: this.backFace.texture })     //Back
  ];
  this.object = new THREE.Mesh(this.geometry, this.materialArray);
  this.object.castShadow = true;


  this.init = () => {

    //Load Fonts
    var fPromise1 = document.fonts.load('12px Righteous');
    var fPromise2 = document.fonts.load('12px Roboto');

    //Once loads are done, draw the card faces
    Promise.all([fPromise1, fPromise2]).then(() => {
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


  this.mouseDown = (e, intersect) => {
    var x = intersect.uv.x * this.backFace.canvas.getWidth();
    var y = intersect.uv.y * this.backFace.canvas.getHeight();
    var objFace = intersect.faceIndex;

    // clickStrength = intersect.uv.x > .5 ? intersect.uv.x - .5 : -intersect.uv.x;
    clickX = e.clientX;

    if([8, 9].indexOf(objFace) != -1){
      //Front Face
      // this.frontFace.update();
      // this.drawMouse(this.frontFace.context, x, y);  //Used for debug
      let cardRotate = this.rotate;
      window.addEventListener('mousemove', cardRotate);
      window.addEventListener('mouseup', function(){window.removeEventListener('mousemove', cardRotate); });
      return;

    } else if([10, 11].indexOf(objFace) != -1){
      //Back Face
      //Check for button intersects
      this.backFace.buttons.forEach((btn) => {
        if(btn.checkIntersection(x, y)){
          btn.onClick();
        } else {
          btn.isMouseHovering = false;  //Reset value
        }
      });

      this.backFace.update();
      // this.drawMouse(this.backFace.context, x, y);  //Used for debug

      let cardRotate = this.rotate;
      window.addEventListener('mousemove', cardRotate);
      window.addEventListener('mouseup', function(){window.removeEventListener('mousemove', cardRotate); });
      return;

    } else {
      //Side Face
    }
  };//End interact


  this.mouseOver = (e, intersect) => {
    var x = intersect.uv.x * this.backFace.canvas.getWidth();
    var y = intersect.uv.y * this.backFace.canvas.getHeight();
    var objFace = intersect.faceIndex;
    if([8, 9].indexOf(objFace) != -1){
      //Front Face
      // this.frontFace.update();
      // this.drawMouse(this.frontFace, x, y);  //Used for debug
      return;

    } else if([10, 11].indexOf(objFace) != -1){
      //Back Face

      //Check for button intersects
      this.backFace.buttons.forEach((btn) => {
        if(btn.checkIntersection(x, y)){
          btn.isMouseHovering = true;
        } else {
          btn.isMouseHovering = false;  //Reset value
        }
      });
      this.backFace.update();
      // this.drawMouse(this.backFace, x, y);  //Used for debug
    } else {
      //Side Face
    }
  };//End interact

  this.rotate = (moveEvent) => {
    var dx = moveEvent.clientX - clickX;
    clickX = moveEvent.clientX;

    this.object.rotation.y += Math.PI * (dx / (window.innerWidth * .5));
  }//End rotate


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

    CardFace.call(this);

    this.font = null;
    this.pattern = null;
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    this.init = () => {
      var textureImg = new ImagePromise(texturePath);
      textureImg.then((img) => {
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
      while(this.context.measureText(cardText).width > this.canvas.getWidth() * .6){
        fontSize -= 5;
        this.context.font = `${fontSize}px ${fontName}`;
      }

      this.context.textAlign = 'center';
      // this.context.textBaseline = 'middle';
      this.context.fillStyle = "black";
      this.context.globalAlpha = 0.80;
      this.context.fillText(cardText, this.canvas.getWidth() / 2, this.canvas.getHeight() / 2);

      //Subtext
      var subText = 'Software Developer';
      var subFontName = 'Roboto'
      var subFontSize = fontSize * .5;

      this.context.font = `${subFontSize}px ${subFontName}`;
      while(this.context.measureText(subText).width > this.canvas.getWidth() * .8){
        subFontSize -= 5;
        this.context.font = `${subFontSize}px ${subFontName}`;
      }
      this.context.fillText(subText, this.canvas.getWidth() / 2, (this.canvas.getHeight() / 2 + fontSize));

      this.context.globalAlpha = 1;
      this.texture.needsUpdate = true;
    }//End Update
  }//End FrontFaceCanvas


  function BackFace(){
    var texturePath = '../assets/papertexture.jpg';

    CardFace.call(this);

    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    this.buttons = [
      new CardButton('GitHub', '../assets/github.svg', 'https://github.com/HenryHall'),
      new CardButton('LinkedIn', '../assets/linkedin.png', 'https://www.linkedin.com/in/henry-hall-ba2168122/'),
      new CardButton('CodePen', '../assets/codepen.png', 'https://codepen.io/HenryPrime/')
    ];

    this.init = () => {
      //Prepare canvas images
      var promises = [];
      var textureImg = new ImagePromise(texturePath);
      textureImg.then((img) => {
        this.pattern = this.context.createPattern(img, 'repeat'); // Create a pattern with this image, and set it to "repeat".
      });

      promises.push(textureImg);
      this.buttons.forEach((btn) => {
        let p = new ImagePromise(btn.src);
        btn.img = p.then((img) => {btn.img = img});
        promises.push(p);
      });

      Promise.all(promises).then((values) => {
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
      if(isWider){
        logoSquare = this.canvas.getWidth() / (this.buttons.length + 1);
        shift = logoSquare * (1 / (this.buttons.length + 1));
        dx = shift;
        dy = (this.canvas.getHeight() / 2) - (logoSquare / 2);
      } else {
        logoSquare = this.canvas.getHeight() * (1 / (this.buttons.length + 1));
        shift = logoSquare * (1 / (this.buttons.length + 1));
        dx = (this.canvas.getWidth() / 2) -  (logoSquare / 2);
        dy = shift;
      }

      //Update each button
      this.buttons.forEach((btn) => {
        btn.x = dx;
        btn.y = dy;
        btn.radius = logoSquare / 2;

        let radiusDiff = btn.radius * .05;  //Used for click and hover animation calculations

        //Draw hover animation
        if(btn.isMouseHovering){
          // console.log(`Drawing hover animation for ${btn.name}`);   //Debug

          //Dashed outline
          let drawDash = true;
          let stepRadians = Math.PI * 2 / 50;   //50 Dashes per button
          for(let i = 0; i <= Math.PI * 2; i += stepRadians){
            if(drawDash){
              this.context.globalAlpha = 0.80;
              this.context.lineWidth = 15;
              this.context.strokeStyle = 'grey';
              this.context.beginPath();
              this.context.arc(btn.x + btn.radius, btn.y + btn.radius, btn.radius + radiusDiff, i, i + stepRadians);
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
        if(btn.isMouseDown){
          //Mouse is down on this button
          this.context.globalAlpha = .8;
          this.context.drawImage(btn.img, dx - radiusDiff/2, dy - radiusDiff/2, logoSquare + radiusDiff, logoSquare + radiusDiff);
        } else {
          //The mouse is no longer down on this button
          btn.isMouseDown = false;  //Reset value
          this.context.globalAlpha = .8;
          this.context.drawImage(btn.img, dx, dy, logoSquare, logoSquare);
        }
        this.context.globalAlpha = 1;


        //Update next button positions
        if(isWider){
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

      this.checkIntersection = (x, y) => {
        //Check if this button is being intersected by the mouse
        try {
          let dx = this.x + this.radius - x;
          let dy = this.y + this.radius - y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < this.radius) {
            return true;
          } else {
            return false;
          }
        } catch (e) {
          throw new Error("Variables x and/or y were not present in function invoke.");
        }
      };

      this.onClick = () => {
        this.isMouseDown = true;

        var btnMouseUp = function(btn){
          window.removeEventListener('mouseup', btnMouseUp);

          //open url
          window.open(btn.url);

          btn.isMouseDown = false;
        }
        var button = this;
        window.addEventListener('mouseup', function(){ btnMouseUp(button); });

      }//End interact
    }//End CardButton
  }//End BackFaceCanvas


  function ImagePromise(path){
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image: ', path));
      img.src = path;
    });
  }


  //Debug
  this.drawMouse = (face, x, y) => {
    var faceContext = face.context;
    var mx = x;
    var my = faceContext.canvas.getHeight() - y;

    face.update();

    faceContext.beginPath();
    faceContext.arc(mx, my, 3, 0, 2 * Math.PI);
    faceContext.fillStyle = '#0000ff';
    faceContext.fill();
    faceContext.lineWidth = 1;
    faceContext.strokeStyle = '#ff0000';
    faceContext.stroke();

    face.texture.needsUpdate = true;
  }//End drawMouse
  //End Debug
}//End BusinessCard
