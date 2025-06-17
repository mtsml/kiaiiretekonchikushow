const models = [
  {
    src: '../../assets/models/kyun.glb',
    alt: 'kyun 3D model',
    twitterId: 'hisaka033'
  },
  {
    src: '../../assets/models/puku.glb',
    alt: 'puku 3D model',
    twitterId: 'pine_nm'
  },
  {
    src: '../../assets/models/akeomeg.glb',
    alt: 'akeomeg 3D model',
    twitterId: 'pine_nm'
  },
  {
    src: '../../assets/models/jk.glb',
    alt: 'jk 3D model',
    twitterId: 'pine_nm'
  },
  {
    src: '../../assets/models/hakuchu.glb',
    alt: 'hakuchu 3D model',
    twitterId: 'pine_nm'
  },
  {
    src: '../../assets/models/doya.glb',
    alt: 'doya 3D model',
    twitterId: 'pine_nm'
  },
  {
    src: '../../assets/models/plank.glb',
    alt: 'plank 3D model',
    twitterId: 'pine_nm'
  },
  {
    src: '../../assets/models/low.glb',
    alt: 'low 3D model',
    twitterId: 'pine_nm'
  },
  {
    src: '../../assets/models/hellomeg.glb',
    alt: 'hellomeg 3D model',
    twitterId: 'pine_nm'
  },
  {
    src: '../../assets/models/ramen.glb',
    alt: 'ramen 3D model',
    twitterId: 'pine_nm'
  },
  {
    src: '../../assets/models/aa.glb',
    alt: 'aa 3D model',
    twitterId: 'pine_nm'
  },
  {
    src: '../../assets/models/katan.glb',
    alt: 'katan 3D model',
    twitterId: 'pine_nm'
  },
  {
    src: '../../assets/models/universe.glb',
    alt: 'universe 3D model',
    twitterId: 'pine_nm'
  },
  {
    src: '../../assets/models/damon.glb',
    alt: 'damon 3D model',
    twitterId: 'pine_nm'
  },
  {
    src: '../../assets/models/stand_megu.glb',
    alt: 'stand_megu 3D model',
    twitterId: 'pine_nm'
  },
  {
    src: '../../assets/models/stand_ruri.glb',
    alt: 'stand_ruri 3D model',
    twitterId: 'pine_nm'
  },
];

let currentSlide = 0;

function isAndroid() {
  // Client Hints を優先、フォールバックで User-Agent を使用
  // ref: https://developer.mozilla.org/ja/docs/Web/API/User-Agent_Client_Hints_API
  if (navigator.userAgentData) {
    return /Android/i.test(navigator.userAgentData.platform);
  }
  return /Android/i.test(navigator.userAgent);
}

function showSlide(index) {
  const slider = document.getElementById('slider');
  const totalSlides = slider.children.length;
  if (index >= totalSlides) {
    currentSlide = 0;
  } else if (index < 0) {
    currentSlide = totalSlides - 1;
  } else {
    currentSlide = index;
  }
  slider.style.transform = `translateX(-${currentSlide * 100}%)`;

  const twitterId = models[currentSlide].twitterId;
  const actionLabel = document.getElementById('action-label');
  actionLabel.innerText = `イラスト：@${twitterId}`;
  actionLabel.href = `https://twitter.com/${twitterId}`;
  actionLabel.target = '_blank';
}

function nextSlide() {
  showSlide(currentSlide + 1);
}

function prevSlide() {
  showSlide(currentSlide - 1);
}

function initializeModelViewers() {
  const slider = document.getElementById('slider');
  slider.innerHTML = '';
  
  models.forEach((model) => {
    const modelViewer = document.createElement('model-viewer');
    modelViewer.src = model.src;
    modelViewer.alt = model.alt;
    modelViewer.setAttribute('camera-controls', '');
    modelViewer.setAttribute('ar', '');
    if (isAndroid()) {
      modelViewer.setAttribute('ar-modes', 'scene-viewer quick-look');
    }
    slider.appendChild(modelViewer);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initializeModelViewers();
  
  const twitterId = models[currentSlide].twitterId;
  const actionLabel = document.getElementById('action-label');
  actionLabel.innerText = `イラスト：@${twitterId}`;
  actionLabel.href = `https://twitter.com/${twitterId}`;
  actionLabel.target = '_blank';
});
