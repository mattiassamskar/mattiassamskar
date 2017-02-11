var scene, camera, renderer, projector;
var stars = [], box, earth;
var time = 0;


init();
animate();

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.z = 1000;
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', callback, false);
    document.addEventListener('mousedown', onDocumentMouseDown, false);

    initStars();
    initBox();
    initEarth();
}

function animate() {
    requestAnimationFrame(animate);
    animateStars();
    animateBox();
    animateEarth();
    renderer.render(scene, camera);
}

function initStars() {
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
    var map = new THREE.TextureLoader().load("mattias.png");
    var material = new THREE.MeshBasicMaterial({ color: 0xffffff, map: map });
    box = new THREE.Mesh(geometry, material);
    box.position.set(0, 0, 0);
    scene.add(box);
}

function initEarth() {
    var geometry = new THREE.SphereGeometry(30, 32, 32);
    var map = new THREE.TextureLoader().load("linkedin.png");
    var material = new THREE.MeshBasicMaterial({ color: 0xcccccc, map: map });
    earth = new THREE.Mesh(geometry, material);
    scene.add(earth);
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

function animateEarth() {
    time = time + 10;
    var e_angle = time * 0.001;
    earth.rotation.y += 0.03;
    earth.position.set(0.7 * window.innerWidth * Math.cos(e_angle) / 2, 0.7 * window.innerHeight * Math.sin(e_angle) / 2, 0);
}

function setMeshStartPosition(mesh, z) {
    var width = window.innerWidth;
    var height = window.innerHeight;

    mesh.position.x = 3 * (Math.random() * width - width / 2);
    mesh.position.y = 3 * (Math.random() * height - height / 2);
    mesh.position.z = z;
}

function callback() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

function onDocumentMouseDown(event) {
    event.preventDefault();
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = - (event.clientY / renderer.domElement.clientHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects([earth]);
    if (intersects.length > 0) {
        window.open('https://se.linkedin.com/in/mattiassamskar');
    }
}