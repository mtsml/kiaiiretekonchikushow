document.addEventListener('DOMContentLoaded', () => {
  // Canvas とコンテキストの設定
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  
  // 描画状態の変数
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;
  let currentColor = '#E7609E';
  let currentSize = 5;

  // キャンバスを白色で初期化
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // マウス操作イベントのセットアップ
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseout', stopDrawing);
  
  // タッチデバイス用イベントのセットアップ
  canvas.addEventListener('touchstart', handleTouchStart);
  canvas.addEventListener('touchmove', handleTouchMove);
  canvas.addEventListener('touchend', handleTouchEnd);
  
  // 描画開始
  function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = getCoordinates(e);
    document.getElementById('clear').disabled = false;
    saveHistory();
  }
  
  // 描画中
  function draw(e) {
    if (!isDrawing) return;
    
    const [x, y] = getCoordinates(e);
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = currentSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    
    [lastX, lastY] = [x, y];
  }
  
  // 描画終了
  function stopDrawing() {
    isDrawing = false;
  }
  
  // タッチイベントハンドラー
  function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
  }
  
  function handleTouchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    canvas.dispatchEvent(mouseEvent);
  }
  
  function handleTouchEnd(e) {
    e.preventDefault();
    const mouseEvent = new MouseEvent('mouseup');
    canvas.dispatchEvent(mouseEvent);
  }
  
  // マウス/タッチ座標を取得
  function getCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
  
    if (e.touches && e.touches[0]) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
  
    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);
    return [x, y];
  }

  const historyStack = [];
  const redoStack = [];
  const maxHistory = 20;

  function saveHistory() {
    if (historyStack.length >= maxHistory) {
      historyStack.shift();
    }
    historyStack.push(canvas.toDataURL());
    // undo したあとに描き直したら redo は無効になる
    redoStack.length = 0;
    updateButtonStates();
  }
  
  function undo() {
    if (historyStack.length === 0) return;
  
    redoStack.push(canvas.toDataURL()); // 現在の状態を redo 用に保存
    const dataURL = historyStack.pop();
    loadCanvasFromDataURL(dataURL);
    updateButtonStates();
  }
  
  function redo() {
    if (redoStack.length === 0) return;
  
    historyStack.push(canvas.toDataURL()); // redo 時にも履歴保存
    const dataURL = redoStack.pop();
    loadCanvasFromDataURL(dataURL);
    updateButtonStates();
  }
  
  function clearCanvas() {
    saveHistory();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 背景を白に戻す
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    document.getElementById('clear').disabled = true;
  }
  
  function loadCanvasFromDataURL(dataURL) {
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = dataURL;
  }

  function updateButtonStates() {
    document.getElementById('undo').disabled = historyStack.length === 0;
    document.getElementById('redo').disabled = redoStack.length === 0;
  }

  // 色ボタンのイベント設定
  document.querySelectorAll('input[name="color"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      const color = document.querySelector('input[name="color"]:checked').value;
      currentColor = color;
    });
  });

  // サイズボタンのイベント設定
  document.querySelectorAll('input[name="size"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      const size =  Number.parseInt(document.querySelector('input[name="size"]:checked').value, 10);
      currentSize = size;
    });
  });

  // コントロールボタンのイベント設定
  document.getElementById('undo').addEventListener('click', undo);
  document.getElementById('redo').addEventListener('click', redo);
  document.getElementById('clear').addEventListener('click', clearCanvas);
  document.getElementById('clear').disabled = true;
  updateButtonStates();
});

/**
 * canvas の内容を画像に変換して navigator.share を呼び出す
 */
const share = () => {
  const canvas = document.getElementById("canvas");
  canvas.toBlob(async (blob) => {
    await navigator.share(getNavigatorShareParams(blob));
  });
}

/**
 * navigator.share に渡す引数を返す
 * 
 * NOTE: 2024年3月時点で以下の現象が発生している
 * - iOS: url が表示されない
 * - Android: text が表示れない
 */
const getNavigatorShareParams = (blob) => ({
  url: "https://kiaiiretekonchiku.show/circle_profile_generator/",
  text: "#めぐ島紹介\nhttps://kiaiiretekonchiku.show/circle_profile_generator/",
  files: [new File([blob], "image.png", { type: "image/png", })],
});
