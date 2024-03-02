document.addEventListener('DOMContentLoaded', function() {
  const container = document.querySelector('.container');
  const pegs = document.querySelectorAll('.peg');
  const chip = document.getElementById('chip');
  const dropButton = document.getElementById('drop-button');
  const resultMessage = document.getElementById('result-message');

  const containerRect = container.getBoundingClientRect();
  const chipInitialPosition = chip.getBoundingClientRect();

  // Initialize cash in localStorage if not exists
  if (!localStorage.getItem('cash')) {
    localStorage.setItem('cash', '0');
  }

  dropButton.addEventListener('click', dropChip);

  function dropChip() {
    // Reset chip position to initial position
    chip.style.bottom = chipInitialPosition.bottom + 'px';
    chip.style.left = chipInitialPosition.left + 'px';

    // Disable drop button during animation
    dropButton.disabled = true;

    // Initial velocity and acceleration
    let velocity = 0;
    const acceleration = 0.2; // Adjust acceleration as needed

    // Simulate chip falling through pegs
    const fallInterval = setInterval(() => {
      // Update chip position based on velocity
      chip.style.bottom = `${parseInt(chip.style.bottom) - velocity}px`;

      // Increase velocity (simulate gravity)
      velocity += acceleration;

      // Check if chip hits pegs or container bounds
      const chipRect = chip.getBoundingClientRect();
      const hitPeg = Array.from(pegs).some(peg => isColliding(chipRect, peg.getBoundingClientRect()));
      const hitContainerBottom = chipRect.bottom >= containerRect.bottom;

      if (hitPeg || hitContainerBottom) {
        clearInterval(fallInterval);
        dropButton.disabled = false;

        // If chip hits pegs, determine outcome
        if (hitPeg) {
          determineOutcome();
        }
      }
    }, 30); // Adjust interval as needed
  }

  function determineOutcome() {
    // Randomly determine outcome and update cash in localStorage
    const outcomes = ['You win red!', 'You win orange!', 'You win green!'];
    const randomIndex = Math.floor(Math.random() * outcomes.length);
    resultMessage.textContent = outcomes[randomIndex];

    // Update cash in localStorage
    let cash = parseInt(localStorage.getItem('cash')) || 0;
    if (randomIndex === 0) {
      cash += 10; // Red win adds 10 to cash
    } else if (randomIndex === 1) {
      cash += 5; // Orange win adds 5 to cash
    } else {
      cash += 2; // Green win adds 2 to cash
    }
    localStorage.setItem('cash', cash.toString());
  }

  function isColliding(rect1, rect2) {
    return !(
      rect1.top > rect2.bottom ||
      rect1.right < rect2.left ||
      rect1.bottom < rect2.top ||
      rect1.left > rect2.right
    );
  }
});
