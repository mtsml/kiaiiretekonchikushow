// @ts-check
// このアノテーションは TypeScript の型チェックを JavaScript ファイルに適用するためのコメントである
// このファイルでは試験的に TypeScript の型チェックを有効にしている
// 型チェックによるエラーの解消が難しい場合は @ts-check を削除してもよい

const LOCAL_STORAGE_KEY = 'odekake/cameraArModeEnabled';

/**
 * @typedef ArModel - AR モデル
 * @property {string} src - モデルの相対ファイルパス
 * @property {string} alt - モデルの代替テキスト
 * @property {string} twitterId - モデル作者の Twitter ID (@ は含まない)
 */
/** @type {ArModel[]} */
const models = [
  {
    src: '../../assets/models/hachiban.glb',
    alt: 'hachiban 3D model',
    twitterId: 'pine_nm'
  },
  {
    src: '../../assets/models/kyun.glb',
    alt: 'kyun 3D model',
    twitterId: 'hisaka033'
  },
  {
    src: '../../assets/models/puku.glb',
    alt: 'puku 3D model',
    twitterId: 'pine_nm'
  },
  {
    src: '../../assets/models/akeomeg.glb',
    alt: 'akeomeg 3D model',
    twitterId: 'pine_nm'
  },
  {
    src: '../../assets/models/jk.glb',
    alt: 'jk 3D model',
    twitterId: 'pine_nm'
  },
  {
    src: '../../assets/models/hakuchu.glb',
    alt: 'hakuchu 3D model',
    twitterId: 'pine_nm'
  },
  {
    src: '../../assets/models/doya.glb',
    alt: 'doya 3D model',
    twitterId: 'pine_nm'
  },
  {
    src: '../../assets/models/plank.glb',
    alt: 'plank 3D model',
    twitterId: 'pine_nm'
  },
  {
    src: '../../assets/models/low.glb',
    alt: 'low 3D model',
    twitterId: 'pine_nm'
  },
  {
    src: '../../assets/models/hellomeg.glb',
    alt: 'hellomeg 3D model',
    twitterId: 'pine_nm'
  },
  {
    src: '../../assets/models/ramen.glb',
    alt: 'ramen 3D model',
    twitterId: 'pine_nm'
  },
  {
    src: '../../assets/models/aa.glb',
    alt: 'aa 3D model',
    twitterId: 'pine_nm'
  },
  {
    src: '../../assets/models/katan.glb',
    alt: 'katan 3D model',
    twitterId: 'pine_nm'
  },
  {
    src: '../../assets/models/universe.glb',
    alt: 'universe 3D model',
    twitterId: 'pine_nm'
  },
  {
    src: '../../assets/models/damon.glb',
    alt: 'damon 3D model',
    twitterId: 'pine_nm'
  },
  {
    src: '../../assets/models/stand_megu.glb',
    alt: 'stand_megu 3D model',
    twitterId: 'pine_nm'
  },
  {
    src: '../../assets/models/stand_ruri.glb',
    alt: 'stand_ruri 3D model',
    twitterId: 'pine_nm'
  },
];
let currentSlide = 0;
let cameraArModeEnabled = false;

/**
 * Andorid 判定
 * - Client Hints を優先
 * - フォールバックで User-Agent を使用
 * - @see https://developer.mozilla.org/ja/docs/Web/API/User-Agent_Client_Hints_API
 */
function isAndroid() {
  // @ts-ignore userAgentData が認識されないため ignore
  if (navigator.userAgentData) {
    // @ts-ignore userAgentData が認識されないため ignore
    return /Android/i.test(navigator.userAgentData.platform);
  }
  return /Android/i.test(navigator.userAgent);
}

function loadCameraArModeSettings() {
  try {
    const storedValue = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedValue !== null) {
      return storedValue === 'true';
    }
  } catch (e) {
    console.warn('localStorage access failed, using default cameraArModeEnabled value');
  }
  return false;
}

function toggleCameraArModeEnabled() {
  cameraArModeEnabled = !cameraArModeEnabled;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, String(cameraArModeEnabled));
  } catch (e) {
    console.warn('localStorage save failed');
  }
  const savedSlide = currentSlide;
  initializeModelViewers();
  showSlide(savedSlide);
}

function showSlide(index) {
  // slide を更新
  const slider = document.getElementById('slider');
  if (!slider) return;
  const totalSlides = slider.children.length;
  if (index >= totalSlides) {
    currentSlide = 0;
  } else if (index < 0) {
    currentSlide = totalSlides - 1;
  } else {
    currentSlide = index;
  }
  slider.style.transform = `translateX(-${currentSlide * 100}%)`;

  // twitter リンクを更新
  const twitterLink = /** @type {HTMLAnchorElement | null} */ (document.getElementById('twitter-link'));
  if (!twitterLink) return;
  const twitterId = models[currentSlide].twitterId;
  twitterLink.innerText = `イラスト：@${twitterId}`;
  twitterLink.href = `https://twitter.com/${twitterId}`;
  twitterLink.target = '_blank';
}

function nextSlide() {
  showSlide(currentSlide + 1);
}

function prevSlide() {
  showSlide(currentSlide - 1);
}

function initializeModelViewers() {
  const slider = document.getElementById('slider');
  if (!slider) return;

  slider.innerHTML = '';
  
  models.forEach((model) => {
    const modelViewer = document.createElement('model-viewer');
    // @ts-ignore modelViewer の型情報が存在しないため ignore
    modelViewer.src = model.src;
    // @ts-ignore modelViewer の型情報が存在しないため ignore
    modelViewer.alt = model.alt;
    modelViewer.setAttribute('camera-controls', '');
    modelViewer.setAttribute('ar', '');
    if (isAndroid() && cameraArModeEnabled) {
      modelViewer.setAttribute('ar-modes', 'scene-viewer quick-look');
    }
    slider.appendChild(modelViewer);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (isAndroid()) {
    // Android は複数の AR Viewer を利用できるため、ユーザーによる AR Viewer 切り替えをサポートするため下記の機能を提供する
    // - カメラ機能付きの AR Viewer である scene-viewer のオンオフ `cameraArModeEnabled` をチェックボックスで切り替える
    // - チェックボックスの値は localStorage に保存して次回読み込み時に復元する

    cameraArModeEnabled = loadCameraArModeSettings();

    const toggleContainer = document.getElementById('ar-toggle-container');
    const toggleCheckbox = /** @type {HTMLInputElement | null} */ (document.getElementById('ar-modes-toggle'));
    if (!toggleContainer || !toggleCheckbox) return;
    toggleContainer.style.display = 'block';
    toggleCheckbox.checked = cameraArModeEnabled;
    toggleCheckbox.addEventListener('change', toggleCameraArModeEnabled);
  }

  initializeModelViewers();
  showSlide(currentSlide);  
});
