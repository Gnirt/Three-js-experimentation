var Gnirt = Gnirt || {};

Gnirt.Main = (function() {
  var scene, camera, renderer, orbitControls, video, videoTexture, cubes;
  // audio variable
  // var context,
  //   soundSource,
  //   soundBuffer,
  //   url = 'http://thingsinjars.com/lab/web-audio-tutorial/hello.mp3';
  // var idx = 0;
  // var filters = ['grayscale', 'sepia', 'blur', 'brightness',
  //              'contrast', 'hue-rotate', 'hue-rotate2',
  //              'hue-rotate3', 'saturate', 'invert', '', 'drop-shadow'];
  // audio variable for analyse
  var micEnable = true;
  var freqByteData; //bars - bar data is from 0 - 256 in 512 bins. no sound is 0;
  var timeByteData; //waveform - waveform data is from 0-256 for 512 bins. no sound is 128.
  var binCount; //512
  var levelsData = [];
  var levelsCount = 16; //should be factor of 512
  var levelBins;

  function setup() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = -1000;
    camera.position.y = 20;

    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);
    cubes = new THREE.Object3D();
    addOrbitControls();

    window.addEventListener('resize', onWindowResize, false);

    addLighting();

    addVideo();
    addMesh();

    addBackgroundSphere();

    addGround();

    //addAudio();

  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function addGround() {
    var helper = new THREE.GridHelper(1000, 100);
    helper.color1.setHex(0x444444);
    helper.color2.setHex(0x444444);
    helper.position.y = -100;
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

    // if (typeof AudioContext !== "undefined") {
    //   context = new AudioContext();
    // } else if (typeof webkitAudioContext !== "undefined") {
    //   context = new webkitAudioContext();
    // } else {
    //   throw new Error('AudioContext not supported. :(');
    // }
    // var request = new XMLHttpRequest();
    // request.open("GET", url, true);
    // request.responseType = "arraybuffer";
    // // Our asynchronous callback
    // request.onload = function() {
    //   var audioData = request.response;
    //   createSoundSource(audioData);
    // };
    // request.send();
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

  function addEchoSoundFromMic(stream) {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    /**
     * http://www.html5rocks.com/en/tutorials/getusermedia/intro/
     **/

    // var context = new AudioContext();
    // var microphone = context.createMediaStreamSource(stream);
    // var filter = context.createBiquadFilter();
    //
    // // microphone -> filter -> destination.
    // microphone.connect(filter);
    // filter.connect(context.destination);
    // filter.type = 'lowpass'; // Low-pass filter. See BiquadFilterNode docs
    // filter.frequency.value = 440; // Set cutoff to 440 HZ

    /**
     * http://blog.chrislowis.co.uk/2014/07/23/dub-delay-web-audio-api.html
     **/

    // var ctx = new AudioContext();
    // var source = ctx.createMediaStreamSource(stream);
    // var delay = ctx.createDelay();
    // delay.delayTime.value = 0.5;
    //
    // var feedback = ctx.createGain();
    // feedback.gain.value = 0.8;
    //
    // var filter = ctx.createBiquadFilter();
    // filter.frequency.value = 1000;
    //
    // delay.connect(feedback);
    // feedback.connect(filter);
    // filter.connect(delay);
    //
    // source.connect(delay);
    // source.connect(ctx.destination);
    // delay.connect(ctx.destination);

    /**
     * audio analyse of the mic
     **/
    audioContext = new AudioContext();
    source = audioContext.createBufferSource();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.3;
    binCount = analyser.frequencyBinCount; // = 512

    microphone = audioContext.createMediaStreamSource(stream);
    microphone.connect(analyser);

    freqByteData = new Uint8Array(binCount);
    timeByteData = new Uint8Array(binCount);
    levelBins = Math.floor(binCount / levelsCount); //number of bins in each level
  }

  /**
   * inspired by http://learningthreejs.com/blog/2012/02/07/live-video-in-webgl/
   **/
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
        audio: micEnable,
        video: true
      }, function(stream) {
        video.src = window.URL.createObjectURL(stream);
        // video.src = "data/video.mp4";
        if (micEnable) {
          addEchoSoundFromMic(stream);
        }
      }, function(error) {
        console.log("Failed to get a stream due to", error);
      });
    } else {
      video.src = "data/video.mp4";
    }

    videoTexture = new THREE.Texture(video);
    materialVideoTexture = new THREE.MeshLambertMaterial({
      map: videoTexture
    });
    materialVideoTexture.map.minFilter = THREE.LinearFilter;
  }

  function changeFilter(el) {
    el.className = '';
    var effect = filters[idx++ % filters.length]; // loop through filters.
    if (effect) {
      el.classList.add(effect);
    }
  }

  function addLighting() {
    // var light = new THREE.DirectionalLight(0xffffff, 1.5);
    // light.position.set(400, 400, 400);
    // light.target.position.set(0, 0, 0);
    // scene.add(light);

    scene.add(new THREE.AmbientLight(0x222222));
    var keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
    keyLight.position.set(1, 1, 1);
    scene.add(keyLight);

    var fillLight = new THREE.DirectionalLight(0xffffff, 1.5);
    fillLight.position.set(-1, 0, -1);
    scene.add(fillLight);
  }

  function addMesh() {
    var cubeY = 0;
    var cubeX = 0;
    var cubeZ = 0;
    var step;
    for (step = 0; step < 200; step++) {
      var geometry = new THREE.BoxGeometry(200, 200, 200);

      var mesh = new THREE.Mesh(geometry, materialVideoTexture);
      if (step < 50) {
        cubeX = cubeX + 200;
        if (step % 10 === 0) {
          cubeY = cubeY + 200;
          cubeX = 0;
        }
      } else if (step < 100) {
        cubeZ = cubeZ + 200;
        if (step === 50) {
          cubeY = 0;
          cubeX = 0;
        }
        if (step % 10 === 0) {
          cubeY = cubeY + 200;
          cubeZ = 0;
        }
      } else if (step < 150) {
        cubeX = cubeX + 200;
        if (step === 100) {
          cubeY = 0;
        }
        if (step % 10 === 0) {
          cubeY = cubeY + 200;
          cubeX = 0;
        }
      } else {
        cubeZ = cubeZ + 200;
        if (step === 150) {
          cubeY = 0;
        }
        if (step % 10 === 0) {
          cubeY = cubeY + 200;
          cubeZ = 0;
        }
      }
      mesh.position.set(cubeX - 900, cubeY - 200, cubeZ - 800);
      // give it some random rotation
      // mesh.rotation.y = Gnirt.Utils.degToRad(Gnirt.Utils.randomRange(45, 135));
      cubes.add(mesh);
    }
    scene.add(cubes);
  }

  function addBackgroundSphere() {
    var sphereMat = new THREE.MeshBasicMaterial({
      color: 0x5a4d3e,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });

    var sphere1Geo = new THREE.SphereGeometry(1800, 20, 10);
    var sphere2Geo = new THREE.IcosahedronGeometry(2100, 2);

    var sphere1 = new THREE.Mesh(sphere1Geo, sphereMat);
    var sphere2 = new THREE.Mesh(sphere2Geo, sphereMat);

    scene.add(sphere1);
    scene.add(sphere2);
  }

  function addOrbitControls() {
    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
    orbitControls.minPolarAngle = Gnirt.Utils.degToRad(90);
    orbitControls.maxPolarAngle = Gnirt.Utils.degToRad(360);
    orbitControls.enablePan = false;
    orbitControls.minDistance = 10;
    orbitControls.maxDistance = 100;
  }

  function soundAnalyse() {
    if (typeof analyser !== 'undefined') {
      analyser.getByteFrequencyData(freqByteData);
      analyser.getByteTimeDomainData(timeByteData);
      var sum, j, i;
      for (i = 0; i < levelsCount; i++) {
        sum = 0;
        for (j = 0; j < levelBins; j++) {
          sum += freqByteData[(i * levelBins) + j];
        }
        levelsData[i] = sum / levelBins / 256; //freqData maxs at 256

        //adjust for the fact that lower levels are percieved more quietly
        //make lower levels smaller
        //levelsData[i] *=  1 + (i/levelsCount)/2;
      }
      //GET AVG LEVEL
      sum = 0;
      for (j = 0; j < levelsCount; j++) {
        sum += levelsData[j];
      }

      level = sum / levelsCount;
      if (level > 0.2) {
        console.log('du bruit');
        cubes.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0.1);
      }
    }
  }

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      videoTexture.needsUpdate = true;
    }
    soundAnalyse();
  }


  function intro() {
    var vid = document.getElementById("bgvid");
    var pauseButton = document.getElementById("pause");
    var nextButton = document.getElementById("next");
    var polina = document.getElementById("polina");

    function vidFade() {
      vid.classList.add("stopfade");
    }

    pauseButton.addEventListener('ended', function() {
      // only functional if "loop" is removed
      vid.pause();
      // to capture IE10
      vidFade();
    });

    pauseButton.addEventListener("click", function() {
      vid.classList.toggle("stopfade");
      if (vid.paused) {
        vid.play();
        pauseButton.innerHTML = "Pause";
      } else {
        vid.pause();
        pauseButton.innerHTML = "Paused";
      }
    });

    nextButton.addEventListener("click", function() {
      vid.parentNode.removeChild(vid);
      polina.parentNode.removeChild(polina);
      setup();
      animate();
    });
  }

  return {
    init: function() {
      intro();
    }
  };
})();
