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

  var settingsAreOpen = false;

  document.body.addEventListener('click', () => {
    if (SoundFile && SoundFile.isLoaded()) {
      if (SoundFile.isPlaying()) {
        console.log("Pausing");
        SoundFile.pause();
        document.getElementById('icon').innerHTML = 'pause';
        document.getElementById('icon').style.opacity = '1';
      } else {
        console.log("Playing");
        SoundFile.play();
        document.getElementById('icon').innerHTML = 'play_arrow';
        document.getElementById('icon').style.opacity = '1';
      }


      // start fadeout
      setTimeout(() => {
        document.getElementById('icon').style.opacity = '0';
      }, 1000);
    }

    // SETTINGS will be added soon
    // var settingsAreOpen = false;
    // if (settingsAreOpen) {
    //   /* close settings window */
    //   document.getElementById('settings').style.opacity = '0';
    //   settingsAreOpen = false;

    //   /* hide mouse when playing */
    //   document.body.style.cursor = "none";

    //   /* play the file */
    //   if (SoundFile && SoundFile.isLoaded() && SoundFile.isPaused()) {
    //     // console.log("Playing");
    //     SoundFile.play();
    //   }
    // } else {
    //   /* open settings window */
    //   document.getElementById('settings').style.opacity = '1';
    //   settingsAreOpen = true;

    //   /* show the cursor */
    //   document.body.style.cursor = "default";

    //   /* pause the file */
    //   if (SoundFile && SoundFile.isPlaying()) {
    //     SoundFile.pause();
    //   }
    // }

  });

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