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
  const cardColors = [];

  // 抽選処理
  for (let i = 0; i < 10; i++) {
    const randomNum = Math.random()*100;
    let hellomegCard;

    // リンクラと同じく79%でR、18%でSR、3%でURとしている
    if (randomNum < 79) {
      if (i === 9) {
        cardColors.push('gold');
        hellomegCard = HELLOMEG_SR_CARD_LIST[Math.floor(Math.random() * HELLOMEG_SR_CARD_LIST.length)];
        cardList.push(hellomegCard);
      } else {
        cardColors.push('cyan');
        hellomegCard = HELLOMEG_R_CARD_LIST[Math.floor(Math.random() * HELLOMEG_R_CARD_LIST.length)];
        cardList.push(hellomegCard);
      }

    } else if (randomNum < 97) {
      cardColors.push('gold');
      hellomegCard = HELLOMEG_SR_CARD_LIST[Math.floor(Math.random() * HELLOMEG_SR_CARD_LIST.length)];
      cardList.push(hellomegCard);

    } else {
      cardColors.push('magenta');
      hellomegCard = HELLOMEG_UR_CARD_LIST[Math.floor(Math.random() * HELLOMEG_UR_CARD_LIST.length)];
      cardList.push(hellomegCard);
    }
  }

  const firstImg = document.createElement('div');
  firstImg.classList.add('image');
  firstImg.style.backgroundColor = 'cyan';
  secretCardContainer.appendChild(firstImg);

  const firstAngle = 0;
  const radius = 30;
  const offset = 10;
  const x = 175 + (radius - offset) * Math.cos(firstAngle);
  const y = 175 + (radius - offset) * Math.sin(firstAngle);

  firstImg.style.left = `${x}px`;
  firstImg.style.top = `${y}px`;
  firstImg.style.transform = `rotate(${firstAngle}rad) translate(0, -50%)`;
  firstImg.style.animationDelay = `0s`;

  for (let i = 0; i < 10; i++) {
    const img = document.createElement('div');
    img.classList.add('image');
    img.style.backgroundColor = cardColors[i];
    secretCardContainer.appendChild(img);

    const angle = (i * 36) * (Math.PI / 180);
    const x = 175 + (radius - offset) * Math.cos(angle);
    const y = 175 + (radius - offset) * Math.sin(angle);

    img.style.left = `${x}px`;
    img.style.top = `${y}px`;

    img.style.transform = `rotate(${angle}rad) translate(0, -50%)`;
    img.style.animationDelay = `${i * 0.06 + 1}s`;
  }

  const totalAnimationDuration = 10 * 0.06 + 1 + 1;
  setTimeout(() => {
    secretCardContainer.style.display = 'none';
    resultCard(cardList);
  }, totalAnimationDuration * 1000);

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