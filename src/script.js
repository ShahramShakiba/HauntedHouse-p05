import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Timer } from 'three/examples/jsm/Addons.js';
import GUI from 'lil-gui';
import * as THREE from 'three';
import { Sky } from 'three/examples/jsm/Addons.js';

const canvas = document.querySelector('canvas.webgl');
const scene = new THREE.Scene();
// const gui = new GUI().title('Haunted House');
// const floorGUI = gui.addFolder('Floor').close();

//======================= Textures ===================
const textureLoader = new THREE.TextureLoader();

//============= Floor-Texture
const floorAlphaTexture = textureLoader.load('./floor/alpha.webp');
const floorColorTexture = textureLoader.load(
  './floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.webp'
);
const floorARMTexture = textureLoader.load(
  './floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.webp'
); // Ambient-occlusion| Roughness| Metalness
const floorNormalTexture = textureLoader.load(
  './floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.webp'
);
const floorDisplacementTexture = textureLoader.load(
  './floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.webp'
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

//============= Wall-Texture
const wallColorTexture = textureLoader.load(
  './wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.webp'
);
const wallARMTexture = textureLoader.load(
  './wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.webp'
);
const wallNormalTexture = textureLoader.load(
  './wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.webp'
);

wallColorTexture.colorSpace = THREE.SRGBColorSpace;

//============= Roof-Texture
const roofColorTexture = textureLoader.load(
  './roof/roof_slates_02_1k/roof_slates_02_diff_1k.webp'
);
const roofARMTexture = textureLoader.load(
  './roof/roof_slates_02_1k/roof_slates_02_arm_1k.webp'
);
const roofNormalTexture = textureLoader.load(
  './roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.webp'
);

roofColorTexture.colorSpace = THREE.SRGBColorSpace;

roofColorTexture.repeat.set(3, 1);
roofARMTexture.repeat.set(3, 1);
roofNormalTexture.repeat.set(3, 1);

roofColorTexture.wrapS = THREE.RepeatWrapping;
roofARMTexture.wrapS = THREE.RepeatWrapping;
roofNormalTexture.wrapS = THREE.RepeatWrapping;

//============= Bush-Texture
const bushColorTexture = textureLoader.load(
  './bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.webp'
);
const bushARMTexture = textureLoader.load(
  './bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.webp'
);
const bushNormalTexture = textureLoader.load(
  './bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.webp'
);

bushColorTexture.colorSpace = THREE.SRGBColorSpace;

bushColorTexture.repeat.set(2, 1);
bushARMTexture.repeat.set(2, 1);
bushNormalTexture.repeat.set(2, 1);

bushColorTexture.wrapS = THREE.RepeatWrapping;
bushARMTexture.wrapS = THREE.RepeatWrapping;
bushNormalTexture.wrapS = THREE.RepeatWrapping;

//============= Grave-Texture
const graveColorTexture = textureLoader.load(
  './grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.webp'
);
const graveARMTexture = textureLoader.load(
  './grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.webp'
);
const graveNormalTexture = textureLoader.load(
  './grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.webp'
);

graveColorTexture.colorSpace = THREE.SRGBColorSpace;

graveColorTexture.repeat.set(0.3, 0.4);
graveARMTexture.repeat.set(0.3, 0.4);
graveNormalTexture.repeat.set(0.3, 0.4);

//============= Door-Texture
const doorColorTexture = textureLoader.load('./door/color.webp');
const doorAlphaTexture = textureLoader.load('./door/alpha.webp');
const doorAmbientOcclusionTexture = textureLoader.load(
  './door/ambientOcclusion.webp'
);
const doorHeightTexture = textureLoader.load('./door/height.webp');
const doorNormalTexture = textureLoader.load('./door/normal.webp');
const doorMetalnessTexture = textureLoader.load('./door/metalness.webp');
const doorRoughnessTexture = textureLoader.load('./door/roughness.webp');

doorColorTexture.colorSpace = THREE.SRGBColorSpace;

//======================= House ======================
//================ Floor
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

// floorGUI
//   .add(floor.material, 'displacementScale')
//   .min(0)
//   .max(1)
//   .step(0.001)
//   .name('Floor displacementScale');
// floorGUI
//   .add(floor.material, 'displacementBias')
//   .min(-1)
//   .max(1)
//   .step(0.001)
//   .name('Floor displacementBias');

//====================== Walls
// House Container
const houseGroup = new THREE.Group();
scene.add(houseGroup);

const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    aoMap: wallARMTexture,
    roughnessMap: wallARMTexture,
    metalnessMap: wallARMTexture,
    normalMap: wallNormalTexture,
  })
);
walls.position.y += 2.5 / 2;
houseGroup.add(walls);

//====================== Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1.5, 4),
  new THREE.MeshStandardMaterial({
    map: roofColorTexture,
    aoMap: roofARMTexture,
    roughnessMap: roofARMTexture,
    metalnessMap: roofARMTexture,
    normalMap: roofNormalTexture,
  })
);
roof.position.y = 2.5 + 0.75;
roof.rotation.y = Math.PI * 0.25;
houseGroup.add(roof);

//===================== Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    alphaMap: doorAlphaTexture,
    transparent: true,
    aoMap: doorAmbientOcclusionTexture,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.15,
    displacementBias: -0.04,
  })
);
door.position.z = 2 + 0.01;
door.position.y = 1;
houseGroup.add(door);

