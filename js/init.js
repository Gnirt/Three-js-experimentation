if (Gnirt.WebGLDetect) {
  // If WebGL is available to use then we load our libraries.
  LazyLoad.js(
    [
      "https://cdnjs.cloudflare.com/ajax/libs/three.js/r72/three.min.js",
      "./js/vendor/orbitControls.js",
      "./js/vendor/postprocessing/EffectComposer.js",
      "./js/vendor/postprocessing/MaskPass.js",
      "./js/vendor/postprocessing/RenderPass.js",
      "./js/vendor/postprocessing/ShaderPass.js",
      "./js/vendor/shaders/CopyShader.js",
      "./js/vendor/shaders/FilmShader.js",
      "./js/vendor/shaders/BadTVShader.js",
      "./js/vendor/shaders/RGBShiftShader.js",
      "./js/vendor/shaders/StaticShader.js",
      "./js/vendor/threex.badtvjamming.js",
      "./js/vendor/threex.badtvsound.js",
      "./js/vendor/threex.badtvpasses.js",
      "./js/utils.js",
      "./js/main.js"
    ],
    function() {
      Gnirt.Main.init();
    });
}
