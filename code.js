var scene, camera, renderer;
var boxGeometry, boxMaterial, boxMesh;
var stars = [];

var time = 0;

init();
animate();

function init() {

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1000;

    initBox();
    initStars();
    scene.add(boxMesh);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

}

function initBox() {
    boxGeometry = new THREE.BoxGeometry(400, 400, 400);
    boxMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

    boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
}

function initStars() {
    for (i = 0; i < 100; i++) {
        var starGeometry = new THREE.CircleGeometry(3);
        var starMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
        var starMesh = new THREE.Mesh(starGeometry, starMaterial);
        starMesh.position.x = getStartXPosition();
        starMesh.position.y = getStartYPosition();
        stars.push(starMesh);
        scene.add(starMesh);
    }
}

function getStartXPosition() {
    return window.innerWidth ;
}

function getStartYPosition() {
  return Math.random() * window.innerHeight;
}

function animate() {
    requestAnimationFrame(animate);
    animateBox();
    animateStars();
    renderer.render(scene, camera);
}

function animateBox() {
    time = time + 4;
    boxMesh.rotation.x += 0.01;
    boxMesh.rotation.y += 0.02;
    boxMesh.scale.x = 1 + pulse(time);
    boxMesh.scale.y = 1 + pulse(time);
    boxMesh.scale.z = 1 + pulse(time);
}

function animateStars() {
    for (i = 0; i < 100; i++){
        stars[i].position.x--;
        if (stars[i].position.x == 0){
            stars[i].position.x = getStartXPosition();
        }
    }
}

function pulse(time) {
    var value = Math.abs(Math.sin(2 * 3.14 * time));
    return value;
}