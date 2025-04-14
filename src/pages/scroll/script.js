let scrollPosition = 0;
let characterPosition = 50; // precentage
let gameStarted = false;

function checkCollisions(character) {
  const characterRect = character.getBoundingClientRect();
    
  const obstacles = document.querySelectorAll('.obstacle');
  obstacles.forEach(obstacle => {
    const obstacleRect = obstacle.getBoundingClientRect();

    // Check for collision
    if (
      obstacle.style.display !== 'none' &&
      characterRect.left < obstacleRect.right &&
      characterRect.right > obstacleRect.left &&
      characterRect.top < obstacleRect.bottom &&
      characterRect.bottom > obstacleRect.top
    ) {
      // hide obstacle
      obstacle.style.display = 'none';

      // Create a speech bubble
      const speechBubble = document.createElement('div');
      speechBubble.className = 'speech-bubble';
      speechBubble.textContent = 'ぼけめぐ';
      document.body.appendChild(speechBubble);

      // Position the speech bubble near the character
      const bubbleX = characterRect.left + characterRect.width / 2;
      const bubbleY = characterRect.top - 20; // Above the character
      speechBubble.style.left = `${bubbleX}px`;
      speechBubble.style.top = `${bubbleY}px`;

      // Remove the speech bubble after animation
      setTimeout(() => {
        speechBubble.remove();
      }, 2000);
    }
  });
}

// Update spawnObstacles to include obstacle movement
function spawnObstacles(container) {
  if (!gameStarted) return; // Stop if the game hasn't started

  const obstacle = document.createElement('div');
  obstacle.className = 'obstacle';
  obstacle.style.top = '0px';
  obstacle.style.left = `${Math.random() * 90}%`;
  container.appendChild(obstacle);

  // Move obstacle downwards
  const obstacleInterval = setInterval(() => {
    const currentTop = parseInt(obstacle.style.top, 10);
    if (currentTop > container.offsetHeight) {
      obstacle.remove();
      clearInterval(obstacleInterval);
    } else {
      obstacle.style.top = `${currentTop + 5}px`;
    }
  }, 50);
}

// 権限を要求する関数
function requestMotionPermission() {
  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    DeviceMotionEvent.requestPermission().then(permission => {
      if (permission === 'granted') {
        startGame()
      } else {
        alert('加速度センサー使用の許可が必要めぐ。');
      }
    });
  }
}

const startGame = () => {
  const target = document.getElementById("logo");
  target.onclick = null;
  target.classList.add("character")
  gameStarted = true;

  window.addEventListener('deviceorientation', (event) => {
    const tilt = event.gamma;
    if (tilt) {
      characterPosition += tilt * 0.1;
      characterPosition = Math.max(0, Math.min(100, characterPosition));
      target.style.left = `${characterPosition}%`;
    }
  });

  const container = document.getElementById("container");
  container.classList.add("started")

  const description = document.getElementById("description");
  description.style.display = "none";

  setInterval(() => checkCollisions(target), 50);
  setInterval(() => spawnObstacles(container), 2000);
}

// ページ読み込み時にイベント有無・権限をチェック
document.addEventListener('DOMContentLoaded', function() {
  // 非対応
  if (!('DeviceMotionEvent' in window)) {
    // document.getElementById("unPlayable").style.display = null;
    document.getElementById("logo").onclick = () => {};
    return
  }

  // iOSの場合、権限要求処理を設定
  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    document.getElementById("logo").onclick = requestMotionPermission;
    return
  }

  // Androidの場合、ゲーム開始処理を設定
  document.getElementById("logo").onclick = startGame;
});
