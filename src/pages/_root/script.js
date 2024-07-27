const KIAIIRETEKONCHIKUSHOW_URL = "https://kiaiiretekonchiku.show/";
const TWEET_INTENT_URL = "https://twitter.com/intent/tweet";
const HELLOMEG_TWEET_URL_PARAM = '%EF%BC%BF%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%EF%BC%BF%0A%EF%BC%9E%E3%80%80%E3%83%8F%E3%83%AD%E3%82%81%E3%81%90%E3%83%BC%EF%BC%81%E3%80%80%EF%BC%9C%0A%EF%BF%A3Y%5EY%5EY%5EY%5EY%5EY%5EY%EF%BF%A3%0A';
const HELLOMEG_TWEET_URL_PARAM_BIG = '%E2%A0%80%E2%80%83%E2%96%A0%0A%E2%80%83%E2%96%A0%E2%80%83%E2%80%83%E2%80%83%E2%96%A0%0A%E2%80%83%E2%96%A0%E2%80%83%E2%80%83%E2%80%83%E2%96%A0%0A%E2%96%A0%E2%80%83%E2%80%83%E2%80%83%E2%80%83%E2%80%83%E2%96%A0%0A%E2%96%A0%E2%80%83%E2%80%83%E2%80%83%E2%80%83%E2%80%83%E2%80%83%E2%96%A0%0A%0A%E3%80%80%E2%96%A0%E2%96%A0%E2%96%A0%E2%96%A0%E2%96%A0%E2%96%A0%0A%E3%80%80%E2%96%A0%E3%80%80%E3%80%80%E3%80%80%20%20%E2%96%A0%0A%E3%80%80%E2%96%A0%E3%80%80%E3%80%80%E3%80%80%20%20%E2%96%A0%0A%E3%80%80%E2%96%A0%E2%96%A0%E2%96%A0%E2%96%A0%E2%96%A0%E2%96%A0%0A%0A%E2%80%83%E2%80%83%E2%80%83%E2%80%83%E2%80%83%E2%96%A0%0A%E2%80%83%E2%96%A0%E2%80%83%E2%80%83%E2%80%83%E2%96%A0%0A%E2%80%83%E2%96%A0%E2%96%A0%E2%96%A0%E2%80%83%E2%96%A0%E2%96%A0%E2%96%A0%0A%E2%80%83%E2%96%A0%E2%96%A0%E2%80%83%E2%80%83%E2%96%A0%E2%80%83%E2%96%A0%E2%96%A0%0A%E2%96%A0%E2%80%83%E2%96%A0%E2%80%83%E2%96%A0%E2%80%83%E2%80%83%E2%80%83%E2%96%A0%0A%E2%96%A0%E2%80%83%E2%80%83%E2%96%A0%E2%80%83%E2%80%83%E2%80%83%E2%96%A0%0A%E3%80%80%E2%96%A0%E2%96%A0%E2%80%83%E2%80%83%E2%80%83%E2%96%A0%0A%0A%E2%80%83%E2%80%83%E2%80%83%E2%80%83%E2%96%A0%0A%E2%80%83%E2%80%83%E2%96%A0%E2%96%A0%0A%E2%80%83%E2%96%A0%E2%96%A0%E2%80%83%E2%80%83%E2%96%A0%E2%80%83%E2%96%A0%0A%E2%96%A0%E2%80%83%E2%80%83%E2%80%83%E2%80%83%E2%80%83%E2%96%A0%0A%E2%96%A0%E2%96%A0%0A%E2%80%83%E2%80%83%E2%96%A0%E2%96%A0%0A%E2%80%83%E2%80%83%E2%80%83%E2%96%A0%E2%96%A0%0A';

/**
 * ハロめぐツイートURLをセットする
 * 
 * onclick -> href の順に処理されるため、ここで作成したURLでツイートされる
 */
const setHellomegTweetLink = (e) => {
  // URL作成
  const url = createUrl();
  // URL差し替え
  e.href = url;
}

/**
 * 70%の確率で吹き出しハロめぐツイートURLを、30%の確率でクソデカハロめぐツイートURLを作成する
 */
const createUrl = () => {
  // 0~99の整数をランダム生成
  const randomNum = Math.floor(Math.random() * 100);

  // 30%の確率でクソデカハロめぐツイート作成
  if (randomNum < 30) {
    return `${TWEET_INTENT_URL}?text=${HELLOMEG_TWEET_URL_PARAM_BIG}&url=${KIAIIRETEKONCHIKUSHOW_URL}`;
  } else {
    return `${TWEET_INTENT_URL}?text=${HELLOMEG_TWEET_URL_PARAM}&url=${KIAIIRETEKONCHIKUSHOW_URL}`;
  }
}

const TEXT_HELLOMEG = "ハロめぐー！";

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
