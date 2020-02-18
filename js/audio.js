let song, analyzer;

window.SoundFile = null;
window.AudioAnalyzer = null;

/* Fetch audio directory */
const audioDirectory = {
  baseURL: 'https://alanw.s3-ap-southeast-2.amazonaws.com/',
  doc: null,
  ready: false,
  audioKeys: [],

  fetchKeys() {
    fetch(audioDirectory.baseURL).then(response => response.text())
      .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
      .then(data => {
        audioDirectory.doc = data;
        for (var contents of audioDirectory.doc.getElementsByTagName('Contents')) {
          var key = contents.childNodes[0].innerHTML;
          audioDirectory.audioKeys.push(key);
        }

        audioDirectory.ready = true;
        if (audioDirectory.onready) audioDirectory.onready();
      });
  },

  getRandomKey() {
    var i = Math.floor(Math.random() * audioDirectory.audioKeys.length);
    var key = audioDirectory.audioKeys[i];

    // Remove it from array
    audioDirectory.audioKeys.splice(i, 1);

    console.log("You are now listening to:", key);

    return audioDirectory.baseURL + encodeURI(key);
  }
};

// Fetch audio file keys
audioDirectory.fetchKeys();

function preload() {

}

async function setup() {
  noCanvas();

  /* if not ready, wait for it */
  if (!audioDirectory.ready) await new Promise((resolve, reject) => {
    audioDirectory.onready = () => {
      resolve();
    };
  });

  // Start loading the sound
  song = loadSound(audioDirectory.getRandomKey(), async () => {
    // The particle generator will play the sound when it's ready
  });
  // When the sound ends, fetch another
  song.onended(() => {
    song.setPath(audioDirectory.getRandomKey(), async () => {
      // Play as soon as its ready
      song.play();
    });
  });



  // create a new Amplitude analyzer
  analyzer = new p5.Amplitude(0.2);

  // Patch the input to an volume analyzer
  analyzer.setInput(song);
  analyzer.toggleNormalize(true);

  window.AudioAnalyzer = analyzer;
  window.SoundFile = song;
}