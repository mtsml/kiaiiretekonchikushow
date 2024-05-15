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

  const container = document.querySelector(".container");
  container.appendChild(hellomegElement);

  // animation 完了後に要素を削除する
  setTimeout(() => {
    hellomegElement.remove();
  }, 2000);
}

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

// スクステにおける2024年3月時点の汎用編成
const HELLOMEG_DRAW_SKILLS = [
  // kaho
  {
    name: "FM花帆",
    src: "./assets/kaho_fm.jpg"
  },
  {
    name: "ST花帆",
    src: "./assets/kaho_st.jpg"
  },
  {
    name: "ゆのくに花帆",
    src: "./assets/kaho_yunokuni.jpg"
  },
  // saya
  {
    name: "ドルビさやか",
    src: "./assets/saya_dorubi.jpg"
  },
  {
    name: "シャボンさやか",
    src: "./assets/saya_syabon.jpg"
  },
  {
    name: "ゆのくにさやか",
    src: "./assets/saya_yunokuni.jpg"
  },
  // ruri
  {
    name: "LttF瑠璃乃",
    src: "./assets/ruri_lttf.jpg"
  },
  {
    name: "夏めき瑠璃乃",
    src: "./assets/ruri_natsu.jpg"
  },
  {
    name: "ツバサ瑠璃乃",
    src: "./assets/ruri_tsubasa.jpg"
  },
  // kozu
  {
    name: "ダイハツ梢",
    src: "./assets/kozu_daihatsu.jpg"
  },
  {
    name: "DN梢",
    src: "./assets/kozu_dn.jpg"
  },
  {
    name: "桃節銘記梢",
    src: "./assets/kozu_momo.jpg"
  },
  // tsuzu
  {
    name: "DB綴理",
    src: "./assets/tsuzu_db.jpg"
  },
  {
    name: "DN綴理",
    src: "./assets/tsuzu_dn.jpg"
  },
  {
    name: "ツバサ綴理",
    src: "./assets/tsuzu_tsubasa.jpg"
  },
  // megu
  {
    name: "冬めぐ",
    src: "./assets/megu_fuyu.jpg"
  },
  {
    name: "ハピめぐ",
    src: "./assets/megu_happy.jpg"
  },
  {
    name: "ツバサめぐ",
    src: "./assets/megu_tsubasa.jpg"
  },
];
const HELLOMEG_DRAW_HASHTAG = "#ハロめぐドロー";
const HELLOMEG_DRAW_TWEET = "運を手繰り寄せよう。私の結果は…";
const HELLOMEG_DRAW_URL = "https://kiaiiretekonchiku.show/draw.html";

/**
 * 処理開始から3秒後に SKILL からランダムに選んだ5つの画像を表示する
 */
const startHellomegDraw = (hellomegImgElement) => {
  hellomegImgElement.onclick = () => {};

  // SKILLS からランダムに5つの要素を抽出する
  // NOTE: 要素数が少ないのでパフォーマンスは考慮しない
  const skills = HELLOMEG_DRAW_SKILLS
                  // 2024年3月時点でエースカードとして採用率が高いFM花帆を必ず抽出する
                  .map(skill => ({ ...skill, sort: skill.name === "FM花帆" ? -1 : Math.random() }))
                  .sort((a, b) => a.sort - b.sort)
                  // 夏めき瑠璃乃を引いたときのために手札を8枚にする
                  // 夏めき瑠璃乃を引いていない場合は後続の処理で5枚に減らす
                  .slice(0, 8)
                  .map(skill => ({ name: skill.name, src: skill.src }));

  // 夏めき瑠璃乃を引いていない場合は手札を5枚に減らす
  // TODO: 8枚から減らすという方針を含めてやっつけ。もっといい感じにする
  if (!skills.some((skill, index) => skill.name === "夏めき瑠璃乃" && index < 5)) {
    skills.splice(5, 8);
  }

  // img を生成してから canvas へ描画するまで時間を要する
  // カウントダウン中に非同期で処理をおこなうため、以降の処理に先んじてここで loadImg を呼び出す
  loadImg(skills, 0, () => {
    const canvas = document.getElementById("canvas");
    drawSkillsOnCanvas(skills, canvas);
    displayShareButtonOrTweetLink(skills, canvas);
  });

  // 説明文をカウントダウン表示に切り替える
  const descriptionElement = document.getElementById("description");
  let count = 3;
  descriptionElement.textContent = count;
  descriptionElement.classList.add("zoom-in");

  const interval = setInterval(() => {
    count--;
    descriptionElement.textContent = count;

    // animation を強制的にリフローさせる
    descriptionElement.style.animation = "none";
    descriptionElement.offsetWidth;
    descriptionElement.style.animation = null;

    if (count === 0) {
      clearInterval(interval);
      descriptionElement.style.display = "none";
      document.getElementById("result").style.display = null;
    }
  }, 1000);
}

