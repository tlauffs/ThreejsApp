import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PointLightHelper, RectAreaLight } from "three";
import { RectAreaLightHelper }  from "three/examples/jsm/helpers/RectAreaLightHelper.js";


const mouse = new THREE.Vector2();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// const camera = new THREE.OrthographicCamera( window.innerWidth / - 200, window.innerWidth / 200, window.innerHeight / 200, window.innerHeight/ - 200,  1, 1000 );
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
  antialias: true,
  alpha: true,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.VSMShadowMap;


renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setX(1.5);
camera.position.setY(9);
camera.position.setZ(14);
camera.rotateX(-0.45);

const loader = new GLTFLoader();
loader.load(
  "/models/room.gltf",
  function (gltf) {
    let room = gltf.scene;
    room.position.set(0, -2, 0);
    const scale = calculateScaleFactor();
    room.scale.set(scale, scale, scale)
    scene.add(room);
    room.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    room.rotateY(-0.8);
  },
  undefined,
  function (error) {
    console.log(error);
  }
);

function calculateScaleFactor() {
  const windowWidth = window.innerWidth;
  let scaleFactor = windowWidth / 700;
  scaleFactor = Math.min(Math.max(scaleFactor, 0.25), 1.25);
  return scaleFactor;
}

const light = new THREE.AmbientLight(0x2b4459, 1);
scene.add(light);

const directionLight = new THREE.DirectionalLight("#f0ab94", 1);
directionLight.castShadow = true;
directionLight.shadow.mapSize.width = 600;
directionLight.shadow.mapSize.height = 600;
directionLight.shadow.bias = -0.00001;
directionLight.position.set(5, 4.6, 7.5);
directionLight.target.position.set(0, 0, 0);

scene.add(directionLight);
scene.add(directionLight.target);

const intensity = 0.7;
const rectLight = new THREE.PointLight( "#5cd3db", intensity );
rectLight.position.set( 1 , 2, -2);
scene.add( rectLight );

function animate() {
  /*
  camera.position.setX(1.5 + 3 * mouse.x);
  camera.position.setY(9 - mouse.y);
  */
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

const controls = new OrbitControls( camera, renderer.domElement );
controls.panSpeed = 0.5;
controls.rotateSpeed = 0.25;
controls.maxDistance = 25;
controls.enableDamping = true;
controls.dampingFactor = 0.5;
controls.minAzimuthAngle = -Math.PI / 3;
controls.maxAzimuthAngle = Math.PI /4;
controls.minPolarAngle = Math.PI /4;
controls.maxPolarAngle = Math.PI / 2;

/*
# Old controls replaced with orbit controls 
window.addEventListener("resize", onWindowResize, false);
document.addEventListener("wheel", onMouseWheel, false);
document.addEventListener("mousemove", onMouseMove, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
  mouse.x = event.clientX / window.innerWidth - 0.5;
  mouse.y = event.clientY / window.innerHeight - 0.5;
}

function onMouseWheel(event) {
  camera.position.z += event.deltaY * 0.01;
}
*/

var colorInput = document.getElementById("colorpicker");
colorInput.addEventListener(
  "input",
  function () {
    var color = new THREE.Color(colorInput.value);
    directionLight.color.setHex(color.getHex());
    console.log(color);
  },
  false
);

var colorInputSec = document.getElementById("colorpickerSec");
colorInputSec.addEventListener(
  "input",
  function () {
    var color = new THREE.Color(colorInputSec.value);
    rectLight.color.setHex(color.getHex());
    console.log(color);
  },
  false
);
