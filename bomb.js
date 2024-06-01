const SWIPE_THRESHOLD = 20;
const COUNT_TO_NEXT_ROUND_LIST = [
  {
    TAP_COUNT_TO_NEXT_ROUND: 10,
    SWIPE_COUNT: 1,
  },
  {
    TAP_COUNT_TO_NEXT_ROUND: 8,
    SWIPE_COUNT: 2,
  },
  {
    TAP_COUNT_TO_NEXT_ROUND: 6,
    SWIPE_COUNT: 3,
  },
  {
    TAP_COUNT_TO_NEXT_ROUND: 5,
    SWIPE_COUNT: 4,
  },
  {
    TAP_COUNT_TO_NEXT_ROUND: 3,
    SWIPE_COUNT: 5,
  },
];

/**
 * 
 */
const startHellomegBomb = (e) => {
  e.onclick = null;

  let currentSection = 0
  let currentSectionInfo = {};
  let swipeCount = 0;
  let tapCount = 0;
  let startY = 0;
  let endY = 0;

  const rightButton = document.getElementById("rightButton");
  const leftButton = document.getElementById("leftButton");
  const gaugeElement = document.getElementById("gauge");
  const gaugeLabelElement = document.getElementById("gaugeLabel");

  // セクション情報を初期化
  const sectionInfos = COUNT_TO_NEXT_ROUND_LIST
                        .map(section => ({ ...section, sort: Math.random() }))
                        .sort((a, b) => a.sort - b.sort);
  // ゲージを作成
  sectionInfos.forEach(sectionInfo => {
    // section wrapper
    const section = document.createElement("div");
    section.classList.add("section");
    gaugeElement.appendChild(section);
    // section text
    const sectionText = document.createElement("span");
    sectionText.innerText = sectionInfo.SWIPE_COUNT;
    sectionText.classList.add("section-text");
    section.appendChild(sectionText);
    // segment
    const segmentElements = [];
    Array.from({ length: sectionInfo.TAP_COUNT_TO_NEXT_ROUND }).map(() => {
      const segment = document.createElement("div");
      segment.classList.add("segment");
      section.appendChild(segment);
      segmentElements.push(segment);
    });
    // DOM 操作よりメモリアクセスの方が速そうだからセクション要素を配列に突っ込んでおく
    sectionInfo.sectionElement = section;
    sectionInfo.segmentElements = segmentElements;
  });

  currentSectionInfo = sectionInfos[currentSection];
  currentSectionInfo.sectionElement.classList.add("currentSection");

  const handleSwipe = () => {
    const currentTop = Math.abs(parseFloat(rightButton.style.top));
    if (currentTop >= SWIPE_THRESHOLD) {
      swipeCount++;
      if (swipeCount >= currentSectionInfo.SWIPE_COUNT) {
        // disable rightButton
        rightButton.onclick = null;
        rightButton.classList.add("disabled");
        // activate leftButton
        leftButton.classList.remove("disabled");
        leftButton.onclick = handleClick;
      }
    }
    // 位置をリセット
    rightButton.style.top = "0px";
  }

  const handleClick = () => {
    swipeCount = 0;
    tapCount++;
    currentSectionInfo.segmentElements[tapCount - 1].classList.add("swiped");
    if (tapCount >= currentSectionInfo.TAP_COUNT_TO_NEXT_ROUND) {
      // 次のセクションへ
      tapCount = 0;
      currentSection++;
      // 最後のセクションが終了した場合はゲームを終了する
      if (currentSection >= COUNT_TO_NEXT_ROUND_LIST.length) {
        return;
      }
      currentSectionInfo = sectionInfos[currentSection];
      sectionInfos[currentSection - 1].sectionElement.classList.remove("currentSection");
      currentSectionInfo.sectionElement.classList.add("currentSection");
    }

    // disable LeftButton
    leftButton.onclick = null;
    leftButton.classList.add("disabled");
    // activate RightButton
    rightButton.classList.remove("disabled");
    rightButton.onclick = handleSwipe;
  }

  const moveImage = () => {
    const distance =  startY - endY;
    // 移動範囲は 0 から SWIPE_THRESHOLD の間
    const newTop = Math.max(Math.min(distance, SWIPE_THRESHOLD), 0);
    rightButton.style.top = `-${newTop}px`;
  }

  rightButton.addEventListener('touchstart', (event) => {
    startY = event.touches[0].pageY;
  });

  rightButton.addEventListener('touchmove', (event) => {
    endY = event.touches[0].pageY;
    moveImage();
  });

  rightButton.addEventListener('touchend', () => {
    handleSwipe();
  });

  document.getElementById("description").style.display = "none";
  document.getElementById("bomb-container").style.display = null;
  gaugeElement.style.display = null;
  gaugeLabelElement.style.display = null;

  // 100ms 単位のタイマーを設定
  let time = 0;
  const timerElement = document.getElementById("timer");
  const interval = setInterval(() => {
    time++;
    timerElement.innerText = `${Math.floor(time / 10)}.${Math.floor(time % 10)} 秒`;

    // round が MAX_ROUND に到達してからゲームが終了するまで最大 100ms の誤差が生じるが許容する
    if (currentSection >= COUNT_TO_NEXT_ROUND_LIST.length) {
      clearInterval(interval);
      document.getElementById("bomb-container").style.display = "none";
      document.getElementById("result").style.display = "block";

      // timerElement の反映を待つために非同期実行する
      setTimeout(() => {
        alert(`${Math.floor(time / 10)}.${Math.floor(time % 10)} 秒`);
      }, 100);
    }
  }, 100);
}
