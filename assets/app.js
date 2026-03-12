(() => {
  const body = document.body;
  const drawer = document.querySelector('.mobile-drawer');
  const openDrawerBtn = document.querySelector('.burger');
  const closeDrawerBtn = document.querySelector('.close-drawer');
  const langWraps = document.querySelectorAll('.lang-wrap');
  const modal = document.getElementById('privacyModal');
  const modalOpen = document.querySelectorAll('[data-open-privacy]');
  const modalCloseBtns = document.querySelectorAll('[data-close-privacy]');

  let focusReturn = null;

  const getFocusable = (root) => [...root.querySelectorAll('a, button, input, [tabindex]:not([tabindex="-1"])')].filter(el => !el.disabled);

  const trapFocus = (container, event) => {
    if (event.key !== 'Tab') return;
    const focusable = getFocusable(container);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const toggleDrawer = (open) => {
    if (!drawer) return;
    drawer.classList.toggle('open', open);
    body.classList.toggle('no-scroll', open);
    if (open) {
      focusReturn = document.activeElement;
      const first = getFocusable(drawer)[0];
      if (first) first.focus();
    } else if (focusReturn) {
      focusReturn.focus();
    }
  };

  openDrawerBtn?.addEventListener('click', () => toggleDrawer(true));
  closeDrawerBtn?.addEventListener('click', () => toggleDrawer(false));
  drawer?.addEventListener('click', (e) => {
    if (e.target === drawer) toggleDrawer(false);
  });

  const toggleModal = (open) => {
    if (!modal) return;
    modal.classList.toggle('open', open);
    body.classList.toggle('no-scroll', open || drawer?.classList.contains('open'));
    if (open) {
      focusReturn = document.activeElement;
      const first = getFocusable(modal)[0];
      if (first) first.focus();
    } else if (focusReturn) {
      focusReturn.focus();
    }
  };

  modalOpen.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    toggleModal(true);
  }));
  modalCloseBtns.forEach(btn => btn.addEventListener('click', () => toggleModal(false)));
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) toggleModal(false);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      toggleDrawer(false);
      toggleModal(false);
      langWraps.forEach(w => w.classList.remove('open'));
    }
    if (drawer?.classList.contains('open')) trapFocus(drawer, e);
    if (modal?.classList.contains('open')) trapFocus(modal, e);
  });

  langWraps.forEach((wrap) => {
    const trigger = wrap.querySelector('.lang-pill');
    trigger?.addEventListener('click', () => wrap.classList.toggle('open'));
  });

  document.addEventListener('click', (e) => {
    langWraps.forEach((wrap) => {
      if (!wrap.contains(e.target)) wrap.classList.remove('open');
    });
  });

  const faqItems = [...document.querySelectorAll('.faq-item')];
  faqItems.forEach((item) => {
    item.querySelector('.faq-btn')?.addEventListener('click', () => {
      faqItems.forEach(i => i.classList.remove('open'));
      item.classList.add('open');
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.card, .chart-box, .performance-panel, .form-card').forEach((el) => {
    el.style.transform = 'translateY(8px)';
    el.style.transition = 'transform .35s ease';
    observer.observe(el);
  });
})();
