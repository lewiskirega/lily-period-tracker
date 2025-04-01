(function() {
  // FAQ data extracted from chat.js
  const faqData = [
    {
      question: "When is my next period?",
      answer: "Based on your tracking data, I can see when your next period is expected. You can also check the home screen for this information."
    },
    {
      question: "What is my average cycle length?",
      answer: "Your average cycle length can be found in the log section. You can also adjust your expected cycle length in settings."
    },
    {
      question: "How do I track my period?",
      answer: "To log a new period, go to the home screen and tap 'Period just started' or use the log section to add a specific date."
    },
    {
      question: "How do I export my data?",
      answer: "You can export your data as a backup from the settings page. This creates a file you can save for later import."
    },
    {
      question: "How do I import my data?",
      answer: "To import previously exported data, go to settings and use the 'Import from backup' option."
    },
    {
      question: "How do I find nearby gynecologists?",
      answer: "I can help you find nearby clinics. Use the maps feature to locate gynecologists in your area."
    }
  ];

  let faqSlideshow, faqSlidesContainer, faqNavigation;
  let currentSlide = 0;
  let slideInterval;
  let isHovering = false;

  function initFaqSlideshow() {
    faqSlideshow = document.getElementById('faq-slideshow');
    if (!faqSlideshow) { console.error('FAQ slideshow element not found'); return; }
    faqSlidesContainer = document.getElementById('faq-slides');
    faqNavigation = document.getElementById('faq-navigation');
    createNavigationDots();
    setupEventListeners();
    startSlideshow();
    updateActiveSlide(0);
  }

  function createNavigationDots() {
    faqNavigation.innerHTML = '';
    for (let i = 0; i < faqData.length; i++) {
      const dot = document.createElement('div');
      dot.classList.add('faq-navigation__dot');
      dot.setAttribute('data-index', i);
      dot.addEventListener('click', () => goToSlide(i));
      faqNavigation.appendChild(dot);
    }
  }

  function setupEventListeners() {
    const prevButton = document.getElementById('faq-control-prev');
    const nextButton = document.getElementById('faq-control-next');
    if (prevButton) { prevButton.addEventListener('click', () => goToSlide(currentSlide - 1)); }
    if (nextButton) { nextButton.addEventListener('click', () => goToSlide(currentSlide + 1)); }
    faqSlideshow.addEventListener('mouseenter', () => isHovering = true);
    faqSlideshow.addEventListener('mouseleave', () => isHovering = false);
    // Attach click events on slides (after slides have been created in HTML generation below)
    const slides = document.querySelectorAll('.faq-slide');
    slides.forEach((slide, index) => {
      slide.addEventListener('click', () => openFaqDetail(index));
    });
  }

  function startSlideshow() {
    if (slideInterval) { clearInterval(slideInterval); }
    slideInterval = setInterval(() => { if (!isHovering) { goToSlide((currentSlide + 1) % faqData.length); } }, 5000);
  }

  function goToSlide(index) {
    if (index < 0) { index = faqData.length - 1; } else if (index >= faqData.length) { index = 0; }
    currentSlide = index;
    faqSlidesContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
    updateActiveSlide(currentSlide);
    startSlideshow();
  }

  function updateActiveSlide(index) {
    const dots = document.querySelectorAll('.faq-navigation__dot');
    dots.forEach((dot, i) => { dot.classList.toggle('faq-navigation__dot--active', i === index); });
  }

  function openFaqDetail(index) {
    const faq = faqData[index];
    if (window.chatModule && typeof window.chatModule.toggleChat === 'function') {
      window.chatModule.toggleChat();
      if (typeof window.chatModule.addMessage === 'function') {
        window.chatModule.addMessage(faq.question, 'user');
        setTimeout(() => { window.chatModule.addMessage(faq.answer, 'assistant'); }, 500);
      }
    } else {
      console.error('Chat module not available');
      alert(faq.answer);
    }
  }

  function createFaqSlideshowHTML() {
    const homeWrapper = document.querySelector('.home__wrapper');
    if (!homeWrapper) { console.error('Home wrapper not found'); return; }
    const faqContainer = document.createElement('div');
    faqContainer.id = 'faq-slideshow';
    faqContainer.className = 'faq-slideshow';
    const title = document.createElement('h2');
    title.className = 'faq-slideshow__title';
    title.textContent = 'Frequently Asked Questions';
    faqContainer.appendChild(title);
    const slidesContainer = document.createElement('div');
    slidesContainer.id = 'faq-slides';
    slidesContainer.className = 'faq-slides';
    faqData.forEach(faq => {
      const slide = document.createElement('div');
      slide.className = 'faq-slide';
      const question = document.createElement('div');
      question.className = 'faq-slide__question';
      question.textContent = faq.question;
      slide.appendChild(question);
      const hint = document.createElement('div');
      hint.className = 'faq-slide__hint';
      hint.textContent = 'Tap to learn more';
      slide.appendChild(hint);
      slidesContainer.appendChild(slide);
    });
    faqContainer.appendChild(slidesContainer);
    const navigation = document.createElement('div');
    navigation.id = 'faq-navigation';
    navigation.className = 'faq-navigation';
    faqContainer.appendChild(navigation);
    const controls = document.createElement('div');
    controls.className = 'faq-controls';
    const prevButton = document.createElement('button');
    prevButton.id = 'faq-control-prev';
    prevButton.className = 'faq-control';
    prevButton.innerHTML = `<svg class="icon faq-control__icon" focusable="false" aria-hidden="true"><use href="#icon-prev"></use></svg>`;
    controls.appendChild(prevButton);
    const nextButton = document.createElement('button');
    nextButton.id = 'faq-control-next';
    nextButton.className = 'faq-control';
    nextButton.innerHTML = `<svg class="icon faq-control__icon" focusable="false" aria-hidden="true"><use href="#icon-next"></use></svg>`;
    controls.appendChild(nextButton);
    faqContainer.appendChild(controls);
    const homeCalc = document.getElementById('home-calc');
    if (homeCalc) {
      homeCalc.parentNode.insertBefore(faqContainer, homeCalc.nextSibling);
    } else {
      homeWrapper.appendChild(faqContainer);
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    createFaqSlideshowHTML();
    initFaqSlideshow();
  });
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    createFaqSlideshowHTML();
    initFaqSlideshow();
  }

  window.faqModule = { goToSlide, openFaqDetail };
})();