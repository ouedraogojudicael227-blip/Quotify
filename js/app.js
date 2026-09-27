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
    const adding = !set.has(id);
    if (adding) set.add(id); else set.delete(id);
    localStorage.setItem("quotify-favs", JSON.stringify([...set]));
    document.querySelectorAll("[data-fav='" + id + "']").forEach((btn) => {
      btn.innerHTML = (adding ? "♥" : "♡") + " " + this.t("favoris");
      btn.classList.toggle("on", adding);
    });
    this.toast(adding ? this.t("ajoutee") : this.t("retiree"));
  },
  toast(msg) {
    let el = document.getElementById("toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "toast";
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.className = "toast show";
    clearTimeout(this._toast);
    this._toast = setTimeout(() => { el.className = "toast"; }, 1600);
  },
  dayIndex() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    return Math.floor((now - start) / 86400000);
  },
  pool(lang) {
    const all = window.QUOTIFY_DATA.quotes;
    const same = all.filter((q) => q.lang === (lang || this.lang()));
    return same.length ? same : all;
  },
  quoteOfDay() {
    const list = this.pool();
    return list[this.dayIndex() % list.length];
  },
  pick(excludeId, lang) {
    const list = this.pool(lang).filter((q) => q.id !== excludeId);
    return list[Math.floor(Math.random() * list.length)] || this.quoteOfDay();
  },
  themeColor(id) {
    return (window.QUOTIFY_DATA.themes[id] || {}).color || "#c9842a";
  },
  themeLabel(id) {
    const th = window.QUOTIFY_DATA.themes[id];
    return th ? th[this.lang()] || th.fr : id;
  },
  copy(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
      if (btn) {
        const old = btn.textContent;
        btn.textContent = this.t("copie");
        setTimeout(() => { btn.textContent = old; }, 1400);
      }
      this.toast(this.t("copie"));
    });
  },
  share(q) {
    const text = `"${q.text}" — ${q.author}`;
    if (navigator.share) navigator.share({ title: "Quotify", text }).catch(() => this.copy(text));
    else this.copy(text);
  },
  untilMidnight() {
    const now = new Date();
    const mid = new Date(now);
    mid.setHours(24, 0, 0, 0);
    const diff = mid - now;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return h + "h" + String(m).padStart(2, "0");
  },
  install() {
    alert(this.lang() === "en"
      ? "On Android Chrome: menu then Add to Home screen. On iPhone: Share then Add to Home Screen."
      : "Sur Android Chrome : menu puis Ajouter à l'écran d'accueil. Sur iPhone : Partager puis Sur l'écran d'accueil.");
  }
};

function applyChrome() {
  document.documentElement.setAttribute("data-theme", Quotify.theme());
  document.documentElement.lang = Quotify.lang();
  if (Quotify.isApp()) document.documentElement.setAttribute("data-shell", "app");
}

function headerHTML(active) {
  const t = (k) => Quotify.t(k);
  return `<header class="top"><div class="wrap top-inner">
    <a class="brand" href="index.html"><span class="logo">Q</span>${t("brand")}</a>
    <nav class="web-nav">
      <a href="index.html" class="${active === "home" ? "active" : ""}">${t("aujourdhui")}</a>
      <a href="explorer.html" class="${active === "explorer" ? "active" : ""}">${t("explorer")}</a>
      <a href="roue.html" class="${active === "roue" ? "active" : ""}">${t("roue")}</a>
      <a href="favoris.html" class="${active === "favoris" ? "active" : ""}">${t("favoris")}</a>
      <button class="icon-btn" type="button" onclick="Quotify.toggleTheme()">${Quotify.theme() === "dark" ? t("clair") : t("sombre")}</button>
      <select onchange="Quotify.setLang(this.value)" aria-label="${t("langue")}">
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
    <a href="roue.html" class="${page === "roue.html" ? "active" : ""}">${t("roue")}</a>
    <a href="favoris.html" class="${page === "favoris.html" ? "active" : ""}">${t("favoris")}</a>
  </nav>`;
}

function quoteCard(q, extra) {
  const t = (k) => Quotify.t(k);
  const heart = Quotify.isFav(q.id) ? "♥" : "♡";
  const text = `"${q.text}" — ${q.author}`;
  const color = Quotify.themeColor(q.theme);
  return `<article class="card quote-card" id="q-${q.id}" style="--q:${color}">
    <div class="tag">${Quotify.themeLabel(q.theme)}</div>
    <blockquote>${q.text}</blockquote>
    <cite>— ${q.author}</cite>
    <div class="row">
      <button class="btn ghost ${Quotify.isFav(q.id) ? "on" : ""}" type="button" data-fav="${q.id}" onclick="Quotify.toggleFav(${q.id})">${heart} ${t("favoris")}</button>
      <button class="btn ghost" type="button" onclick='Quotify.copy(${JSON.stringify(text)}, this)'>${t("copier")}</button>
      <button class="btn ghost" type="button" onclick='Quotify.share(${JSON.stringify(q)})'>${t("partager")}</button>
      ${extra || ""}
    </div>
  </article>`;
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}
document.addEventListener("DOMContentLoaded", applyChrome);
