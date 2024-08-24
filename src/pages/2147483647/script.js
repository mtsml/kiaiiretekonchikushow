const LOCAL_STORAGE_KEYS = {
  INPUT_VALUES: "INPUT_VALUES",
}

const SONGS = [
  {
    ID: "JUU3JTlDJUE5JUU4JTgwJTgwJUU1JUE0JTlDJUU4JUExJThDJUVGJUJDJTg4MTA0JUU2JTlDJTlGVmVyLiVFRiVCQyU4OQ==",
    NAME: "眩耀夜行（104期Ver.）",
    SECONDS: 97,
    SINGERSNUM: 3,
  },
  {
    ID: "TWlyYWdlJTIwVm95YWdlJUVGJUJDJTg4MTA0JUU2JTlDJTlGVmVyLiVFRiVCQyU4OQ==",
    NAME: "Mirage Voyage（104期Ver.）",
    SECONDS: 113,
    SINGERSNUM: 3,
  },
  {
    ID: "JUU1JUE0JThGJUU4JTg5JUIyJUUzJTgxJTg4JUUzJTgxJThDJUUzJTgxJThBJUUzJTgxJUE3MSUyQzIlMkNKdW1wIQ==",
    NAME: "夏色えがおで1,2,Jump!",
    SECONDS: 121,
    SINGERSNUM: 9,
  },
];

/**
 * result.value にセットする値を返却する
 */
const getResultValue = (
  songSeconds,
  singerNum,
  appealSmile,
  appealPure,
  appealCool,
  masteryLv,
  loveBornusLv,
  heartRank,
  heartCnt,
  loveAtract
) => {
  hundleChangeFieldValue();

  /*
    TODO: <output/> を利用しないようにリファクタする。

    以降は oninput のため処理。
    hundleChangeFieldValue のみで必要処理はすべて完了している。
  */

  // LOVE計算
  const loveScore = calcLoveScore(
    songSeconds,
    singerNum,
    appealSmile,
    appealPure,
    appealCool,
    masteryLv,
    loveBornusLv,
    heartRank,
    heartCnt,
    loveAtract
  );

  return toResultDisplayValue(loveScore);
}

/**
 * field の値の変化をハンドル
 */
const hundleChangeFieldValue = () => {
  const selectedSongId = document.getElementById("songSelect").value;
  const songSeconds = parseFloat(document.getElementById("song").value);
  const singerNum = parseInt(document.getElementById("singer").value, 10);
  const appealSmile = parseInt(document.getElementById("appealSmile").value, 10);
  const appealPure = parseInt(document.getElementById("appealPure").value, 10);
  const appealCool = parseInt(document.getElementById("appealCool").value, 10);
  const masteryLv = parseInt(document.getElementById("mastery").value, 10);
  const loveBornusLv = parseInt(document.getElementById("lovebornus").value, 10);
  const heartRank = parseFloat(document.getElementById("heartrank").value);
  const heartCnt = parseInt(document.getElementById("heartcnt").value, 10);
  const loveAtract = parseInt(document.getElementById("loveatract").value, 10);

  // localStorage に保存
  try {
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.INPUT_VALUES,
      JSON.stringify({
        selectedSongId,
        songSeconds,
        singerNum,
        appealSmile,
        appealPure,
        appealCool,
        masteryLv,
        loveBornusLv,
        heartRank,
        heartCnt,
        loveAtract,  
      }),
    );
  } catch (e) {
    console.error(e);
  }

  // 他の項目がすべて入力されている場合に自動計算を有効にする
  const autoCalcHeartCntElement = document.getElementById("auto-calc-heartcnt");
  const autoCalcHeatCntIsDisabled = [
      songSeconds, singerNum, appealSmile, appealPure, appealCool, masteryLv, loveBornusLv, heartRank, loveAtract
    ].some(item => isNaN(parseInt(item, 10)));
  autoCalcHeartCntElement.disabled = autoCalcHeatCntIsDisabled;
  const autoCalcLoveAtractElement = document.getElementById("auto-calc-loveatract");
  const autoCalcLoveAtractIsDisabled = [
    songSeconds, singerNum, appealSmile, appealPure, appealCool, masteryLv, loveBornusLv, heartRank, heartCnt
  ].some(item => isNaN(parseInt(item, 10)));
  autoCalcLoveAtractElement.disabled = autoCalcLoveAtractIsDisabled;

  // LOVE計算
  const loveScore = calcLoveScore(
    songSeconds,
    singerNum,
    appealSmile,
    appealPure,
    appealCool,
    masteryLv,
    loveBornusLv,
    heartRank,
    heartCnt,
    loveAtract
  );

  // debugArea を更新
  const debugAreaElement = document.getElementById("debug-area");
  debugAreaElement.textContent = Math.round(loveScore);

  // result 更新
  const resultElement = document.getElementById("result");
  resultElement.value = toResultDisplayValue(loveScore);
}

/**
 * 獲得LOVEを計算する
 */
