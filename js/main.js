var Gnirt = Gnirt || {};

Gnirt.Main = (function() {
  var scene, camera, renderer, orbitControls, video, videoTexture;
  // audio variable
  var context,
    soundSource,
    soundBuffer,
    url = 'http://thingsinjars.com/lab/web-audio-tutorial/hello.mp3';
  var idx = 0;
  var filters = ['grayscale', 'sepia', 'blur', 'brightness',
               'contrast', 'hue-rotate', 'hue-rotate2',
               'hue-rotate3', 'saturate', 'invert', '', 'drop-shadow'];

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

    //addMesh();

    //addGround();

    //addAudio();

    addVideo();
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
    /**
     * Audio sphere with three js
     **/
    // var listener = new THREE.AudioListener();
    // camera.add(listener);
    // var sphere = new THREE.SphereGeometry(20, 32, 16);
    // var material_sphere2 = new THREE.MeshLambertMaterial({
    //   color: 0xff2200,
    //   shading: THREE.FlatShading
    // });
    // var mesh2 = new THREE.Mesh(sphere, material_sphere2);
    // mesh2.position.set(250, 30, 0);
    // scene.add(mesh2);
    //
    // var sound2 = new THREE.Audio(listener);
    // sound2.load('data/music.mp3');
    // sound2.setRefDistance(20);
    // sound2.autoplay = true;
    // mesh2.add(sound2);
    /**
     * Audio in browser http://creativejs.com/resources/web-audio-api-getting-started/
     **/
    if (typeof AudioContext !== "undefined") {
      context = new AudioContext();
    } else if (typeof webkitAudioContext !== "undefined") {
      context = new webkitAudioContext();
    } else {
      throw new Error('AudioContext not supported. :(');
    }
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
    // Our asynchronous callback
    request.onload = function() {
      var audioData = request.response;
      createSoundSource(audioData);
    };
    request.send();
  }

  function createSoundSource(audioData) {
    // create a sound source
    soundSource = context.createBufferSource();
    // The Audio Context handles creating source buffers from raw binary
    context.decodeAudioData(audioData, function(soundBuffer) {
      // Add the buffered data to our object
      soundSource.buffer = soundBuffer;
      // Plug the cable from one thing to the other
      soundSource.connect(context.destination);
      // Finally
      soundSource.start(context.currentTime);
    });
  }

  function addVideo() {
    video = document.createElement('video');
    video.width = 320;
    video.height = 240;
    video.autoplay = true;
    navigator.getUserMedia = navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;

    if (navigator.getUserMedia) {
      navigator.getUserMedia({
        audio: false,
        video: true
      }, function(stream) {
        video.src = window.URL.createObjectURL(stream);
      }, function(error) {
        console.log("Failed to get a stream due to", error);
      });
    } else {
      video.src = "http://example.com/supercatvideo.webm";
    }

    videoTexture = new THREE.Texture(video);
    materialVideoTexture = new THREE.MeshLambertMaterial({
      map: videoTexture
    });
    var geometry = new THREE.BoxGeometry(200, 200, 200);

    var mesh = new THREE.Mesh(geometry, materialVideoTexture);

    // give it some random rotation
    mesh.rotation.y = Gnirt.Utils.degToRad(Gnirt.Utils.randomRange(45, 135));

    scene.add(mesh);
  }

  function changeFilter(el) {
    el.className = '';
    var effect = filters[idx++ % filters.length]; // loop through filters.
    if (effect) {
      el.classList.add(effect);
    }
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
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      videoTexture.needsUpdate = true;
    }
  }

  return {
    init: function() {
      setup();
      animate();
    }
  };
})();
