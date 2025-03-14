const TWEET_INTENT_URL = "https://twitter.com/intent/tweet";

// スクステにおける2024年3月時点の汎用編成
const HELLOMEG_DRAW_SKILLS = [
  // kaho
  {
    name: "FM花帆",
    src: "../../assets/kaho_fm.jpg"
  },
  {
    name: "ST花帆",
    src: "../../assets/kaho_st.jpg"
  },
  {
    name: "ゆのくに花帆",
    src: "../../assets/kaho_yunokuni.jpg"
  },
  // saya
  {
    name: "ドルビさやか",
    src: "../../assets/saya_dorubi.jpg"
  },
  {
    name: "シャボンさやか",
    src: "../../assets/saya_syabon.jpg"
  },
  {
    name: "ゆのくにさやか",
    src: "../../assets/saya_yunokuni.jpg"
  },
  // ruri
  {
    name: "LttF瑠璃乃",
    src: "../../assets/ruri_lttf.jpg"
  },
  {
    name: "夏めき瑠璃乃",
    src: "../../assets/ruri_natsu.jpg"
  },
  {
    name: "ツバサ瑠璃乃",
    src: "../../assets/ruri_tsubasa.jpg"
  },
  // kozu
  {
    name: "ダイハツ梢",
    src: "../../assets/kozu_daihatsu.jpg"
  },
  {
    name: "DN梢",
    src: "../../assets/kozu_dn.jpg"
  },
  {
    name: "桃節銘記梢",
    src: "../../assets/kozu_momo.jpg"
  },
  // tsuzu
  {
    name: "DB綴理",
    src: "../../assets/tsuzu_db.jpg"
  },
  {
    name: "DN綴理",
    src: "../../assets/tsuzu_dn.jpg"
  },
  {
    name: "ツバサ綴理",
    src: "../../assets/tsuzu_tsubasa.jpg"
  },
  // megu
  {
    name: "冬めぐ",
    src: "../../assets/megu_fuyu.jpg"
  },
  {
    name: "ハピめぐ",
    src: "../../assets/megu_happy.jpg"
  },
  {
    name: "ツバサめぐ",
    src: "../../assets/megu_tsubasa.jpg"
  },
];
const HELLOMEG_DRAW_HASHTAG = "#ハロめぐドロー";
const HELLOMEG_DRAW_TWEET = "運を手繰り寄せよう。私の結果は…";
const HELLOMEG_DRAW_URL = "https://kiaiiretekonchiku.show/draw/";

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
