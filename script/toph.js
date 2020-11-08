/*
 * Getting the DOM Elements
 */
const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const theBoulders = document.querySelectorAll('.the-boulder');
const btn = document.querySelector('.btn');
const countdownBoard = document.querySelector('.countdown');

/*
 * setting the up the random length of time
 */
let lastHole;
const timeLimit = 20000;
let score = 0;
let countdown = timeLimit/1000;

/**
 * retuns a random hole that is not the same as last hole.
 */
function randomHole() {
  while (true) {
    const randomHole = Math.floor(Math.random() * holes.length);
    const hole = holes[randomHole];
    if (hole !== lastHole) {
      lastHole = hole;
      return hole;
    }
  }
}

/**
 * brings up the theBoulders in random holes and when time runs out it hides the theBoulders.
 */
function popUp() {
  const time = Math.random() * 1300;
  const hole = randomHole();
  hole.classList.add('up');
  setTimeout(function () {
      hole.classList.remove('up');
  }, time);
}

/**
 * start and ends the game
 */
btn.addEventListener('click', function() {
  scoreBoard.textContent = 0;
  countdownBoard.textContent = countdown,
  score = 0;
  let startCountdown = setInterval(function(){
    countdown -= 1;
    if (countdown < 1) {
      countdown = 0;
      clearInterval(startCountdown);
      countdownBoard.textContent = 'Times up!! You have brought great shame to Toph\'s name!!'
    } else if (score >= 5) {
      clearInterval(startCountdown);
      countdownBoard.textContent = 'You have brought great pride to Toph\'s name.';
    } else {
      countdownBoard.textContent = countdown;
      popUp();
    }
  }, 1000);

});

/**
 * event that fires when theBoulder clicked
 * @param {object} e
 */
function bonk(e) {
  if(!e.isTrusted) return;
  score++;
  this.parentNode.classList.remove('up');
  scoreBoard.textContent = score;
}

/**
 * fires the bonke() function
 */
theBoulders.forEach(theBoulder => theBoulder.addEventListener('click', bonk));