import "./style.css";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

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

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setX(1.5);
camera.position.setY(9);
camera.position.setZ(14);
camera.rotateX(-0.45);

const loader = new GLTFLoader();
loader.load(
  "./models/room.gltf",
  function (gltf) {
    let room = gltf.scene;
    room.position.set(1, 0, 0);
    scene.add(room);
    room.rotateY(-0.8);
  },
  undefined,
  function (error) {
    console.log(error);
  }
);

const light = new THREE.AmbientLight(0x2b4459, 1);
scene.add(light);

const directionLight = new THREE.DirectionalLight('#b6ccf0', 1.7);
directionLight.position.set(5, 4.6, 7.5);
directionLight.target.position.set(0, 0, 0);

scene.add(directionLight);
scene.add(directionLight.target);

function animate() {
  camera.position.setX(1.5 + 3 * (mouse.x));
  camera.position.setY(9 - (mouse.y));
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", onWindowResize, false);
document.addEventListener("wheel", onMouseWheel, false);
document.addEventListener("mousemove", onMouseMove, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) - 0.5;
  mouse.y = (event.clientY / window.innerHeight) - 0.5;
}

function onMouseWheel(event) {
  camera.position.z += event.deltaY * 0.01;
}

var colorInput = document.getElementById("colorpicker");
colorInput.addEventListener("input", function(){
  var color = new THREE.Color(colorInput.value);
  directionLight.color.setHex(color.getHex());
  console.log(color);
}, false);