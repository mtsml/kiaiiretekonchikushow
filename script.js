const TEXT_HELLO_MEG = "ハロめぐー！";


const helloMeg = (e) => {
  // 画像を揺らす
  e.classList.add("shake-img");
  setTimeout(() => {
    e.classList.remove("shake-img");
  }, 500);

  const helloMegElement = document.createElement("div");
  helloMegElement.textContent = TEXT_HELLO_MEG;
  helloMegElement.classList.add("hello-megu");

  // container の中心から外側に向かってランダムに飛び出す
  const randomAngle = Math.random() * 2 * Math.PI;
  const translateX = Math.cos(randomAngle) * 180;
  const translateY = Math.sin(randomAngle) * 180;
  helloMegElement.style.setProperty("--translateX", translateX + "px");
  helloMegElement.style.setProperty("--translateY", translateY + "px");
  helloMegElement.style.setProperty("--startX", Math.cos(randomAngle) * 20 + "%");
  helloMegElement.style.setProperty("--startY", Math.sin(randomAngle) * 20 + "%");

  const container = document.querySelector(".container");
  container.appendChild(helloMegElement);

  // animation 完了後に要素を削除する
  setTimeout(() => {
    helloMegElement.remove();
  }, 2000);
}