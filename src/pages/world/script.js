const MAX_CNT = 10;
const SWIPE_THRESHOLD = 20;

const startGame = (centerButton) => {
  // dummyButton のタップ処理
  Array.from(document.getElementsByClassName("card_dummyButton")).forEach((card) => {
    card.addEventListener("touchstart", () => {
      // 同時押しを防ぐための誤答ペナルティ 500ms
      const overlay = document.getElementById("overlay");
      overlay.style.display = null;
      setTimeout(() => {
        overlay.style.display = "none";
      }, 500);
    });
  });

  // centerButton のタップ処理
  const cardContainer = document.getElementById("card-container");
  const actionLeftButton = document.getElementById("action-left-button");
  const actionRightButton = document.getElementById("action-right-button");
  const actionTopRightButton = document.getElementById("action-top-right-button");
  centerButton.addEventListener("touchstart", (event) => {
    if (event.cancelable) event.preventDefault();
    centerButton.classList.add("disabled");

    cnt++;

    // ゲーム終了判定
    if (cnt >= MAX_CNT) {
      clearInterval(interval);
      alert(`${Math.floor(time / 10)}.${Math.floor(time % 10)} 秒`);
      cardContainer.style.display = "none";
      actionLeftButton.classList.add("disabled");
      actionRightButton.classList.add("disabled");
      actionTopRightButton.classList.add("disabled");
      document.getElementById("result").style.display = "block";
      return;
    }

    shuffleCards();
    swipableCard.classList.remove("disabled");
  });

  let swipeStartY = 0;
  let swipeEndY = 0;

  // swipableCard のスワイプ開始時に初期位置を保存
  const swipableCard = document.getElementById("swipable-button");
  swipableCard.addEventListener('touchstart', (event) => {
    swipeStartY = event.touches[0].pageY;
  });

  // swipableCard のスワイプ中は画像を動かす
  swipableCard.addEventListener('touchmove', (event) => {
    swipeEndY = event.touches[0].pageY;
    const distance =  swipeStartY - swipeEndY;
    // 移動範囲は 0 から SWIPE_THRESHOLD の間
    const newTop = Math.max(Math.min(distance, SWIPE_THRESHOLD), 0);
    swipableCard.style.top = `-${newTop}px`;
  });

  // swipableCard のスワイプ完了時に閾値を超えていた場合はスワイプとみなす
  swipableCard.addEventListener('touchend', () => {
    const currentTop = Math.abs(parseFloat(swipableCard.style.top));
    if (currentTop >= SWIPE_THRESHOLD) {
      swipableCard.classList.add("disabled");
      centerButton.classList.remove("disabled");
    }
    // 位置をリセット
    swipableCard.style.top = "0px";
  });

  let cnt = 0;
  let time = 0;
  let interval;
  const timerElement = document.getElementById("timer");
  const newInterval = () => {
    // 100ms 単位のタイマーを設定
    interval = setInterval(() => {
      time++;
      timerElement.innerText = `${Math.floor(time / 10)}.${Math.floor(time % 10)} 秒`;
    }, 100);
  }

  // action ボタンのタップ処理
  const handleTapActionButton = (event) => {
    if (event.cancelable) event.preventDefault();
    clearInterval(interval);
    openModal(cnt, () => {closeModal();newInterval();});
  }
  actionLeftButton.addEventListener("touchstart", handleTapActionButton);
  actionRightButton.addEventListener("touchstart", handleTapActionButton);
  actionTopRightButton.addEventListener("touchstart", handleTapActionButton);
  
  // 要素の表示・非表示を切り替えてゲームスタート
  shuffleCards();
  centerButton.classList.add("disabled");
  swipableCard.classList.remove("disabled");
  cardContainer.style.display = null;
  actionTopRightButton.style.display = null;
  document.getElementById("action-container").style.display = null;
  document.getElementById("description").style.display = "none";
  newInterval();
}

/**
 * モーダルを開く
 */
const openModal = (cnt, clodeModalFunc) => {
  const modalCloseButton = document.getElementById("modal-close-button");
  modalCloseButton.addEventListener("click", function func(event){
    if (event.cancelable) event.preventDefault();
    clodeModalFunc();
    this.removeEventListener("click", func);
  });

  const modalText = document.getElementById("modal-text");
  modalText.textContent = `あと${MAX_CNT - cnt}回`;

  const modal = document.getElementById("modal");
  modal.showModal();
}

/**
 * モーダルを閉じる
 */
const closeModal = () => {
  const modal = document.getElementById("modal");
  modal.close();
}

/**
 * カードをランダムに入れ替える
 */
const shuffleCards = () => {
  const container = document.getElementById("card-container");
  const cards = Array.from(container.children).map(e => e);

  // Fisher-Yatesシャッフル
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  container.innerHTML = "";
  cards.forEach(card => container.appendChild(card));
}
