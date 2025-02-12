import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.126.1/build/three.module.js';
import { ARButton } from 'https://cdn.jsdelivr.net/npm/three@0.126.1/examples/jsm/webxr/ARButton.js';

let scene, camera, renderer;
let reticle, model;
let isPlaced = false;

function initAR() {
    // Create Scene
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 40);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);

    // Add AR Button
    document.body.appendChild(ARButton.createButton(renderer));

    // Reticle for placement
    const geometry = new THREE.RingGeometry(0.08, 0.1, 32).rotateX(-Math.PI / 2);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    reticle = new THREE.Mesh(geometry, material);
    reticle.visible = false;
    scene.add(reticle);

    // Load Object (Replace with Poster/Tapestry/Rug)
    const texture = new THREE.TextureLoader().load('https://i.imgur.com/YOUR_IMAGE.jpg');
    const planeGeo = new THREE.PlaneGeometry(1, 1.5);
    const planeMat = new THREE.MeshBasicMaterial({ map: texture });
    model = new THREE.Mesh(planeGeo, planeMat);
    model.visible = false;
    scene.add(model);

    // XR Session
    const session = renderer.xr.getSession();
    session.addEventListener('select', placeObject);

    function placeObject() {
        if (!isPlaced) {
            model.position.setFromMatrixPosition(reticle.matrix);
            model.visible = true;
            isPlaced = true;
        }
    }

    function animate() {
        renderer.setAnimationLoop(() => {
            renderer.render(scene, camera);
        });
    }

    animate();
}

// Start AR when Button is Clicked
document.getElementById('startAR').addEventListener('click', initAR);
