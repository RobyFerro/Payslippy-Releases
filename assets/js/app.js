(function () {
  'use strict';

  const REPO = 'RobyFerro/Payslippy-Releases';
  const API_URL = `https://api.github.com/repos/${REPO}/releases/latest`;
  const CACHE_KEY = 'documiner.latestRelease';
  const CACHE_TTL_MS = 10 * 60 * 1000;
  const FALLBACK_URL = `https://github.com/${REPO}/releases/latest`;
  const ASSET_REGEX = /\.(exe|msi|msix|msixbundle|appinstaller|zip)$/i;
  const INSTALLER_REGEX = /\.(exe|msi|msix|msixbundle|appinstaller)$/i;

  // ===== prefers-reduced-motion =====
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('reduce-motion');
  }

  // ===== Mobile nav =====
  const toggle = document.querySelector('.nav-toggle');
  const drawer = document.getElementById('nav-drawer');
  if (toggle && drawer) {
    toggle.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      drawer.hidden = !isOpen;
    });
    drawer.addEventListener('click', (e) => {
      if (e.target instanceof HTMLAnchorElement) {
        drawer.classList.remove('open');
        drawer.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ===== Latest release =====
  function readCache() {
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed.ts !== 'number') return null;
      if (Date.now() - parsed.ts > CACHE_TTL_MS) return null;
      return parsed.data;
    } catch (_) { return null; }
  }
  function writeCache(data) {
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
    } catch (_) { /* ignore */ }
  }

  function pickAsset(release) {
    if (!release || !Array.isArray(release.assets)) return null;
    const installer = release.assets.find(a => INSTALLER_REGEX.test(a.name));
    if (installer) return installer;
    return release.assets.find(a => ASSET_REGEX.test(a.name)) || null;
  }

  function formatDate(iso) {
    if (!iso) return '';
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' });
    } catch (_) { return ''; }
  }

  function applyRelease(release) {
    if (!release) return;
    const tag = (release.tag_name || release.name || '').replace(/^v/i, '');
    if (tag) {
      document.querySelectorAll('.version-badge').forEach(el => {
        if (el.closest('.hero-eyebrow')) {
          el.textContent = `v${tag} · Windows 10/11`;
        } else {
          el.textContent = `v${tag}`;
        }
      });
    }

    const asset = pickAsset(release);
    const url = asset ? asset.browser_download_url : (release.html_url || FALLBACK_URL);
    document.querySelectorAll('.download-link').forEach(el => { el.href = url; });

    const dateEl = document.querySelector('.release-date');
    if (dateEl && release.published_at) {
      const formatted = formatDate(release.published_at);
      if (formatted) dateEl.textContent = `Pubblicato il ${formatted}`;
    }
  }

  async function fetchLatestRelease() {
    const cached = readCache();
    if (cached) { applyRelease(cached); return; }
    try {
      const res = await fetch(API_URL, { headers: { 'Accept': 'application/vnd.github+json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      writeCache(data);
      applyRelease(data);
    } catch (err) {
      // Silenzioso: i valori di fallback nell'HTML restano validi.
      console.warn('[DocuMiner] Impossibile recuperare il latest release:', err);
    }
  }

  fetchLatestRelease();
})();
