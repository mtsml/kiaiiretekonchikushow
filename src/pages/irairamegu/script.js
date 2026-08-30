document.addEventListener('DOMContentLoaded', () => {
  // DOM要素の取得
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  
  // ボール設定
  const ballRadius = 15;
  let ballX, ballY;
  let ballVelocityX = 0;
  let ballVelocityY = 0;
  const acceleration = 0.05; // 加速度係数
  const friction = 0.98; // 摩擦係数（1未満の値）
  const bounce = 0.7; // 反発係数（1未満の値）
  
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
    
    // 速度をリセット
    ballVelocityX = 0;
    ballVelocityY = 0;
    
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
  
  // ボールの移動処理
  function moveBall() {
    // 速度に基づいてボールを移動
    ballX += ballVelocityX;
    ballY += ballVelocityY;
    
    // 摩擦による減速
    ballVelocityX *= friction;
    ballVelocityY *= friction;
    
    // 速度が非常に小さい場合は0にする（停止）
    if (Math.abs(ballVelocityX) < 0.01) ballVelocityX = 0;
    if (Math.abs(ballVelocityY) < 0.01) ballVelocityY = 0;
    
    // 壁との衝突判定と反発
    if (ballX - ballRadius < 0) {
      ballX = ballRadius;
      ballVelocityX = -ballVelocityX * bounce;
    } else if (ballX + ballRadius > canvas.width) {
      ballX = canvas.width - ballRadius;
      ballVelocityX = -ballVelocityX * bounce;
    }
    
    if (ballY - ballRadius < 0) {
      ballY = ballRadius;
      ballVelocityY = -ballVelocityY * bounce;
    } else if (ballY + ballRadius > canvas.height) {
      ballY = canvas.height - ballRadius;
      ballVelocityY = -ballVelocityY * bounce;
    }
  }
  
  // 加速度センサーのイベントハンドラ
  function handleOrientation(event) {
    // ベータ（前後の傾き）とガンマ（左右の傾き）を取得
    const beta = event.beta;  // -180〜180の範囲（前後）
    const gamma = event.gamma; // -90〜90の範囲（左右）
    
    if (beta !== null && gamma !== null) {
      // 傾きに基づいて加速度を計算
      const maxTilt = 10;
      const limitedBeta = Math.max(-maxTilt, Math.min(maxTilt, beta));
      const limitedGamma = Math.max(-maxTilt, Math.min(maxTilt, gamma));
      
      // 加速度を速度に加算
      ballVelocityY += limitedBeta * acceleration;
      ballVelocityX += limitedGamma * acceleration;
    }
  }
  
  // ゲームループ
  function gameLoop() {
    moveBall();
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
