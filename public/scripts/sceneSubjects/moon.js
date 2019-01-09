
function Moon(radius, wSegment, hSegment, offset){
  this.type = 'Moon';
  this.geometry = new THREE.SphereBufferGeometry(radius, wSegment, hSegment);
  this.texture = new THREE.TextureLoader().load("../assets/moontexture.jpg");
  this.material = new THREE.MeshPhongMaterial({ map: this.texture });
  this.object = new THREE.Mesh(this.geometry, this.material);
  this.object.receiveShadow = true;

  this.object.position.y = -(radius + offset);
  this.object.rotation.z = Math.PI / 2;
}
