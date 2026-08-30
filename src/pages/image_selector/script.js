/** @type {Set<string>} 選択された画像IDのセット */
const selectedImages = new Set();

/**
 * 画像の選択状態を切り替える
 * @param {HTMLElement} element - クリックされた画像要素
 */
const toggleImage = (element) => {
  const imageId = element.dataset.imageId;

  if (selectedImages.has(imageId)) {
    selectedImages.delete(imageId);
    element.classList.remove('selected');
  } else {
    selectedImages.add(imageId);
    element.classList.add('selected');
  }

  updateUI();
};

/**
 * UIを更新する（送信ボタンの状態）
 */
const updateUI = () => {
  const submitButton = document.getElementById('submit-selection');
  submitButton.disabled = selectedImages.size === 0;
};

/**
 * 選択された画像を送信し、正解判定を行う
 * @returns {Promise<void>}
 */
const submitSelection = async () => {
  if (selectedImages.size === 0) return;
  
  const selectedArray = Array.from(selectedImages).sort();
  const selectedString = selectedArray.join(',');
  
  // 選択された画像IDの組み合わせをハッシュ化
  const hash = await generateHash(selectedString);
  
  // 正解のハッシュ値
  const correctHash = '43f78d1e707b93cfac8d2dde7a13530fd77a5ad7a6a06ca6839851dc5746c107';
  
  if (hash === correctHash) {
    await showResult(true);
  } else {
    await showResult(false);
  }
};

/**
 * 文字列のSHA-256ハッシュを生成する
 * @param {string} text - ハッシュ化する文字列
 * @returns {Promise<string>} 16進数文字列のハッシュ値
 */
const generateHash = async (text) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

/**
 * 結果を表示する
 * @param {boolean} isCorrect - 正解かどうか
 */
const showResult = async (isCorrect) => {
  const dialog = isCorrect
    ? document.getElementById('success-dialog')
    : document.getElementById('failure-dialog');  

  if (isCorrect) {
    const link = document.getElementById('success-link');
    // ソルトを追加して画像URLを生成
    const imageUrl = await generateImageUrl();
    link.href = imageUrl;
  }

  dialog.showModal();
};

/**
 * 正解画像のURLを動的に生成する
 * @returns {Promise<string>} 画像のURL
 */
const generateImageUrl = async () => {
  // 選択された画像IDにソルトを追加
  const selectedArray = Array.from(selectedImages).sort();
  const selectedString = selectedArray.join(',');
  const salt = 'hasunosorani3kai';
  const saltedString = selectedString + salt;
  
  // ソルト付きでハッシュ化
  const hash = await generateHash(saltedString);
  
  // ハッシュ値から画像URLを構築
  const baseUrl = '../../assets/';
  const imageUrl = `${baseUrl}${hash}.png`;
  
  return imageUrl;
};

/**
 * 結果ダイアログを閉じる
 */
const closeResultDialog = (id) => {
  const dialog = document.getElementById(id);
  dialog.close();
};
