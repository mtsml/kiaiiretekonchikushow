// script.js
document.addEventListener('DOMContentLoaded', () => {
  // AR開始ボタンのイベントリスナー
  const startARButton = document.getElementById('start-ar');
  if (startARButton) {
    startARButton.addEventListener('click', initAR);
  }

  // 戻るボタンを作成する関数
  function createBackButton() {
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'ar-controls';
    
    const backButton = document.createElement('button');
    backButton.textContent = 'AR体験を終了';
    backButton.addEventListener('click', exitAR);
    
    controlsDiv.appendChild(backButton);
    document.body.appendChild(controlsDiv);
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
      arContainer.style.display = 'block';
    }
    
    // bodyにar-activeクラスを追加
    document.body.classList.add('ar-active');
    
    // 戻るボタンを作成
    createBackButton();
    
    // 位置情報に基づいてARエンティティを配置
    placeAREntities(position);
  }

  // 位置情報に基づいてARエンティティを配置する関数
  function placeAREntities(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    
    console.log('現在位置めぐ:', latitude, longitude);
    
    // ARシーンを取得
    const scene = document.querySelector('a-scene');
    
    // 現在地から一定範囲内にランダムにロゴを配置
    for (let i = 0; i < 10; i++) {
      // 約10m範囲内にランダムに配置（緯度経度の0.0001は約10m）
      const latDiff = (Math.random() - 0.5) * 0.0001;
      const lonDiff = (Math.random() - 0.5) * 0.0001;
      
      // a-imageエンティティを作成
      const logoEntity = document.createElement('a-image');
      logoEntity.setAttribute('src', '../../assets/logo-512x512.png');
      logoEntity.setAttribute('look-at', '[gps-camera]');
      logoEntity.setAttribute('scale', '1 1 1');
      logoEntity.setAttribute('gps-entity-place', `latitude: ${latitude + latDiff}; longitude: ${longitude + lonDiff}`);
      
      // 距離表示用のテキストを追加
      const textEntity = document.createElement('a-text');
      textEntity.setAttribute('value', `ロゴ ${i+1}`);
      textEntity.setAttribute('look-at', '[gps-camera]');
      textEntity.setAttribute('scale', '1 1 1');
      textEntity.setAttribute('position', '0 1.5 0');
      textEntity.setAttribute('align', 'center');
      textEntity.setAttribute('color', 'white');
      textEntity.setAttribute('gps-entity-place', `latitude: ${latitude + latDiff}; longitude: ${longitude + lonDiff}`);
      
      // シーンに追加
      scene.appendChild(logoEntity);
      scene.appendChild(textEntity);
      
      console.log(`ロゴを配置しましためぐ: ${latitude + latDiff}, ${longitude + lonDiff}`);
    }
  }

  // AR体験を終了する関数
  function exitAR() {
    // ARコンテナを非表示にする
    const arContainer = document.getElementById('ar-container');
    if (arContainer) {
      arContainer.style.display = 'none';
    }
    
    // スタート画面を表示する
    const startScreen = document.getElementById('start-screen');
    if (startScreen) {
      startScreen.style.display = 'block';
    }
    
    // bodyからar-activeクラスを削除
    document.body.classList.remove('ar-active');
    
    // コントロールを削除
    const controls = document.querySelector('.ar-controls');
    if (controls) {
      controls.remove();
    }
    
    // ARシーンをリセット
    const scene = document.querySelector('a-scene');
    // 画像エンティティを削除
    const imageEntities = scene.querySelectorAll('a-image[gps-entity-place]');
    imageEntities.forEach(entity => {
      entity.remove();
    });
    // テキストエンティティを削除
    const textEntities = scene.querySelectorAll('a-text[gps-entity-place]');
    textEntities.forEach(entity => {
      entity.remove();
    });
  }
});
