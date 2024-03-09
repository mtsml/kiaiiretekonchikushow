const TEXT_HELLOMEG = "ハロめぐー！";
// https://lovelive-anime.jp/special/live/live_detail.php?p=unitlive2024
const UNITLIVE_ARTISTS = [
  { name: "CYaRon！", tweetUrl: "%EF%BC%BF%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%EF%BC%BF%0D%0A%EF%BC%9E%E3%80%80CYaRon%EF%BC%81%E3%80%80%EF%BC%9C%0D%0A%EF%BF%A3Y%5EY%5EY%5EY%5EY%EF%BF%A3%0D%0A" },
  { name: "AZALEA", tweetUrl: "%EF%BC%BF%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%EF%BC%BF%0D%0A%EF%BC%9E%E3%80%80AZALEA%E3%80%80%EF%BC%9C%0D%0A%EF%BF%A3Y%5EY%5EY%5EY%EF%BF%A3%0D%0A" },
  { name: "Guilty Kiss", tweetUrl: "%EF%BC%BF%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%EF%BC%BF%0D%0A%EF%BC%9E%E3%80%80Guilty+Kiss%E3%80%80%EF%BC%9C%0D%0A%EF%BF%A3Y%5EY%5EY%5EY%5EY%5EY%5EY%EF%BF%A3%0D%0A" },
  { name: "わいわいわい", tweetUrl: "%EF%BC%BF%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%EF%BC%BF%0D%0A%EF%BC%9E%E3%80%80%E3%82%8F%E3%81%84%E3%82%8F%E3%81%84%E3%82%8F%E3%81%84%E3%80%80%EF%BC%9C%0D%0A%EF%BF%A3Y%5EY%5EY%5EY%5EY%5EY%5EY%EF%BF%A3%0D%0A" },
  { name: "Saint Snow", tweetUrl: "%EF%BC%BF%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%EF%BC%BF%0D%0A%EF%BC%9E%E3%80%80Saint+Snow%E3%80%80%EF%BC%9C%0D%0A%EF%BF%A3Y%5EY%5EY%5EY%5EY%5EY%EF%BF%A3%0D%0A" },
  { name: "A・ZU・NA", tweetUrl: "%EF%BC%BF%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%EF%BC%BF%0D%0A%EF%BC%9E%E3%80%80A%E3%83%BBZU%E3%83%BBNA%E3%80%80%EF%BC%9C%0D%0A%EF%BF%A3Y%5EY%5EY%5EY%5EY%5EY%EF%BF%A3%0D%0A" },
  { name: "QU4RTZ", tweetUrl: "%EF%BC%BF%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%EF%BC%BF%0D%0A%EF%BC%9E%E3%80%80QU4RTZ%E3%80%80%EF%BC%9C%0D%0A%EF%BF%A3Y%5EY%5EY%5EY%EF%BF%A3%0D%0A" },
  { name: "DiverDiva", tweetUrl: "%EF%BC%BF%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%EF%BC%BF%0D%0A%EF%BC%9E%E3%80%80DiverDiva%E3%80%80%EF%BC%9C%0D%0A%EF%BF%A3Y%5EY%5EY%5EY%5EY%5EY%EF%BF%A3%0D%0A" },
  { name: "R3BIRTH", tweetUrl: "%EF%BC%BF%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%EF%BC%BF%0D%0A%EF%BC%9E%E3%80%80R3BIRTH%E3%80%80%EF%BC%9C%0D%0A%EF%BF%A3Y%5EY%5EY%5EY%5EY%EF%BF%A3%0D%0A" },
  { name: "CatChu!", tweetUrl: "%EF%BC%BF%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%EF%BC%BF%0D%0A%EF%BC%9E%E3%80%80CatChu%21%E3%80%80%EF%BC%9C%0D%0A%EF%BF%A3Y%5EY%5EY%5EY%5EY%EF%BF%A3%0D%0A" },
  { name: "KALEIDOSCORE", tweetUrl: "%EF%BC%BF%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%EF%BC%BF%0D%0A%EF%BC%9E%E3%80%80KALEIDOSCORE%E3%80%80%EF%BC%9C%0D%0A%EF%BF%A3Y%5EY%5EY%5EY%5EY%5EY%5EY%EF%BF%A3%0D%0A" },
  { name: "5yncri5e!", tweetUrl: "%EF%BC%BF%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%EF%BC%BF%0D%0A%EF%BC%9E%E3%80%805yncri5e%21%E3%80%80%EF%BC%9C%0D%0A%EF%BF%A3Y%5EY%5EY%5EY%5EY%5EY%EF%BF%A3%0D%0A" },
  { name: "Sunny Passion", tweetUrl: "%EF%BC%BF%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%EF%BC%BF%0D%0A%EF%BC%9E%E3%80%80Sunny+Passion%E3%80%80%EF%BC%9C%0D%0A%EF%BF%A3Y%5EY%5EY%5EY%5EY%5EY%5EY%5EY%EF%BF%A3%0D%0A" },
  { name: "スリーズブーケ", tweetUrl: "%EF%BC%BF%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%EF%BC%BF%0D%0A%EF%BC%9E%E3%80%80%E3%82%B9%E3%83%AA%E3%83%BC%E3%82%BA%E3%83%96%E3%83%BC%E3%82%B1%E3%80%80%EF%BC%9C%0D%0A%EF%BF%A3Y%5EY%5EY%5EY%5EY%5EY%5EY%5EY%EF%BF%A3%0D%0A" },
  { name: "DOLLCHESTRA", tweetUrl: "%EF%BC%BF%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%EF%BC%BF%0D%0A%EF%BC%9E%E3%80%80DOLLCHESTRA%E3%80%80%EF%BC%9C%0D%0A%EF%BF%A3Y%5EY%5EY%5EY%5EY%5EY%5EY%EF%BF%A3%0D%0A" },
  { name: "みらくらぱーく！", tweetUrl: "%EF%BC%BF%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%EF%BC%BF%0D%0A%EF%BC%9E%E3%80%80%E3%81%BF%E3%82%89%E3%81%8F%E3%82%89%E3%81%B1%E3%83%BC%E3%81%8F%EF%BC%81%E3%80%80%EF%BC%9C%0D%0A%EF%BF%A3Y%5EY%5EY%5EY%5EY%5EY%5EY%5EY%5EY%EF%BF%A3%0D%0A" },
  { name: "藤井康生", tweetUrl: "%EF%BC%BF%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%EF%BC%BF%0D%0A%EF%BC%9E%E3%80%80%E8%97%A4%E4%BA%95%E5%BA%B7%E7%94%9F%E3%80%80%EF%BC%9C%0D%0A%EF%BF%A3Y%5EY%5EY%5EY%5EY%EF%BF%A3%0D%0A" },
  { name: "矢野妃菜喜", tweetUrl: "%EF%BC%BF%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%EF%BC%BF%0D%0A%EF%BC%9E%E3%80%80%E7%9F%A2%E9%87%8E%E5%A6%83%E8%8F%9C%E5%96%9C%E3%80%80%EF%BC%9C%0D%0A%EF%BF%A3Y%5EY%5EY%5EY%5EY%5EY%EF%BF%A3%0D%0A" },
];


const helloMeg = (e) => {
  // 画像を揺らす
  e.classList.add("shake-img");
  setTimeout(() => {
    e.classList.remove("shake-img");
  }, 300);

  const helloMegElement = document.createElement("div");
  const index = Math.floor(Math.random() * UNITLIVE_ARTISTS.length);
  helloMegElement.textContent = UNITLIVE_ARTISTS[index].name;
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


const addIntentTweetUrl = (e) => {
    const index = Math.floor(Math.random() * UNITLIVE_ARTISTS.length);
    const tweetUrl = UNITLIVE_ARTISTS[index].tweetUrl;
    e.href = `https://twitter.com/intent/tweet?text=${tweetUrl}&url=https://kiaiiretekonchiku.show/`;
}