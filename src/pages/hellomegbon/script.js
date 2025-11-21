document.addEventListener('DOMContentLoaded', () => {
  const pages = ['museum4.png', 'museum3.png', 'museum2.png', 'museum1.png'];
  const assetPath = './assets/';
  const viewer = document.getElementById('viewer');
  const fullscreenButton = document.getElementById('fullscreen-button');

  // 1. Dynamically create and add image elements
  pages.forEach(page => {
    const img = document.createElement('img');
    img.src = assetPath + page;
    img.classList.add('manga-page');
    viewer.appendChild(img);
  });

  // 2. Set initial scroll to the very end (right-most)
  window.addEventListener('load', () => {
    viewer.scrollLeft = viewer.scrollWidth;
  });
  
  const scrollAmount = () => viewer.offsetWidth;

  // 3. Click Navigation
  viewer.addEventListener('click', (event) => {
    if (!event.target.classList.contains('manga-page')) return;
    const clickX = event.clientX;
    const halfWidth = viewer.offsetWidth / 2;

    if (clickX <= halfWidth) {
      viewer.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
    } else {
      viewer.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
    }
  });

  // 4. JavaScript-controlled Swipe Navigation
  let touchstartX = 0;
  let touchendX = 0;
  const swipeThreshold = 50;

  viewer.addEventListener('touchstart', (event) => {
    touchstartX = event.changedTouches[0].screenX;
    event.preventDefault();
  }, { passive: false });

  viewer.addEventListener('touchmove', (event) => {
    event.preventDefault();
  }, { passive: false });

  viewer.addEventListener('touchend', (event) => {
    touchendX = event.changedTouches[0].screenX;
    const swipeDistance = touchendX - touchstartX;

    if (Math.abs(swipeDistance) >= swipeThreshold) {
      if (swipeDistance > 0) {
        viewer.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
      } else {
        viewer.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
      }
    }
  });

  // 5. Native Fullscreen API Logic
  fullscreenButton.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      viewer.requestFullscreen().catch(err => {
        alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  });

  document.addEventListener('fullscreenchange', () => {
    if (document.fullscreenElement) {
      fullscreenButton.textContent = 'Exit Fullscreen';
    } else {
      fullscreenButton.textContent = 'Fullscreen';
    }
  });
});