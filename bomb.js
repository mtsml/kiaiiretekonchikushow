/**
 * 
 */
const startHellomegBomb = (e) => {
  e.onclick = null;

  let round = 0;

  const SWIP_MAX = 3;
  let swipCount = 0;

  const haElement = document.getElementById("ha");
  const roElement = document.getElementById("ro");

  const handleHaClick = () => {
    if (swipCount >= SWIP_MAX) return;

    swipCount++;

    if (swipCount === SWIP_MAX) {
      swipCount = 0;
      // disable ha
      haElement.onclick = null;
      haElement.classList.add("disabled");
      // activate ro
      roElement.classList.remove("disabled");
      roElement.onclick = handleRoClick;
    }
  }

  const handleRoClick = () => {
    // disable ro
    roElement.onclick = null;
    roElement.classList.add("disabled")
    // activate ha
    haElement.classList.remove("disabled");
    haElement.onclick = handleHaClick;
  }

  haElement.onclick = handleHaClick;
  document.getElementById("description").style.display = "none";
  document.getElementById("bomb-container").style.display = null;

  // // 100ms 単位のタイマーを設定
  // let time = 0;
  // const timerElement = document.getElementById("timer");
  // const interval = setInterval(() => {
  //   time++;
  //   timerElement.innerText = `${Math.floor(time / 10)}.${Math.floor(time % 10)} 秒`;

  //   // round が MAX_ROUND に到達してからゲームが終了するまで最大 100ms の誤差が生じるが許容する
  //   if (round >= MAX_ROUND) {
  //     clearInterval(interval);
  //     container.style.display = "none";
  //     document.getElementById("result").style.display = "block";
  //     document.getElementById("post").href = `https://twitter.com/intent/tweet?text=%23%E3%83%8F%E3%83%AD%E3%82%81%E3%81%90%E3%83%95%E3%82%A1%E3%82%A4%E3%82%A2%0D%0A%E3%83%8F%E3%83%AD%E3%82%81%E3%81%90%E3%82%92%E7%B4%A0%E6%97%A9%E3%81%8F%E3%81%A4%E3%81%AA%E3%81%92%E3%81%A6%E5%8F%8D%E5%B0%84%E7%A5%9E%E7%B5%8C%E3%82%92%E7%88%86%E4%B8%8A%E3%81%92%E3%81%97%E3%82%88%E3%81%86%E3%80%82%E7%A7%81%E3%81%8C10%E3%83%8F%E3%83%AD%E3%82%81%E3%81%90%E5%AE%8C%E6%88%90%E3%81%95%E3%81%9B%E3%82%8B%E3%81%AE%E3%81%AB%E3%81%8B%E3%81%8B%E3%81%A3%E3%81%9F%E6%99%82%E9%96%93%E3%81%AF%E2%80%A6%0D%0A%0D%0A${Math.floor(time / 10)}.${Math.floor(time % 10)}+%E7%A7%92%EF%BC%81%0D%0A&url=https://kiaiiretekonchiku.show/haromegu.html`;
  //     displayAdTweet();

  //     // timerElement の反映を待つために非同期実行する
  //     setTimeout(() => {
  //       alert(`${Math.floor(time / 10)}.${Math.floor(time % 10)} 秒`);
  //     }, 100);
  //   }
  // }, 100);
}