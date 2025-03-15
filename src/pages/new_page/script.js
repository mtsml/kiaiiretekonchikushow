// script.js
document.addEventListener('DOMContentLoaded', () => {
  // AR開始ボタンのイベントリスナー
  const startARButton = document.getElementById('start-ar');
  if (startARButton) {
    startARButton.addEventListener('click', initAR);
  }

  // AR体験を初期化する関数
  function initAR() {
    // 位置情報の権限をチェック
    if (!navigator.geolocation) {
      alert('お使いのブラウザは位置情報をサポートしていませんめぐ。');
      return;
    }

    // 位置情報の取得を開始
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // 位置情報取得成功
        startARExperience(position);
      },
      (error) => {
        // 位置情報取得エラー
        console.error('位置情報の取得に失敗しましためぐ:', error);
        alert('位置情報の取得に失敗しましためぐ。位置情報の許可を確認してくださいめぐ。');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }

  // AR体験を開始する関数
  function startARExperience(position) {
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
      iframe.src = `ar-experience.html?lat=${position.coords.latitude}&lng=${position.coords.longitude}`;
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
