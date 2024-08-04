const SECTION_INFO_LIST = [
  {
    SEGMENTS: 8,
    SWIPE_COUNT_TO_NEXT_SEGMENT: 1,
  },
  {
    SEGMENTS: 6,
    SWIPE_COUNT_TO_NEXT_SEGMENT: 2,
  },
  {
    SEGMENTS: 4,
    SWIPE_COUNT_TO_NEXT_SEGMENT: 3,
  },
  {
    SEGMENTS: 3,
    SWIPE_COUNT_TO_NEXT_SEGMENT: 4,
  },
  {
    SEGMENTS: 2,
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

  const buttonContainer = document.getElementById("button-container");
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
        rightButton.classList.add("disabled");
        // activate leftButton
        leftButton.classList.remove("disabled");
      }
    }
    // 位置をリセット
    rightButton.style.top = "0px";
  }

  const handleTap = () => {
    swipeCount = 0;
    currentSegment++;
    currentSectionInfo.segmentElements[currentSegment - 1].classList.add("swiped");
 
    if (currentSegment >= currentSectionInfo.SEGMENTS) {
      // 次のセクションへ
      currentSegment = 0;
      currentSectionInfo.sectionElement.classList.remove("currentSection");
      currentSection++;
      // 最後のセクションが終了した場合はゲームを終了する
      if (currentSection >= SECTION_INFO_LIST.length) {
        return;
      }
      currentSectionInfo = sectionInfos[currentSection];
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
    leftButton.classList.add("disabled");
    // activate RightButton
    rightButton.classList.remove("disabled");
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
  leftButton.addEventListener("touchstart", (event) => {
    if (event.cancelable) event.preventDefault();
    handleTap();
  });

  // 要素の表示・非表示を切り替えてゲームスタート
  document.getElementById("description").style.display = "none";
  sectionWrapper.style.display = null;
  buttonContainer.style.display = null;

  // 100ms 単位のタイマーを設定
  let time = 0;
  const timerElement = document.getElementById("timer");
  const interval = setInterval(() => {
    time++;
    timerElement.innerText = `${Math.floor(time / 10)}.${Math.floor(time % 10)} 秒`;

    if (currentSection >= sectionInfos.length) {
      clearInterval(interval);
      buttonContainer.style.display = "none";
      document.getElementById("result").style.display = "block";
      document.getElementById("post").href = `https://twitter.com/intent/tweet?text=%23%E3%83%8F%E3%83%AD%E3%82%81%E3%81%90%E3%83%9C%E3%83%B3%E3%83%90%E3%83%BC%0D%0A%E5%A4%A7%E6%B2%A2%E3%81%A8%E3%83%8F%E3%83%AD%E3%82%81%E3%81%90%E3%81%A7%E3%82%B9%E3%83%AF%E3%82%A4%E3%83%97%E3%81%AE%E6%84%9F%E8%A6%9A%E3%82%92%E6%8E%B4%E3%82%82%E3%81%86%E3%80%82%E7%A7%81%E3%81%AE%E7%B5%90%E6%9E%9C%E3%81%AF%E2%80%A6%0D%0A%0D%0A${Math.floor(time / 10)}.${Math.floor(time % 10)}+%E7%A7%92%EF%BC%81%0D%0A&url=https://kiaiiretekonchiku.show/bomber/`;

      // timerElement の反映を待つために非同期実行する
      setTimeout(() => {
        alert(`${Math.floor(time / 10)}.${Math.floor(time % 10)} 秒`);
      }, 100);
    }
  }, 100);
}
