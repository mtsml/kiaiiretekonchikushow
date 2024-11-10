document.addEventListener('DOMContentLoaded', function() {
  const image = new Image();

  // 画像のロードが完了したときの処理を設定
  image.onload = function() {
    generateImage(image);
    document.getElementById('textInput').addEventListener('input', function() {
      generateImage(image);
    });
    document.querySelectorAll('input[name="color"], input[name="size"]').forEach(function(radio) {
      radio.addEventListener('change', function() {
        generateImage(image);
      });
    });

    // 共有ボタンまたはツイートリンクを表示する
    displayShareButtonOrTweetLink(document.getElementById("canvas"));
  };

  // 画像のソースを設定
  image.src = '../../assets/template.png';

  // フォントを事前にロード
  const font = new FontFace('keifont', 'url(../../assets/fonts/keifont.ttf)');
  font.load().then(function(loadedFont) {
    document.fonts.add(loadedFont);
  });
});

function generateImage(image) {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  // キャンバスをクリア
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // キャンバスのサイズを画像のサイズに合わせる
  canvas.width = image.width;
  canvas.height = image.height;

  // 画像をキャンバスに描画
  ctx.drawImage(image, 0, 0);

  const text = document.getElementById('textInput').value;
  const color = document.querySelector('input[name="color"]:checked').value;
  const size =  Number.parseInt(document.querySelector('input[name="size"]:checked').value, 10);
  if (text === '') return;

  // テキストをキャンバスに描画
  ctx.font = `${size}px keifont`;
  ctx.fillStyle = color;

  // テキストを改行で分割して描画
  const lines = text.split('\n');
  const lineHeight = size * 1.3;
  const offset = size === 100 ? 90 : size === 45 ? 10 : -5; 
  lines.forEach((line, index) => {
    ctx.fillText(line, 100, 1400 + offset + index * lineHeight); // 位置とスタイルは適宜調整
  });
}

/**
 * diplay: none で埋め込まれている共有ボタンまたは画像ダウンロードリンクを表示状態にする
 * 
 * 画像を Twitter で共有するために Web Share API を利用した共有ボタンを表示する。
 * PC など Web Share API が利用できない場合は、画像ダウンロードリンクへフォールバック。
 */
const displayShareButtonOrTweetLink = (canvas) => {
  try {
    canvas.toBlob((blob) => {
      // Web Share API が利用できる場合は共有ボタンを、そうでない場合は画像ダウンロードリンクを表示する
      if (navigator.share && navigator.canShare && navigator.canShare(getNavigatorShareParams(blob))) {
        document.getElementById("share-button").style.display = null;
      } else {
        const cannotShareText = document.getElementById("cannot-share");
        cannotShareText.style.display = null;
      }
    });
  } catch (error) {
    const cannotShareText = document.getElementById("cannot-share");
    cannotShareText.style.display = null;
    console.log(error);
  }
}

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
  text: "https://kiaiiretekonchiku.show/circle_profile_generator/",
  files: [new File([blob], "image.png", { type: "image/png", })],
});
