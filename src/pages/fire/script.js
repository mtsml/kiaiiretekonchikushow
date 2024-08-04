const MAX_ROUND = 10;
const START_ID = "ha";
const END_ID = "gu";

/**
 * ハロめぐを MAX_ROUND 回順番にタップする時間を計測する
 */
const startHaromegu = (e) => {
  let round = 0;
  let nextId = START_ID;

  e.onclick = null;

  // haromegu をシャッフルして onclick を設定する
  shuffleHaromeguElemets();
  const handleClick = (e) => {
    if (e.target.dataset.myId !== nextId) {
      // 同時押しを防ぐための誤答ペナルティ 500ms
      const overlay = document.getElementById("overlay");
      overlay.style.display = null;
      setTimeout(() => {
        overlay.style.display = "none";
      }, 500);
      return;
    }

    nextId = e.target.dataset.nextId;
    e.target.style.opacity = 0;
    e.target.style.pointerEvents = "none";

    // 「ぐ」まで到達したら round 終了
    if (e.target.dataset.myId === END_ID) {
      round++;
      // MAX_ROUND までシャッフルを繰り返す
      if (round < MAX_ROUND) {
        shuffleHaromeguElemets();
      }
    }
  }
  const container = document.getElementById("haromegu-container");
  Array.from(container.children).forEach(haromegu => {
    haromegu.onclick = handleClick;
    // タッチデバイスの速度改善
    haromegu.addEventListener("touchstart", (e) => {
      e.preventDefault();
      handleClick(e);
    });
  });

  document.getElementById("description").style.display = "none";
  container.style.display = null;

  // 100ms 単位のタイマーを設定
  let time = 0;
  const timerElement = document.getElementById("timer");
  const interval = setInterval(() => {
    time++;
    timerElement.innerText = `${Math.floor(time / 10)}.${Math.floor(time % 10)} 秒`;

    // round が MAX_ROUND に到達してからゲームが終了するまで最大 100ms の誤差が生じるが許容する
    if (round >= MAX_ROUND) {
      clearInterval(interval);
      container.style.display = "none";
      document.getElementById("result").style.display = "block";
      document.getElementById("post").href = `https://twitter.com/intent/tweet?text=%23%E3%83%8F%E3%83%AD%E3%82%81%E3%81%90%E3%83%95%E3%82%A1%E3%82%A4%E3%82%A2%0D%0A%E3%83%8F%E3%83%AD%E3%82%81%E3%81%90%E3%82%92%E7%B4%A0%E6%97%A9%E3%81%8F%E3%81%A4%E3%81%AA%E3%81%92%E3%81%A6%E5%8F%8D%E5%B0%84%E7%A5%9E%E7%B5%8C%E3%82%92%E7%88%86%E4%B8%8A%E3%81%92%E3%81%97%E3%82%88%E3%81%86%E3%80%82%E7%A7%81%E3%81%8C10%E3%83%8F%E3%83%AD%E3%82%81%E3%81%90%E5%AE%8C%E6%88%90%E3%81%95%E3%81%9B%E3%82%8B%E3%81%AE%E3%81%AB%E3%81%8B%E3%81%8B%E3%81%A3%E3%81%9F%E6%99%82%E9%96%93%E3%81%AF%E2%80%A6%0D%0A%0D%0A${Math.floor(time / 10)}.${Math.floor(time % 10)}+%E7%A7%92%EF%BC%81%0D%0A&url=https://kiaiiretekonchiku.show/fire/`;
      displayAdTweet();

      // timerElement の反映を待つために非同期実行する
      setTimeout(() => {
        alert(`${Math.floor(time / 10)}.${Math.floor(time % 10)} 秒`);
      }, 100);
    }
  }, 100);
}

/**
 * haromegu-container 内の要素をランダムに並び替えて4つの要素を表示状態にする
 * 
 * 子要素は「ハ」「ロ」「め」「ぐ」と puchihasu の5つ。
 * 「ロ」または「め」のどちらかを非表示とし、puchihasu を非表示とした要素の代わりとして表示する。
 */
