document.getElementById('info-icon').onclick = function() {
  document.getElementById('info').classList.toggle('hidden');
  return false;
};
if (Gnirt.WebGLDetect) {
  Gnirt.Main.init();
}
