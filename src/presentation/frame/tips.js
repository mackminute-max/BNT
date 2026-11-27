// Clickable tooltips: any element with data-tip opens a small explanation box
// when clicked or tapped, and closes on a second click, Escape, or a click
// elsewhere. One delegated listener per document, so re-rendered panels work.
const CSS = `.bt-tag{display:inline-block;margin:0 .3rem .3rem 0;padding:.08rem .5rem;border:1px solid #b89968;border-radius:999px;background:#2b1d16;color:#f3e2c0;font:600 .78rem/1.5 system-ui,sans-serif;cursor:help;text-decoration:underline dotted #b89968;text-underline-offset:3px}
.bt-tag:hover,.bt-tag:focus-visible,.bt-tag[aria-expanded=true]{background:#4a2f1f;border-color:#ffc94a;outline:none}
.bt-tag-plain{cursor:default;text-decoration:none}
.bt-tags{margin:.15rem 0 .35rem}
.bt-tip-pop{position:fixed;z-index:9999;max-width:320px;padding:.6rem .75rem;border:1px solid #ffc94a;border-radius:6px;background:#1d1410;color:#f3e2c0;font:400 .85rem/1.4 system-ui,sans-serif;box-shadow:0 6px 18px rgba(0,0,0,.55)}
.bt-tip-pop strong{display:block;color:#ffc94a;margin-bottom:.2rem}`;

export function installTips(doc = globalThis.document) {
  if (!doc || doc.__btTips) return;
  doc.__btTips = true;
  const style = doc.createElement('style');
  style.textContent = CSS;
  doc.head.append(style);
  let pop = null, owner = null;
  const close = () => { pop?.remove(); pop = null; owner?.setAttribute('aria-expanded', 'false'); owner = null; };
  doc.addEventListener('click', e => {
    const t = e.target.closest?.('[data-tip]');
    if (!t) { if (pop && !e.target.closest?.('.bt-tip-pop')) close(); return; }
    e.preventDefault();
    e.stopPropagation();
    if (owner === t) { close(); return; }
    close();
    owner = t;
    t.setAttribute('aria-expanded', 'true');
    pop = doc.createElement('div');
    pop.className = 'bt-tip-pop';
    pop.setAttribute('role', 'tooltip');
    const title = doc.createElement('strong');
    title.textContent = t.dataset.tipTitle ?? t.textContent.trim() ?? '';
    const body = doc.createElement('div');
    body.textContent = t.dataset.tip;
    if (title.textContent) pop.append(title);
    pop.append(body);
    doc.body.append(pop);
    const r = t.getBoundingClientRect(), w = pop.offsetWidth, h = pop.offsetHeight, vw = doc.documentElement.clientWidth, vh = doc.documentElement.clientHeight;
    const left = Math.max(8, Math.min(r.left, vw - w - 8));
    const top = r.bottom + 6 + h > vh ? Math.max(8, r.top - h - 6) : r.bottom + 6;
    pop.style.left = left + 'px';
    pop.style.top = top + 'px';
  }, true);
  doc.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  doc.addEventListener('scroll', close, true);
}
