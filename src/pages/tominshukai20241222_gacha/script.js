// 確定カード
const LOGIN_BORNUS = {
  fullname: "福梅",
  rarity: "R",
  src: "../../assets/tominshukai20241222/fukuume.png",
  description: "ログインボーナス"
}
// Rカード
const HELLOMEG_R_CARD_LIST = [
  {
    fullname: "フレークシール",
    rarity: "R",
    src: "../../assets/tominshukai20241222/sheel.png",
    description: "好きなシールを一枚選んでね。"
  },
];
// SRカード
const HELLOMEG_SR_CARD_LIST = [
  {
    fullname: "With×MEETSシール",
    rarity: "SR",
    src: "../../assets/tominshukai20241222/wm.png",
    description: "好きなシールを一枚選んでね。"
  },
  {
    fullname: "きんつば",
    rarity: "SR",
    src: "../../assets/tominshukai20241222/kintsuba.png",
    description: "めぐちゃんも大好きおいしいきんつば"
  },
];
// URカード
const HELLOMEG_UR_CARD_LIST = [
  {
    fullname: "カステラ",
    rarity: "UR",
    src: "../../assets/tominshukai20241222/kasutera.png",
    description: "いい感じのカステラ"
  },
  {
    fullname: "サイダー",
    rarity: "UR",
    src: "../../assets/tominshukai20241222/soda.png",
    description: "さいだー"
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

  // モーダル本体をクリックしても閉じないようにする
  modal.onclick = function(e) {
    e.stopPropagation();
  };
};

/**
 * 処理開始から3秒後に SKILL からランダムに選んだ5つの画像を表示する
 */
const startHellomegGacha = (hellomegImgElement) => {
  hellomegImgElement.onclick = () => {};

  // 各要素を初期化して出し分ける
  const container = document.getElementById("container");
  while (container.firstChild) container.removeChild(container.firstChild);
  const secretCardContainer = document.getElementById("secret-card-container");
  while (secretCardContainer.firstChild) secretCardContainer.removeChild(secretCardContainer.firstChild);
  secretCardContainer.style.display = null;
  const descriptionElement = document.getElementById("description");
  descriptionElement.style.display = "none";  
  const resultElement = document.getElementById("result");
  resultElement.style.display = "none";

  // ログインボーナスは確定で排出する
  const cardList = [LOGIN_BORNUS];

  // 抽選処理
  for (let i = 0; i < 9; i++) {
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
  // 加算している 0.1s はいい感じの delay
  setTimeout(() => {
    firstImg.style.display = 'none';
  }, (totalAnimationDuration + 0.1) * 1000);

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
    document.getElementsByTagName('body')[0].classList.add('overflow-hidden');
    // カードパックを画面外に吹き飛ばす
    Array.from(document.getElementsByClassName('image')).forEach((card, i) => {
      const angle = (i * 36) * (Math.PI / 180);
      const translateX = 1000 * Math.cos(angle);
      const translateY = 1000 * Math.sin(angle);

      card.style.transition = 'transform 1s ease-in-out, opacity 1s ease-in-out';
      card.style.transform = `translate(${translateX}px, ${translateY}px)`;
      card.style.opacity = '0';
    });

    // 結果画面を表示する
    setTimeout(() => {
      secretCardContainer.style.display = 'none';
      document.getElementsByTagName('body')[0].classList.remove('overflow-hidden');
      resultCard(cardList);
    }, 1000);
  }, (totalAnimationDuration + 1) * 1000);
};

