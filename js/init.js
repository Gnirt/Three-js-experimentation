if (Gnirt.WebGLDetect) {
  // If WebGL is available to use then we load our libraries.
  LazyLoad.js(
    [
      "https://cdnjs.cloudflare.com/ajax/libs/three.js/r72/three.min.js",
      "./js/vendor/orbitControls.js",
      "./js/utils.js",
      "./js/main.js"
    ],
    function() {
      Gnirt.Main.init();
    });
}
