(() => {
  const navigation = performance.getEntriesByType('navigation')[0];
  let shouldShowIntro = true;

  try {
    const seenBefore = sessionStorage.getItem('swastik-intro-seen') === 'true';
    shouldShowIntro = !seenBefore || (navigation && navigation.type === 'reload');
    if (shouldShowIntro) {
      document.documentElement.classList.add('brand-intro-enabled');
      sessionStorage.setItem('swastik-intro-seen', 'true');
    }
  } catch (error) {
    document.documentElement.classList.add('brand-intro-enabled');
  }

  if (!shouldShowIntro) {
    document.addEventListener('DOMContentLoaded', () => {
      const intro = document.getElementById('brand-intro');
      if (intro) intro.remove();
    });
    return;
  }

  document.addEventListener('DOMContentLoaded', () => {
    const intro = document.getElementById('brand-intro');
    if (!intro) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pageContent = Array.from(document.body.children).filter((element) => element !== intro);
    pageContent.forEach((element) => {
      element.inert = true;
    });
    document.body.classList.add('brand-intro-active');

    const dismiss = () => {
      intro.classList.add('is-leaving');
      intro.setAttribute('aria-hidden', 'true');
      intro.inert = true;
      window.setTimeout(() => {
        intro.remove();
        pageContent.forEach((element) => {
          element.inert = false;
        });
        document.body.classList.remove('brand-intro-active');
      }, reducedMotion ? 0 : 500);
    };

    window.setTimeout(dismiss, reducedMotion ? 0 : 1320);
  });
})();