const calcLoveScore = (
  songSeconds,
  singerNum,
  appealSmile,
  appealPure,
  appealCool,
  masteryLv,
  loveBornusLv,
  heartRank,
  heartCnt,
  loveAtract
) => {
  // MEMO: floor か round かは不明
  const oneHeartScore = Math.floor((120 * (appealSmile + appealPure + appealCool)) / (songSeconds * singerNum));
  const learningBornus = (1 + masteryLv * 0.05 / 100) * (1 + loveBornusLv * 0.5 / 100);
  const loveScore = Math.floor(oneHeartScore * learningBornus * heartRank * (1 + loveAtract / 100)) * heartCnt;
  return loveScore;
}

/**
 * loveScore を表示用の value に変換する
 */
const toResultDisplayValue = (loveScore) => {
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
  const appealSmile = parseInt(document.getElementById("appealSmile").value, 10);
  const appealPure = parseInt(document.getElementById("appealPure").value, 10);
  const appealCool = parseInt(document.getElementById("appealCool").value, 10);
  const masteryLv = parseInt(document.getElementById("mastery").value, 10);
  const loveBornusLv = parseInt(document.getElementById("lovebornus").value, 10);
  const heartRank = parseFloat(document.getElementById("heartrank").value);
  const loveAtract = parseInt(document.getElementById("loveatract").value, 10);

  // heartcnt 更新
  const oneHeartScore = Math.floor((120 * (appealSmile + appealPure + appealCool)) / (songSeconds * singerNum));
  const learningBornus = (1 + masteryLv * 0.05 / 100) * (1 + loveBornusLv * 0.5 / 100);
  const heartCnt = 2147483647 / (oneHeartScore * learningBornus * heartRank * (1 + loveAtract / 100));
  const heartCntElement = document.getElementById("heartcnt");
  heartCntElement.value = Math.ceil(heartCnt);

  // result 更新
  hundleChangeFieldValue();
}

/**
 * 獲得LOVEが 2147483647 を超える最小のLOVEアトラクトを計算する
 */
const calcLoveAtract = () => {
  const songSeconds = parseFloat(document.getElementById("song").value);
  const singerNum = parseInt(document.getElementById("singer").value, 10);
  const appealSmile = parseInt(document.getElementById("appealSmile").value, 10);
  const appealPure = parseInt(document.getElementById("appealPure").value, 10);
  const appealCool = parseInt(document.getElementById("appealCool").value, 10);
  const masteryLv = parseInt(document.getElementById("mastery").value, 10);
  const loveBornusLv = parseInt(document.getElementById("lovebornus").value, 10);
  const heartRank = parseFloat(document.getElementById("heartrank").value);
  const heartCnt = parseInt(document.getElementById("heartcnt").value, 10);

  // loveAtract 更新 
  const oneHeartScore = Math.floor((120 * (appealSmile + appealPure + appealCool)) / (songSeconds * singerNum));
  const learningBornus = (1 + masteryLv * 0.05 / 100) * (1 + loveBornusLv * 0.5 / 100);
  const loveAtract = 100 * (2147483647 / (oneHeartScore * learningBornus * heartRank * heartCnt) - 1);
  const loveAtractElement = document.getElementById("loveatract");
  loveAtractElement.value = Math.ceil(loveAtract);

  // result 更新
  hundleChangeFieldValue();
}

/**
 * 楽曲選択時処理
 */
const selectSong = (e) => {
  const selectedSongId = e.target.value;
  const selectedSong = SONGS.find(song => song.ID === selectedSongId);

  if (!selectedSong) return;

  document.getElementById("song").value = selectedSong.SECONDS;
  document.getElementById("singer").value = selectedSong.SINGERSNUM;

  hundleChangeFieldValue();
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
 * DebugMode を切り替える
 */
const toggleDebugMode = () => {
  const debugAreaElement = document.getElementById("debug-area");
  debugAreaElement.style.display = debugAreaElement.style.display === "none" ? null : "none";
}

window.addEventListener("DOMContentLoaded", () => {
  // 楽曲選択欄を更新
  const songSelectElement = document.getElementById("songSelect");
  SONGS.forEach(SONG => {
    const optionElement = document.createElement("option");
    optionElement.value = SONG.ID;
    optionElement.textContent = SONG.NAME;
    songSelectElement.appendChild(optionElement);
  });

  // localStorage から値を復元
  try {
    const inputValues = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.INPUT_VALUES));
    document.getElementById("songSelect").value = inputValues.selectedSongId;
    document.getElementById("song").value = parseFloat(inputValues.songSeconds);
    document.getElementById("singer").value = parseInt(inputValues.singerNum, 10);
    document.getElementById("appealSmile").value = parseInt(inputValues.appealSmile, 10);
    document.getElementById("appealPure").value = parseInt(inputValues.appealPure, 10);
    document.getElementById("appealCool").value = parseInt(inputValues.appealCool, 10);
    document.getElementById("mastery").value = parseInt(inputValues.masteryLv, 10);
    document.getElementById("lovebornus").value = parseInt(inputValues.loveBornusLv, 10);
    document.getElementById("heartrank").value = parseFloat(inputValues.heartRank);
    document.getElementById("heartcnt").value = parseInt(inputValues.heartCnt, 10);
    document.getElementById("loveatract").value = parseInt(inputValues.loveAtract, 10)
  } catch (e) {
    console.error(e);
  }

  hundleChangeFieldValue();
});
