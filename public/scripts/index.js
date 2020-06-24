
const scene = new THREE.Scene();
const sCanvas = document.getElementById('sceneCanvas');
sCanvas.height = window.innerHeight;
sCanvas.width = window.innerWidth;

let maxRender = 5000;
const camera = new THREE.PerspectiveCamera(50, sCanvas.width / sCanvas.height, 1, maxRender);

const renderer = new THREE.WebGLRenderer({ canvas: sCanvas, antialias: true });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const controls = new THREE.OrbitControls(camera);
const raycaster = new THREE.Raycaster();

const light1 = new THREE.AmbientLight(0xaaaaaa, 1);
const light2 = new THREE.PointLight(0xaaaaaa, 1, maxRender, 1);
light2.castShadow = true;
light2.position.set(100, 500, 500);
light2.shadow.mapSize.width = 1024;
light2.shadow.mapSize.height = 1024;
light2.shadow.camera.far = 1000;

let cardWidth = 80,
    cardHeight = 40,
    cardThickness = .5;
const card = new BusinessCard(cardWidth, cardHeight, cardThickness);

let moonRadius = 300,
    moonSegment = 32;
const moon = new Moon(moonRadius, moonSegment, moonSegment, cardHeight);

const mouse = new Mouse();


init();
animate();


window.addEventListener('resize', onWindowResize);
window.addEventListener('mouseup', onMouseUp);
window.addEventListener('mousedown', onMouseDown);
window.addEventListener('mousemove', mouse.move);


function onWindowResize(){
    sCanvas.height = window.innerHeight;
    sCanvas.width = window.innerWidth;
    renderer.setSize(sCanvas.width, sCanvas.height);
    camera.aspect = sCanvas.width / sCanvas.height;
    camera.updateProjectionMatrix();
}


function onMouseUp(e){
    e.preventDefault();
    // mouse.mouseUp(e);
    document.body.style.cursor = 'grab';
    controls.enableRotate = true;
}


function onMouseDown(e){
    e.preventDefault();
    mouse.mouseDown(e);
    document.body.style.cursor = 'grabbing';
}


function Mouse(){
    this.vector = new THREE.Vector2(1, 1);

    this.firstIntersect = () => {
        raycaster.setFromCamera(this.vector, camera);
        //Returns an array of objects the mouse is intersecting, from the camera nearest to farthest
        let intersects = raycaster.intersectObjects(scene.children);

        return intersects.length > 0 ? intersects[0] : false;
    };


    this.move = (e) => {
        e.preventDefault();
        let canvasRect = sCanvas.getBoundingClientRect();
        let vector = new THREE.Vector2((e.clientX - canvasRect.left) / canvasRect.width, (e.clientY - canvasRect.top) / canvasRect.height);
        this.vector.set((vector.x * 2) - 1, - (vector.y * 2) + 1);

        let intersect = this.firstIntersect();

        switch (intersect.object) {
        case card.object:
            card.mouseOver(e, intersect);
            break;

        case moon.object:
            break;
        default:
            break;
        }
    };


    this.mouseDown = (e) => {
    //Check for button interactions
        let intersect = this.firstIntersect();

        switch (intersect.object) {
        case card.object:
            card.mouseDown(e, intersect);
            controls.enableRotate = false;
            break;

        case moon.object:
            break;
        default:
            break;
        }

    }; //End click
} //End Mouse


function init(){
    //Todo: create an init function that returns a promise for each scene object
    card.init()
        .then(function() {
            scene.add(light1);
            scene.add(light2);
            scene.add(card.object);
            scene.add(moon.object);

            const stars = createStars();
            stars.forEach((star) => { scene.add(star); });

            camera.position.z = 100;
            camera.updateProjectionMatrix();

            //Controls
            controls.maxDistance = maxRender - 500;
            controls.update();
        });
}


function animate() {
    requestAnimationFrame(animate);

    // if (mouse.firstIntersect().object == card.object){
    //   controls.enabled = false;
    // } else {
    //   controls.enabled = true;
    // }

    card.update();
    moon.object.rotation.x += .0005;
    moon.object.rotation.z += .0003;

    renderer.render(scene, camera);
}


function createStars() {
    let starCount = 2000;
    let stars = [];
    let minDist = 100;
    let maxDistance = maxRender - 50;

    for(let i=0; i<starCount; i++){
        let x = (Math.floor(Math.random() * (maxDistance - minDist)) + minDist) * (Math.random() < 0.5 ? -1 : 1);
        let y = (Math.floor(Math.random() * (maxDistance - minDist)) + minDist) * (Math.random() < 0.5 ? -1 : 1);
        let z = (Math.floor(Math.random() * (maxDistance - minDist)) + minDist) * (Math.random() < 0.5 ? -1 : 1);
        let star = new THREE.Mesh(new THREE.SphereBufferGeometry(5, 16, 8), new THREE.MeshBasicMaterial({ color: 0xaaaadd }));

        star.position.set(x, y, z);
        stars.push(star);
    }

    return stars;
}
