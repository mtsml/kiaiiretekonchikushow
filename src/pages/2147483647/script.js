const LOCAL_STORAGE_KEYS = {
  SELECTED_SONG_ID: "SELECTED_SONG_ID",
  INPUT_VALUES: "INPUT_VALUES",
}

const DEFAULT_SONG_ID = "default";

const songs = [
  {
    id: DEFAULT_SONG_ID,
    name: "楽曲未選択",
  },
  {
    id: "REVFUE5FU1MlRUYlQkMlODhSZUMlMjBWZXIuJUVGJUJDJTg5",
    name: "DEEPNESS（ReC Ver.）",
    seconds: 105,
    singersNum: 6,
  },
  {
    id: "UHJvb2Y=",
    name: "Proof",
    seconds: 108,
    singersNum: 3,
  },
  {
    id: "JUUzJTgzJUFDJUUzJTgzJTg3JUUzJTgyJUEzJUUzJTgzJTkwJUUzJTgyJUIw",
    name: "レディバグ",
    seconds: 94,
    singersNum: 3,
  },
  {
    id: "JUU3JTlDJUE5JUU4JTgwJTgwJUU1JUE0JTlDJUU4JUExJThDJUVGJUJDJTg4MTA0JUU2JTlDJTlGVmVyLiVFRiVCQyU4OQ==",
    name: "眩耀夜行（104期Ver.）",
    seconds: 97,
    singersNum: 3,
  },
  {
    id: "TWlyYWdlJTIwVm95YWdlJUVGJUJDJTg4MTA0JUU2JTlDJTlGVmVyLiVFRiVCQyU4OQ==",
    name: "Mirage Voyage（104期Ver.）",
    seconds: 113,
    singersNum: 3,
  },
  {
    id: "JUU1JUE0JThGJUU4JTg5JUIyJUUzJTgxJTg4JUUzJTgxJThDJUUzJTgxJThBJUUzJTgxJUE3MSUyQzIlMkNKdW1wIQ==",
    name: "夏色えがおで1,2,Jump!",
    seconds: 121,
    singersNum: 9,
  },
];

/**
 * 入力値の変化をハンドル
 */
const hundleChangeFieldValue = () => {
  const selectedSongId = document.getElementById("selectedSongId").value;
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
  saveInputValuesToLocalStorage(
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
  );

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
const paging = (isNext) => {
  const currentSongId = document.getElementById("selectedSongId").value;
  const currentSongIndex = songs.findIndex(song => song.id === currentSongId);

  let nextSongIndex = 0;
  switch (isNext) {
    case true:
      nextSongIndex = currentSongIndex === songs.length - 1 ? 0 : currentSongIndex + 1;
      break;
    case false:
      nextSongIndex = currentSongIndex === 0 ? songs.length - 1 : currentSongIndex - 1;
      break;
  }
  const nextSong = songs[nextSongIndex];
  document.getElementById("selectedSongId").value = nextSong.id;
  document.getElementById("selectedSongName").textContent = nextSong.name;

  // localStorage に保存
  try {
    localStorage.setItem(LOCAL_STORAGE_KEYS.SELECTED_SONG_ID, JSON.stringify(nextSong.id));
  } catch (e) {
    console.error(e);
  }

  // localStorage から復元
  restoreInputValuesFromLocalStorage(nextSong.id);

  // MEMO: 楽曲情報は入力値を保存できない仕様
  const selectedSong = songs.find(song => song.id === nextSong.id);
  if (selectedSong) {
    document.getElementById("song").value = selectedSong.seconds;
    document.getElementById("singer").value = selectedSong.singersNum;
  };

  hundleChangeFieldValue();
}

/**
 * 入力値を削除する
 */
const clearInputValue = (id) => {
  document.getElementById(id).value = null;

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

/**
 * localStorage に入力値を保存する
 */
const saveInputValuesToLocalStorage = (
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
) => {
  try {
    const nextSongData =  {
      id: selectedSongId,
      songSeconds: isNaN(songSeconds) ? null : songSeconds,
      singerNum: isNaN(singerNum) ? null : singerNum,
      appealSmile: isNaN(appealSmile) ? null : appealSmile,
      appealPure: isNaN(appealPure) ? null : appealPure,
      appealCool: isNaN(appealCool) ? null : appealCool,
      masteryLv: isNaN(masteryLv) ? null : masteryLv,
      loveBornusLv: isNaN(loveBornusLv) ? null : loveBornusLv,
      heartRank: isNaN(heartRank) ? null : heartRank,
      heartCnt: isNaN(heartCnt) ? null : heartCnt,
      loveAtract: isNaN(loveAtract) ? null : loveAtract,
    };

    let savedInputValues = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.INPUT_VALUES));

    if (!Array.isArray(savedInputValues)) {
      savedInputValues = [];
    }

    const savedSelectedSongDataIndex = savedInputValues.findIndex(song => song.id === selectedSongId);
    if (savedSelectedSongDataIndex !== -1) {
      savedInputValues[savedSelectedSongDataIndex] = nextSongData;
    } else {
      savedInputValues.push(nextSongData);
    }

    localStorage.setItem(LOCAL_STORAGE_KEYS.INPUT_VALUES, JSON.stringify(savedInputValues));
  } catch (e) {
    console.error(e);
  }
}

