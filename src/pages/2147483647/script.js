/**
 * result.value にセットする値を返却する
 */
const getResultValue = (song, singer, appeal, mastery, lovebornus, heartrank, heartcnt, loveatract) => {
  // 他の項目がすべて入力されている場合に自動計算を有効にする
  const autoCalcHeartCntElement = document.getElementById("auto-calc-heartcnt");
  if ([song, singer, appeal, mastery, lovebornus, heartrank, loveatract].some(item => isNaN(parseInt(item, 10)))) {
    autoCalcHeartCntElement.disabled = true;
  } else {
    autoCalcHeartCntElement.disabled = false;
  }
  const autoCalcLoveAtractElement = document.getElementById("auto-calc-loveatract");
  if ([song, singer, appeal, mastery, lovebornus, heartrank, heartcnt].some(item => isNaN(parseInt(item, 10)))) {
    autoCalcLoveAtractElement.disabled = true;
  } else {
    autoCalcLoveAtractElement.disabled = false;
  }

  const loveValue = calcLoveValue(song, singer, appeal, mastery, lovebornus, heartrank, heartcnt, loveatract);

  if (isNaN(loveValue)) {
    return "NaNダロナ";
  } else {
    const displayValue = Math.round(loveValue / 100000000)
    if (displayValue == 0) {
      return "1億未満！";
    } else {
      return `だいたい${displayValue}億！`;
    }
  }
}

/**
 * 獲得LOVEを計算する
 */
const calcLoveValue = (song, singer, appeal, mastery, lovebornus, heartrank, heartcnt, loveatract) => {
  const oneHeartScore = 120 * parseInt(appeal, 10) / (parseInt(song, 10) * parseInt(singer, 10));
  const bornus = 1 + (parseInt(mastery, 10) / 20 + parseFloat(lovebornus)) / 100;
  const loveValue = oneHeartScore * bornus * parseFloat(heartrank) * parseInt(heartcnt, 10) * (1 + parseInt(loveatract, 10) / 100);
  return loveValue;
}

/**
 * 獲得LOVEが 2147483647 を超える最小のハート個数を計算する
 */
const calcHeartCnt = () => {
  const song = document.getElementById("song").value;
  const singer = document.getElementById("singer").value;
  const appeal = document.getElementById("appeal").value;
  const mastery = document.getElementById("mastery").value;
  const lovebornus = document.getElementById("lovebornus").value;
  const heartrank = document.getElementById("heartrank").value;
  const loveatract = document.getElementById("loveatract").value;

  const oneHeartScore = 120 * parseInt(appeal, 10) / (parseInt(song, 10) * parseInt(singer, 10));
  const bornus = 1 + (parseInt(mastery, 10) / 20 + parseFloat(lovebornus)) / 100;
  const heartcnt = 2147483647 / (oneHeartScore * bornus * parseFloat(heartrank) * (1 + parseInt(loveatract) / 100))

  const heartCntElement = document.getElementById("heartcnt");
  heartCntElement.value = Math.ceil(heartcnt);
  const resultElement = document.getElementById("result");
  resultElement.value = getResultValue(song, singer, appeal, mastery, lovebornus, heartrank, heartcnt, loveatract);
}

/**
 * 獲得LOVEが 2147483647 を超える最小のLOVEアトラクトを計算する
 */
const calcLoveAtract = () => {
  const song = document.getElementById("song").value;
  const singer = document.getElementById("singer").value;
  const appeal = document.getElementById("appeal").value;
  const mastery = document.getElementById("mastery").value;
  const lovebornus = document.getElementById("lovebornus").value;
  const heartrank = document.getElementById("heartrank").value;
  const heartcnt = document.getElementById("heartcnt").value;

  const oneHeartScore = 120 * parseInt(appeal, 10) / (parseInt(song, 10) * parseInt(singer, 10));
  const bornus = 1 + (parseInt(mastery, 10) / 20 + parseFloat(lovebornus)) / 100;
  const loveatract = 100 * (2147483647 / (oneHeartScore * bornus * parseFloat(heartrank) * parseInt(heartcnt, 10)) - 1);

  const loveAtractElement = document.getElementById("loveatract");
  loveAtractElement.value = Math.ceil(loveatract);
  const resultElement = document.getElementById("result");
  resultElement.value = getResultValue(song, singer, appeal, mastery, lovebornus, heartrank, heartcnt, loveatract);
}
