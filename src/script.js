import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Timer } from 'three/examples/jsm/Addons.js';
import GUI from 'lil-gui';
import * as THREE from 'three';
import { normalMap } from 'three/examples/jsm/nodes/Nodes.js';

const scene = new THREE.Scene();
const canvas = document.querySelector('canvas.webgl');
const gui = new GUI().title('Haunted House');
const floorGUI = gui.addFolder('Floor').close();

//======================= Textures ===================
const textureLoader = new THREE.TextureLoader();

const floorAlphaTexture = textureLoader.load('./floor/alpha.jpg');
const floorColorTexture = textureLoader.load(
  './floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.jpg'
);
const floorARMTexture = textureLoader.load(
  './floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.jpg'
); // Ambient-occlusion| Roughness| Metalness
const floorNormalTexture = textureLoader.load(
  './floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.jpg'
);
const floorDisplacementTexture = textureLoader.load(
  './floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.jpg'
);

floorColorTexture.colorSpace = THREE.SRGBColorSpace;

// Texture is too big - reduce it, then repeat it
floorColorTexture.repeat.set(8, 8);
floorARMTexture.repeat.set(8, 8);
floorNormalTexture.repeat.set(8, 8);
floorDisplacementTexture.repeat.set(8, 8);

floorColorTexture.wrapS = THREE.RepeatWrapping;
floorARMTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorDisplacementTexture.wrapS = THREE.RepeatWrapping;

floorColorTexture.wrapT = THREE.RepeatWrapping;
floorARMTexture.wrapT = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;
floorDisplacementTexture.wrapT = THREE.RepeatWrapping;

//======================= House ======================
//=== Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(25, 25, 100, 100),
  new THREE.MeshStandardMaterial({
    alphaMap: floorAlphaTexture,
    transparent: true,
    
    map: floorColorTexture,
    aoMap: floorARMTexture, // Get "red" value in the shaders - R
    roughnessMap: floorARMTexture, // Get "green" - G
    metalnessMap: floorARMTexture, // Get "blue" - B
    normalMap: floorNormalTexture,

    // Since displacementMap will move the actual vertices we need to add more vertices (..., ..., 100, 100)
    displacementMap: floorDisplacementTexture,
    displacementScale: 0.3,

    // Still plane looks too high| offset whole displacement down
    displacementBias: -0.15,
  })
);
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

floorGUI
  .add(floor.material, 'displacementScale')
  .min(0)
  .max(1)
  .step(0.001)
  .name('Floor displacementScale');
floorGUI
  .add(floor.material, 'displacementBias')
  .min(-1)
  .max(1)
  .step(0.001)
  .name('Floor displacementBias');

//=== House Container
const houseGroup = new THREE.Group();
scene.add(houseGroup);

//================= Walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial()
);
walls.position.y += 2.5 / 2;
houseGroup.add(walls);

//================= Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1.5, 4),
  new THREE.MeshStandardMaterial()
);
roof.position.y = 2.5 + 0.75;
roof.rotation.y = Math.PI * 0.25;
houseGroup.add(roof);

//================= Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2),
  new THREE.MeshStandardMaterial()
);
door.position.z = 2 + 0.01;
door.position.y = 1;
houseGroup.add(door);

//================ Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial();

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.position.set(1.45, 0.2, 2.2);
bush1.scale.set(0.5, 0.5, 0.5);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.position.set(2.05, 0.1, 2.1);
bush2.scale.set(0.35, 0.35, 0.35);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.position.set(-1.2, 0.1, 2.2);
bush3.scale.set(0.4, 0.4, 0.4);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.position.set(-1, 0.05, 2.6);
bush4.scale.set(0.25, 0.25, 0.25);

const bush5 = new THREE.Mesh(bushGeometry, bushMaterial);
bush5.position.set(1.9, 0.05, 2.55);
bush5.scale.set(0.25, 0.25, 0.25);

const bush6 = new THREE.Mesh(bushGeometry, bushMaterial);
bush6.position.set(2.2, 0.2, -1);
bush6.scale.set(0.35, 0.35, 0.35);

houseGroup.add(bush1, bush2, bush3, bush4, bush5, bush6);

//================= Graves
const gravesGroup = new THREE.Group();
scene.add(gravesGroup);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const gravesMaterial = new THREE.MeshStandardMaterial();

for (let i = 0; i < 30; i++) {
  // spread all graves in a full circle
  const angle = Math.random() * (Math.PI * 2);

  // start from 3.2 meter to 4.5m randomly
  const radius = 3.2 + Math.random() * 4.5;

  // create a random angle on a "circle"
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  // Mesh
  const grave = new THREE.Mesh(graveGeometry, gravesMaterial);
  grave.position.set(x, Math.random() * 0.4, z);

  // graves should stand forward and backwards (-0.5), then * 0.5: lower the effect of the way they are standing
  grave.rotation.x = (Math.random() - 0.5) * 0.5;
  grave.rotation.y = (Math.random() - 0.5) * 0.5;
  grave.rotation.z = (Math.random() - 0.5) * 0.5;

  gravesGroup.add(grave);
}

//======================= Lights ========================
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5);
scene.add(ambientLight);

const moonLight = new THREE.DirectionalLight('#ffffff', 2.5);
moonLight.position.set(3, 2, -8);
scene.add(moonLight);

//====================== Camera ==========================
let width = window.innerWidth;
let height = window.innerHeight;

const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

//=================== Orbit Controls =====================
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

//===================== Renderer =========================
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});

renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//==================== Resize Listener ===================
window.addEventListener('resize', () => {
  width = window.innerWidth;
  height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

//==================== Animate ==========================
const timer = new Timer();

const tick = () => {
  timer.update();
  const elapsedTime = timer.getElapsed();

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
