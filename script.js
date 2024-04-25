const KIAIIRETEKONCHIKUSHOW_URL = "https://kiaiiretekonchiku.show/";
const TWEET_INTENT_URL = "https://twitter.com/intent/tweet";

const HELLOMEG_TWEET_URL_PARAM = '%EF%BC%BF%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%E4%BA%BA%EF%BC%BF%0A%EF%BC%9E%E3%80%80%E3%83%8F%E3%83%AD%E3%82%81%E3%81%90%E3%83%BC%EF%BC%81%E3%80%80%EF%BC%9C%0A%EF%BF%A3Y%5EY%5EY%5EY%5EY%5EY%5EY%EF%BF%A3%0A';
const HELLOMEG_TWEET_URL_PARAM_BIG = '%E2%A0%80%E2%80%83%E2%96%A0%0A%E2%80%83%E2%96%A0%E2%80%83%E2%80%83%E2%80%83%E2%96%A0%0A%E2%80%83%E2%96%A0%E2%80%83%E2%80%83%E2%80%83%E2%96%A0%0A%E2%96%A0%E2%80%83%E2%80%83%E2%80%83%E2%80%83%E2%80%83%E2%96%A0%0A%E2%96%A0%E2%80%83%E2%80%83%E2%80%83%E2%80%83%E2%80%83%E2%80%83%E2%96%A0%0A%0A%E3%80%80%E2%96%A0%E2%96%A0%E2%96%A0%E2%96%A0%E2%96%A0%E2%96%A0%0A%E3%80%80%E2%96%A0%E3%80%80%E3%80%80%E3%80%80%20%20%E2%96%A0%0A%E3%80%80%E2%96%A0%E3%80%80%E3%80%80%E3%80%80%20%20%E2%96%A0%0A%E3%80%80%E2%96%A0%E2%96%A0%E2%96%A0%E2%96%A0%E2%96%A0%E2%96%A0%0A%0A%E2%80%83%E2%80%83%E2%80%83%E2%80%83%E2%80%83%E2%96%A0%0A%E2%80%83%E2%96%A0%E2%80%83%E2%80%83%E2%80%83%E2%96%A0%0A%E2%80%83%E2%96%A0%E2%96%A0%E2%96%A0%E2%80%83%E2%96%A0%E2%96%A0%E2%96%A0%0A%E2%80%83%E2%96%A0%E2%96%A0%E2%80%83%E2%80%83%E2%96%A0%E2%80%83%E2%96%A0%E2%96%A0%0A%E2%96%A0%E2%80%83%E2%96%A0%E2%80%83%E2%96%A0%E2%80%83%E2%80%83%E2%80%83%E2%96%A0%0A%E2%96%A0%E2%80%83%E2%80%83%E2%96%A0%E2%80%83%E2%80%83%E2%80%83%E2%96%A0%0A%E3%80%80%E2%96%A0%E2%96%A0%E2%80%83%E2%80%83%E2%80%83%E2%96%A0%0A%0A%E2%80%83%E2%80%83%E2%80%83%E2%80%83%E2%96%A0%0A%E2%80%83%E2%80%83%E2%96%A0%E2%96%A0%0A%E2%80%83%E2%96%A0%E2%96%A0%E2%80%83%E2%80%83%E2%96%A0%E2%80%83%E2%96%A0%0A%E2%96%A0%E2%80%83%E2%80%83%E2%80%83%E2%80%83%E2%80%83%E2%96%A0%0A%E2%96%A0%E2%96%A0%0A%E2%80%83%E2%80%83%E2%96%A0%E2%96%A0%0A%E2%80%83%E2%80%83%E2%80%83%E2%96%A0%E2%96%A0%0A';

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
 * ハロめぐツイートURLをセットする
 * 
 * onclick -> href の順に処理されるため、ここで作成したURLでツイートされる
 */
const setHellomegTweetLink = (e) => {
  const songNames = Array.from({ length: 10 }, () => SONGS[Math.floor(Math.random() * SONGS.length)].name);
  const intentTweetParam = encodeURIComponent(`#蓮ノ空103期楽曲10連ガチャ\n\n${songNames.join("\n")}\n`);  
  const url = `${TWEET_INTENT_URL}?text=${intentTweetParam}&url=${KIAIIRETEKONCHIKUSHOW_URL}`;

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
