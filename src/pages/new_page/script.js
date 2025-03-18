// script.js
document.addEventListener('DOMContentLoaded', () => {
  // AR開始ボタンのイベントリスナー
  const startARButton = document.getElementById('start-ar');
  if (startARButton) {
    startARButton.addEventListener('click', initAR);
  }

  // AR体験を初期化する関数
  function initAR() {
    // 位置情報なしでAR体験を開始
    startARExperience();
    
    console.log('位置情報なしでAR体験を開始しますめぐ');
  }

  // AR体験を開始する関数
  function startARExperience() {
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
      // 位置情報なしでAR体験ページを読み込む
      iframe.src = 'ar-experience.html';
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      
      // デバッグ情報をコンソールに出力
      console.log('AR体験を開始しますめぐ');
      
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
  function handleIframeMessage(event) {
    if (event.data === 'exit-ar') {
      exitAR();
    }
  }

  // AR体験を終了する関数
  function exitAR() {
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
});
