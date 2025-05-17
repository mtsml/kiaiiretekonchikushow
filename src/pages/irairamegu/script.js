document.addEventListener('DOMContentLoaded', () => {
  // DOM要素の取得
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  
  // ボール設定
  const ballRadius = 15;
  let ballX, ballY;
  const sensitivity = 0.1; // 傾きの感度
  
  // キャンバスのサイズ設定
  function setupCanvas() {
    // モバイルデバイスに適したサイズに設定
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // キャンバスの幅は画面の80%、ただし最大350px
    const canvasWidth = Math.min(screenWidth * 0.8, 350);
    
    // キャンバスの高さは幅と同じ（正方形）
    const canvasHeight = canvasWidth;
    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    return { width: canvasWidth, height: canvasHeight };
  }
  
  // ゲームの初期化
  function initializeGame() {
    const canvasSize = setupCanvas();
    
    // ボールの初期位置（キャンバスの中心）
    ballX = canvasSize.width / 2;
    ballY = canvasSize.height / 2;
    
    // 初期描画
    drawGame();
    
    // ゲームループ開始
    requestAnimationFrame(gameLoop);
  }
  
  // ゲーム画面の描画
  function drawGame() {
    // キャンバスをクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // ボールの描画
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#FF6347'; // トマト色
    ctx.fill();
    ctx.closePath();
  }
  
  // 加速度センサーのイベントハンドラ
  function handleOrientation(event) {
    // ベータ（前後の傾き）とガンマ（左右の傾き）を取得
    const beta = event.beta;  // -180〜180の範囲（前後）
    const gamma = event.gamma; // -90〜90の範囲（左右）
    
    if (beta !== null && gamma !== null) {
      // 傾きに基づいてボールの位置を直接更新
      // 値を制限して急激な動きを防止
      const maxTilt = 10;
      const limitedBeta = Math.max(-maxTilt, Math.min(maxTilt, beta));
      const limitedGamma = Math.max(-maxTilt, Math.min(maxTilt, gamma));
      
      // Y軸（前後）の移動
      ballY += limitedBeta * sensitivity;
      
      // X軸（左右）の移動
      ballX += limitedGamma * sensitivity;
      
      // ボールがキャンバスの外に出ないように制限
      ballX = Math.max(ballRadius, Math.min(canvas.width - ballRadius, ballX));
      ballY = Math.max(ballRadius, Math.min(canvas.height - ballRadius, ballY));
    }
  }
  
  // ゲームループ
  function gameLoop() {
    drawGame();
    requestAnimationFrame(gameLoop);
  }
  
  // 加速度センサーのイベントリスナー
  if (window.DeviceOrientationEvent) {
    // iOS 13+ではユーザーのアクセス許可が必要
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      document.addEventListener('click', () => {
        DeviceOrientationEvent.requestPermission()
          .then(permissionState => {
            if (permissionState === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation);
            } else {
              alert('加速度センサーへのアクセスが許可されませんでした。');
            }
          })
          .catch(console.error);
      }, { once: true });
    } else {
      // 通常のデバイス（許可不要）
      window.addEventListener('deviceorientation', handleOrientation);
    }
  } else {
    alert('お使いのデバイスは加速度センサーをサポートしていません。');
  }
  
  // ゲームの初期化
  initializeGame();
});
