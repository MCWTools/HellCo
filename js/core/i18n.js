/* English / Vietnamese. UI + dialogue strings live in js/lang/*.js.
   Generated content (deaths, ledgers...) stores [en, vi] pairs and renders with pair(). */
HC.i18n = {
  lang: 'en',
  dicts: {},
  register(l, d) { this.dicts[l] = d; },
  t(key, vars) {
    let s = (this.dicts[this.lang] || {})[key];
    if (s == null) s = (this.dicts.en || {})[key];
    if (s == null) return key;
    if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] != null ? vars[k] : m));
    return s;
  },
  pair(p) { return p[this.lang === 'vi' ? 1 : 0]; },
  detect() {
    const nav = (navigator.language || 'en').toLowerCase();
    return nav.indexOf('vi') === 0 ? 'vi' : 'en';
  },
  init() {
    const st = HC.store.get();
    this.lang = st.lang || this.detect();
    document.documentElement.lang = this.lang;
    this.apply();
  },
  set(l) {
    this.lang = l;
    const st = HC.store.get(); st.lang = l; HC.store.save();
    document.documentElement.lang = l;
    this.apply();
    HC.bus.emit('lang', l);
  },
  apply(root) {
    const r = root || document;
    r.querySelectorAll('[data-i18n]').forEach(e => { e.textContent = this.t(e.dataset.i18n); });
    r.querySelectorAll('[data-i18n-ph]').forEach(e => { e.placeholder = this.t(e.dataset.i18nPh); });
    r.querySelectorAll('[data-i18n-title]').forEach(e => { e.title = this.t(e.dataset.i18nTitle); });
  }
};
HC.t = (k, v) => HC.i18n.t(k, v);
