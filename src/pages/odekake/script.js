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
}

function nextSlide() {
  showSlide(currentSlide + 1);
}

function prevSlide() {
  showSlide(currentSlide - 1);
}

let currentSlideLimted = 0;

function showSlideLimited(index) {
  const slider = document.getElementById('slider-limited');
  const totalSlides = slider.children.length;
  if (index >= totalSlides) {
    currentSlideLimted = 0;
  } else if (index < 0) {
    currentSlideLimted = totalSlides - 1;
  } else {
    currentSlideLimted = index;
  }
  slider.style.transform = `translateX(-${currentSlideLimted * 100}%)`;
}

function nextSlideLimited() {
  showSlide(currentSlideLimted + 1);
}

function prevSlideLimited() {
  showSlide(currentSlideLimted - 1);
}
