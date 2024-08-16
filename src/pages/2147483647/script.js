/**
 * 獲得LOVEを計算する
 */
const calcLoveValue = (song, singer, appeal, mastery, lovebornus, heartrank, heartcnt, loveatract) => {
  const oneHeartScore = 120 * parseInt(appeal) / (parseInt(song) * parseInt(singer));
  const bornus = 1 + (parseInt(mastery) / 20 + parseFloat(lovebornus)) / 100;
  const loveValue = oneHeartScore * bornus * parseFloat(heartrank) * parseInt(heartcnt) * (1 + parseInt(loveatract) / 100);
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
