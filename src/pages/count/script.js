const TEXT_HELLOMEG = "ハロめぐー！";

/**
 * 10秒間ハロめぐを連打した回数を計測する
 */
const startHellomegCount = (hellomegImgElement) => {
  let score = 0;

  // onclick を上書きしてクリック時に score 加算処理を設定
  hellomegImgElement.onclick = () => {
    score++;
    document.getElementById("score").innerText = `${score} ハロめぐー！`;
    hellomeg(hellomegImgElement);
  }

  // スタート時のクリックもカウントする
  hellomegImgElement.click(hellomegImgElement)

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
      hellomegImgElement.onclick = () => {};
      document.getElementById("description").style.display = "none";
      document.getElementById("result").style.display = "block";
      document.getElementById("post").href = `https://twitter.com/intent/tweet?text=%23%E3%83%8F%E3%83%AD%E3%82%81%E3%81%90%E3%82%AB%E3%82%A6%E3%83%B3%E3%83%88%0D%0A%E3%83%8F%E3%83%AD%E3%82%81%E3%81%90%E3%82%92%E9%80%A3%E6%89%93%E3%81%97%E3%81%A6%E3%82%B9%E3%82%AF%E3%82%B9%E3%83%86%E7%AD%8B%E3%82%92%E9%8D%9B%E3%81%88%E3%82%88%E3%81%86%E3%80%82%E7%A7%81%E3%81%AE10%E7%A7%92%E9%96%93%E3%81%AE%E9%80%A3%E6%89%93%E7%B5%90%E6%9E%9C%E3%81%AF%E2%80%A6%0D%0A%0D%0A${score}+%E3%83%8F%E3%83%AD%E3%82%81%E3%81%90%E3%83%BC%EF%BC%81%0D%0A&url=https://kiaiiretekonchiku.show/count.html`;
      
      // timerElement の反映を待つために非同期実行する
      setTimeout(() => {
        alert(`${score} ハロめぐー！`);
      }, 100);
    }
  }, 100);
}

/**
 * ロゴからハロめぐー！をランダムな方向に射出する
 */
const hellomeg = (e) => {
  // ロゴを揺らす
  e.classList.add("shake-img");
  setTimeout(() => {
    e.classList.remove("shake-img");
  }, 300);

  const hellomegElement = document.createElement("div");
  hellomegElement.textContent = TEXT_HELLOMEG;
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
