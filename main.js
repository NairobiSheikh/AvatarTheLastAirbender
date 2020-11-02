/* auto strack
// const player = document.querySelector('#player');
// audioElem.addEventListener('load', function() {
//   audioElem.play();
// }, true);
requirements
A minimalist audio player represented by a single button in a circle which
fills clockwise as the audio file progresses.
*/
window.onload = function(){
  document.querySelector("palyContent").play();
}


/** settings up my circle parameters */
let PARAMETERS = {
  borderColor: "#BE4BDB",
  playedColor: "#000",
  backgroundColor: "rgba(142,187,196,.2)",
  iconColor: "#fff",
  borderWidth: 2,
  size: 48,
  className: 'circle-audio-player'
};

/** reused values & set the pi of the circle cumference.*/
let pi = Math.PI;
let doublePi = pi * 2;
let circumference = -pi / 2;
let animTime = 200;
let loaderTime = 1800;

let audioPlayer = function(choices) {
  choices = choices || {};
  for (let property in PARAMETERS) {
    this[property] = choices[property] || PARAMETERS[property];
  }

  /** creating the canves */
  this.canvas = document.createElement('canvas');
  this.canvas.setAttribute('class', `${this.className} is-loading`);
  this.canvas.addEventListener('mousedown', (function () {
      if (this.playing) {
          this.pause();
      }
      else {
          this.play();
      }
  }).bind(this));
  //lets drawe the context of the canvas
  /** Set and creating the getContext('2d') variable */
  this.context = this.canvas.getContext('2d');

  // set up initial stuff
  this.setAudio(choices.audio);
  this.setSize(this.size);

  // redraw loop
  (function animationLoop (now) {
      // check if we need to update anything
      if (this.animating) {
          this.updateAnimations(now);
      }
      if (this._forceDraw || this.playing || this.animating || this.loading) {
          this.drawing();
          this._forceDraw = false;
      }

      requestAnimationFrame(animationLoop.bind(this));
  }).call(this, new Date().getTime());
};
audioPlayer.prototype = {
  // private methods
  animateIcon: function (to, from) {
      // define a few things the first time
      this._animationProps = {
          animStart: null,
          from: from,
          to: to
      };
      if (from) {
          this.animating = true;
      }
      else {
          this._animationProps.current = this._icons[to].slice();
          this.draw();
      }
  },
  updateAnimations: function (now) {
      this._animationProps.animStart = this._animationProps.animStart || now;
      let deltaTime = now - this._animationProps.animStart;
      let perc = (1 - Math.cos(deltaTime / animTime * pi / 2));
      if (deltaTime >= animTime) {
          this.animating = false;
          perc = 1;
          this._animationProps.current = this._icons[this._animationProps.to].slice();
          this.draw();
      }
      else {
          let from = this._icons[this._animationProps.from];
          let current = [];
          for (let i = 0; i < from.length; i++) {
              current.push([]);
              for (let j = 0; j < from[i].length; j++) {
                  current[i].push([]);
                  let to = this._icons[this._animationProps.to][i][j];
                  current[i][j][0] = from[i][j][0] + (to[0] - from[i][j][0]) * perc;
                  current[i][j][1] = from[i][j][1] + (to[1] - from[i][j][1]) * perc;
              }
          }
          this._animationProps.current = current;
      }
  },
  drawing: function (progress) {
      // common settings
      if (isNaN(progress)) {
          progress = this.audio.currentTime / this.audio.duration || 0;
      }

      // clear existing
      this.context.clearRect(0, 0, this.size, this.size);

      // draw bg
      this.context.beginPath();
      this.context.arc(this.halfSize, this.halfSize, this.halfSize - (this.borderWidth / 2), 0, doublePi);
      this.context.closePath();
      this.context.fillStyle = this.backgroundColor;
      this.context.fill();

      /**
       draw border
       the active path is already the full circle, so just stroke it
      */
      this.context.lineWidth = this.borderWidth;
      this.context.strokeStyle = this.borderColor;
      this.context.stroke();

      /** play progress */
      if (progress > 0) {
          this.context.beginPath();
          this.context.arc(this.halfSize, this.halfSize, this.halfSize - (this.borderWidth / 2), circumference, circumference + doublePi * progress);
          this.context.strokeStyle = this.playedColor;
          this.context.stroke();
      }

      /** icons */
      this.context.fillStyle = this.iconColor;
      if (this.loading) {
          let loaderOffset = -Math.cos((new Date().getTime() % (loaderTime)) / (loaderTime) * pi) * doublePi - (pi / 3) - (pi / 2);
          this.context.beginPath();
          this.context.arc(this.halfSize, this.halfSize, this.halfSize / 3, loaderOffset, loaderOffset + pi / 3 * 2);
          this.context.strokeStyle = this.iconColor;
          this.context.stroke();
      }
      else {
          this.context.beginPath();
          let icon = (this.animationProps && this.animationProps.current) || this._icons.play;
          for (let i = 0; i < icon.length; i++) {
              this.context.moveTo(icon[i][0][0], icon[i][0][1]);

              for (let k = 1; k < icon[i].length; k++) {
                  this.context.lineTo(icon[i][k][0], icon[i][k][1]);
              }
          }

          // this.context.closePath();
          this.context.fill();
          // stroke to fill in for retina
          this.context.strokeStyle = this.iconColor;
          this.context.lineWidth = 2;
          this.context.linejoin = 'miter';
          this.context.stroke();
      }
  },
  setState: function (state) {
      this.playing = false;
      this.loading = false;
      if (state === 'playing') {
          this.playing = true;
          this.animateIcon('pause', 'play');
      }
      else if (state === 'loading') {
          this.loading = true;
      }
      else if (this.state !== 'loading') {
          this.animateIcon('play', 'pause');
      }
      else {
          this.animateIcon('play', null);
      }
      this.state = state;
      this.canvas.setAttribute('class', this.className + ' is-' + state);
      this.draw();
  },
  // public methods
  draw: function () {
      this._forceDraw = true;
  },
  setSize: function (size) {
      this.size = size;
      this.halfSize = size / 2; // we do this a lot. it's not heavy, but why repeat?
      this.canvas.width = size;
      this.canvas.height = size;
      // set icon paths
      let iconSize = this.size / 2;
      let pauseGap = iconSize / 10;
      let playLeft = Math.cos(pi / 3 * 2) * (iconSize / 2) + this.halfSize;
      let playRight = iconSize / 2 + this.halfSize;
      let playHalf = (playRight - playLeft) / 2 + playLeft;
      let top = this.halfSize - Math.sin(pi / 3 * 2) * (iconSize / 2);
      let bottom = this.size - top;
      let pauseLeft = this.halfSize - iconSize / 3;
      let pauseRight = this.size - pauseLeft;
      this._icons = {
          play: [
              [
                  [playLeft, top],
                  [playHalf, (this.halfSize - top) / 2 + top],
                  [playHalf, (this.halfSize - top) / 2 + this.halfSize],
                  [playLeft, bottom]
              ],
              [
                  [playHalf, (this.halfSize - top) / 2 + top],
                  [playRight, this.halfSize],
                  [playRight, this.halfSize],
                  [playHalf, (this.halfSize - top) / 2 + this.halfSize]
              ]
          ],
          pause: [
              [
                  [pauseLeft, top + pauseGap],
                  [this.halfSize - pauseGap, top + pauseGap],
                  [this.halfSize - pauseGap, bottom - pauseGap],
                  [pauseLeft, bottom - pauseGap]
              ],
              [
                  [this.halfSize + pauseGap, top + pauseGap],
                  [pauseRight, top + pauseGap],
                  [pauseRight, bottom - pauseGap],
                  [this.halfSize + pauseGap, bottom - pauseGap]
              ]
          ]
      };

      if (this.animationProps && this.animationProps.current) {
          this.animateIcon(this.animationProps.to);
      }
      if (!this.playing) {
          this.draw();
      }
  },
  setAudio: function (audioUrl) {
      this.audio = new Audio(audioUrl);
      this.setState('loading');

      this.audio.addEventListener('canplaythrough', (function () {
          this.setState('paused');
      }).bind(this));
      this.audio.addEventListener('play', (function () {
          this.setState('playing');
      }).bind(this));
      this.audio.addEventListener('pause', (function () {
          /** reset when finished */
          if (this.audio.currentTime === this.audio.duration) {
              this.audio.currentTime = 0;
          }
          this.setState('paused');
      }).bind(this));
  },
  appendTo: function (element) {
      element.appendChild(this.canvas);
  },
  play: function () {
      this.audio.play();
  },
  pause: function () {
      this.audio.pause();
  }
};


/** now init one as an example */
let cap = new audioPlayer({
  audio: 'audio/31YuYen.mp3',
size: 20,
borderWidth: 8
});
cap.appendTo(playerContent);