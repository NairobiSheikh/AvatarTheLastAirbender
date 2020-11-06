const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const theBoulders = document.querySelectorAll('.the-boulder');
const btn = document.querySelector('.btn');
const countdownBoard = document.querySelector('.countdown');

let lastHole;
let timeUp = false;
let timeLimit = 20000;
let score = 0;
let countdown;

function randomHole(holes) {
  const randomHole = Math.floor(Math.random() * holes.length);
  const hole = holes[randomHole];
  if (hole === lastHole) {
    return randomHole(holes);
  }
  lastHole = hole; 
  return hole;
}

function popUp() {
  const time = Math.random() * (1300 - 400) + 400;
  const hole = randomHole(holes);
  hole.classList.add('up');
  setTimeout(function () {
      hole.classList.remove('up'); 
      if (!timeUp)
        popUp();
    }, time);
}

btn.addEventListener('click', function() {
  countdown = timeLimit/1000;
  scoreBoard.textContent = 0;
  countdownBoard.textContent = countdown,
  timeUp = false;
  score = 0;
  popUp();
  setTimeout(function(){
    timeUp = true;
  }, timeLimit);

  let startCountdown = setInterval(function(){
    countdown -= 1;
    countdownBoard.textContent = countdown;
    if (countdown < 0) {
      countdown = 0;
      clearInterval(startCountdown);
      countdownBoard.textContent = 'Times up!! Thank you for participating on our planet! Toph rules!!'
    }
  }, 1000);
});

function bonk(e) {
  if(!e.isTrusted) return;
  score++;
  this.parentNode.classList.remove('up');
  scoreBoard.textContent = score;
}

theBoulders.forEach(theBoulder => theBoulder.addEventListener('click', bonk));