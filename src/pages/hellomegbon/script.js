document.addEventListener('DOMContentLoaded', () => {
  const pages = ['museum4.png', 'museum3.png', 'museum2.png', 'museum1.png'];
  const assetPath = './assets/';
  const viewer = document.getElementById('viewer');
  const fullscreenButton = document.getElementById('fullscreen-button');
  const closeFullscreenButton = document.getElementById('close-fullscreen');

  // --- Right-to-Left (Manga Style) Viewer Logic ---

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
  let currentPageIndex = 0;

  const updateCurrentPageIndex = () => {
    currentPageIndex = Math.round(viewer.scrollLeft / viewer.offsetWidth);
  };

  const scrollToPage = (index) => {
    viewer.scrollLeft = index * viewer.offsetWidth;
  };

  viewer.addEventListener('scroll', updateCurrentPageIndex);

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

  // 4. Swipe Navigation
  let touchstartX = 0;
  const swipeThreshold = 50;

  viewer.addEventListener('touchstart', (event) => {
    touchstartX = event.changedTouches[0].screenX;
  }, { passive: true });

  viewer.addEventListener('touchend', (event) => {
    const touchendX = event.changedTouches[0].screenX;
    const swipeDistance = touchendX - touchstartX;

    if (Math.abs(swipeDistance) >= swipeThreshold) {
      event.preventDefault();
      if (swipeDistance > 0) {
        viewer.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
      } else {
        viewer.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
      }
    }
  });

  // 5. Custom Fullscreen (Modal) Logic
  const toggleFullscreen = () => {
    updateCurrentPageIndex();
    viewer.classList.toggle('viewer-fullscreen');
    if (viewer.classList.contains('viewer-fullscreen')) {
      fullscreenButton.textContent = 'Exit Fullscreen';
    } else {
      fullscreenButton.textContent = 'Fullscreen';
    }
    setTimeout(() => {
      scrollToPage(currentPageIndex);
    }, 0);
  };

  fullscreenButton.addEventListener('click', toggleFullscreen);
  closeFullscreenButton.addEventListener('click', toggleFullscreen);
});