const character = document.getElementById('character');
let characterPosition = 50; // Initial position in percentage

// Ensure the startButton is properly selected from the DOM
const startButton = document.getElementById('start-button');

// Ensure obstacles are appended to the game-container instead of the body
const gameContainer = document.getElementById('game-container');

// Listen to device orientation
window.addEventListener('deviceorientation', (event) => {
  const tilt = event.gamma; // Left-right tilt

  if (tilt) {
    characterPosition += tilt * 0.1; // Adjust sensitivity
    characterPosition = Math.max(0, Math.min(100, characterPosition)); // Keep within bounds
    character.style.left = `${characterPosition}%`;
  }
});

// Add scrolling logic
let scrollPosition = 0; // Initial scroll position
let gameStarted = false;

function scrollGame() {
  if (!gameStarted) return; // Stop if the game hasn't started

  scrollPosition += 2; // Adjust scroll speed
  document.body.style.backgroundPositionY = `${scrollPosition}px`;

  // Check for collisions (placeholder logic)
  checkCollisions();
}

function checkCollisions() {
  const obstacles = document.querySelectorAll('.obstacle');
  const characterRect = character.getBoundingClientRect();

  obstacles.forEach(obstacle => {
    const obstacleRect = obstacle.getBoundingClientRect();

    // Check for collision
    if (
      characterRect.left < obstacleRect.right &&
      characterRect.right > obstacleRect.left &&
      characterRect.top < obstacleRect.bottom &&
      characterRect.bottom > obstacleRect.top
    ) {
      // Collision detected
      console.log('Collision detected!');
      gameStarted = false; // Stop the game
      alert('Game Over!'); // Notify the player
    }
  });
}

// Update spawnObstacles to include obstacle movement
function spawnObstacles() {
  if (!gameStarted) return; // Stop if the game hasn't started

  const obstacle = document.createElement('div');
  obstacle.className = 'obstacle';
  obstacle.style.top = '0px';
  obstacle.style.left = `${Math.random() * 90}%`; // Random horizontal position
  gameContainer.appendChild(obstacle); // Append to game-container

  // Move obstacle downwards
  const obstacleInterval = setInterval(() => {
    const currentTop = parseInt(obstacle.style.top, 10);
    if (currentTop > gameContainer.offsetHeight) { // Use game-container height
      obstacle.remove();
      clearInterval(obstacleInterval);
    } else {
      obstacle.style.top = `${currentTop + 5}px`; // Adjust speed
    }
  }, 50);
}

// Update start button logic
startButton.addEventListener('click', () => {
  startButton.style.display = 'none'; // Hide the button
  gameStarted = true; // Set gameStarted to true

  // Start the game loop
  setInterval(scrollGame, 50);
  setInterval(spawnObstacles, 2000); // Spawn obstacles every 2 seconds
});