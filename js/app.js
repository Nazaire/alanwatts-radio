import controller from './controller.js';

const PIXEL_RATIO = (function () {
  var ctx = document.createElement("canvas").getContext("2d"),
    dpr = window.devicePixelRatio || 1,
    bsr = ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio || 1;

  return dpr / bsr;
})();

(function () {
  console.log("Hey you (me)");

  const canvas = document.getElementById('canvas');

  var init = window.onresize = () => {
    var w = window.innerWidth,
      h = window.innerHeight;

    canvas.width = w * PIXEL_RATIO;
    canvas.height = h * PIXEL_RATIO;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";

    controller.init(canvas);
  };

  init();
})();