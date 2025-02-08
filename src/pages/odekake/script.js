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

window.addEventListener("DOMContentLoaded", () => {
  const params = new URL(document.location).searchParams;
  const additionalModel = params.get("additional_model");
  
  switch (additionalModel) {
    case "a1B2c3":
      document.getElementById("a1B2c3").style.display = null;
      break;
    case "d4E5f6":
      document.getElementById("d4E5f6").style.display = null;
      break;
    case "g7H8i9":
      document.getElementById("g7H8i9").style.display = null;
      break;
    case "j0K1l2":
      document.getElementById("j0K1l2").style.display = null;
      break;
    case "m3N4o5":
      document.getElementById("m3N4o5").style.display = null;
      break;
    case "p6Q7r8":
      document.getElementById("p6Q7r8").style.display = null;
      break;
    }
});