/**
 * 各 skill の src を元に img 要素を生成し、すべての skill に対して処理を終えた後に callback を呼び出す
 */
const loadImg = (skills, index, callback) => {
  if (index >= skills.length) {
    callback();
    return;
  }
  const img = new Image();
  img.onload = () => {
    skills[index].img = img;
    loadImg(skills, ++index, callback);
  }
  img.src = skills[index].src;
}

/**
 * skills を canvas に描画する
 * 
 * skills は5つまたは8つの前提で angle の初期値を設定している。
 * centerX と centerY は微調整した値なので計算式の意味を理解する必要はない。
 */
const drawSkillsOnCanvas = (skills, canvas) => {
  const ctx = canvas.getContext("2d");

  let angle = -10;

  skills.forEach((skill, index) => {
    // 5つの img が扇形に並ぶように位置を調整する
    // TODO: 8枚編成のためやっつけを修正する
    const centerX = skills.length === 8
                      ? 10 + index * 56.5 + skill.img.width / 2
                      : 10 + index * 100 + skill.img.width / 2;
    const centerY = skills.length === 8
                      ? (Math.abs(index - 3.5) * 2) ** 1.13 * 2 + skill.img.height / 2
                      : (Math.abs(index - 2) * 2) ** 1.5 * 2 + skill.img.height / 2;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle * Math.PI / 180);
    ctx.drawImage(skill.img, -skill.img.width / 2, -skill.img.height / 2);
    ctx.restore();

    // TODO: 8枚編成のためやっつけを修正する
    angle += skills.length === 8 ? 2.5 : 5;
  });
}

/**
 * diplay: none で埋め込まれている共有ボタンまたはツイートリンクを表示状態にする
 * 
 * 画像を Twitter で共有するために Web Share API を利用した共有ボタンを表示する。
 * PC など Web Share API が利用できない場合は、テキストのみを共有するためのツイートリンクへフォールバック。
 */
const displayShareButtonOrTweetLink = (skills, canvas) => {
  try {
    canvas.toBlob((blob) => {
      // Web Share API が利用できる場合は共有ボタンを、そうでない場合はツイートリンクを表示する
      if (navigator.share && navigator.canShare && navigator.canShare(getNavigatorShareParams(blob))) {
        document.getElementById("share-button").style.display = null;
      } else {
        const text = encodeURIComponent(`${HELLOMEG_DRAW_HASHTAG}\n${HELLOMEG_DRAW_TWEET}\n\n${skills.map(skill => `・${skill.name}\n`).join("")}\n`);
        document.getElementById("tweet-link").href = `${TWEET_INTENT_URL}?text=${text}&url=${HELLOMEG_DRAW_URL}`;
        document.getElementById("tweet-link").style.display = null;
      }
    });
  } catch (error) {
    // ローカル実行の場合はエラーを捕まえてツイートリンクを表示する
    if (error.message === "Failed to execute 'toBlob' on 'HTMLCanvasElement': Tainted canvases may not be exported.") {
      const text = encodeURIComponent(`${HELLOMEG_DRAW_HASHTAG}\n${HELLOMEG_DRAW_TWEET}\n\n${skills.map(skill => `・${skill.name}\n`).join("")}\n`);
      document.getElementById("tweet-link").href = `${TWEET_INTENT_URL}?text=${text}&url=${HELLOMEG_DRAW_URL}`;
      document.getElementById("tweet-link").style.display = null;
    } else {
      throw error;
    }
  }
}

/**
 * canvas の内容を画像に変換して navigator.share を呼び出す
 */
const share = () => {
  const canvas = document.getElementById("canvas");
  canvas.toBlob(async (blob) => {
    await navigator.share(getNavigatorShareParams(blob));
  });
}

