const SECTION_INFO_LIST = [
  {
    SEGMENTS: 10,
    SWIPE_COUNT_TO_NEXT_SEGMENT: 1,
  },
  {
    SEGMENTS: 8,
    SWIPE_COUNT_TO_NEXT_SEGMENT: 2,
  },
  {
    SEGMENTS: 6,
    SWIPE_COUNT_TO_NEXT_SEGMENT: 3,
  },
  {
    SEGMENTS: 5,
    SWIPE_COUNT_TO_NEXT_SEGMENT: 4,
  },
  {
    SEGMENTS: 3,
    SWIPE_COUNT_TO_NEXT_SEGMENT: 5,
  },
];
const SWIPE_THRESHOLD = 20;

const startHellomegBomb = (e) => {
  e.onclick = null;

  let currentSection = 0
  let currentSectionInfo = {};
  let currentSegment = 0;
  let swipeCount = 0;
  let swipeStartY = 0;
  let swipeEndY = 0;

  const buttonWrapper = document.getElementById("button-container");
  const rightButton = document.getElementById("right-button");
  const leftButton = document.getElementById("left-button");
  const sectionWrapper = document.getElementById("section-wrapper");

  // セクション情報を初期化
  const sectionInfos = SECTION_INFO_LIST
                        .map(section => ({ ...section, sort: Math.random() }))
                        .sort((a, b) => a.sort - b.sort);

  // セクション情報を要素に反映する
  sectionInfos.forEach(sectionInfo => {
    // section
    const section = document.createElement("div");
    section.classList.add("section");
    sectionWrapper.appendChild(section);
    // section text
    const sectionText = document.createElement("span");
    sectionText.innerText = sectionInfo.SWIPE_COUNT_TO_NEXT_SEGMENT;
    sectionText.classList.add("section-text");
    section.appendChild(sectionText);
    // segment
    const segmentElements = [];
    Array.from({ length: sectionInfo.SEGMENTS }).forEach(() => {
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

  // スワイプゲージを初期化
  const swipeCountElements = document.getElementsByClassName("swipe-gauge-block");
  Array.from({ length: currentSectionInfo.SWIPE_COUNT_TO_NEXT_SEGMENT }).forEach((_, index) => {
    swipeCountElements[index].style.display = null;
  });

  const handleSwipe = () => {
    const currentTop = Math.abs(parseFloat(rightButton.style.top));
    if (currentTop >= SWIPE_THRESHOLD) {
      swipeCount++;
      swipeCountElements[swipeCount - 1].classList.add("swiped");
      if (swipeCount >= currentSectionInfo.SWIPE_COUNT_TO_NEXT_SEGMENT) {
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
    currentSegment++;
    currentSectionInfo.segmentElements[currentSegment - 1].classList.add("swiped");
 
    if (currentSegment >= currentSectionInfo.SEGMENTS) {
      // 次のセクションへ
      currentSegment = 0;
      currentSection++;
      // 最後のセクションが終了した場合はゲームを終了する
      if (currentSection >= SECTION_INFO_LIST.length) {
        return;
      }
      currentSectionInfo = sectionInfos[currentSection];
      sectionInfos[currentSection - 1].sectionElement.classList.remove("currentSection");
      currentSectionInfo.sectionElement.classList.add("currentSection");
    }

    // スワイプゲージを初期化
    Array.from(swipeCountElements).forEach((swipeCountElement, index) => {
      swipeCountElement.classList.remove("swiped");
      swipeCountElement.style.display = index < currentSectionInfo.SWIPE_COUNT_TO_NEXT_SEGMENT
                                        ? null
                                        : "none";
    });

    // disable LeftButton
    leftButton.onclick = null;
    leftButton.classList.add("disabled");
    // activate RightButton
    rightButton.classList.remove("disabled");
    rightButton.onclick = handleSwipe;
  }

  const moveImage = () => {
    const distance =  swipeStartY - swipeEndY;
    // 移動範囲は 0 から SWIPE_THRESHOLD の間
    const newTop = Math.max(Math.min(distance, SWIPE_THRESHOLD), 0);
    rightButton.style.top = `-${newTop}px`;
  }

  rightButton.addEventListener('touchstart', (event) => {
    swipeStartY = event.touches[0].pageY;
  });

  rightButton.addEventListener('touchmove', (event) => {
    swipeEndY = event.touches[0].pageY;
    moveImage();
  });

  rightButton.addEventListener('touchend', () => {
    handleSwipe();
  });

  document.getElementById("description").style.display = "none";
  sectionWrapper.style.display = null;
  buttonWrapper.style.display = null;

  // 100ms 単位のタイマーを設定
  let time = 0;
  const timerElement = document.getElementById("timer");
  const interval = setInterval(() => {
    time++;
    timerElement.innerText = `${Math.floor(time / 10)}.${Math.floor(time % 10)} 秒`;

    if (currentSection >= sectionInfos.length) {
      clearInterval(interval);
      document.getElementById("button-container").style.display = "none";
      document.getElementById("result").style.display = "block";

      // timerElement の反映を待つために非同期実行する
      setTimeout(() => {
        alert(`${Math.floor(time / 10)}.${Math.floor(time % 10)} 秒`);
      }, 100);
    }
  }, 100);
}
