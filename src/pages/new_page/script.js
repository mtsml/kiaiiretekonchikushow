// script.js
document.addEventListener('DOMContentLoaded', () => {
  // めぐポイントの緯度経度
  const meguPoint = {
    latitude: 35.728493054835496,
    longitude: 139.69921490383388
  };
  
  // 表示可能な最大距離（メートル）
  const MAX_DISTANCE = 1000; // 1km以内なら表示
  
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

    // Android向けの位置情報取得エラーハンドリングを強化
    try {
      // 位置情報の取得を開始
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // 位置情報取得成功
          // めぐポイントとの距離を計算
          const distance = calculateDistance(
            position.coords.latitude, 
            position.coords.longitude,
            meguPoint.latitude,
            meguPoint.longitude
          );
          
          console.log(`めぐポイントまでの距離: ${distance.toFixed(2)}mめぐ`);
          
          // 距離が一定以内ならAR体験を開始
          if (distance <= MAX_DISTANCE) {
            startARExperience(position, meguPoint);
          } else {
            // 距離が遠い場合はメッセージを表示
            alert(`めぐポイントから${distance.toFixed(2)}m離れていますめぐ。\nめぐポイント周辺（${MAX_DISTANCE}m以内）でご利用くださいめぐ。`);
          }
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
          
          // デバッグモード：テスト用に固定位置でAR体験を開始（本番環境では削除）
          const testPosition = {
            coords: {
              latitude: meguPoint.latitude + 0.0001, // めぐポイントから少し離れた位置
              longitude: meguPoint.longitude + 0.0001
            }
          };
          startARExperience(testPosition, meguPoint);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000, // タイムアウトを15秒に延長
          maximumAge: 0
        }
      );
    } catch (e) {
      console.error('位置情報APIでエラーが発生しましためぐ:', e);
      alert('位置情報の取得中にエラーが発生しましためぐ。ブラウザを更新して再度お試しくださいめぐ。');
    }
  }
  
  // 2点間の距離をメートルで計算する関数（ハーバーサイン公式）
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // 地球の半径（メートル）
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // メートル単位の距離
  }

  // AR体験を開始する関数
  function startARExperience(userPosition, targetPosition) {
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
      // ユーザーの現在位置と秋葉原駅の位置を両方渡す
      iframe.src = `ar-experience.html?userLat=${userPosition.coords.latitude}&userLng=${userPosition.coords.longitude}&targetLat=${targetPosition.latitude}&targetLng=${targetPosition.longitude}`;
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
