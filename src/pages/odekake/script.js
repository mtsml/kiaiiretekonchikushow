// TODO: html にハードコードされているモデル情報を剥がして js で管理する
const models = [
  {
    src: 'kyun.glb',
    twitterId: 'hisaka033'
  },
  {
    src: 'puku.glb',
    twitterId: 'pine_nm'
  },
  {
    src: 'akeomeg.glb',
    twitterId: 'pine_nm'
  },
  {
    src: 'jk.glb',
    twitterId: 'pine_nm'
  },
  {
    src: 'hakuchu.glb',
    twitterId: 'pine_nm'
  },
  {
    src: 'doya.glb',
    twitterId: 'pine_nm'
  },
  {
    src: 'plank.glb',
    twitterId: 'pine_nm'
  },
  {
    src: 'low.glb',
    twitterId: 'pine_nm'
  },
  {
    src: 'hellomeg.glb',
    twitterId: 'pine_nm'
  },
  {
    src: 'ramen.glb',
    twitterId: 'pine_nm'
  },
  {
    src: 'aa.glb',
    twitterId: 'pine_nm'
  },
  {
    src: 'katan.glb',
    twitterId: 'pine_nm'
  },
  {
    src: 'universe.glb',
    twitterId: 'pine_nm'
  },
  {
    src: 'damon.glb',
    twitterId: 'pine_nm'
  },
  {
    src: 'stand_megu.glb',
    twitterId: 'pine_nm'
  },
  {
    src: 'stand_ruri.glb',
    twitterId: 'pine_nm'
  },
];

let currentSlide = 0;

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

document.addEventListener('DOMContentLoaded', () => {
  const twitterId = models[currentSlide].twitterId;
  const actionLabel = document.getElementById('action-label');
  actionLabel.innerText = `イラスト：@${twitterId}`;
  actionLabel.href = `https://twitter.com/${twitterId}`;
  actionLabel.target = '_blank';
});
