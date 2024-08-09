// Rカード
const HELLOMEG_R_CARD_LIST = [
  // Rカード
  {
    name: "めぐぅ",
    rarity: "R",
    src: "../../assets/logo-512x512.png"
  },
];
// SRカード
const HELLOMEG_SR_CARD_LIST = [
  {
    name: "HSCTハロめぐ",
    rarity: "SR",
    src: "../../assets/hsct.png"
  },
  {
    name: "ハクチューハロめぐ",
    rarity: "SR",
    src: "../../assets/hkc.png"
  },
];
// URカード
const HELLOMEG_UR_CARD_LIST = [
  {
    name: "宇宙ハロめぐ",
    rarity: "UR",
    src: "../../assets/universe.png"
  },
];

const viewModal = (hellomegImgElement) => {
  var modal = document.getElementById("myModal");
  var modalOverlay = document.getElementById("myModalOverlay");
  modal.style.display = "block";
  modalOverlay.style.display = "block";

  document.getElementById("confirmOk").onclick = function() {
    modal.style.display = "none";
    modalOverlay.style.display = "none";
    startHellomegGacha(hellomegImgElement);
  };

  document.getElementById("confirmCancel").onclick = function() {
    modal.style.display = "none";
    modalOverlay.style.display = "none";
  };

  modalOverlay.onclick = function() {
    modal.style.display = "none";
    modalOverlay.style.display = "none";
  };

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
      modalOverlay.style.display = "none";
    }
  };
};

/**
 * 処理開始から3秒後に SKILL からランダムに選んだ5つの画像を表示する
 */
const startHellomegGacha = (hellomegImgElement) => {

  hellomegImgElement.onclick = () => {};

  const descriptionElement = document.getElementById("description");
  descriptionElement.style.display = "none";
  const secretCardContainer = document.getElementById('secret-card-container');
  const cardList = [];

  // 抽選処理
  for (let i = 0; i < 10; i++) {
    const randomNum = Math.random()*100;
    let hellomegCard;

    // リンクラと同じく79%でR、18%でSR、3%でURとしている
    if (randomNum < 79) {
      if (i === 9) {
        hellomegCard = HELLOMEG_SR_CARD_LIST[Math.floor(Math.random() * HELLOMEG_SR_CARD_LIST.length)];
        cardList.push(hellomegCard);
      } else {
        hellomegCard = HELLOMEG_R_CARD_LIST[Math.floor(Math.random() * HELLOMEG_R_CARD_LIST.length)];
        cardList.push(hellomegCard);
      }

    } else if (randomNum < 97) {
      hellomegCard = HELLOMEG_SR_CARD_LIST[Math.floor(Math.random() * HELLOMEG_SR_CARD_LIST.length)];
      cardList.push(hellomegCard);

    } else {
      hellomegCard = HELLOMEG_UR_CARD_LIST[Math.floor(Math.random() * HELLOMEG_UR_CARD_LIST.length)];
      cardList.push(hellomegCard);
    }
  }

  // 画像を共有するための canvas 描画に時間を要するため抽選が完了したタイミングで処理を開始する
  displayShareButtonOrTweetLink(cardList);

  const firstImg = document.createElement('div');
  firstImg.classList.add('image', 'first');
  secretCardContainer.appendChild(firstImg);

  // animationDelay 定義
  const animationDelayBase = 1;
  const animationDelayRatio = 0.07;
  const totalAnimationDuration = animationDelayBase + animationDelayRatio * cardList.length;

  // firstImg を一周させる
  setTimeout(() => {
    firstImg.classList.add('rotateAroundCircle');
  }, animationDelayBase * 1000);

  // すべてのカードを描画し終わったら周回完了として非表示にする
  setTimeout(() => {
    firstImg.style.display = 'none';
  }, totalAnimationDuration * 1000);

  const radius = 30;
  // カードの円を secretCardContainer の中央に配置するためのオフセット
  const offset = {
    x: 90,
    y: 60,
  };

  for (let i = 0; i < cardList.length; i++) {
    const img = document.createElement('div');
    img.classList.add('image', cardList[i].rarity);
    secretCardContainer.appendChild(img);

    // 36°の位置からカードを配置するために i + 1 とする
    const angle = (i + 1) * 36 * (Math.PI / 180);
    const x = offset.x + radius * Math.cos(angle);
    const y = offset.y + radius * Math.sin(angle);

    img.style.left = `${x}px`;
    img.style.top = `${y}px`;
    img.style.transform = `rotate(${angle}rad) translate(0, -50%)`;
    img.style.animationDelay = `${i * animationDelayRatio + animationDelayBase}s`;
  }

  setTimeout(() => {
    secretCardContainer.style.display = 'none';
    resultCard(cardList);
  }, (totalAnimationDuration + 1) * 1000);
};