const resultCard = (cardList) => {

  const container = document.getElementById('container');

  // 選択した画像とランクを追加
  cardList.forEach(item => {
      const card = document.createElement('div');
      card.classList.add('card', item.rarity);

      // 背景色を付与するためだけの要素
      // カードに animated border を付与するために必要
      const cardInner = document.createElement('div');
      cardInner.classList.add('cardInner');

      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.name;
      img.onclick = () => viewCardModal(item);

      cardInner.appendChild(img);
      card.appendChild(cardInner);
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

const viewCardModal = (card) => {
  var modal = document.getElementById("cardModal");
  var modalOverlay = document.getElementById("cardModalOverlay");
  modal.style.display = "block";
  modalOverlay.style.display = "block";

  modal.querySelector('.modal-body img').src = card.src;
  modal.querySelector('.modal-body h2').textContent = `${card.rarity} ${card.fullname}`;
  modal.querySelector('.modal-body p').textContent = `${card.description}`;

  document.getElementById("cardModalConfirmCancel").onclick = function() {
    modal.style.display = "none";
    modalOverlay.style.display = "none";
  };

  modalOverlay.onclick = function() {
    modal.style.display = "none";
    modalOverlay.style.display = "none";
  };

  // モーダル本体をクリックしても閉じないようにする
  modal.onclick = function(e) {
    e.stopPropagation();
  };
};

/**
 * diplay: none で埋め込まれている共有ボタンまたはツイートリンクを表示状態にする
 * 
 * 画像を Twitter で共有するために Web Share API を利用した共有ボタンを表示する。
 * PC など Web Share API が利用できない場合は、テキストのみを共有するためのツイートリンクへフォールバック。
 */
const displayShareButtonOrTweetLink = (cards) => {
  // cards を canvas に描画する
  const canvas = drawCanvas(cards);

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
      }
    });
  } catch (error) {
    console.error(error);
  }
}

// cards.length === 10 を期待
const drawCanvas = (cards) => {
  const cardWidth = 100;
  const cardHeight = 100;
  const borderWidth = 2;
  const padding = 10;
  const canvasWidth = padding + (cardWidth + padding) * 5;
  const canvasHeight = padding + (cardHeight + padding) * 2;

  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext("2d");

  cards.forEach(async (card, index) => {
    // 画像
    const img = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = card.src;
    });
    const dx = index < 5
      ? padding + (cardWidth + padding) * index        // 1行目
      : padding + (cardWidth + padding) * (index - 5); // 2行目
    const dy = index < 5
      ? padding                   // 1行目
      : padding * 2 + cardHeight; // 2行目
    ctx.drawImage(img, dx, dy, cardWidth, cardHeight);

    // 枠線
    ctx.strokeStyle = card.rarity === 'UR' ? 'blueviolet' : card.rarity === 'SR' ? 'gold' : 'paleturquoise'; // 枠線の色
    ctx.lineWidth = borderWidth;
    ctx.strokeRect(dx, dy, cardWidth, cardHeight);
  });

  return canvas;
}

/**
 * navigator.share に渡す引数を返す
 * 
 * NOTE: 2024年3月時点で以下の現象が発生している
 * - iOS: url が表示されない
 * - Android: text が表示れない
 */
const getNavigatorShareParams = (blob) => ({
  files: [new File([blob], "image.png", { type: "image/png", })],
});


/**
 * もう一度引く
 */
const retry = () => {
  const hellomegImgElement = document.getElementById("helloMegImg").querySelector("img");
  viewModal(hellomegImgElement);
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('cardContainer');

  // 選択した画像とランクを追加
  [...HELLOMEG_UR_CARD_LIST, ...HELLOMEG_SR_CARD_LIST, ...HELLOMEG_R_CARD_LIST, LOGIN_BORNUS].forEach(item => {
    const card = document.createElement('li');
    card.classList.add('card', item.rarity);
    card.style.transform = 'translateX(0)';

    // 背景色を付与するためだけの要素
    // カードに animated border を付与するために必要
    const cardInner = document.createElement('div');
    cardInner.classList.add('cardInner');

    const img = document.createElement('img');
    img.src = item.src;
    img.alt = item.name;
    img.onclick = () => viewCardModal(item);

    cardInner.appendChild(img);
    card.appendChild(cardInner);
    container.appendChild(card);
  });
})
