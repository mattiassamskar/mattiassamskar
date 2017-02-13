'use strict';

var scene, camera, renderer, projector, raycaster, mouse, stars = [], box, planet, time = 0;

var planets = [
    {
        image: 'linkedin.png',
        url: 'https://se.linkedin.com/in/mattiassamskar',
        distance: 0.3,
        speed: 0.007,
        size: 23,
        tilt: -0.10
    },
    {
        image: 'github.jpg',
        url: 'https://github.com/mattiassamskar',
        distance: 0.18,
        speed: 0.006,
        size: 25,
        tilt: 0.06
    },
    {
        image: 'twitter.jpg',
        url: 'https://twitter.com/mattiassamskar',
        distance: 0.27,
        speed: 0.009,
        size: 20,
        tilt: -0.15
    },
    {
        image: 'facebook.png',
        url: 'https://facebook.com/mattias.samskar',
        distance: 0.33,
        speed: 0.011,
        size: 15,
        tilt: 0.0001
    },
    {
        image: 'instagram.jpg',
        url: 'https://www.instagram.com/mattiassamskar/',
        distance: 0.13,
        speed: 0.015,
        size: 16,
        tilt: 0.13
    },
];

function initStars() {
    var i;
    for (i = -2000; i < 1000; i += 20) {
        var geometry = new THREE.CircleGeometry(3);
        var material = new THREE.MeshBasicMaterial({ color: 0xcccccc });
        var star = new THREE.Mesh(geometry, material);
        setMeshStartPosition(star, i);
        stars.push(star);
        scene.add(star);
    }
}

function initBox() {
    var geometry = new THREE.BoxGeometry(60, 60, 60);
    var map = new THREE.TextureLoader().load("mattias.jpg");
    var material = new THREE.MeshBasicMaterial({ color: 0xffffff, map: map });
    box = new THREE.Mesh(geometry, material);
    box.position.set(0, 0, 0);
    scene.add(box);
}

function initPlanets() {
    planets.forEach(function (planet) {
        var geometry = new THREE.SphereGeometry(planet.size, 50, 50);
        var map = new THREE.TextureLoader().load(planet.image);
        var material = new THREE.MeshBasicMaterial({ color: 0xffffff, map: map });
        planet.mesh = new THREE.Mesh(geometry, material);
        planet.mesh.userData = planet.url;
        planet.e_angle = Math.random() * 10;
        scene.add(planet.mesh);
    });
}

function setMeshStartPosition(mesh, z) {
    var width = window.innerWidth;
    var height = window.innerHeight;

    mesh.position.x = 3 * (Math.random() * width - width / 2);
    mesh.position.y = 3 * (Math.random() * height - height / 2);
    mesh.position.z = z;
}

function animateStars() {
    stars.forEach(function (star) {
        star.position.z += 15;
        if (star.position.z > 1000) {
            setMeshStartPosition(star, -2000);
        }
    });
}

function animateBox() {
    box.rotation.x += 0.01;
    box.rotation.y += 0.005;
    box.rotation.z += 0.015;
}

function animatePlanets() {
    var windowSize = Math.min(window.innerWidth, window.innerHeight);
    planets.forEach(function (planet) {
        var x = planet.distance * windowSize * Math.cos(planet.e_angle);
        var y = planet.tilt * windowSize * Math.sin(planet.e_angle);
        var z = planet.distance * 2 * windowSize * Math.sin(planet.e_angle);
        planet.mesh.position.set(x, y, z);
        planet.mesh.rotation.y += planet.speed;
        planet.e_angle += planet.speed;
    });
}

function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

function onDocumentMouseDown(event) {
    event.preventDefault();
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = - (event.clientY / renderer.domElement.clientHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(planets.map(function (planet) {
        return planet.mesh;
    }));
    if (intersects.length > 0) {
        window.open(intersects[0].object.userData);
    }
}

function onDocumentTouchStart(event) {
    event.preventDefault();
    event.clientX = event.touches[0].clientX;
    event.clientY = event.touches[0].clientY;
    onDocumentMouseDown(event);
}

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.z = 1000;
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('touchstart', onDocumentTouchStart, false);

    initStars();
    initBox();
    initPlanets();
}

function animate() {
    requestAnimationFrame(animate);
    animateStars();
    animateBox();
    animatePlanets();
    renderer.render(scene, camera);
}

init();
animate();