/* Small pop-up messages. */
HC.toast = function (text, cls) {
  const box = document.getElementById('toasts');
  const e = HC.el('div', 'toast ' + (cls || ''), HC.esc(text));
  box.appendChild(e);
  setTimeout(() => { e.style.transition = 'opacity .4s'; e.style.opacity = 0; setTimeout(() => e.remove(), 450); }, 2800);
};
