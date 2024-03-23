const TEXT_HELLOMEG = "ハロめぐー！";
const HELLOMEG_URL_PARAM = '%EF%BC%BF%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%EF%BC%BF%0A%EF%BC%9E%E3%80%80%E3%83%8F%E3%83%AD%E3%82%81%E3%81%90%E3%83%BC%EF%BC%81%E3%80%80%EF%BC%9C%0A%EF%BF%A3Y%5EY%5EY%5EY%5EY%5EY%5EY%EF%BF%A3%0A';
const BIG_HELLOMEG_URL_PARAM = '%E2%A0%80%E2%80%83%E2%96%A0%0A%E2%80%83%E2%96%A0%E2%80%83%E2%80%83%E2%80%83%E2%96%A0%0A%E2%80%83%E2%96%A0%E2%80%83%E2%80%83%E2%80%83%E2%96%A0%0A%E2%96%A0%E2%80%83%E2%80%83%E2%80%83%E2%80%83%E2%80%83%E2%96%A0%0A%E2%96%A0%E2%80%83%E2%80%83%E2%80%83%E2%80%83%E2%80%83%E2%80%83%E2%96%A0%0A%0A%E3%80%80%E2%96%A0%E2%96%A0%E2%96%A0%E2%96%A0%E2%96%A0%E2%96%A0%0A%E3%80%80%E2%96%A0%E3%80%80%E3%80%80%E3%80%80%20%20%E2%96%A0%0A%E3%80%80%E2%96%A0%E3%80%80%E3%80%80%E3%80%80%20%20%E2%96%A0%0A%E3%80%80%E2%96%A0%E2%96%A0%E2%96%A0%E2%96%A0%E2%96%A0%E2%96%A0%0A%0A%E2%80%83%E2%80%83%E2%80%83%E2%80%83%E2%80%83%E2%96%A0%0A%E2%80%83%E2%96%A0%E2%80%83%E2%80%83%E2%80%83%E2%96%A0%0A%E2%80%83%E2%96%A0%E2%96%A0%E2%96%A0%E2%80%83%E2%96%A0%E2%96%A0%E2%96%A0%0A%E2%80%83%E2%96%A0%E2%96%A0%E2%80%83%E2%80%83%E2%96%A0%E2%80%83%E2%96%A0%E2%96%A0%0A%E2%96%A0%E2%80%83%E2%96%A0%E2%80%83%E2%96%A0%E2%80%83%E2%80%83%E2%80%83%E2%96%A0%0A%E2%96%A0%E2%80%83%E2%80%83%E2%96%A0%E2%80%83%E2%80%83%E2%80%83%E2%96%A0%0A%E3%80%80%E2%96%A0%E2%96%A0%E2%80%83%E2%80%83%E2%80%83%E2%96%A0%0A%0A%E2%80%83%E2%80%83%E2%80%83%E2%80%83%E2%96%A0%0A%E2%80%83%E2%80%83%E2%96%A0%E2%96%A0%0A%E2%80%83%E2%96%A0%E2%96%A0%E2%80%83%E2%80%83%E2%96%A0%E2%80%83%E2%96%A0%0A%E2%96%A0%E2%80%83%E2%80%83%E2%80%83%E2%80%83%E2%80%83%E2%96%A0%0A%E2%96%A0%E2%96%A0%0A%E2%80%83%E2%80%83%E2%96%A0%E2%96%A0%0A%E2%80%83%E2%80%83%E2%80%83%E2%96%A0%E2%96%A0%0A';

const hellomeg = (e) => {
  // 画像を揺らす
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

  const container = document.querySelector(".container");
  container.appendChild(hellomegElement);

  // animation 完了後に要素を削除する
  setTimeout(() => {
    hellomegElement.remove();
  }, 2000);
}

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

  // 10秒間、0.1秒ごとに timerElement を更新する
  let timeRemaining = 100;
  const timerElement = document.getElementById("timer");
  const interval = setInterval(() => {
    timeRemaining--;
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

const setHellomegTweetLink = (e) => {
  // URL作成
  const url = createUrl();
  // URL差し替え
  e.href = url;
}

const createUrl = () => {
  // 0~99の整数をランダム生成
  const randomNum = Math.floor(Math.random() * 100);

  // 30%の確率でクソデカハロめぐツイート作成
  if (randomNum < 30) {
    return "https://twitter.com/intent/tweet?text="+BIG_HELLOMEG_URL_PARAM+"&url=https://kiaiiretekonchiku.show/";
  } else {
    return "https://twitter.com/intent/tweet?text="+HELLOMEG_URL_PARAM+"&url=https://kiaiiretekonchiku.show/";
  }
}

const SKILLS = [
  "FM花帆",
  "ゆのくに花帆",
  "ST花帆",

  "ドルビさやか",
  "ゆのくにさやか",
  "シャボンさやか",

  "LttF瑠璃乃",
  "ミルク瑠璃乃",
  "ツバサ瑠璃乃",

  "DN梢",
  "桃節銘記",
  "らきとれ",

  "ツバサ綴理",
  "DN綴理",
  "DB綴理",

  "ハピめぐ",
  "ツバサ",
  "おくりもの",
];

const drawCards = (hellomegImgElement) => {
  hellomegImgElement.onclick = () => {};
  document.getElementById("description").style.display = "none";

  const resultElement = document.getElementById("result");
  resultElement.style.display = "block";

  const skillsElement = resultElement.querySelector(".skills");

  // SKILLS からランダムに5枚引く
  // パフォーマンスは考慮しない
  const skills = SKILLS
                  .map(SKILL => ({ SKILL, sort: Math.random() }))
                  .sort((a, b) => a.sort - b.sort)
                  .map(({ SKILL }) => SKILL)
                  .slice(0, 5)
                  .forEach(skill => {
                    const skillWrapperElement = document.createElement("li");
                    const imgElement = document.createElement("img");
                    imgElement.src = "./assets/logo-512x512.png";
                    imgElement.alt = skill;
                    imgElement.classList.add("skill");
                    skillWrapperElement.appendChild(imgElement);
                    skillsElement.appendChild(skillWrapperElement);
                  });
}

const share = async () => {
  const response = await fetch("./assets/logo-512x512.png");
  const blob = await response.blob();
  await navigator.share({
    files: [new File([blob], "image.png", {
      type: "image/png",
    })]
  });
}