/**
 * localStorage から入力値を復元する
 */
const restoreInputValuesFromLocalStorage = (songId) => {
  try {
    const savedInputValues = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.INPUT_VALUES));
    const savedInputValue = Array.isArray(savedInputValues) && savedInputValues.find(value => value.id === songId);

    if (savedInputValue) {
      document.getElementById("appealSmile").value = parseInt(savedInputValue.appealSmile, 10);
      document.getElementById("appealPure").value = parseInt(savedInputValue.appealPure, 10);
      document.getElementById("appealCool").value = parseInt(savedInputValue.appealCool, 10);
      document.getElementById("mastery").value = parseInt(savedInputValue.masteryLv, 10);
      document.getElementById("lovebornus").value = parseInt(savedInputValue.loveBornusLv, 10);
      document.getElementById("heartrank").value = parseFloat(savedInputValue.heartRank);
      document.getElementById("heartcnt").value = parseInt(savedInputValue.heartCnt, 10);
      document.getElementById("loveatract").value = parseInt(savedInputValue.loveAtract, 10);

      // 楽曲未選択の場合は楽曲情報も復元する
      if (songId === DEFAULT_SONG_ID) {
        document.getElementById("song").value = parseFloat(savedInputValue.songSeconds);
        document.getElementById("singer").value = parseInt(savedInputValue.singerNum, 10);
      }      
    }
  } catch (e) {
    console.error(e);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  // localStorage を初期化
  try {
    let savedInputValues = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.INPUT_VALUES));

    if (!Array.isArray(savedInputValues)) {
      savedInputValues = [];
    }

    songs.forEach(song => {
      if (!savedInputValues.find(value => value.id === song.id)) {
        savedInputValues.push({
          id: song.id,
          songSeconds: song.seconds,
          singerNum: song.singersNum,
          appealSmile: null,
          appealPure: null,
          appealCool: null,
          masteryLv: null,
          loveBornusLv: null,
          heartRank: 3.5,
          heartCnt: null,
          loveAtract: null,
        });
      }
    });
    localStorage.setItem(LOCAL_STORAGE_KEYS.INPUT_VALUES, JSON.stringify(savedInputValues));

    const savedSelectedSongId = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.SELECTED_SONG_ID));
    const selectedSong = songs.find(song => song.id === savedSelectedSongId);
    if (selectedSong) {
      document.getElementById("selectedSongId").value = selectedSong.id;
      document.getElementById("selectedSongName").textContent = selectedSong.name;
      document.getElementById("song").value = selectedSong.seconds;
      document.getElementById("singer").value = selectedSong.singersNum;
    } else {
      // MEMO: 初回のみ
      document.getElementById("selectedSongId").value = DEFAULT_SONG_ID;
      document.getElementById("selectedSongName").textContent = "楽曲未選択";
    }
  
    const selectedSongId = savedSelectedSongId || DEFAULT_SONG_ID;
    restoreInputValuesFromLocalStorage(selectedSongId);
  } catch (e) {
    console.error(e);
  }

  hundleChangeFieldValue();
});