/**
 * navigator.share に渡す引数を返す
 * 
 * NOTE: 2024年3月時点で以下の現象が発生している
 * - iOS: url が表示されない
 * - Android: text が表示れない
 */
const getNavigatorShareParams = (blob) => ({
  url: HELLOMEG_DRAW_URL,
  text: `${HELLOMEG_DRAW_HASHTAG}\n${HELLOMEG_DRAW_TWEET}\n${HELLOMEG_DRAW_URL}`,
  files: [new File([blob], "image.png", { type: "image/png", })],
});

const MAX_ROUND = 10;
const START_ID = "ha";
const END_ID = "gu";

/**
 * ハロめぐを MAX_ROUND 回順番にタップする時間を計測する
 */
const startHaromegu = (e) => {
  let round = 0;
  let nextId = START_ID;

  e.onclick = null;

  // haromegu をシャッフルして onclick を設定する
  shuffleHaromeguElemets();
  const handleClick = (e) => {
    if (e.target.dataset.myId !== nextId) {
      // 同時押しを防ぐための誤答ペナルティ 500ms
      const overlay = document.getElementById("overlay");
      overlay.style.display = null;
      setTimeout(() => {
        overlay.style.display = "none";
      }, 500);
      return;
    }

    nextId = e.target.dataset.nextId;
    e.target.style.opacity = 0;
    e.target.style.pointerEvents = "none";

    // 「ぐ」まで到達したら round 終了
    if (e.target.dataset.myId === END_ID) {
      round++;
      // MAX_ROUND までシャッフルを繰り返す
      if (round < MAX_ROUND) {
        shuffleHaromeguElemets();
      }
    }
  }
  const container = document.getElementById("haromegu-container");
  Array.from(container.children).forEach(haromegu => {
    haromegu.onclick = handleClick;
    // タッチデバイスの速度改善
    haromegu.addEventListener("touchstart", (e) => {
      e.preventDefault();
      handleClick(e);
    });
  });

  document.getElementById("description").style.display = "none";
  container.style.display = null;

  // 100ms 単位のタイマーを設定
  let time = 0;
  const timerElement = document.getElementById("timer");
  const interval = setInterval(() => {
    time++;
    timerElement.innerText = `${Math.floor(time / 10)}.${Math.floor(time % 10)} 秒`;

    // round が MAX_ROUND に到達してからゲームが終了するまで最大 100ms の誤差が生じるが許容する
    if (round >= MAX_ROUND) {
      clearInterval(interval);
      container.style.display = "none";
      document.getElementById("result").style.display = "block";
      document.getElementById("post").href = `https://twitter.com/intent/tweet?text=%23%E3%83%8F%E3%83%AD%E3%82%81%E3%81%90%E3%83%95%E3%82%A1%E3%82%A4%E3%82%A2%0D%0A%E3%83%8F%E3%83%AD%E3%82%81%E3%81%90%E3%82%92%E7%B4%A0%E6%97%A9%E3%81%8F%E3%81%A4%E3%81%AA%E3%81%92%E3%81%A6%E5%8F%8D%E5%B0%84%E7%A5%9E%E7%B5%8C%E3%82%92%E7%88%86%E4%B8%8A%E3%81%92%E3%81%97%E3%82%88%E3%81%86%E3%80%82%E7%A7%81%E3%81%8C10%E3%83%8F%E3%83%AD%E3%82%81%E3%81%90%E5%AE%8C%E6%88%90%E3%81%95%E3%81%9B%E3%82%8B%E3%81%AE%E3%81%AB%E3%81%8B%E3%81%8B%E3%81%A3%E3%81%9F%E6%99%82%E9%96%93%E3%81%AF%E2%80%A6%0D%0A%0D%0A${Math.floor(time / 10)}.${Math.floor(time % 10)}+%E7%A7%92%EF%BC%81%0D%0A&url=https://kiaiiretekonchiku.show/haromegu.html`;
      displayAdTweet();

      // timerElement の反映を待つために非同期実行する
      setTimeout(() => {
        alert(`${Math.floor(time / 10)}.${Math.floor(time % 10)} 秒`);
      }, 100);
    }
  }, 100);
}

/**
 * haromegu-container 内の要素をランダムに並び替えて4つの要素を表示状態にする
 * 
 * 子要素は「ハ」「ロ」「め」「ぐ」と puchihasu の5つ。
 * 「ロ」または「め」のどちらかを非表示とし、puchihasu を非表示とした要素の代わりとして表示する。
 */
