document.addEventListener('DOMContentLoaded', () => {
  // DOM要素の取得
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const timeDisplay = document.getElementById('time');
  const startButton = document.getElementById('startButton');
  const retryButton = document.getElementById('retryButton');

  // ゲーム設定
  const ballRadius = 10;
  let ballX, ballY;
  let ballSpeedX = 0;
  let ballSpeedY = 0;
  const friction = 0.98; // 摩擦（減速効果）
  const sensitivity = 0.5; // 傾きの感度

  // 時間計測用変数
  let startTime;
  let elapsedTime = 0;
  let timerInterval;

  // ゲーム状態
  let gameState = 'ready'; // ready, playing, finished

  // 迷路の壁の配列
  let walls = [];
  
  // スタートとゴールの位置
  let startArea = {};
  let goalArea = {};

  // キャンバスのサイズ設定
  function setupCanvas() {
    // モバイルデバイスに適したサイズに設定
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // キャンバスの幅は画面の80%、ただし最大350px
    const canvasWidth = Math.min(screenWidth * 0.8, 350);
    
    // キャンバスの高さは幅の1.2倍（縦長の迷路だが、ボタンが見えるように調整）
    const canvasHeight = canvasWidth * 1.2;
    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    return { width: canvasWidth, height: canvasHeight };
  }

  // 迷路の初期化
  function initializeMaze(canvasWidth, canvasHeight) {
    // 壁の太さ
    const wallThickness = canvasWidth * 0.05;
    
    // 外枠の壁
    walls = [
      // 上の壁
      { x: 0, y: 0, width: canvasWidth, height: wallThickness },
      // 右の壁
      { x: canvasWidth - wallThickness, y: 0, width: wallThickness, height: canvasHeight },
      // 下の壁
      { x: 0, y: canvasHeight - wallThickness, width: canvasWidth, height: wallThickness },
      // 左の壁
      { x: 0, y: 0, width: wallThickness, height: canvasHeight }
    ];
    
    // 内側の障害物（シンプルな迷路）
    // 横向きの障害物
    walls.push({ x: wallThickness * 2, y: canvasHeight * 0.2, width: canvasWidth * 0.6, height: wallThickness });
    walls.push({ x: canvasWidth * 0.3, y: canvasHeight * 0.4, width: canvasWidth * 0.7 - wallThickness, height: wallThickness });
    walls.push({ x: 0, y: canvasHeight * 0.6, width: canvasWidth * 0.7, height: wallThickness });
    walls.push({ x: canvasWidth * 0.3, y: canvasHeight * 0.8, width: canvasWidth * 0.7 - wallThickness, height: wallThickness });
    
    // スタートエリア（左上）
    startArea = {
      x: wallThickness * 2,
      y: wallThickness * 2,
      width: canvasWidth * 0.15,
      height: canvasWidth * 0.15
    };
    
    // ゴールエリア（右下）
    goalArea = {
      x: canvasWidth - wallThickness * 4 - canvasWidth * 0.15,
      y: canvasHeight - wallThickness * 4 - canvasWidth * 0.15,
      width: canvasWidth * 0.15,
      height: canvasWidth * 0.15
    };
    
    // ボールの初期位置（スタートエリアの中心）
    ballX = startArea.x + startArea.width / 2;
    ballY = startArea.y + startArea.height / 2;
  }

  // ゲームの初期化
  function initializeGame() {
    const canvasSize = setupCanvas();
    initializeMaze(canvasSize.width, canvasSize.height);
    
    // ボールの速度をリセット
    ballSpeedX = 0;
    ballSpeedY = 0;
    
    // 時間をリセット
    elapsedTime = 0;
    timeDisplay.textContent = '0.0';
    
    // ゲーム状態を準備完了に
    gameState = 'ready';
    
    // ボタンの表示状態を更新
    startButton.style.display = 'inline-block';
    retryButton.style.display = 'none';
    
    // 初期描画
    drawGame();
  }

  // ゲーム画面の描画
  function drawGame() {
    // キャンバスをクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // スタートエリアの描画
    ctx.fillStyle = '#8FBC8F'; // 薄い緑
    ctx.fillRect(startArea.x, startArea.y, startArea.width, startArea.height);
    ctx.fillStyle = '#000';
    ctx.font = '14px Arial';
    ctx.fillText('Start', startArea.x + startArea.width / 2 - 15, startArea.y + startArea.height / 2 + 5);
    
    // ゴールエリアの描画
    ctx.fillStyle = '#FFD700'; // 金色
    ctx.fillRect(goalArea.x, goalArea.y, goalArea.width, goalArea.height);
    ctx.fillStyle = '#000';
    ctx.font = '14px Arial';
    ctx.fillText('Goal', goalArea.x + goalArea.width / 2 - 15, goalArea.y + goalArea.height / 2 + 5);
    
    // 壁の描画
    ctx.fillStyle = '#333';
    walls.forEach(wall => {
      ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
    });
    
    // ボールの描画
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#FF6347'; // トマト色
    ctx.fill();
    ctx.closePath();
  }

  // ボールの移動処理
  function moveBall() {
    // 現在の位置を保存（衝突時に戻すため）
    const prevX = ballX;
    const prevY = ballY;
    
    // 速度に基づいてボールを移動
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    
    // 摩擦による減速
    ballSpeedX *= friction;
    ballSpeedY *= friction;
    
    // 速度が非常に小さい場合は0にする（停止）
    if (Math.abs(ballSpeedX) < 0.01) ballSpeedX = 0;
    if (Math.abs(ballSpeedY) < 0.01) ballSpeedY = 0;
    
    // 壁との衝突判定
    let collision = false;
    
    walls.forEach(wall => {
      if (
        ballX + ballRadius > wall.x &&
        ballX - ballRadius < wall.x + wall.width &&
        ballY + ballRadius > wall.y &&
        ballY - ballRadius < wall.y + wall.height
      ) {
        // 衝突した場合、前の位置に戻す
        ballX = prevX;
        ballY = prevY;
        
        // 速度を反転させて少し減衰させる
        ballSpeedX = -ballSpeedX * 0.5;
        ballSpeedY = -ballSpeedY * 0.5;
        
        collision = true;
      }
    });
    
    // ゴール判定
    if (
      ballX > goalArea.x &&
      ballX < goalArea.x + goalArea.width &&
      ballY > goalArea.y &&
      ballY < goalArea.y + goalArea.height
    ) {
      finishGame();
    }
    
    return collision;
  }

  // 加速度センサーのイベントハンドラ
  function handleOrientation(event) {
    if (gameState !== 'playing') return;
    
    // ベータ（前後の傾き）とガンマ（左右の傾き）を取得
    const beta = event.beta;  // -180〜180の範囲（前後）
    const gamma = event.gamma; // -90〜90の範囲（左右）
    
    // 傾きに基づいてボールの加速度を設定
    // 値を制限して急激な動きを防止
    const maxTilt = 10;
    const limitedBeta = Math.max(-maxTilt, Math.min(maxTilt, beta));
    const limitedGamma = Math.max(-maxTilt, Math.min(maxTilt, gamma));
    
    // Y軸（前後）の加速
    ballSpeedY += limitedBeta * sensitivity * 0.1;
    
    // X軸（左右）の加速
    ballSpeedX += limitedGamma * sensitivity * 0.1;
  }

  // タイマーの開始
  function startTimer() {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(updateTimer, 100);
  }

  // タイマーの更新
  function updateTimer() {
    elapsedTime = Date.now() - startTime;
    timeDisplay.textContent = (elapsedTime / 1000).toFixed(1);
  }

  // タイマーの停止
  function stopTimer() {
    clearInterval(timerInterval);
  }

  // ゲームループ
  function gameLoop() {
    if (gameState !== 'playing') return;
    
    const collision = moveBall();
    drawGame();
    
    requestAnimationFrame(gameLoop);
  }

  // ゲームの開始
  function startGame() {
    if (gameState !== 'ready') return;
    
    gameState = 'playing';
    startButton.style.display = 'none';
    
    // タイマー開始
    startTimer();
    
    // ゲームループ開始
    gameLoop();
  }

  // ゲームの終了
  function finishGame() {
    if (gameState !== 'playing') return;
    
    gameState = 'finished';
    stopTimer();
    
    // リトライボタンを表示
    retryButton.style.display = 'inline-block';
  }

  // イベントリスナーの設定
  startButton.addEventListener('click', startGame);
  retryButton.addEventListener('click', initializeGame);
  
  // 加速度センサーのイベントリスナー
  if (window.DeviceOrientationEvent) {
    // iOS 13+ではユーザーのアクセス許可が必要
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      startButton.addEventListener('click', () => {
        DeviceOrientationEvent.requestPermission()
          .then(permissionState => {
            if (permissionState === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation);
              startGame();
            } else {
              alert('加速度センサーへのアクセスが許可されませんでした。');
            }
          })
          .catch(console.error);
      });
    } else {
      // 通常のデバイス（許可不要）
      window.addEventListener('deviceorientation', handleOrientation);
    }
  } else {
    alert('お使いのデバイスは加速度センサーをサポートしていません。');
  }

  // デバッグ用：キーボード操作（PCでのテスト用）
  document.addEventListener('keydown', (e) => {
    if (gameState !== 'playing') return;
    
    const speed = 0.5;
    
    switch (e.key) {
      case 'ArrowUp':
        ballSpeedY -= speed;
        break;
      case 'ArrowDown':
        ballSpeedY += speed;
        break;
      case 'ArrowLeft':
        ballSpeedX -= speed;
        break;
      case 'ArrowRight':
        ballSpeedX += speed;
        break;
    }
  });

  // ゲームの初期化
  initializeGame();
});
