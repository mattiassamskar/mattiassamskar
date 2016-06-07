var scene, camera, renderer;
var stars = [];

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
    initImage();
    camera.position.z = 1000;
}

function animate() {
    requestAnimationFrame(animate);
    animateStars();
    renderer.render(scene, camera);
}

function initStars() {
    for (i = -2000; i < 1000; i += 20) {
        var starMesh = createStarMesh(i);
        stars.push(starMesh);
        scene.add(starMesh);
    }
}

function initImage() {
    var map = new THREE.TextureLoader().load("mattias.png");
    var material = new THREE.SpriteMaterial({ map: map });
    var mesh = new THREE.Sprite(material);
    mesh.position.set(0, 0, 996);
    scene.add(mesh);
}

function animateStars() {
    for (i = 0; i < stars.length; i++) {
        var starMesh = stars[i];
        starMesh.position.z += 15;
        if (starMesh.position.z > 1000) {
            setStartPosition(starMesh, -2000);
        }
    }
}

function createStarMesh(z) {
    var starGeometry = new THREE.CircleGeometry(3);
    var starMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc });
    var starMesh = new THREE.Mesh(starGeometry, starMaterial);
    setStartPosition(starMesh, z);
    return starMesh;
}

function setStartPosition(mesh, z) {

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