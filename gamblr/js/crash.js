const CRASH_CHANCE = 0.4999998;
const ROCKET_SPEED = 2000; // ms
const RESPAWN_SPEED = 840 // ms

document.addEventListener('DOMContentLoaded', initialize);

function initialize() {
  updateCashDisplay();
  document.getElementById('bet-button').addEventListener('click', placeBet);
}

function updateCashDisplay() {
  const cashValue = parseFloat(localStorage.getItem('cash')) || 0;
  var formattedCash = parseFloat(cashValue).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  document.getElementById('cash-value').textContent = formattedCash;
}

function resetRocket() {
  const rocket = document.getElementById('rocket');

  rocket.style.transition = 'opacity 0.6s ease-in-out';
  rocket.style.opacity = '0';

  setTimeout(() => {
    rocket.style.transition = 'none';
    rocket.style.backgroundImage = "url('/gamblr/images/rocket.png')";
    rocket.style.bottom = '0';
    rocket.style.left = '0';
    rocket.offsetHeight;
    rocket.style.transition = 'none';
    document.getElementById('bet-button').disabled = false;
    rocket.offsetHeight;
    rocket.style.transition = 'opacity 0.7s ease-in-out';
    rocket.style.opacity = '1';
  }, RESPAWN_SPEED);
}

function placeBet() {
  const betAmount = parseFloat(document.getElementById('bet-amount').value);
  const cashValue = parseFloat(localStorage.getItem('cash')) || 0;
  document.getElementById('bet-button').disabled = true;
  if (isNaN(betAmount) || betAmount <= 0 || betAmount > cashValue) {
    displayResult('Invalid bet or insufficient funds!');
    document.getElementById('bet-button').disabled = false;
    return;
  }

  const ascent = 260
  const forward = 300
  const crashChance = Math.random();

  const rocket = document.getElementById('rocket');
  const rocketContainer = document.getElementById('rocket-container');

  const containerWidth = rocketContainer.clientWidth;
  const containerHeight = rocketContainer.clientHeight;

  const rocketWidth = rocket.offsetWidth;
  const rocketHeight = rocket.offsetHeight;

  const maxForward = containerWidth - rocketWidth;
  const maxAscent = containerHeight - rocketHeight;

  const newForward = Math.min(maxForward, forward);
  const newAscent = Math.min(maxAscent, ascent);

  rocket.style.transition = 'bottom 2s ease-in-out, left 2s ease-in-out';
  rocket.style.bottom = newAscent + 'px';
  rocket.style.left = newForward + 'px';

  setTimeout(() => {
    if (crashChance < CRASH_CHANCE) {
      const lostAmount = betAmount;
      displayResult(`The rocket exploded! You lost $${lostAmount.toLocaleString()}, you'll get it next time! :)`);
      rocket.style.backgroundImage = "url('/gamblr/images/boom.png')";
      setTimeout(resetRocket, 1000);
      localStorage.setItem('cash', (cashValue - betAmount).toFixed(2));
      updateCashDisplay();
    } else {
      const randomMultiplier = (Math.random() * 3) + 1;
      const wonAmount = betAmount * randomMultiplier;
      const actualWonAmount = wonAmount - betAmount;
      if (actualWonAmount < (betAmount + 0.5)) {
        const wonAmount = betAmount * 3;
        const actualWonAmount = wonAmount - betAmount;
        displayResult(`⭐ The rocket made it! You won $${actualWonAmount.toLocaleString()}`);
        setTimeout(resetRocket, 480);
        localStorage.setItem('cash', (cashValue + actualWonAmount).toFixed(2));
        updateCashDisplay();
      } else {
        const wonAmount = betAmount * randomMultiplier;
        const actualWonAmount = wonAmount - betAmount;
        displayResult(`🌑 The rocket made it! You won $${actualWonAmount.toLocaleString()}`);
        setTimeout(resetRocket, 480);
        localStorage.setItem('cash', (cashValue + actualWonAmount).toFixed(2));
        updateCashDisplay();
      }
    }
  }, ROCKET_SPEED);
}


function displayResult(message) {
  document.getElementById('result').textContent = message;
}
