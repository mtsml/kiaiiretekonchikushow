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
        // 位置情報取得成功したらAR体験を開始
        startARExperience(position);
        console.log('位置情報を取得しましためぐ:', {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        // 位置情報取得エラー
        console.error('位置情報の取得に失敗しましためぐ:', error);
        
        // エラーコードに応じたメッセージを表示
        let errorMessage = '位置情報の取得に失敗しましためぐ。';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += '位置情報へのアクセスが拒否されましためぐ。設定から位置情報の許可を確認してくださいめぐ。';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += '位置情報が利用できませんめぐ。屋外でお試しくださいめぐ。';
            break;
          case error.TIMEOUT:
            errorMessage += '位置情報の取得がタイムアウトしましためぐ。再度お試しくださいめぐ。';
            break;
          default:
            errorMessage += '位置情報の許可を確認してくださいめぐ。';
        }
        
        alert(errorMessage);
        
        // エラーが発生しても、デフォルトの位置情報でAR体験を開始
        const defaultPosition = {
          coords: {
            latitude: 35.681236,  // 東京駅の緯度
            longitude: 139.767125 // 東京駅の経度
          }
        };
        startARExperience(defaultPosition);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000, // タイムアウトを15秒に設定
        maximumAge: 0
      }
    );
  }

  // AR体験を開始する関数
  function startARExperience(userPosition) {
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
      // ユーザーの位置情報をURLパラメータとして渡す
      iframe.src = `ar-experience.html?userLat=${userPosition.coords.latitude}&userLng=${userPosition.coords.longitude}`;
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      
      // デバッグ情報をコンソールに出力
      console.log('ユーザー位置情報をiframeに渡します:', {
        latitude: userPosition.coords.latitude,
        longitude: userPosition.coords.longitude
      });
      
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
