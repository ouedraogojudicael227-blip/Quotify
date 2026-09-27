window.Quotify = {
  t(k) {
    const lang = this.lang();
    return (window.I18N[lang] && window.I18N[lang][k]) || window.I18N.fr[k] || k;
  },
  lang() { return localStorage.getItem("quotify-lang") || "fr"; },
  setLang(v) { localStorage.setItem("quotify-lang", v); location.reload(); },
  theme() { return localStorage.getItem("quotify-theme") || "light"; },
  toggleTheme() {
    const next = this.theme() === "dark" ? "light" : "dark";
    localStorage.setItem("quotify-theme", next);
    document.documentElement.setAttribute("data-theme", next);
  },
  isApp() {
    const q = new URLSearchParams(location.search).get("shell");
    if (q === "app") localStorage.setItem("quotify-shell", "app");
    if (q === "web") localStorage.setItem("quotify-shell", "web");
    return localStorage.getItem("quotify-shell") === "app" || window.matchMedia("(display-mode: standalone)").matches;
  },
  favs() {
    try { return JSON.parse(localStorage.getItem("quotify-favs") || "[]"); } catch (e) { return []; }
  },
  isFav(id) { return this.favs().includes(id); },
  toggleFav(id) {
    const set = new Set(this.favs());
    if (set.has(id)) set.delete(id); else set.add(id);
    localStorage.setItem("quotify-favs", JSON.stringify([...set]));
    location.reload();
  },
  dayIndex() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    return Math.floor((now - start) / 86400000);
  },
  quoteOfDay() {
    const list = window.QUOTIFY_DATA.quotes;
    return list[this.dayIndex() % list.length];
  },
  pick(excludeId) {
    const list = window.QUOTIFY_DATA.quotes.filter((q) => q.id !== excludeId);
    return list[Math.floor(Math.random() * list.length)];
  },
  themeLabel(id) {
    const th = window.QUOTIFY_DATA.themes[id];
    return th ? th[this.lang()] || th.fr : id;
  },
  copy(text) {
    navigator.clipboard.writeText(text).then(() => {
      const el = document.getElementById("copyBtn");
      if (el) { el.textContent = this.t("copie"); setTimeout(() => { el.textContent = this.t("copier"); }, 1400); }
    });
  },
  share(q) {
    const text = `"${q.text}" — ${q.author}`;
    if (navigator.share) navigator.share({ title: "Quotify", text });
    else this.copy(text);
  },
  install() {
    alert(this.lang() === "en"
      ? "On Android Chrome: menu then Add to Home screen. On iPhone: Share then Add to Home Screen."
      : "Sur Android Chrome : menu puis Ajouter à l'écran d'accueil. Sur iPhone : Partager puis Sur l'écran d'accueil.");
  }
};

function applyChrome() {
  document.documentElement.setAttribute("data-theme", Quotify.theme());
  if (Quotify.isApp()) document.documentElement.setAttribute("data-shell", "app");
}

function headerHTML(active) {
  const t = (k) => Quotify.t(k);
  return `<header class="top"><div class="wrap top-inner">
    <a class="brand" href="index.html"><span class="logo">Q</span>${t("brand")}</a>
    <nav class="web-nav">
      <a href="index.html" class="${active === "home" ? "active" : ""}">${t("aujourdhui")}</a>
      <a href="explorer.html" class="${active === "explorer" ? "active" : ""}">${t("explorer")}</a>
      <a href="favoris.html" class="${active === "favoris" ? "active" : ""}">${t("favoris")}</a>
      <button class="icon-btn" onclick="Quotify.toggleTheme()">${Quotify.theme() === "dark" ? t("clair") : t("sombre")}</button>
      <select onchange="Quotify.setLang(this.value)">
        <option value="fr" ${Quotify.lang() === "fr" ? "selected" : ""}>FR</option>
        <option value="en" ${Quotify.lang() === "en" ? "selected" : ""}>EN</option>
      </select>
    </nav>
  </div></header>`;
}

function footerHTML() {
  const t = (k) => Quotify.t(k);
  const page = (location.pathname.split("/").pop() || "index.html");
  return `<footer class="wrap"><p>${t("footer")}</p><p class="note">${t("offlineOk")}</p></footer>
  <nav class="app-foot">
    <a href="index.html" class="${page === "index.html" || page === "" ? "active" : ""}">${t("aujourdhui")}</a>
    <a href="explorer.html" class="${page === "explorer.html" ? "active" : ""}">${t("explorer")}</a>
    <a href="favoris.html" class="${page === "favoris.html" ? "active" : ""}">${t("favoris")}</a>
  </nav>`;
}

function quoteCard(q, extra) {
  const t = (k) => Quotify.t(k);
  const heart = Quotify.isFav(q.id) ? "♥" : "♡";
  const text = `"${q.text}" — ${q.author}`;
  return `<article class="card quote-card" id="q-${q.id}">
    <div class="tag">${Quotify.themeLabel(q.theme)}</div>
    <blockquote>${q.text}</blockquote>
    <cite>— ${q.author}</cite>
    <div class="row">
      <button class="btn ghost" onclick="Quotify.toggleFav(${q.id})">${heart} ${t("favoris")}</button>
      <button class="btn ghost" id="copyBtn" onclick='Quotify.copy(${JSON.stringify(text)})'>${t("copier")}</button>
      <button class="btn ghost" onclick='Quotify.share(${JSON.stringify(q)})'>${t("partager")}</button>
      ${extra || ""}
    </div>
  </article>`;
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
document.addEventListener("DOMContentLoaded", applyChrome);