//==================== Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
  color: '#ccffcc',
  map: bushColorTexture,
  aoMap: bushARMTexture,
  roughnessMap: bushARMTexture,
  metalnessMap: bushARMTexture,
  normalMap: bushNormalTexture,
});

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.position.set(1.45, 0.2, 2.2);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.rotation.x = -0.75; // to hide the stretching in the center

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.position.set(2.05, 0.05, 2.1);
bush2.scale.set(0.35, 0.35, 0.35);
bush2.rotation.x = -0.75;

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.position.set(-1.2, 0.1, 2.2);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.rotation.x = -0.75;

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.position.set(-1, 0.05, 2.6);
bush4.scale.set(0.25, 0.25, 0.25);
bush4.rotation.x = -0.75;

const bush5 = new THREE.Mesh(bushGeometry, bushMaterial);
bush5.position.set(1.9, 0.05, 2.55);
bush5.scale.set(0.25, 0.25, 0.25);
bush5.rotation.x = -0.75;

const bush6 = new THREE.Mesh(bushGeometry, bushMaterial);
bush6.position.set(2.2, 0.2, -1);
bush6.scale.set(0.35, 0.35, 0.35);
bush6.rotation.x = -0.75;

houseGroup.add(bush1, bush2, bush3, bush4, bush5, bush6);

//=================== Graves
const gravesGroup = new THREE.Group();
scene.add(gravesGroup);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const gravesMaterial = new THREE.MeshStandardMaterial({
  map: graveColorTexture,
  aoMap: graveARMTexture,
  roughnessMap: graveARMTexture,
  metalnessMap: graveARMTexture,
  normalMap: graveNormalTexture,
});

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

//======================= Lights =========================
const ambientLight = new THREE.AmbientLight('#86cdff', 0.275);
scene.add(ambientLight);

const moonLight = new THREE.DirectionalLight('#86cdff', 1);
moonLight.position.set(3, 2, -8);
scene.add(moonLight);

const doorLight = new THREE.PointLight('#ff7d46', 5);
doorLight.position.set(0, 2.2, 2.5);
houseGroup.add(doorLight);

const flickerLight = () => {
  const minIntensity = 0.1;
  const maxIntensity = 5;
  const flickerSpeed = 300;

  // Randomly change the light's intensity
  doorLight.intensity =
    minIntensity + Math.random() * (maxIntensity - minIntensity);

  // Call this function again after a short delay
  setTimeout(flickerLight, flickerSpeed);
};
flickerLight();

//======================= Ghosts =========================
const ghost1 = new THREE.PointLight('#8800ff', 6);
const ghost2 = new THREE.PointLight('#ff0088', 6);
const ghost3 = new THREE.PointLight('#ff0000', 6);

scene.add(ghost1, ghost2, ghost3);

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

//======================= Shadows =========================
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

moonLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

floor.receiveShadow = true;
walls.receiveShadow = true;
walls.castShadow = true;
roof.castShadow = true;

for (const grave of gravesGroup.children) {
  grave.castShadow = true;
  grave.receiveShadow = true;
}

// Mapping
moonLight.shadow.mapSize.width = 256;
moonLight.shadow.mapSize.height = 256;
moonLight.shadow.camera.top = 8;
moonLight.shadow.camera.right = 8;
moonLight.shadow.camera.bottom = -8;
moonLight.shadow.camera.left = -8;
moonLight.shadow.camera.near = 1;
moonLight.shadow.camera.far = 20;

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 10;

ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 10;

ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 10;

//======================= Sky =========================
const sky = new Sky();
sky.scale.set(100, 100, 100);
scene.add(sky);

sky.material.uniforms['turbidity'].value = 10;
sky.material.uniforms['rayleigh'].value = 3;
sky.material.uniforms['mieCoefficient'].value = 0.1;
sky.material.uniforms['mieDirectionalG'].value = 0.95;
sky.material.uniforms['sunPosition'].value.set(0.3, -0.038, -0.95);

//======================= Fog =========================
scene.fog = new THREE.FogExp2('#02343f', 0.11);

//======================= Sound =========================
// Listen the audio in the scene
const audioListener = new THREE.AudioListener();
camera.add(audioListener);

const sound = new THREE.Audio(audioListener);

const audioLoader = new THREE.AudioLoader();
audioLoader.load('./sound/spooky.mp3', (buffer) => {
  sound.setBuffer(buffer);
  sound.setLoop(true);
  sound.setVolume(0.5);

  // Attach sound playback to a user interaction
  const playSound = () => {
    if (!sound.isPlaying) {
      sound.play();
    }
  };

  document.addEventListener('click', playSound);
  document.addEventListener('touchstart', playSound);
});

//==================== Animate ========================
const timer = new Timer();

const tick = () => {
  timer.update();
  const elapsedTime = timer.getElapsed();

  //== Ghost 01
  const ghost1Angle = elapsedTime * 0.45;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;

  // Go up and down through the floor in a irregular pattern
  ghost1.position.y =
    Math.sin(ghost1Angle) *
    Math.sin(ghost1Angle * 2.34) *
    Math.sin(ghost1Angle * 3.45);

  //== Ghost 02
  const ghost2Angle = -elapsedTime * 0.35;
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(ghost2Angle) * 5;
  ghost2.position.y =
    Math.sin(ghost2Angle) *
    Math.sin(ghost2Angle * 2.34) *
    Math.sin(ghost2Angle * 3.45);

  //== Ghost 03
  const ghost3Angle = elapsedTime * 0.25;
  ghost3.position.x = Math.cos(ghost3Angle) * 6.5;
  ghost3.position.z = Math.sin(ghost3Angle) * 6.5;
  ghost3.position.y =
    Math.cos(ghost3Angle) *
    Math.cos(ghost3Angle * 2.34) *
    Math.sin(ghost3Angle * 3.45);

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
