const TEXT_HELLO_MEG = "ハロめぐー！";
// https://lovelive-anime.jp/special/live/live_detail.php?p=unitlive2024
const UNITLIVE_ARTISTS = [
  "CYaRon！",
  "AZALEA",
  "Guilty Kiss",
  "わいわいわい",
  "Saint Snow",
  "A・ZU・NA",
  "QU4RTZ",
  "DiverDiva",
  "R3BIRTH",
  "CatChu!",
  "KALEIDOSCORE",
  "5yncri5e!",
  "Sunny Passion",
  "スリーズブーケ",
  "DOLLCHESTRA",
  "みらくらぱーく！",
  "藤井康生",
  "矢野妃菜喜",
]


const helloMeg = (e) => {
  // 画像を揺らす
  e.classList.add("shake-img");
  setTimeout(() => {
    e.classList.remove("shake-img");
  }, 300);

  const helloMegElement = document.createElement("div");
  helloMegElement.textContent = UNITLIVE_ARTISTS[Math.floor(Math.random() * UNITLIVE_ARTISTS.length)];
  helloMegElement.classList.add("hello-meg");

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