const resultCard = (cardList) => {

  const container = document.getElementById('container');

  // 選択した画像とランクを追加
  cardList.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card';

      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.src;

      const label = document.createElement('div');
      label.className = 'label';
      label.textContent = item.rarity;

      card.appendChild(img);
      card.appendChild(label);
      container.appendChild(card);
  });

  // アニメーションを順番に実行
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, index) => {
      setTimeout(() => {
          card.style.transform = 'translateX(0)'; // 元の位置に戻す
      }, index * 150); // 2枚ずつ0.5秒間隔でスライド
  });

  // result 表示
  setTimeout(() => {
    document.getElementById('result').style.display = null;
  }, cardList.length * 150 + 500);
};

const TWEET_INTENT_URL = "https://twitter.com/intent/tweet";
// TODO: URL 決める
const HELLOMEG_GACHA_URL = 'https://kiaiiretekonchiku.show/gacha/';
const HELLOMEG_GACHA_HASHTAG = '#ハロめぐガチャ';
const HELLOMEG_GACHA_TWEET = 'hellome gacha\ntweet';

/**
 * diplay: none で埋め込まれている共有ボタンまたはツイートリンクを表示状態にする
 * 
 * 画像を Twitter で共有するために Web Share API を利用した共有ボタンを表示する。
 * PC など Web Share API が利用できない場合は、テキストのみを共有するためのツイートリンクへフォールバック。
 */
const displayShareButtonOrTweetLink = (cards) => {
  // cards を canvas に描画する
  const canvas = document.createElement("canvas");
  canvas.width = 620;
  canvas.height = 244;
  const ctx = canvas.getContext("2d");
  cards.forEach(async (card, index) => {
    const img = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = card.src;
    });
    const dx = index < 5 ? 10 + index * 122 : 10 + (index - 5) * 122 ;
    const dy = index < 5 ? 10 : 132;
    ctx.drawImage(img, dx, dy, 112, 112);
  });

  try {
    canvas.toBlob((blob) => {
      // Web Share API が利用できる場合は共有ボタンを、そうでない場合はツイートリンクを表示する
      if (navigator.share && navigator.canShare && navigator.canShare(getNavigatorShareParams(blob))) {
        document.getElementById("share-button").style.display = null;
        document.getElementById("share-button").onclick = () => {
          canvas.toBlob(async (blob) => {
            await navigator.share(getNavigatorShareParams(blob));
          });
        }
      } else {
        const text = encodeURIComponent(`${HELLOMEG_GACHA_HASHTAG}\n${HELLOMEG_GACHA_TWEET}\n\n${cards.map(card => `・${card.name}\n`).join("")}\n`);
        document.getElementById("tweet-link").href = `${TWEET_INTENT_URL}?text=${text}&url=${HELLOMEG_GACHA_URL}`;
        document.getElementById("tweet-link").style.display = null;
      }
    });
  } catch (error) {
    // ローカル実行の場合はエラーを捕まえてツイートリンクを表示する
    if (error.message === "Failed to execute 'toBlob' on 'HTMLCanvasElement': Tainted canvases may not be exported.") {
      const text = encodeURIComponent(`${HELLOMEG_DRAW_HASHTAG}\n${HELLOMEG_DRAW_TWEET}\n\n${cards.map(card => `・${card.name}\n`).join("")}\n`);
      document.getElementById("tweet-link").href = `${TWEET_INTENT_URL}?text=${text}&url=${HELLOMEG_DRAW_URL}`;
      document.getElementById("tweet-link").style.display = null;
    } else {
      throw error;
    }
  }
}

/**
 * navigator.share に渡す引数を返す
 * 
 * NOTE: 2024年3月時点で以下の現象が発生している
 * - iOS: url が表示されない
 * - Android: text が表示れない
 */
const getNavigatorShareParams = (blob) => ({
  url: HELLOMEG_GACHA_URL,
  text: `${HELLOMEG_GACHA_HASHTAG}\n${HELLOMEG_GACHA_TWEET}\n${HELLOMEG_GACHA_URL}`,
  files: [new File([blob], "image.png", { type: "image/png", })],
});
