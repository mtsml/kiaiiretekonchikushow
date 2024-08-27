const MAX_TAP_CNT = 15;
const SWIPE_THRESHOLD = 20;

const dummyCardList = [
  {
    src: "../../assets/hsct.png"
  },
  {
    src: "../../assets/hkc.png"
  },
  {
    src: "../../assets/fever.png"
  },
  {
    src: "../../assets/plank.png"
  },
  {
    src: "../../assets/universe.png"
  },
  {
    src: "../../assets/damon.png"
  },
  {
    src: "../../assets/comike104.png"
  },
  {
    src: "../../assets/donki.png"
  },
  {
    src: "../../assets/gao.png"
  },
  {
    src: "../../assets/haromegudayo.png"
  },
  {
    src: "../../assets/hellomegkamo.png"
  },
  {
    src: "../../assets/juden.png"
  },
  {
    src: "../../assets/mickfire.png"
  },
  {
    src: "../../assets/monochrome.png"
  },
  {
    src: "../../assets/pressed.png"
  },
  {
    src: "../../assets/shout.png"
  },
  {
    src: "../../assets/stand.png"
  },
  {
    src: "../../assets/sushi.png"
  },
  {
    src: "../../assets/tanameg.png"
  },
  {
    src: "../../assets/umtm.png"
  },
  {
    src: "../../assets/unitlive_hellomeg.png"
  },
];

const startGame = (centerButton) => {
  let tapCnt = 0;

  const timerElement = document.getElementById("timer");
  const timer = new PausableTimer((time) => {
    const seconds = Math.floor(time / 10); // 秒部分
    const deciseconds = time % 10; // 100ms単位
    timerElement.innerText = `${seconds}.${deciseconds} 秒`;
  });

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

    tapCnt++;
    

    // ゲーム終了判定
    if (tapCnt >= MAX_TAP_CNT) {
      cardContainer.style.display = "none";
      actionLeftButton.classList.add("disabled");
      actionRightButton.classList.add("disabled");
      actionTopRightButton.classList.add("disabled");
      timer.end();

      const seconds = Math.floor(timer.elapsed / 1000);
      const deciseconds = Math.floor((timer.elapsed % 1000) / 100);
      alert(`${seconds}.${deciseconds} 秒`);

      document.getElementById("result").style.display = "block";
      return;
    }

    shuffleCards();
    swipableCard.src = "../../assets/ohsawa.png";
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
      swipableCard.src = "../../assets/lose_001.png";
      centerButton.classList.remove("disabled");
    }
    // 位置をリセット
    swipableCard.style.top = "0px";
  });

  // action ボタンのタップ処理
  const handleTapActionButton = (event) => {
    if (event.cancelable) event.preventDefault();
    timer.pause();
    openModal(tapCnt, () => {
      closeModal();
      timer.start();
    });
  }
  actionLeftButton.addEventListener("touchstart", handleTapActionButton);
  actionRightButton.addEventListener("touchstart", handleTapActionButton);
  actionTopRightButton.addEventListener("touchstart", handleTapActionButton);
  
  // 要素の表示・非表示を切り替えてゲームスタート
  shuffleCards();
  centerButton.classList.add("disabled");
  swipableCard.classList.remove("disabled");
  cardContainer.style.display = null;
  actionLeftButton.classList.remove("disabled");
  actionRightButton.classList.remove("disabled");
  actionTopRightButton.classList.remove("disabled");
  document.getElementById("action-container").style.display = null;
  document.getElementById("description").style.display = "none";
  timer.start();
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
  modalText.textContent = `あと${MAX_TAP_CNT - cnt}回`;

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
  const cards = dummyCardList
    .map(card => ({ ...card, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .slice(0, 4)
    .map(card => card.img);

  const swipableCard = document.getElementById("swipable-button");
  cards.push(swipableCard);

  // Fisher-Yatesシャッフル
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  const container = document.getElementById("card-container");
  container.innerHTML = "";
  cards.forEach(card => container.appendChild(card));
}

/**
 * timer 管理
 */
class PausableTimer {
  constructor(callback) {
    this.callback = callback;
    this.timerId = null;
    this.startTime = 0;
    this.elapsed = 0;
    this.isPaused = true;
    this.isEnded = false;
  }

  start() {
    if (!this.isPaused || this.isEnded) return;
    this.isPaused = false;
    this.startTime = Date.now() - this.elapsed;
    this.timerId = setInterval(() => {
      this.elapsed = Date.now() - this.startTime;
      this.callback(Math.floor(this.elapsed / 100));
    }, 100);
  }

  pause() {
    if (this.isPaused || this.isEnded) return;
    this.isPaused = true;
    clearInterval(this.timerId);
    this.timerId = null;
  }

  end() {
    this.pause();
    this.isEnded = true;
  }
}

window.addEventListener("DOMContentLoaded", () => {
  // 高速化のためにマウント時に画像データを読み込んでおく
  dummyCardList.forEach(card => {
    const img = document.createElement("img");
    img.src = card.src;
    img.classList.add("card_dummyButton");
    card.img = img;
  })
});
