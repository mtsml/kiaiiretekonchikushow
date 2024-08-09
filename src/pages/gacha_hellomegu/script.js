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
};