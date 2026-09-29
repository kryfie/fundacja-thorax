(async () => {
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
  let data;
  try {
    const res = await fetch('/content/site.json', {cache: 'no-store'});
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    data = await res.json();
  } catch (err) {
    console.warn('Decap content fallback:', err);
    return;
  }
  const page = document.body.dataset.page || 'home';
  const setText = (attr, value) => {
    if (value === undefined || value === null || value === '') return;
    $$(`[data-cms="${attr}"]`).forEach(el => el.textContent = value);
  };
  const st = data.settings || {}, h = data.home || {};
  ['foundationName','tagline','krs','nip','regon','email','phone','address','bankAccount'].forEach(k => setText(k, st[k]));
  ['heroEyebrow','heroTitle','heroText','missionTitle','missionText','taxTitle','taxText'].forEach(k => setText(k, h[k]));
  $$('[data-cms-href="email"]').forEach(el => st.email && (el.href = `mailto:${st.email}`));
  $$('[data-cms-href="phone"]').forEach(el => st.phone && (el.href = `tel:${st.phone.replace(/\s/g,'')}`));

  if (page === 'home') {
    renderPrograms(data.programs, $('[data-programs]'));
    renderEvents(data.events, $('[data-events]'));
    renderArticles(data.articles?.slice(0,3), $('[data-articles]'));
    renderPeople(data.people, $('[data-people]'));
    renderReports(data.reports, $('[data-reports]'));
  }
  if (page === 'article') renderArticle(data.articles || []);

  function renderPrograms(items, root) {
    if (!root || !items?.length) return;
    root.innerHTML = items.map((p,i) => `<article class="card"><div class="icon-box" aria-hidden="true">${['♡','◎','＋','✦'][i%4]}</div><div class="kicker">${esc(p.category||'Wsparcie')}</div><h3>${esc(p.title)}</h3><p>${esc(p.summary||p.details||'')}</p>${p.formUrl ? `<a class="btn btn-text" href="${safeUrl(p.formUrl)}" target="_blank" rel="noopener">Szczegóły ${arrow()}</a>`:''}</article>`).join('');
  }
  function renderEvents(items, root) {
    if (!root) return;
    if (!items?.length) { root.innerHTML = `<div class="empty-state"><strong>Brak opublikowanych wydarzeń</strong>Nowe terminy można dodać w panelu Decap CMS.</div>`; return; }
    root.innerHTML = items.slice(0,3).map(e => `<article class="card event-card"><div class="event-media">${e.image?`<img src="${esc(e.image)}" alt="">`:''}<span class="event-date">${esc(e.dateLabel||'Termin do ustalenia')}</span></div><div class="event-body"><div class="event-meta">${esc(e.location||(e.archived?'Archiwum':'Wydarzenie'))}</div><h3>${esc(e.title)}</h3><p>${esc(e.summary||'')}</p>${e.url?`<a class="btn btn-text" href="${safeUrl(e.url)}" target="_blank" rel="noopener">Szczegóły ${arrow()}</a>`:''}</div></article>`).join('');
  }
  function renderArticles(items, root) {
    if (!root || !items?.length) return;
    root.innerHTML = items.map(a => `<article class="card article-card"><div class="article-media">${a.image?`<img src="${esc(a.image)}" alt="">`:`<div class="article-placeholder">◎</div>`}</div><div class="article-body"><div class="meta">${esc(a.category||'Wiedza')} · ${esc(a.dateLabel||'')}</div><h3>${esc(a.title)}</h3><p>${esc(a.excerpt||'')}</p><a class="btn btn-text" href="artykul.html?slug=${encodeURIComponent(a.slug||'')}">Czytaj ${arrow()}</a></div></article>`).join('');
  }
  function renderPeople(items, root) {
    if (!root || !items?.length) return;
    const groups = items.reduce((acc,p)=>((acc[p.section||'Zespół'] ||= []).push(p),acc),{});
    root.innerHTML = Object.entries(groups).map(([section,people]) => `<div class="people-group"><h3>${esc(section)}</h3><div class="people">${people.map(p=>`<div class="person"><strong>${esc(p.name)}</strong><span>${esc(p.role||'')}</span></div>`).join('')}</div></div>`).join('');
  }
  function renderReports(items, root) {
    if (!root || !items?.length) return;
    root.innerHTML = items.map(r=>`<div class="feature-row"><div class="icon-box">PDF</div><div><strong>${esc(r.title)}</strong><p>${esc(r.description||'Dokument Fundacji Thorax')}</p></div><a class="btn btn-secondary" href="${safeUrl(r.url)}" target="_blank" rel="noopener">Otwórz</a></div>`).join('');
  }
  function renderArticle(items) {
    const slug = new URLSearchParams(location.search).get('slug');
    const a = items.find(x => x.slug === slug);
    if (!a) return;
    setText('articleTitle', a.title);
    setText('articleMeta', `${a.category||'Wiedza'} · ${a.dateLabel||''}`);
    const prose = $('[data-article-body]');
    if (prose) prose.innerHTML = String(a.body||'').split(/\n{2,}/).map(p=>`<p>${esc(p).replace(/\n/g,'<br>')}</p>`).join('');
    document.title = `${a.title} | Fundacja Thorax`;
  }
  function esc(v=''){return String(v).replace(/[&<>\"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));}
  function safeUrl(v=''){return /^https?:\/\//i.test(v) ? esc(v) : '#';}
  function arrow(){return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;}
})();
