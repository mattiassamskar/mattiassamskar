var scene, camera, renderer;
var stars = [];
var box;

init();
animate();

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 5000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', callback, false);

    initStars();
    // initImage();
    initBox();
    camera.position.z = 1000;
}

function animate() {
    requestAnimationFrame(animate);
    animateStars();
    animateBox();
    renderer.render(scene, camera);
}

function initStars() {
    for (i = -2000; i < 1000; i += 20) {
        var star = createStarMesh(i);
        setMeshStartPosition(star, i);
        stars.push(star);
        scene.add(star);
    }
}

function initImage() {
    var map = new THREE.TextureLoader().load("mattias.png");
    var material = new THREE.SpriteMaterial({ map: map });
    var mesh = new THREE.Sprite(material);
    mesh.position.set(0, 0, 996);
    scene.add(mesh);
}

function initBox() {
    var geometry = new THREE.BoxGeometry(100, 100, 100);
    var map = new THREE.TextureLoader().load("mattias.png");
    var material = new THREE.MeshBasicMaterial({ color: 0xffffff, map: map });
    box = new THREE.Mesh(geometry, material);
    box.position.set(0, 0, 700);
    scene.add(box);
}

function animateStars() {
    for (i = 0; i < stars.length; i++) {
        var star = stars[i];
        star.position.z += 15;
        if (star.position.z > 1000) {
            setMeshStartPosition(star, -2000);
        }
    }
}

function animateBox() {
    box.rotation.x += 0.02;
    box.rotation.y += 0.01;
    box.rotation.z += 0.03;
}

function createStarMesh() {
    var geometry = new THREE.CircleGeometry(3);
    var material = new THREE.MeshBasicMaterial({ color: 0xcccccc });
    var mesh = new THREE.Mesh(geometry, material);
    return mesh;
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