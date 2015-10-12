var Gnirt = Gnirt || {};

(function() {
  'use strict';

  var Utils = function() {
    throw "Utils cannot be instantiated.";
  };

  Utils.angleBetweenPointsInRad = function(p0, p1) {
    return Math.atan2(p1.y - p0.y, p1.x - p0.x);
  };

  Utils.radToDeg = function(rad) {
    return rad * 180 / Math.PI;
  };

  Utils.degToRad = function(deg) {
    return deg * Math.PI / 180;
  };

  Utils.randomRange = function(min, max) {
    return min + Math.random() * (max - min);
  };

  Utils.randomInt = function(min, max) {
    return Math.floor(min + Math.random() * (max - min + 1));
  };

  Gnirt.Utils = Utils;
})();
