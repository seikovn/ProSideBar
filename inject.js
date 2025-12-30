// inject.js
// Chèn iframe sidebar vào page (right fixed panel) và thêm nút floating để show/hide
// Nếu đã có thì không chèn lại.

(function() {
  if (window.__proSideAIInjected) return;
  window.__proSideAIInjected = true;

  const STORAGE_KEY = 'proside_hidden_v1';

  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.src = chrome.runtime.getURL('sidebar.html');
  iframe.id = 'pro-side-ai-iframe';
  iframe.style.position = 'fixed';
  iframe.style.top = '0';
  iframe.style.right = '0';
  iframe.style.height = '100vh';
  iframe.style.width = '420px';
  iframe.style.zIndex = '2147483647';
  iframe.style.border = '0';
  iframe.style.boxShadow = '0 0 12px rgba(0,0,0,0.3)';
  iframe.style.background = 'white';
  iframe.style.transition = 'transform 0.28s ease, opacity 0.22s ease';
  iframe.style.transform = 'translateX(0)'; // visible by default
  iframe.setAttribute('aria-hidden', 'false');

  // Create floating show button (small pill)
  const showBtn = document.createElement('button');
  showBtn.id = 'pro-side-ai-show-btn';
  showBtn.type = 'button';
  showBtn.textContent = 'Hiện ProSider';
  showBtn.title = 'Hiện ProSider AI';
  Object.assign(showBtn.style, {
    position: 'fixed',
    right: '20px',
    bottom: '20px',
    zIndex: '2147483648',
    padding: '10px 14px',
    background: 'linear-gradient(90deg,#4f46e5,#06b6d4)',
    color: 'white',
    border: 'none',
    borderRadius: '999px',
    boxShadow: '0 8px 26px rgba(6,182,212,0.12)',
    cursor: 'pointer',
    display: 'none' // hidden by default
  });

  // Append to DOM (body preferred)
  const parentEl = document.body || document.documentElement;
  parentEl.appendChild(iframe);
  parentEl.appendChild(showBtn);

  // Safe localStorage getter/setter
  function storageSet(val) {
    try { localStorage.setItem(STORAGE_KEY, val ? '1' : '0'); } catch (e) { /* ignore */ }
  }
  function storageGet() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  // Show/hide logic: hide -> translateX(100%) so iframe moves outside viewport
  function setHidden(hidden, persist = true) {
    if (hidden) {
      iframe.style.transform = 'translateX(100%)';
      iframe.setAttribute('aria-hidden', 'true');
      iframe.style.opacity = '0';
      iframe.style.pointerEvents = 'none';
      showBtn.style.display = 'flex';
      showBtn.focus();
    } else {
      iframe.style.transform = 'translateX(0)';
      iframe.setAttribute('aria-hidden', 'false');
      iframe.style.opacity = '1';
      iframe.style.pointerEvents = 'auto';
      showBtn.style.display = 'none';
    }
    if (persist) storageSet(hidden);
  }

  // Init from storage
  const stored = storageGet();
  if (stored === '1') setHidden(true, false);
  else setHidden(false, false);

  // Click handlers
  showBtn.addEventListener('click', () => setHidden(false));
  // We will listen for messages from iframe to toggle/hide/close

  // Message handler from iframe (sidebar)
  function onMessage(ev) {
    const data = ev.data;
    if (!data || typeof data !== 'object') return;
    if (data.type === 'closeProSideAI') {
      // remove iframe and show button
      removeAll();
    } else if (data.type === 'hideProSideAI' || data.type === 'toggleProSideAI') {
      // hide (or toggle)
      const isHidden = iframe.style.transform !== 'translateX(0)' && iframe.getAttribute('aria-hidden') === 'true';
      if (data.type === 'hideProSideAI') setHidden(true);
      else setHidden(!isHidden);
    }
  }
  window.addEventListener('message', onMessage, false);

  // Cleanup function to remove injected elements and listeners
  function removeAll() {
    try { window.removeEventListener('message', onMessage, false); } catch(e){}
    const el = document.getElementById('pro-side-ai-iframe');
    if (el && el.parentNode) el.parentNode.removeChild(el);
    const btn = document.getElementById('pro-side-ai-show-btn');
    if (btn && btn.parentNode) btn.parentNode.removeChild(btn);
    window.__proSideAIInjected = false;
  }

  // Optional: allow page scripts to dispatch a custom event to close
  window.addEventListener('ProSideAIClose', removeAll, false);

})();
