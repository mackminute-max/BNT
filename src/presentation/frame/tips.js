// Clickable tooltips: any element with data-tip opens a small explanation box
// when clicked or tapped, and closes on a second click, Escape, or a click
// elsewhere. One delegated listener per document, so re-rendered panels work.
const CSS = `.bt-tag{display:inline-flex;align-items:center;gap:.25rem;margin:0 .3rem .3rem 0;padding:0 .45rem;border:1px solid rgba(184,153,104,.6);border-radius:999px;background:rgba(184,153,104,.12);color:#e9d3a8;font:500 .74rem/1.55 system-ui,sans-serif;letter-spacing:0;text-transform:none;text-shadow:none;box-shadow:none;cursor:help;user-select:none}.bt-tag[data-tip]::after{content:'?';display:inline-grid;place-items:center;width:1.1em;height:1.1em;border-radius:50%;background:#b89968;color:#1d1410;font:700 .66rem/1 system-ui,sans-serif}
.bt-tag[data-tip]:hover,.bt-tag:focus-visible,.bt-tag[aria-expanded=true]{background:rgba(255,201,74,.16);border-color:#ffc94a;color:#ffe3a3;outline:none}
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
  doc.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches?.('[data-tip][role=button]')) { e.preventDefault(); e.target.click(); }
    else if (e.key === 'Escape') close();
  });
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
