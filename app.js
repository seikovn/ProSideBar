// Modern hide/show app script with state saved in localStorage
(function () {
  const APP_KEY = 'prosider_app_hidden_v1';
  const app = document.getElementById('app');
  const hideBtn = document.getElementById('hide-app');
  const hideLabel = document.getElementById('hide-label');
  const hideIcon = document.getElementById('hide-icon');
  const collapsedBar = document.getElementById('collapsed-bar');
  const showBtn = document.getElementById('show-app');
  const appContent = document.getElementById('app-content');

  function setHidden(hidden, persist = true) {
    if (hidden) {
      app.classList.add('collapsed');
      app.setAttribute('aria-hidden', 'true');
      if (appContent) appContent.setAttribute('hidden', '');
      hideBtn.setAttribute('aria-expanded', 'false');
      hideLabel.textContent = 'Hiện';
      collapsedBar.hidden = false;
    } else {
      app.classList.remove('collapsed');
      app.setAttribute('aria-hidden', 'false');
      if (appContent) appContent.removeAttribute('hidden');
      hideBtn.setAttribute('aria-expanded', 'true');
      hideLabel.textContent = 'Ẩn';
      collapsedBar.hidden = true;
    }
    if (persist) localStorage.setItem(APP_KEY, hidden ? '1' : '0');
  }

  // init from storage
  const stored = localStorage.getItem(APP_KEY);
  if (stored === '1') {
    setHidden(true, false);
  } else {
    setHidden(false, false);
  }

  hideBtn.addEventListener('click', () => setHidden(true));
  showBtn.addEventListener('click', () => setHidden(false));

  // keyboard shortcut 'H' to toggle
  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'h' && !/input|textarea/i.test(document.activeElement.tagName)) {
      e.preventDefault();
      const isHidden = app.classList.contains('collapsed');
      setHidden(!isHidden);
    }
  });

  // optional: nice touch - restore focus to show button when hidden
  hideBtn.addEventListener('click', () => {
    setTimeout(() => showBtn.focus(), 220);
  });
})();