const shuffleHaromeguElemets = () => {
  const container = document.getElementById("haromegu-container");

  // puchihasuTargetId 以外の要素を表示状態にする
  const puchihasuTargetId = ["ro", "me"][Math.floor(Math.random() * 2)];
  const haromegus = Array.from(container.children).map(haromegu => {
    switch (haromegu.id) {
      case puchihasuTargetId:
        // width を持たないように透過ではなく非表示状態とする
        haromegu.style.display = "none";
        break;
      case "puchihasu":
        haromegu.dataset.myId = puchihasuTargetId;
        haromegu.dataset.nextId = puchihasuTargetId === "ro" ? "me" : "gu";
      default:
        haromegu.style.opacity = 1;
        haromegu.style.pointerEvents = null;
        haromegu.style.display = null;
    }
    return haromegu;
  });

  // Fisher-Yatesシャッフル
  for (let i = haromegus.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [haromegus[i], haromegus[j]] = [haromegus[j], haromegus[i]];
  }

  container.innerHTML = "";
  haromegus.forEach(haromegu => container.appendChild(haromegu));
}

const AD_TWEET_URLS = [
  // めぐ島
  "https://twitter.com/pine_nm/status/1747617380803698977",
  "https://twitter.com/pine_nm/status/1747830758558048650",
  "https://twitter.com/pine_nm/status/1747959663205941443",
  "https://twitter.com/pine_nm/status/1748615206513885603",
  "https://twitter.com/pine_nm/status/1749040338763993449",
  "https://twitter.com/pine_nm/status/1749389715114193348",
  "https://twitter.com/pine_nm/status/1749778283259117642",
  "https://twitter.com/pine_nm/status/1752689330219565370",
  "https://twitter.com/pine_nm/status/1753606179111276588",
  "https://twitter.com/pine_nm/status/1754125334012891622",
  "https://twitter.com/pine_nm/status/1755209734070899026",
  "https://twitter.com/pine_nm/status/1757767575327641759",
  "https://twitter.com/pine_nm/status/1758056443796988148",
  "https://twitter.com/pine_nm/status/1758124375482761679",
  "https://twitter.com/pine_nm/status/1758446682440970556",
  "https://twitter.com/pine_nm/status/1758464616445907355",
  "https://twitter.com/pine_nm/status/1758486706398155014",
  "https://twitter.com/pine_nm/status/1758800845473550648",
  "https://twitter.com/pine_nm/status/1758851971896033511",
  "https://twitter.com/pine_nm/status/1759241120062841040",
  "https://twitter.com/pine_nm/status/1759399951497589060",
  "https://twitter.com/pine_nm/status/1759400457104134384",
  "https://twitter.com/pine_nm/status/1762409798094684646",
  "https://twitter.com/pine_nm/status/1762793929987273050",
  "https://twitter.com/pine_nm/status/1763196143046185438",
  "https://twitter.com/pine_nm/status/1763521820408614965",
  "https://twitter.com/pine_nm/status/1769693037322547597",
  "https://twitter.com/pine_nm/status/1769702604353962227",
  "https://twitter.com/pine_nm/status/1770127226484543612",
  "https://twitter.com/pine_nm/status/1772575567113564636",
  "https://twitter.com/pine_nm/status/1774021752445919624",
  "https://twitter.com/pine_nm/status/1774428844960993718",
  "https://twitter.com/pine_nm/status/1774769971954127196",
  "https://twitter.com/pine_nm/status/1776836347510272236",
  "https://twitter.com/pine_nm/status/1776951267711234544",
  "https://twitter.com/pine_nm/status/1778427050422157677",
  "https://twitter.com/pine_nm/status/1784147869991317722",
  "https://twitter.com/pine_nm/status/1784481225199247808",
  "https://twitter.com/pine_nm/status/1785296444586676712",
  "https://twitter.com/pine_nm/status/1785509271205249248",
  "https://twitter.com/pine_nm/status/1785886354746007888",
];

/**
 * 広告ツイートを表示する
 */
const displayAdTweet = () => {
  // 広告ツイートをランダムに取得
  const adTweetLink = document.getElementById("ad-tweet-link");
  adTweetLink.href = AD_TWEET_URLS[Math.floor(Math.random() * AD_TWEET_URLS.length)];

  // ツイート埋め込みスクリプトを読み込む
  const adTweet = document.getElementById("ad-tweet");
  const script = document.createElement("script");
  script.src = "https://platform.twitter.com/widgets.js";
  adTweet.appendChild(script);

  // ツイート埋め込み完了を監視する
  const observer = new MutationObserver(mutationsList => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList" && mutation.removedNodes.length !== 0) {
        mutation.removedNodes.forEach(node => {
          if (node.classList.contains("twitter-tweet")) {
            document.getElementById("loading").style.display = "none";
            observer.disconnect();
          }
        });
      }
    }
  });
  observer.observe(adTweet, { childList: true });
}
