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

  const twitterId = slider.children[index].dataset.twitterId;
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
  const twitterId = slider.children[currentSlide].dataset.twitterId;
  const actionLabel = document.getElementById('action-label');
  actionLabel.innerText = `イラスト：@${twitterId}`;
  actionLabel.href = `https://twitter.com/${twitterId}`;
  actionLabel.target = '_blank';
});
