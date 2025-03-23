const SHAKE_THRESHOLD = 30;
const SHAKE_INTERVAL = 200;
let lastShakeTime = new Date().getTime();
let shakeCount = 0
let scoreElement, hellomegElement;

function startGame() {
  hellomegElement = document.getElementById("logo");
  scoreElement = document.getElementById("score");

  hellomegElement.onclick = () => {};
  document.body.classList.add("overflow-hidden");
  window.addEventListener('devicemotion', handleMotion);

  // 10秒間、0.1秒ごとに timerElement および progressElement を更新する
  let timeRemaining = 100;
  const timerElement = document.getElementById("timer");
  const progressElement = document.getElementById("timeprogress");
  const interval = setInterval(() => {
    timeRemaining--;
    progressElement.value = timeRemaining;
    timerElement.innerText = `あと ${Math.floor(timeRemaining / 10)}.${Math.floor(timeRemaining % 10)} 秒`;

    if (timeRemaining === 0) {
      clearInterval(interval);
      window.removeEventListener('devicemotion', handleMotion);
      document.body.classList.remove("overflow-hidden");
      document.getElementById("description").style.display = "none";
      document.getElementById("result").style.display = "block";
      // document.getElementById("post").href = `https://twitter.com/intent/tweet?text=%23%E3%83%8F%E3%83%AD%E3%82%81%E3%81%90%E3%82%AB%E3%82%A6%E3%83%B3%E3%83%88%0D%0A%E3%83%8F%E3%83%AD%E3%82%81%E3%81%90%E3%82%92%E9%80%A3%E6%89%93%E3%81%97%E3%81%A6%E3%82%B9%E3%82%AF%E3%82%B9%E3%83%86%E7%AD%8B%E3%82%92%E9%8D%9B%E3%81%88%E3%82%88%E3%81%86%E3%80%82%E7%A7%81%E3%81%AE10%E7%A7%92%E9%96%93%E3%81%AE%E9%80%A3%E6%89%93%E7%B5%90%E6%9E%9C%E3%81%AF%E2%80%A6%0D%0A%0D%0A${score}+%E3%83%8F%E3%83%AD%E3%82%81%E3%81%90%E3%83%BC%EF%BC%81%0D%0A&url=https://kiaiiretekonchiku.show/count/`;
      
      // timerElement の反映を待つために非同期実行する
      setTimeout(() => {
        alert(`${shakeCount} ハロめぐー！`);
      }, 100);
    }
  }, 100);
}

function handleMotion(event) {
  const acc = event.accelerationIncludingGravity;
  const currentTime = new Date().getTime();

  // 加速度の合計を計算（振りの強さを判定）
  const shakeMagnitude = Math.sqrt(acc.x**2 + acc.y**2 + acc.z**2);

  if (shakeMagnitude > SHAKE_THRESHOLD && (currentTime - lastShakeTime) > SHAKE_INTERVAL) {
    shakeCount++;
    scoreElement.innerText = `${shakeCount} ハロめぐー！`;
    hellomeg(hellomegElement);
    lastShakeTime = currentTime;
  }
}

/**
 * ロゴからハロめぐー！をランダムな方向に射出する
 */
const hellomeg = (e) => {
  // ロゴを揺らす
  e.classList.add("shake");
  setTimeout(() => {
    e.classList.remove("shake");
  }, 300);

  const hellomegElement = document.createElement("div");
  hellomegElement.textContent = "ハロめぐー！";
  hellomegElement.classList.add("hellomeg");

  // container の中心から外側に向かってランダムに飛び出す
  const randomAngle = Math.random() * 2 * Math.PI;
  const translateX = Math.cos(randomAngle) * 180;
  const translateY = Math.sin(randomAngle) * 180;
  hellomegElement.style.setProperty("--translateX", translateX + "px");
  hellomegElement.style.setProperty("--translateY", translateY + "px");
  hellomegElement.style.setProperty("--startX", Math.cos(randomAngle) * 20 + "%");
  hellomegElement.style.setProperty("--startY", Math.sin(randomAngle) * 20 + "%");

  const container = document.querySelector(".c-container");
  container.appendChild(hellomegElement);

  // animation 完了後に要素を削除する
  setTimeout(() => {
    hellomegElement.remove();
  }, 2000);
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

// ページ読み込み時にイベント有無・権限をチェック
document.addEventListener('DOMContentLoaded', function() {
  // 非対応
  if (!('DeviceMotionEvent' in window)) {
    document.getElementById("unPlayable").style.display = null;
    document.getElementById("logo").onclick = () => {};
    return
  }

  // iOSの場合、権限要求処理を設定
  if (typeof DeviceMotionEvent.requestPermission === 'function') {
    document.getElementById("playable").style.display = null;
    document.getElementById("logo").onclick = requestMotionPermission;
    return
  }

  // Androidの場合、ゲーム開始処理を設定
  document.getElementById("playable").style.display = null;
  document.getElementById("logo").onclick = startGame;
});