const shuffleHaromeguElemets = () => {
  const container = document.getElementById("haromegu-container");

  // puchihasuTargetId 以外の要素を表示状態にする
  const puchihasuTargetId = ["ro", "me"][Math.floor(Math.random() * 2)];
  const haromegus = Array.from(container.children).map(haromegu => {
    switch (haromegu.id) {
      case puchihasuTargetId:
        // width を持たないように透過ではなく非表示状態とする
        haromegu.style.display = "none";
        break;
      case "puchihasu":
        haromegu.dataset.myId = puchihasuTargetId;
        haromegu.dataset.nextId = puchihasuTargetId === "ro" ? "me" : "gu";
      default:
        haromegu.style.opacity = 1;
        haromegu.style.pointerEvents = null;
        haromegu.style.display = null;
    }
    return haromegu;
  });

  // Fisher-Yatesシャッフル
  for (let i = haromegus.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [haromegus[i], haromegus[j]] = [haromegus[j], haromegus[i]];
  }

  container.innerHTML = "";
  haromegus.forEach(haromegu => container.appendChild(haromegu));
}

const AD_TWEET_URLS = [
  // めぐ島
  "https://twitter.com/pine_nm/status/1747617380803698977",
  "https://twitter.com/pine_nm/status/1747830758558048650",
  "https://twitter.com/pine_nm/status/1747959663205941443",
  "https://twitter.com/pine_nm/status/1748615206513885603",
  "https://twitter.com/pine_nm/status/1749040338763993449",
  "https://twitter.com/pine_nm/status/1749389715114193348",
  "https://twitter.com/pine_nm/status/1749778283259117642",
  "https://twitter.com/pine_nm/status/1752689330219565370",
  "https://twitter.com/pine_nm/status/1753606179111276588",
  "https://twitter.com/pine_nm/status/1754125334012891622",
  "https://twitter.com/pine_nm/status/1755209734070899026",
  "https://twitter.com/pine_nm/status/1757767575327641759",
  "https://twitter.com/pine_nm/status/1758056443796988148",
  "https://twitter.com/pine_nm/status/1758124375482761679",
  "https://twitter.com/pine_nm/status/1758446682440970556",
  "https://twitter.com/pine_nm/status/1758464616445907355",
  "https://twitter.com/pine_nm/status/1758486706398155014",
  "https://twitter.com/pine_nm/status/1758800845473550648",
  "https://twitter.com/pine_nm/status/1758851971896033511",
  "https://twitter.com/pine_nm/status/1759241120062841040",
  "https://twitter.com/pine_nm/status/1759399951497589060",
  "https://twitter.com/pine_nm/status/1759400457104134384",
  "https://twitter.com/pine_nm/status/1762409798094684646",
  "https://twitter.com/pine_nm/status/1762793929987273050",
  "https://twitter.com/pine_nm/status/1763196143046185438",
  "https://twitter.com/pine_nm/status/1763521820408614965",
  "https://twitter.com/pine_nm/status/1769693037322547597",
  "https://twitter.com/pine_nm/status/1769702604353962227",
  "https://twitter.com/pine_nm/status/1770127226484543612",
  "https://twitter.com/pine_nm/status/1772575567113564636",
  "https://twitter.com/pine_nm/status/1774021752445919624",
  "https://twitter.com/pine_nm/status/1774428844960993718",
  "https://twitter.com/pine_nm/status/1774769971954127196",
  "https://twitter.com/pine_nm/status/1776836347510272236",
  "https://twitter.com/pine_nm/status/1776951267711234544",
  "https://twitter.com/pine_nm/status/1778427050422157677",
  "https://twitter.com/pine_nm/status/1784147869991317722",
  "https://twitter.com/pine_nm/status/1784481225199247808",
  "https://twitter.com/pine_nm/status/1785296444586676712",
  "https://twitter.com/pine_nm/status/1785509271205249248",
  "https://twitter.com/pine_nm/status/1785886354746007888",
];

/**
 * 広告ツイートを表示する
 */
