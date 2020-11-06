const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const theBoulders = document.querySelectorAll('.the-boulder');
const btn = document.querySelector('.btn');
const msg1 = document.querySelector('.msg1');
const msg2 = document.querySelector('.msg2');


let lastHole;
let timeUp = false;
let score = 0;
let currentTime = timeUp.textContent;

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
      if (!timeUp){
        popUp();
      } else {
        return document.querySelector('msg1').innerHTML = 'You have brought great shame to the Toph name!';
      }
    }, time);
}

btn.addEventListener('click', function() {
  scoreBoard.textContent = 0;
  timeUp = false;
  score = 0;
  popUp();
  setTimeout(() => timeUp = true, 20000)
});

function bonk(e) {
  if(!e.isTrusted) return;
  score++;
  this.parentNode.classList.remove('up');
  scoreBoard.textContent = score;
}

theBoulders.forEach(theBoulder => theBoulder.addEventListener('click', bonk));