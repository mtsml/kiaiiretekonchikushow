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
