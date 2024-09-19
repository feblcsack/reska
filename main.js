let scene, camera, renderer, canvas;

function init() {
  canvas = document.getElementById("3d-canvas");
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    35,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000
  );
  camera.position.set(4, 5, 7);

  renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1);
  scene.add(light);

  const loader = new THREE.GLTFLoader();
  const loadingIndicator = document.createElement("div");
  loadingIndicator.textContent = "Loading...";
  document.body.appendChild(loadingIndicator);

  loader.load(
    "/mie.glb",
    function (gltf) {
      loadingIndicator.style.display = "none";
      const model = gltf.scene;
      model.position.set(0, -0.5, 0);
      scene.add(model);
      animate();
    },
    undefined,
    function (error) {
      console.error("Error loading the model:", error);
      loadingIndicator.textContent = "Failed to load model";
    }
  );

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableZoom = true;

  window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

window.onload = init;

const beliBtn = document.getElementById("beli-btn");
const popup = document.getElementById("popup");
const overlay = document.getElementById("overlay");
const closeBtn = document.getElementById("close-btn");

beliBtn.addEventListener("click", function () {
  popup.classList.add("show");
  overlay.classList.add("show");
});

closeBtn.addEventListener("click", function () {
  popup.classList.remove("show");
  overlay.classList.remove("show");
});

const deskripsiBtn = document.getElementById("deskripsi-btn");
const descriptionSection = document.getElementById("description-section");

deskripsiBtn.addEventListener("click", function () {
  descriptionSection.classList.toggle("active");
  deskripsiBtn.setAttribute(
    "aria-expanded",
    descriptionSection.classList.contains("active")
  );
});

window.addEventListener("beforeunload", function () {
  renderer.dispose();
  scene.children.forEach((child) => {
    if (child.geometry) child.geometry.dispose();
    if (child.material) child.material.dispose();
  });
});
