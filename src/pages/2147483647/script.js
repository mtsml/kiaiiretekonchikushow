/**
 * result.value にセットする値を返却する
 */
const getResultValue = (songSeconds, singerNum, appealSum, masteryLv, loveBorunsLv, heartRank, heartCnt, loveAtract) => {
  // 他の項目がすべて入力されている場合に自動計算を有効にする
  const autoCalcHeartCntElement = document.getElementById("auto-calc-heartcnt");
  if ([songSeconds, singerNum, appealSum, masteryLv, loveBorunsLv, heartRank, loveAtract].some(item => isNaN(parseInt(item, 10)))) {
    autoCalcHeartCntElement.disabled = true;
  } else {
    autoCalcHeartCntElement.disabled = false;
  }
  const autoCalcLoveAtractElement = document.getElementById("auto-calc-loveatract");
  if ([songSeconds, singerNum, appealSum, masteryLv, loveBorunsLv, heartRank, heartCnt].some(item => isNaN(parseInt(item, 10)))) {
    autoCalcLoveAtractElement.disabled = true;
  } else {
    autoCalcLoveAtractElement.disabled = false;
  }

  // LOVE計算
  const loveScore = calcLoveScore(
    parseFloat(songSeconds), 
    parseInt(singerNum, 10),
    parseInt(appealSum, 10),
    parseInt(masteryLv, 10),
    parseInt(loveBorunsLv, 10),
    parseFloat(heartRank),
    parseInt(heartCnt, 10),
    parseInt(loveAtract, 10),
  );

  // debugArea を更新
  const debugAreaElement = document.getElementById("debug-area");
  debugAreaElement.textContent = Math.round(loveScore);

  return loveScoreToResultDisplayValue(loveScore);
}

/**
 * 獲得LOVEを計算する
 */
const calcLoveScore = (songSeconds, singerNum, appealSum, masteryLv, loveBornusLv, heartRank, heartCnt, loveAtract) => {
  const oneHeartScore = Math.floor((120 * appealSum) / (songSeconds * singerNum));
  const learningBornus = (1 + masteryLv * 0.05 / 100) * (1 + loveBornusLv * 0.5 / 100);
  const loveScore = Math.floor(oneHeartScore * learningBornus * heartRank * (1 + loveAtract / 100)) * heartCnt;
  return loveScore;
}

/**
 * loveScore を表示用の value に変換する
 */
const loveScoreToResultDisplayValue = (loveScore) => {
  if (isNaN(loveScore)) {
    return "NaNダロナ";
  } else {
    const displayValue = Math.round(loveScore / 100000000);
    if (displayValue === 0) {
      return "1億未満！";
    } else {
      return `だいたい${displayValue}億！`;
    }
  }
}

/**
 * 獲得LOVEが 2147483647 を超える最小のハート個数を計算する
 */
const calcHeartCnt = () => {
  const songSeconds = parseFloat(document.getElementById("song").value, 10);
  const singerNum = parseInt(document.getElementById("singer").value, 10);
  const appealSum = parseInt(document.getElementById("appeal").value, 10);
  const masteryLv = parseInt(document.getElementById("mastery").value, 10);
  const loveBornusLv = parseInt(document.getElementById("lovebornus").value, 10);
  const heartRank = parseFloat(document.getElementById("heartrank").value);
  const loveAtract = parseInt(document.getElementById("loveatract").value, 10);

  // heartcnt 更新
  const oneHeartScore = Math.floor((120 * appealSum) / (songSeconds * singerNum));
  const learningBornus = (1 + masteryLv * 0.05 / 100) * (1 + loveBornusLv * 0.5 / 100);
  const heartCnt = 2147483647 / (oneHeartScore * learningBornus * heartRank * (1 + loveAtract / 100));
  const heartCntElement = document.getElementById("heartcnt");
  heartCntElement.value = Math.ceil(heartCnt);

  // result 更新
  const resultElement = document.getElementById("result");
  const loveScore = calcLoveScore(songSeconds, singerNum, appealSum, masteryLv, loveBornusLv, heartRank, heartCnt, loveAtract);
  resultElement.value = loveScoreToResultDisplayValue(loveScore);
}

/**
 * 獲得LOVEが 2147483647 を超える最小のLOVEアトラクトを計算する
 */
const calcLoveAtract = () => {
  const songSeconds = parseFloat(document.getElementById("song").value, 10);
  const singerNum = parseInt(document.getElementById("singer").value, 10);
  const appealSum = parseInt(document.getElementById("appeal").value, 10);
  const masteryLv = parseInt(document.getElementById("mastery").value, 10);
  const loveBornusLv = parseInt(document.getElementById("lovebornus").value, 10);
  const heartRank = parseFloat(document.getElementById("heartrank").value);
  const heartCnt = parseInt(document.getElementById("heartcnt").value, 10);

  // loveAtract 更新 
  const oneHeartScore = Math.floor((120 * appealSum) / (songSeconds * singerNum));
  const learningBornus = (1 + masteryLv * 0.05 / 100) * (1 + loveBornusLv * 0.5 / 100);
  const loveAtract = 100 * (2147483647 / (oneHeartScore * learningBornus * heartRank * heartCnt) - 1);
  const loveAtractElement = document.getElementById("loveatract");
  loveAtractElement.value = Math.ceil(loveAtract);

  // result 更新
  const resultElement = document.getElementById("result");
  const loveScore = calcLoveScore(songSeconds, singerNum, appealSum, masteryLv, loveBornusLv, heartRank, heartCnt, loveAtract);
  resultElement.value = loveScoreToResultDisplayValue(loveScore);
}

/**
 * ヘルプモーダルを開く
 */
const openHelpModal = (id) => {
  const modal = document.getElementById(id);
  modal.showModal();
}

/**
 * ヘルプモーダルを閉じる
 */
const closeHelpModal = (id) => {
  const modal = document.getElementById(id);
  modal.close();
}

/**
 * DebugMode に切り替える
 */
const toggleDebugMode = () => {
  const debugAreaElement = document.getElementById("debug-area");
  debugAreaElement.style.display = debugAreaElement.style.display === "none" ? null : "none";
}
