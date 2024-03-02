let cash = localStorage.getItem('cash') ? parseInt(localStorage.getItem('cash')) : 0;

const reels = [
  ["🍒", "🍊", "🍇", "🍒", "🔔", "7️⃣"],
  ["🍒", "🍊", "🍇", "🍒", "🔔", "7️⃣"],
  ["🍒", "🍊", "🍇", "🍒", "🔔", "7️⃣"]
];


const descriptions = [
  "dont get too addicted now 🤨",
  "gamble more please",
  "99% of gamblers quit before they win big 👌🤑",
  "spin 4 free cash!!",
  "try to hit a jackpot kim jung il 😱",
  "throw stones at homeless people if you dont win",
  "happy birthday gambling, so glad u exist"
];

const spinDelay = 300;
const spinDuration = 3000;

function updateCashDisplay() {
  // Formatting cash amount with commas
  var cashWithCommas = parseFloat(cash).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');

  localStorage.setItem('cash', cash);
  document.getElementById('cash-display').textContent = '$' + cashWithCommas;
}


function updateDescription() {
  const randomIndex = Math.floor(Math.random() * descriptions.length);
  document.getElementById('description').textContent = descriptions[randomIndex];
}

function spinReels() {
  // Get the bet amount from the input field
  let betAmount = parseInt(document.getElementById('bet-amount').value);

  // Check if the bet amount is valid and there's enough cash to spin
  if (betAmount > 0 && betAmount <= cash) {
    // Deduct the bet amount from cash
    // Update cash display
    updateCashDisplay();

    // Disable spin button during spinning
    document.getElementById('spin-button').disabled = true;

    let promises = [];
    for (let i = 0; i < reels.length; i++) {
      promises.push(spinSingleReel(i));
    }
    Promise.all(promises).then(() => {
      checkWin();
      // Enable spin button after spinning completes
      document.getElementById('spin-button').disabled = false;
    });
  } else {
    // If the bet amount is invalid or not enough cash, display a message
    document.getElementById('result-message').textContent = 'Invalid bet or insufficient funds';
  }
}



function spinSingleReel(index) {
  return new Promise(resolve => {
    let reel = document.getElementById(`reel${index + 1}`);
    let symbols = reels[index];
    let randomIndex = Math.floor(Math.random() * symbols.length);
    let targetIndex = randomIndex + symbols.length * 5;
    let speed = 50; // Speed of spinning
    let currentIteration = 0;

    let spinInterval = setInterval(() => {
      reel.textContent = symbols[currentIteration % symbols.length];
      currentIteration++;

      if (currentIteration >= targetIndex) {
        clearInterval(spinInterval);
        resolve();
      }
    }, speed);
  });
}

function checkWin() {
  let results = [];
  for (let i = 0; i < reels.length; i++) {
    let symbols = reels[i];
    let symbol = document.getElementById(`reel${i + 1}`).textContent;
    results.push(symbols.indexOf(symbol));
  }
  let multiplicationFactor = 1;

  if (results[0] === results[1] && results[1] === results[2]) {
    switch (results[0]) {
      case 0: // 🍒
        multiplicationFactor = 2;
        break;
      case 1: // 🍊
        multiplicationFactor = 2;
        break;
      case 2: // 🍇
        multiplicationFactor = 3;
        break;
      case 3: // 🔔
        multiplicationFactor = 10;
        break;
      case 4: // 7️⃣
        multiplicationFactor = 5;
        break;
      default:
        break;
    }
    let betAmount = parseInt(document.getElementById('bet-amount').value);
    let newCash = betAmount *= multiplicationFactor;
    cash += betAmount *= multiplicationFactor;
    document.getElementById('result-message').textContent = `You won $${newCash}!`;
  } else {
    let betAmount = parseInt(document.getElementById('bet-amount').value);
    document.getElementById('result-message').textContent = 'You lost!';
    cash -= betAmount;
  }
  updateCashDisplay();
}


document.getElementById('spin-button').addEventListener('click', spinReels);


window.addEventListener('load', function() {
  updateCashDisplay();
  updateDescription();
});
