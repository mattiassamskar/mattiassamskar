var scene, camera, renderer;
var stars = [];

init();
animate();

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    initStars();
    camera.position.z = 1000;
}

function animate() {
    requestAnimationFrame(animate);
    animateStars();
    renderer.render(scene, camera);
}

function initStars() {
    for (i = -1000; i < 1000; i += 30) {
        var starMesh = createStarMesh(i);
        stars.push(starMesh);
        scene.add(starMesh);
    }
}

function animateStars() {
    for (i = 0; i < stars.length; i++){
        var starMesh = stars[i];
        starMesh.position.z += 15;
        if (starMesh.position.z > 1000) {
            setStartPosition(starMesh, -1000);
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
    mesh.position.x = Math.random() * 2000 - 1000;
    mesh.position.y = Math.random() * 1000 - 500;
    mesh.position.z = z;    
}
