var Gnirt = Gnirt || {};

Gnirt.Main = (function() {
  var scene, camera, renderer, orbitControls;

  function setup() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1000;

    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);

    addLighting();

    addMesh();

    addGround();

    addAudio();
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function addGround() {
    var helper = new THREE.GridHelper(500, 10);
    helper.color1.setHex(0x444444);
    helper.color2.setHex(0x444444);
    helper.position.y = 0.1;
    scene.add(helper);
  }

  function addAudio() {
    var listener = new THREE.AudioListener();
    camera.add(listener);
    var sphere = new THREE.SphereGeometry(20, 32, 16);
    var material_sphere2 = new THREE.MeshLambertMaterial({
      color: 0xff2200,
      shading: THREE.FlatShading
    });
    var mesh2 = new THREE.Mesh(sphere, material_sphere2);
    mesh2.position.set(250, 30, 0);
    scene.add(mesh2);

    var sound2 = new THREE.Audio(listener);
    sound2.load('data/music.mp3');
    sound2.setRefDistance(20);
    sound2.autoplay = true;
    mesh2.add(sound2);
  }

  function addLighting() {
    var light = new THREE.DirectionalLight(0xffffff, 0.6);
    light.position.set(400, 400, 400);
    light.target.position.set(0, 0, 0);

    scene.add(light);

    scene.add(new THREE.AmbientLight(0x222222));
  }

  function addMesh() {
    var geometry = new THREE.BoxGeometry(200, 200, 200);
    var material = new THREE.MeshPhongMaterial({
      color: 0xffffe0,
      shading: THREE.FlatShading
    });

    var mesh = new THREE.Mesh(geometry, material);

    // give it some random rotation
    mesh.rotation.y = Gnirt.Utils.degToRad(Gnirt.Utils.randomRange(45, 135));

    scene.add(mesh);
  }

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  return {
    init: function() {
      setup();
      animate();
    }
  };
})();
