const $ = (id) => document.getElementById(id);

// ===== Randomized plan storage (no repeats next week) =====
function getMondayOfCurrentWeek(d = new Date()) {
  const day = d.getDay(); // Sun=0
  const mondayOffset = (day === 0 ? -6 : 1 - day);
  const m = new Date(d);
  m.setDate(d.getDate() + mondayOffset);
  m.setHours(0, 0, 0, 0);
  return m;
}
function weekKey(d = new Date()) {
  const m = getMondayOfCurrentWeek(d);
  return `week_${m.toISOString().slice(0, 10)}`; // e.g. week_2026-02-16
}
function loadSavedWeek() {
  const key = weekKey(new Date());
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
}
function saveWeek(plan) {
  const key = weekKey(new Date());
  localStorage.setItem(key, JSON.stringify(plan));
}
function clearThisWeek() {
  localStorage.removeItem(weekKey(new Date()));
}

function lastWeekTitles() {
  const now = getMondayOfCurrentWeek(new Date());
  const prev = new Date(now);
  prev.setDate(now.getDate() - 7);
  const prevKey = `week_${prev.toISOString().slice(0, 10)}`;
  const raw = localStorage.getItem(prevKey);
  if (!raw) return new Set();
  try {
    const p = JSON.parse(raw);
    const titles = [];
    p.days.forEach((d) => titles.push(d.breakfast?.title, d.lunch?.title, d.dinner?.title));
    return new Set(titles.filter(Boolean));
  } catch {
    return new Set();
  }
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function cloneMeal(m) {
  return JSON.parse(JSON.stringify(m));
}

function pickNonRepeating(pool, avoidSet, usedSet) {
  for (let i = 0; i < 60; i++) {
    const m = pickRandom(pool);
    if (!m) break;
    if (usedSet.has(m.title)) continue;
    if (avoidSet.has(m.title)) continue;
    usedSet.add(m.title);
    return cloneMeal(m);
  }
  const fallback = pickRandom(pool);
  if (fallback) {
    usedSet.add(fallback.title);
    return cloneMeal(fallback);
  }
  return {
    title: "(Add meals to MEAL_POOL)",
    cuisine: "",
    kcalPerServing: 0,
    ingredients: [],
    steps: ["Add meals to MEAL_POOL in data.js"],
    tags: ["Family of 4"],
    note: "",
    image: ""
  };
}

function buildWeekFromPool() {
  const avoid = lastWeekTitles();
  const used = new Set();

  const breakfasts = MEAL_POOL.filter((m) => (m.tags || []).includes("Breakfast"));
  const lunches = MEAL_POOL.filter((m) => (m.tags || []).includes("Lunch"));
  const dinners = MEAL_POOL.filter((m) => (m.tags || []).includes("Dinner"));

  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const days = dayNames.map((name) => ({
    name,
    breakfast: pickNonRepeating(breakfasts, avoid, used),
    lunch: pickNonRepeating(lunches, avoid, used),
    dinner: pickNonRepeating(dinners, avoid, used)
  }));

  return { days };
}

// Current plan (saved or generated)
let ACTIVE_WEEK = loadSavedWeek() || buildWeekFromPool();
saveWeek(ACTIVE_WEEK);

// ===== UI tabs =====
const views = {
  today: $("view-today"),
  week: $("view-week"),
  shop: $("view-shop"),
};
const tabs = {
  today: $("tab-today"),
  week: $("tab-week"),
  shop: $("tab-shop"),
};

function setActiveTab(which) {
  Object.entries(tabs).forEach(([k, el]) => el.classList.toggle("active", k === which));
  Object.entries(views).forEach(([k, el]) => el.classList.toggle("hidden", k !== which));
}
tabs.today.onclick = () => setActiveTab("today");
tabs.week.onclick = () => setActiveTab("week");
tabs.shop.onclick = () => setActiveTab("shop");
$("printBtn").onclick = () => window.print();

// ===== Date helpers =====
function weekdayIndexMondayFirst(date = new Date()) {
  const js = date.getDay(); // Sun=0
  return (js + 6) % 7; // Mon=0
}
function formatDateLong(d) {
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ===== Cards =====
function renderMealCard(typeLabel, m) {
  const tags = (m.tags || []).map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("");
  const ingList = (m.ingredients || [])
    .map((x) => `<li>${escapeHtml(x.name)} — ${prettyQty(x.qty)} ${escapeHtml(x.unit)}</li>`)
    .join("");
  const steps = (m.steps || []).map((s) => `<li>${escapeHtml(s)}</li>`).join("");

  const el = document.createElement("div");
  el.className = "card";

  const imgHtml = m.image
    ? `<img class="mealImg"
        src="${escapeHtml(m.image)}"
        alt="${escapeHtml(m.title || "Meal")}"
        loading="lazy"
        referrerpolicy="no-referrer"
        crossorigin="anonymous"
        onerror="this.style.display='none'; this.parentElement.classList.add('imgError');" />`

    : `<div class="mealImg placeholder"></div>`;

  el.innerHTML = `
    <div class="imgWrap">${imgHtml}</div>

    <div class="cardTop">
      <div>
        <div class="mealType">${escapeHtml(typeLabel)}</div>
        <div class="mealName">${escapeHtml(m.title || "")}</div>
        <div class="small">${escapeHtml(m.cuisine || "")}</div>
      </div>
      <div class="kcal">${Number(m.kcalPerServing || 0)} kcal</div>
    </div>

    <div class="tags">${tags}</div>

    <div class="details">
      <h3>Ingredients</h3>
      <ul>${ingList}</ul>
      <div class="small">Servings: 4 (default)</div>

      <h3 style="margin-top:12px;">Recipe</h3>
      <ol>${steps}</ol>

      ${m.note ? `<div class="small"><strong>Note:</strong> ${escapeHtml(m.note)}</div>` : ""}
    </div>
  `;

  el.onclick = () => el.classList.toggle("expanded");
  return el;
}

// ===== Render Today =====
function renderToday() {
  const idx = weekdayIndexMondayFirst(new Date());
  const day = ACTIVE_WEEK.days[idx];

  $("todayTitle").textContent = "Today";
  $("todayPill").textContent = `${day.name} • ${formatDateLong(new Date())}`;
  $("subtitle").textContent = `${FAMILY.location} • Family of ${FAMILY.size}`;

  const wrap = $("todayCards");
  wrap.innerHTML = "";
  wrap.appendChild(renderMealCard("Breakfast", day.breakfast));
  wrap.appendChild(renderMealCard("Lunch", day.lunch));
  wrap.appendChild(renderMealCard("Dinner", day.dinner));
}

// ===== Render Week =====
function renderWeek() {
  const tabsWrap = $("dayTabs");
  const cardsWrap = $("weekCards");
  tabsWrap.innerHTML = "";

  let activeIdx = weekdayIndexMondayFirst(new Date());

  ACTIVE_WEEK.days.forEach((d, i) => {
    const b = document.createElement("button");
    b.className = "dayTab" + (i === activeIdx ? " active" : "");
    b.textContent = d.name.slice(0, 3);
    b.onclick = () => {
      activeIdx = i;
      [...tabsWrap.children].forEach((x, j) => x.classList.toggle("active", j === activeIdx));
      renderWeekCards(activeIdx);
    };
    tabsWrap.appendChild(b);
  });

  function renderWeekCards(i) {
    const day = ACTIVE_WEEK.days[i];
    cardsWrap.innerHTML = "";
    cardsWrap.appendChild(renderMealCard(`${day.name} • Breakfast`, day.breakfast));
    cardsWrap.appendChild(renderMealCard(`${day.name} • Lunch`, day.lunch));
    cardsWrap.appendChild(renderMealCard(`${day.name} • Dinner`, day.dinner));
  }

  renderWeekCards(activeIdx);
}

// ===== Shopping list + cost =====
function toBaseUnit(qty, unit) {
  const u = String(unit || "").toLowerCase();
  if (u === "kg") return { qty: qty * 1000, unit: "g" };
  if (u === "g") return { qty, unit: "g" };
  if (u === "l") return { qty: qty * 1000, unit: "ml" };
  if (u === "ml") return { qty, unit: "ml" };
  return { qty, unit: "pcs" };
}
function fromBaseUnit(qty, unit) {
  if (unit === "g" && qty >= 1000) return { qty: qty / 1000, unit: "kg" };
  if (unit === "ml" && qty >= 1000) return { qty: qty / 1000, unit: "L" };
  return { qty, unit };
}
function buildWeeklyIngredientTotals() {
  const totals = new Map(); // name -> {qty, unit}
  ACTIVE_WEEK.days.forEach((d) => {
    [d.breakfast, d.lunch, d.dinner].forEach((m) => {
      (m.ingredients || []).forEach((x) => {
        const base = toBaseUnit(x.qty, x.unit);
        const key = x.name;
        const prev = totals.get(key);
        if (!prev) totals.set(key, { qty: base.qty, unit: base.unit });
        else totals.set(key, { qty: prev.qty + base.qty, unit: prev.unit });
      });
    });
  });
  return totals;
}
function estimateCostForItem(name, totalBase) {
  const pb = PRICE_BOOK[name];
  if (!pb) return { known: false, cost: 0, store: "Unknown", packs: 0, packPrice: 0 };

  const packBase = toBaseUnit(pb.packSize, pb.unit);
  const needed = totalBase.qty;
  const packQty = packBase.qty;

  const packs = packQty > 0 ? Math.ceil(needed / packQty) : 0;
  const cost = packs * pb.price;
  return { known: true, cost, store: pb.store, packs, packPrice: pb.price };
}
function inferCategory(name) {
  const pb = PRICE_BOOK[name];
  if (pb?.category) return pb.category;

  const n = String(name || "").toLowerCase();
  if (n.includes("chicken") || n.includes("beef") || n.includes("salmon") || n.includes("tuna") || n.includes("turkey")) return "Meat/Fish";
  if (n.includes("milk") || n.includes("cheese") || n.includes("yogurt") || n.includes("eggs") || n.includes("butter")) return "Dairy";
  if (n.includes("rice") || n.includes("oats") || n.includes("pasta") || n.includes("flour") || n.includes("beans") || n.includes("egusi") || n.includes("oil") || n.includes("granola")) return "Pantry";
  if (n.includes("pepper") || n.includes("tomato") || n.includes("onion") || n.includes("banana") || n.includes("berries") || n.includes("apples") || n.includes("carrot") || n.includes("lettuce") || n.includes("cucumber") || n.includes("potato") || n.includes("green beans")) return "Produce";
  return "Other";
}
function prettyQty(q) {
  if (Number.isInteger(q)) return String(q);
  const rounded = Math.round(q * 100) / 100;
  return String(rounded);
}

function renderShopping() {
  const totals = buildWeeklyIngredientTotals();
  const storeFilter = $("storeFilter").value;
  const groupBy = $("groupBy").value;

  const rows = [];
  totals.forEach((base, name) => {
    const shown = fromBaseUnit(base.qty, base.unit);
    const costInfo = estimateCostForItem(name, base);
    const store = costInfo.known ? costInfo.store : "Unknown";

    rows.push({
      name,
      qty: shown.qty,
      unit: shown.unit,
      category: inferCategory(name),
      store,
      costKnown: costInfo.known,
      cost: costInfo.cost,
      packs: costInfo.packs,
      packPrice: costInfo.packPrice,
    });
  });

  const filtered = rows.filter((r) => (storeFilter === "ALL" ? true : r.store === storeFilter));

  const totalCost = filtered.reduce((s, r) => s + (r.costKnown ? r.cost : 0), 0);
  const unknownCount = filtered.filter((r) => !r.costKnown).length;

  $("budgetPill").textContent =
    `Estimated total: $${totalCost.toFixed(2)}` +
    (unknownCount ? ` • ${unknownCount} items need a price` : "");

  const storeTotals = {};
  filtered.forEach((r) => {
    if (!r.costKnown) return;
    storeTotals[r.store] = (storeTotals[r.store] || 0) + r.cost;
  });

  $("shopSummary").innerHTML = `
    <div><strong>How this estimate works:</strong> sums ingredients across Mon–Sun and rounds up to package sizes in your Price Book.</div>
    <div class="small" style="margin-top:8px;">
      ${
        Object.keys(storeTotals).length
          ? Object.entries(storeTotals)
              .map(([k, v]) => `${escapeHtml(k)}: <strong>$${v.toFixed(2)}</strong>`)
              .join(" • ")
          : "Add more items to PRICE_BOOK in data.js to get better totals."
      }
    </div>
  `;

  const groups = new Map();
  filtered
    .sort((a, b) => a.name.localeCompare(b.name))
    .forEach((r) => {
      const key = groupBy === "store" ? r.store : r.category;
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(r);
    });

  const listWrap = $("shopList");
  listWrap.innerHTML = "";

  groups.forEach((items, key) => {
    const groupCost = items.reduce((s, r) => s + (r.costKnown ? r.cost : 0), 0);
    const g = document.createElement("div");
    g.className = "group";
    g.innerHTML = `
      <div class="groupTitle">
        <div>${escapeHtml(key)}</div>
        <span>$${groupCost.toFixed(2)}</span>
      </div>
      ${items
        .map(
          (r) => `
        <div class="itemRow">
          <div class="left">${escapeHtml(r.name)}</div>
          <div class="right">
            ${prettyQty(r.qty)} ${escapeHtml(r.unit)}
            ${
              r.costKnown
                ? ` • $${r.cost.toFixed(2)} (${r.packs}×$${r.packPrice.toFixed(2)})`
                : ` • <em>add price</em>`
            }
          </div>
        </div>
      `
        )
        .join("")}
    `;
    listWrap.appendChild(g);
  });
}

// ===== Buttons =====
function randomizeWholeWeek() {
  ACTIVE_WEEK = buildWeekFromPool();
  saveWeek(ACTIVE_WEEK);
  renderToday();
  renderWeek();
  renderShopping();
}
function randomizeTodayOnly() {
  const idx = weekdayIndexMondayFirst(new Date());
  const used = new Set(); // avoid duplicates within today
  const avoid = new Set();

  const breakfasts = MEAL_POOL.filter((m) => (m.tags || []).includes("Breakfast"));
  const lunches = MEAL_POOL.filter((m) => (m.tags || []).includes("Lunch"));
  const dinners = MEAL_POOL.filter((m) => (m.tags || []).includes("Dinner"));

  ACTIVE_WEEK.days[idx].breakfast = pickNonRepeating(breakfasts, avoid, used);
  ACTIVE_WEEK.days[idx].lunch = pickNonRepeating(lunches, avoid, used);
  ACTIVE_WEEK.days[idx].dinner = pickNonRepeating(dinners, avoid, used);

  saveWeek(ACTIVE_WEEK);
  renderToday();
  renderWeek();
  renderShopping();
}

$("randWeekBtn").addEventListener("click", randomizeWholeWeek);
$("randTodayBtn").addEventListener("click", randomizeTodayOnly);
$("refreshShopBtn").addEventListener("click", renderShopping);
$("resetWeekBtn").addEventListener("click", () => {
  clearThisWeek();
  ACTIVE_WEEK = buildWeekFromPool();
  saveWeek(ACTIVE_WEEK);
  renderToday();
  renderWeek();
  renderShopping();
});

// Re-render shopping list when filters change
$("storeFilter").addEventListener("change", renderShopping);
$("groupBy").addEventListener("change", renderShopping);

// ===== Utils =====
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[m]));
}

// ===== Initial render =====
renderToday();
renderWeek();
renderShopping();
setActiveTab("today");