const displayAdTweet = () => {
  // 広告ツイートをランダムに取得
  const adTweetLink = document.getElementById("ad-tweet-link");
  adTweetLink.href = AD_TWEET_URLS[Math.floor(Math.random() * AD_TWEET_URLS.length)];

  // ツイート埋め込みスクリプトを読み込む
  const adTweet = document.getElementById("ad-tweet");
  const script = document.createElement("script");
  script.src = "https://platform.twitter.com/widgets.js";
  adTweet.appendChild(script);

  // ツイート埋め込み完了を監視する
  const observer = new MutationObserver(mutationsList => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList" && mutation.removedNodes.length !== 0) {
        mutation.removedNodes.forEach(node => {
          if (node.classList.contains("twitter-tweet")) {
            document.getElementById("loading").style.display = "none";
            observer.disconnect();
          }
        });
      }
    }
  });
  observer.observe(adTweet, { childList: true });
}

LINK_LIFE_TWEET_URLS = [
  // 104期
  "https://x.com/hasunosora_SIC/status/1788773456563380546",
  "https://x.com/hasunosora_SIC/status/1786229199096992220",
  "https://x.com/hasunosora_SIC/status/1783692475460162033",
  "https://x.com/hasunosora_SIC/status/1781155771360665832",
  "https://x.com/hasunosora_SIC/status/1779343825741451657",
  "https://x.com/hasunosora_SIC/status/1776082337715159126",
  // 103期
  // ~78
  "https://x.com/hasunosora_SIC/status/1773500321207144740",
  "https://x.com/hasunosora_SIC/status/1771008902580281385",
  "https://x.com/hasunosora_SIC/status/1768472194491773288",
  "https://x.com/hasunosora_SIC/status/1765935483262206462",
  "https://x.com/hasunosora_SIC/status/1763398763568345353",
  "https://x.com/hasunosora_SIC/status/1761949211233259969",
  "https://x.com/hasunosora_SIC/status/1760862050530808070",
  "https://x.com/hasunosora_SIC/status/1759774881820905839",
  // ~70
  "https://x.com/hasunosora_SIC/status/1758325329356038458",
  "https://x.com/hasunosora_SIC/status/1755788621075096004",
  "https://x.com/hasunosora_SIC/status/1753614293361176637",
  "https://x.com/hasunosora_SIC/status/1750715192957386916",
  "https://x.com/hasunosora_SIC/status/1748178477226877198",
  "https://x.com/hasunosora_SIC/status/1746004141808222453",
  "https://x.com/hasunosora_SIC/status/1743105034445832417",
  "https://x.com/hasunosora_SIC/status/1739632154814959958",
  "https://x.com/hasunosora_SIC/status/1739118775331438950",
  "https://x.com/hasunosora_SIC/status/1738393992197439946",
  // ~60
  "https://x.com/hasunosora_SIC/status/1737457829147975729",
  "https://x.com/hasunosora_SIC/status/1735494900957794600",
  "https://x.com/hasunosora_SIC/status/1732958183256461371",
  "https://x.com/hasunosora_SIC/status/1730421472420835411",
  "https://x.com/hasunosora_SIC/status/1727884744480973104",
  "https://x.com/hasunosora_SIC/status/1725348042092450114",
  "https://x.com/hasunosora_SIC/status/1722811319286657365",
  "https://x.com/hasunosora_SIC/status/1720274603451240490",
  "https://x.com/hasunosora_SIC/status/1717737886366507419",
  "https://x.com/hasunosora_SIC/status/1715201175589396481",
  // ~50
  "https://x.com/hasunosora_SIC/status/1712015184297074695",
  "https://x.com/hasunosora_SIC/status/1707591031061950846",
  "https://x.com/hasunosora_SIC/status/1705054319106818516",
  "https://x.com/hasunosora_SIC/status/1702925279793185171",
  "https://x.com/hasunosora_SIC/status/1699980884605342185",
  "https://x.com/hasunosora_SIC/status/1697081783484059937",
  "https://x.com/hasunosora_SIC/status/1694907456445665323",
  "https://x.com/hasunosora_SIC/status/1691645960982499577",
  "https://x.com/hasunosora_SIC/status/1689834022354993152",
  "https://x.com/hasunosora_SIC/status/1687297303470813184",
  // ~40
  "https://x.com/hasunosora_SIC/status/1684760595965321216",
  "https://x.com/hasunosora_SIC/status/1682223877118898177",
  "https://x.com/hasunosora_SIC/status/1679687166803181569",
  "https://x.com/hasunosora_SIC/status/1677150442936229888",
  "https://x.com/hasunosora_SIC/status/1674613728979873792",
  "https://x.com/hasunosora_SIC/status/1672077023572033537",
  "https://x.com/hasunosora_SIC/status/1669540304150749187",
  "https://x.com/hasunosora_SIC/status/1668453136519012352",
  "https://x.com/hasunosora_SIC/status/1664474418255638528",
  "https://x.com/hasunosora_SIC/status/1660616496668905474",
  // ~30
  "https://x.com/hasunosora_SIC/status/1660118213420630016",
  "https://x.com/hasunosora_SIC/status/1656856723741892608",
  "https://x.com/hasunosora_SIC/status/1655044784157872128",
  "https://x.com/hasunosora_SIC/status/1654682406849314816",
  "https://x.com/hasunosora_SIC/status/1654320016693526532",
  "https://x.com/hasunosora_SIC/status/1653957619550126082",
  "https://x.com/hasunosora_SIC/status/1653595235354591234",
  "https://x.com/hasunosora_SIC/status/1651783296307830784",
  "https://x.com/hasunosora_SIC/status/1649246584612478979",
  "https://x.com/hasunosora_SIC/status/1647140198063685633",
  // 1~20 はアプリのみ
  // 102期
  // ~10
  "https://x.com/hasunosora_SIC/status/1642648098437750784",
  "https://x.com/hasunosora_SIC/status/1641968626881425410",
  "https://x.com/hasunosora_SIC/status/1640911667721797632",
  "https://x.com/hasunosora_SIC/status/1640866363169447936",
  "https://x.com/hasunosora_SIC/status/1639431907573211136",
  "https://x.com/hasunosora_SIC/status/1636895199245860867",
  "https://x.com/hasunosora_SIC/status/1634358484488601601",
  "https://x.com/hasunosora_SIC/status/1631821767013539845",
  "https://x.com/hasunosora_SIC/status/1629285052763848710",
  "https://x.com/hasunosora_SIC/status/1626748336178081792",
]

