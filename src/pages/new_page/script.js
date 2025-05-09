const initAR = () => {
  // スタート画面を非表示にする
  const startScreen = document.getElementById('start-screen');
  if (startScreen) {
    startScreen.style.display = 'none';
  }

  // ARコンテナを表示する
  const arContainer = document.getElementById('ar-container');
  if (arContainer) {
    // 既存のiframeがあれば削除
    while (arContainer.firstChild) {
      arContainer.removeChild(arContainer.firstChild);
    }

    // iframeを作成
    const iframe = document.createElement('iframe');
    iframe.src = 'ar-experience.html';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';

    // コンテナに追加
    arContainer.appendChild(iframe);
    arContainer.style.display = 'block';
  }

  // bodyにar-activeクラスを追加
  document.body.classList.add('ar-active');
  
  // メッセージイベントリスナーを追加
  window.addEventListener('message', handleIframeMessage);
}

// iframeからのメッセージを処理する関数
const handleIframeMessage = (event) => {
  if (event.data === 'exit-ar') {
    exitAR();
  }
}

// AR体験を終了する関数
const exitAR = () => {
  // ARコンテナを非表示にする
  const arContainer = document.getElementById('ar-container');
  if (arContainer) {
    arContainer.style.display = 'none';

    // iframeを削除
    while (arContainer.firstChild) {
      arContainer.removeChild(arContainer.firstChild);
    }
  }

  // スタート画面を表示する
  const startScreen = document.getElementById('start-screen');
  if (startScreen) {
    startScreen.style.display = 'block';
  }

  // bodyからar-activeクラスを削除
  document.body.classList.remove('ar-active');

  // メッセージイベントリスナーを削除
  window.removeEventListener('message', handleIframeMessage);
}