/**
 * りんく！らいふ！らぶらいぶ！のツイートURLをセットする
 */
const setLinkLifeTweetLink = (e) => {
  // 広告ツイートをランダムに取得
  e.href = LINK_LIFE_TWEET_URLS[Math.floor(Math.random() * LINK_LIFE_TWEET_URLS.length)];
}

const SONGS = [
  // https://www.lovelive-anime.jp/hasunosora/music/01/
  {
    name: "Dream Believers",
    intentTweetParam: ""
  },
  {
    name: "On your mark",
    intentTweetParam: ""
  },
  {
    name: "水彩世界",
    intentTweetParam: ""
  },
  {
    name: "AWOKE",
    intentTweetParam: ""
  },
  {
    name: "ド！ド！ド！",
    intentTweetParam: ""
  },
  {
    name: "永遠のEuphoria",
    intentTweetParam: ""
  },
  // https://www.lovelive-anime.jp/hasunosora/music/02/
  {
    name: "Reflection in the mirror",
    intentTweetParam: ""
  },
  {
    name: "フォーチュンムービー",
    intentTweetParam: ""
  },
  {
    name: "Mix shake!!",
    intentTweetParam: ""
  },
  // https://www.lovelive-anime.jp/hasunosora/music/03/
  {
    name: "Sparkly Spot",
    intentTweetParam: ""
  },
  {
    name: "ツキマカセ",
    intentTweetParam: ""
  },
  {
    name: "希望的プリズム",
    intentTweetParam: ""
  },
  // https://www.lovelive-anime.jp/hasunosora/music/04/
  {
    name: "謳歌爛漫",
    intentTweetParam: ""
  },
  {
    name: "Holiday∞Holiday",
    intentTweetParam: ""
  },
  // https://www.lovelive-anime.jp/hasunosora/music/05/
  {
    name: "スケイプゴート",
    intentTweetParam: ""
  },
  {
    name: "Tragic Drops",
    intentTweetParam: ""
  },
  // https://www.lovelive-anime.jp/hasunosora/music/06/
  {
    name: "DEEPNESS",
    intentTweetParam: ""
  },
  {
    name: "Kawaii no susume",
    intentTweetParam: ""
  },
  {
    name: "眩耀夜行",
    intentTweetParam: ""
  },
  // https://www.lovelive-anime.jp/hasunosora/music/07/
  // 06 と重複するためコメントアウト
//   {
//     name: "DEEPNESS",
//     intentTweetParam: ""
//   },
  {
    name: "ジブンダイアリー",
    intentTweetParam: ""
  },
  {
    name: "Mirage Voyage",
    intentTweetParam: ""
  },
  // https://www.lovelive-anime.jp/hasunosora/music/08/
  {
    name: "夏めきペイン",
    intentTweetParam: ""
  },
  {
    name: "Yup! Yup! Yup!",
    intentTweetParam: ""
  },
  {
    name: "ココン東西",
    intentTweetParam: ""
  },
  {
    name: "残陽",
    intentTweetParam: ""
  },
  {
    name: "青春の輪郭",
    intentTweetParam: ""
  },
  {
    name: "ハクチューアラモード",
    intentTweetParam: ""
  },
  {
    name: "Dear my future",
    intentTweetParam: ""
  },
  {
    name: "パラレルダンサー",
    intentTweetParam: ""
  },
  {
    name: "明日の空の僕たちへ",
    intentTweetParam: ""
  },
  {
    name: "Legato",
    intentTweetParam: ""
  },
  // https://www.lovelive-anime.jp/hasunosora/music/09/
  {
    name: "素顔のピクセル",
    intentTweetParam: ""
  },
  {
    name: "シュガーメルト",
    intentTweetParam: ""
  },
  {
    name: "千変万華",
    intentTweetParam: ""
  },
  // https://www.lovelive-anime.jp/hasunosora/music/10/
  {
    name: "Take It Over",
    intentTweetParam: ""
  },
  {
    name: "飴色",
    intentTweetParam: ""
  },
  {
    name: "KNOT",
    intentTweetParam: ""
  },
  // https://www.lovelive-anime.jp/hasunosora/music/11/
  {
    name: "アイデンティティ",
    intentTweetParam: ""
  },
  {
    name: "天才なのかもしれない",
    intentTweetParam: ""
  },
  {
    name: "ノンフィクションヒーローショー",
    intentTweetParam: ""
  },
  // https://www.lovelive-anime.jp/hasunosora/music/12/
  {
    name: "Trick ＆ Cute",
    intentTweetParam: ""
  },
  {
    name: "ツバサ・ラ・リベルテ",
    intentTweetParam: ""
  },
  {
    name: "Link to the FUTURE",
    intentTweetParam: ""
  },
  // https://www.lovelive-anime.jp/hasunosora/music/13/
  {
    name: "Special Thanks",
    intentTweetParam: ""
  },
  {
    name: "青とシャボン",
    intentTweetParam: ""
  },
  {
    name: "ミルク",
    intentTweetParam: ""
  },
  // https://www.lovelive-anime.jp/hasunosora/music/14/
  {
    name: "Colorfulness",
    intentTweetParam: ""
  },
  {
    name: "ハッピー至上主義！",
    intentTweetParam: ""
  },
  {
    name: "Pleasure Feather",
    intentTweetParam: ""
  },
  // https://www.lovelive-anime.jp/hasunosora/music/15/
  {
    name: "以心☆電信",
    intentTweetParam: ""
  },
  {
    name: "BANG YOU グラビティ",
    intentTweetParam: ""
  },
  {
    name: "マハラジャンボリー",
    intentTweetParam: ""
  },
  // https://www.lovelive-anime.jp/hasunosora/music/16/
  {
    name: "抱きしめる花びら",
    intentTweetParam: ""
  },
  {
    name: "STEP UP !",
    intentTweetParam: ""
  },
  // 音源なし
  {
    name: "Runway",
    intentTweetParam: ""
  },
];

/**
 * 103期楽曲10曲ガチャツイートURLをセットする
 */
const set103SongTweetLink = (e) => {
  // 103期楽曲を10曲重複なしで取得する
  const songNames = SONGS
                      .sort((a, b) => a.sort - b.sort)
                      .slice(0, 10)
                      .map(song => song.name);
  const intentTweetParam = encodeURIComponent(`#蓮ノ空103期楽曲10連ガチャ\n\n${songNames.join("\n")}\n`);  
  e.href = `${TWEET_INTENT_URL}?text=${intentTweetParam}&url=${KIAIIRETEKONCHIKUSHOW_URL}`;
}
