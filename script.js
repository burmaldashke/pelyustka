const products = [
  { id: "rose-sunrise", title: "Рожевий світанок", type: "троянди", short: "11 троянд, евкаліпт", description: "Ніжний букет для особливих слів.", price: 1890, badge: "Бестселер", rating: "4.9", image: "https://images.unsplash.com/photo-1655744348513-7e48315b7769?auto=format&fit=crop&w=800&q=80", alt: "Букет рожевих і білих троянд" },
  { id: "red-tulips", title: "Трохи пристрасті", type: "тюльпани", short: "15 червоних тюльпанів", description: "Яскравий жест, який запам’ятається.", price: 1250, badge: "Хіт", rating: "5.0", image: "https://images.unsplash.com/photo-1646565804980-7609ba53d260?auto=format&fit=crop&w=800&q=80", alt: "Букет червоних тюльпанів" },
  { id: "white-roses", title: "Тихе зізнання", type: "троянди", short: "9 білих троянд, зелень", description: "Стримана краса для ніжної нагоди.", price: 1690, badge: "Ніжність", rating: "4.8", image: "https://images.unsplash.com/photo-1719736321482-1d70cceba67e?auto=format&fit=crop&w=800&q=80", alt: "Кремові білі троянди" },
  { id: "small-joy", title: "Маленька радість", type: "комплімент", short: "Сезонні квіти, 7 стебел", description: "Маленький букет із великим настроєм.", price: 890, badge: "До 1 000 ₴", rating: "4.9", image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=800&q=80", alt: "Весняний мікс ніжних квітів" },
  { id: "pink-peony", title: "Півонієва хмаринка", type: "комплімент", short: "Півонії та сезонна зелень", description: "Повітряна композиція у рожевих тонах.", price: 2200, badge: "Сезонне", rating: "4.9", image: "https://images.unsplash.com/photo-1655744348513-7e48315b7769?auto=format&fit=crop&w=800&q=80", alt: "Пишні рожеві півонії та троянди" },
  { id: "tulip-morning", title: "Тюльпановий ранок", type: "тюльпани", short: "25 рожевих тюльпанів", description: "Свіжий весняний настрій у кожній пелюстці.", price: 1750, badge: "Свіже надходження", rating: "4.8", image: "https://images.unsplash.com/photo-1646565795834-6bfc55dd4fbe?auto=format&fit=crop&w=800&q=80", alt: "Букет ніжних рожевих тюльпанів" },
  { id: "red-velvet", title: "Оксамитове серце", type: "троянди", short: "15 червоних троянд", description: "Класика, у якій завжди є почуття.", price: 2390, badge: "Для закоханих", rating: "5.0", image: "https://images.unsplash.com/photo-1615196519167-bb42d6337e7a?auto=format&fit=crop&w=800&q=80", alt: "Яскраві червоні троянди" },
  { id: "season-mix", title: "Обійми", type: "комплімент", short: "Сезонний мікс, 11 стебел", description: "Флорист збереться для тебе щось особливе.", price: 1490, badge: "Вибір флориста", rating: "4.9", image: "https://images.unsplash.com/photo-1646565804980-7609ba53d260?auto=format&fit=crop&w=800&q=80", alt: "Авторська квіткова композиція" }
];

const formatPrice = (value) => new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 0 }).format(value) + " ₴";
const productGrid = document.getElementById("productGrid");
const productSearch = document.getElementById("productSearch");
const toast = document.getElementById("toast");
let activeFilter = "усі";
let toastTimer;
let cart = loadStorage("pelyustka-cart", {});

function loadStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2800);
}

function renderProducts() {
  const term = productSearch.value.trim().toLocaleLowerCase("uk");
  const visible = products.filter((product) => {
    const matchesFilter = activeFilter === "усі" || product.type === activeFilter;
    const matchesSearch = !term || (product.title + " " + product.type + " " + product.short).toLocaleLowerCase("uk").includes(term);
    return matchesFilter && matchesSearch;
  });
  if (!visible.length) {
    productGrid.innerHTML = '<p class="no-results">Не знайшли такого букета. Спробуй інший запит або попроси помічника допомогти.</p>';
    return;
  }
  productGrid.innerHTML = visible.map((product) => (
    '<article class="product-card"><div class="product-image-wrap">' +
    '<img class="product-image" src="' + product.image + '" alt="' + product.alt + '" loading="lazy">' +
    '<span class="product-badge">' + product.badge + '</span>' +
    '<button class="favorite-button" type="button" aria-label="Додати ' + product.title + ' до обраного" aria-pressed="false">♡</button>' +
    '</div><div class="product-info"><span class="product-type">' + product.type + ' · ' + product.short + '</span>' +
    '<div class="product-title-row"><h3 class="product-title">' + product.title + '</h3><span class="product-rating">★ ' + product.rating + '</span></div>' +
    '<p class="product-description">' + product.description + '</p><div class="product-buy-row"><span class="product-price">' + formatPrice(product.price) + '</span>' +
    '<button class="add-to-cart" type="button" data-add="' + product.id + '">До кошика <span>+</span></button></div></div></article>'
  )).join("");
}

function saveCart() {
  try { localStorage.setItem("pelyustka-cart", JSON.stringify(cart)); } catch {}
}

function cartQuantity() {
  return Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
}

function renderCart() {
  const items = Object.entries(cart).filter(([, quantity]) => quantity > 0);
  const count = cartQuantity();
  document.getElementById("cartCount").textContent = count;
  document.getElementById("drawerCount").textContent = count ? "(" + count + ")" : "";
  document.getElementById("cartEmpty").hidden = items.length > 0;
  document.getElementById("cartSummary").hidden = items.length === 0;
  document.getElementById("cartItems").innerHTML = items.map(([id, quantity]) => {
    const product = products.find((item) => item.id === id);
    if (!product) return "";
    return '<div class="cart-line"><img src="' + product.image + '" alt=""><div><strong>' + product.title + '</strong><small>' + formatPrice(product.price) + '</small>' +
      '<div class="quantity-control"><button type="button" data-quantity="' + id + '" data-change="-1" aria-label="Зменшити кількість">−</button><span>' + quantity + '</span>' +
      '<button type="button" data-quantity="' + id + '" data-change="1" aria-label="Збільшити кількість">+</button></div></div><span class="cart-line-price">' + formatPrice(product.price * quantity) + '</span></div>';
  }).join("");
  const total = items.reduce((sum, [id, quantity]) => sum + products.find((product) => product.id === id).price * quantity, 0);
  document.getElementById("cartTotal").textContent = formatPrice(total);
  saveCart();
}

function openCart() {
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("cartDrawer").setAttribute("aria-hidden", "false");
  document.getElementById("cartDimmer").hidden = false;
  requestAnimationFrame(() => document.getElementById("cartDimmer").classList.add("visible"));
  document.body.classList.add("drawer-open");
  document.getElementById("closeCart").focus();
}

function closeCart() {
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("cartDrawer").setAttribute("aria-hidden", "true");
  document.getElementById("cartDimmer").classList.remove("visible");
  document.body.classList.remove("drawer-open");
  setTimeout(() => { document.getElementById("cartDimmer").hidden = true; }, 250);
}

function changeCart(id, change) {
  cart[id] = (cart[id] || 0) + change;
  if (cart[id] <= 0) delete cart[id];
  renderCart();
}

productGrid.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add]");
  if (addButton) {
    changeCart(addButton.dataset.add, 1);
    showToast("Додали букет до кошика ✿");
    return;
  }
  const favorite = event.target.closest(".favorite-button");
  if (favorite) {
    const isFavorite = favorite.classList.toggle("is-favorite");
    favorite.setAttribute("aria-pressed", String(isFavorite));
    favorite.textContent = isFavorite ? "♥" : "♡";
  }
});

document.querySelectorAll(".filter-tab").forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll(".filter-tab").forEach((tab) => {
      const active = tab === button;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-pressed", String(active));
    });
    renderProducts();
  });
});
document.querySelectorAll("[data-category-link]").forEach((link) => {
  link.addEventListener("click", () => {
    const button = [...document.querySelectorAll(".filter-tab")].find((item) => item.dataset.filter === link.dataset.categoryLink);
    if (button) button.click();
  });
});
productSearch.addEventListener("input", renderProducts);
document.getElementById("openCart").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
document.getElementById("cartDimmer").addEventListener("click", closeCart);
document.getElementById("cartItems").addEventListener("click", (event) => {
  const button = event.target.closest("[data-quantity]");
  if (button) changeCart(button.dataset.quantity, Number(button.dataset.change));
});
document.getElementById("continueShopping").addEventListener("click", closeCart);
document.getElementById("checkoutButton").addEventListener("click", () => showToast("Дякуємо! Це навчальний макет — замовлення не надсилається."));

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
menuToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Закрити меню" : "Відкрити меню");
});
mainNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

const chatPanel = document.getElementById("chatPanel");
const chatFab = document.getElementById("chatFab");
const chatMessages = document.getElementById("chatMessages");
const chatInput = document.getElementById("chatInput");
const chatHistory = loadSession("pelyustka-chat-session", []);

function loadSession(key, fallback) {
  try {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}
function openChat() {
  chatPanel.classList.add("open");
  chatPanel.setAttribute("aria-hidden", "false");
  chatFab.classList.add("is-open");
  chatFab.setAttribute("aria-label", "Закрити квіткового помічника");
  chatInput.focus();
}
function closeChat() {
  chatPanel.classList.remove("open");
  chatPanel.setAttribute("aria-hidden", "true");
  chatFab.classList.remove("is-open");
  chatFab.setAttribute("aria-label", "Відкрити квіткового помічника");
}
chatFab.addEventListener("click", () => chatPanel.classList.contains("open") ? closeChat() : openChat());
document.getElementById("closeChat").addEventListener("click", closeChat);
document.querySelectorAll("[data-open-chat]").forEach((button) => button.addEventListener("click", openChat));

function addChatMessage(text, from, persist = true) {
  const row = document.createElement("div");
  row.className = "chat-message " + (from === "user" ? "user-message" : "bot-message");
  if (from === "bot") {
    const icon = document.createElement("i");
    icon.textContent = "✿";
    row.append(icon);
  }
  const paragraph = document.createElement("p");
  paragraph.textContent = text;
  row.append(paragraph);
  chatMessages.append(row);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  if (persist) {
    chatHistory.push({ text, from });
    if (chatHistory.length > 12) chatHistory.splice(0, chatHistory.length - 12);
    try { sessionStorage.setItem("pelyustka-chat-session", JSON.stringify(chatHistory)); } catch {}
  }
}
chatHistory.forEach((message) => addChatMessage(message.text, message.from, false));

function classifyIntent(text) {
  const value = text.toLocaleLowerCase("uk");
  if (/привіт|вітаю|добр(ий|ого) (день|ранок)|добрий вечір/.test(value)) return "привітання";
  if (/достав|кур.?єр|коли привез|скільки часу|відправ/.test(value)) return "доставка";
  if (/оплат|картк|готів|платити|ціна|коштує/.test(value)) return "оплата";
  if (/повер|обмін|не сподобав|свіж|якість/.test(value)) return "якість";
  if (/догляд|воду|вазу|пелюст|зріз|стояти/.test(value)) return "догляд";
  if (/троянд|тюльпан|півон|ромаш|квіт|букет|порад|обрат|подар|народжен|кохан/.test(value)) return "букет";
  if (/каталог|сайт|знайти|розділ|контакт/.test(value)) return "навігація";
  return "інше";
}
function makeBotReply(text) {
  const intent = classifyIntent(text);
  const value = text.toLocaleLowerCase("uk");
  const budgetMatch = value.match(/(\d[\d\s]{2,5})\s*(грн|₴|грив)/);
  if (budgetMatch) {
    const budget = Number(budgetMatch[1].replace(/\s/g, ""));
    const match = products.filter((product) => product.price <= budget).sort((a, b) => b.price - a.price)[0];
    if (match) return "У бюджет до " + formatPrice(budget) + " підійде «" + match.title + "» за " + formatPrice(match.price) + ".";
  }
  if (/день народжен|іменин/.test(value)) return "На день народження пасуватиме «Обійми» або яскраві тюльпани. Підкажи бюджет — звужу вибір.";
  if (/мам|подяк/.test(value)) return "Для мами часто обирають ніжні троянди чи сезонний мікс. «Тихе зізнання» — гарний стриманий варіант за 1 690 ₴.";
  if (intent === "привітання") return "Привіт! Рада допомогти 🌷 Розкажи, для якої нагоди шукаєш букет.";
  if (intent === "доставка") return "Доставляємо по Києву від 2 годин після підтвердження. Вартість — від 90 ₴; точний час узгодимо перед відправленням.";
  if (intent === "оплата") return "Можна оплатити карткою онлайн або переказом після підтвердження замовлення. Ціни на сайті вказані у гривнях.";
  if (intent === "якість") return "Ми дбайливо відбираємо квіти перед відправленням. Якщо з букетом щось не так, одразу напиши нам або зателефонуй за номером +38 067 123 45 67.";
  if (intent === "догляд") return "Підріж стебла навскіс, постав букет у чисту прохолодну воду й оновлюй її щодня. Тримай квіти подалі від прямих сонячних променів.";
  if (intent === "букет") return "З радістю підкажу! Є троянди, тюльпани й сезонні компліменти від 890 ₴. Для кого букет і який приблизно бюджет?";
  if (intent === "навігація") return "У каталозі можна знайти букети й скористатися фільтрами. Про доставку та часті запитання — у розділах нижче на цій сторінці.";
  const previous = [...chatHistory].reverse().find((message) => message.from === "user");
  if (previous && classifyIntent(previous.text) === "букет") return "Для точної поради напиши нагоду, улюблений колір або бюджет — підберу варіант із каталогу.";
  return "Я підкажу про букети, доставку, оплату й догляд за квітами. Напиши, що саме тебе цікавить 🌸";
}
function recordLocalAnalytics(intent) {
  const stats = loadStorage("pelyustka-demo-stats", { total: 0, topics: {} });
  stats.total += 1;
  stats.topics[intent] = (stats.topics[intent] || 0) + 1;
  try { localStorage.setItem("pelyustka-demo-stats", JSON.stringify(stats)); } catch {}
}
function sendChat(text) {
  const clean = text.trim();
  if (!clean) return;
  addChatMessage(clean, "user");
  recordLocalAnalytics(classifyIntent(clean));
  const typing = document.createElement("div");
  typing.className = "chat-message bot-message typing-message";
  typing.innerHTML = '<i>✿</i><p>Пелюстка думає…</p>';
  chatMessages.append(typing);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  setTimeout(() => {
    typing.remove();
    addChatMessage(makeBotReply(clean), "bot");
  }, 350);
}
document.getElementById("chatForm").addEventListener("submit", (event) => {
  event.preventDefault();
  sendChat(chatInput.value);
  chatInput.value = "";
});
document.getElementById("chatSuggestions").addEventListener("click", (event) => {
  const suggestion = event.target.closest("button");
  if (suggestion) sendChat(suggestion.textContent);
});
document.getElementById("contactForm").addEventListener("submit", (event) => {
  event.preventDefault();
  showToast("Дякуємо! Це демо — форма не надсилає дані.");
  event.currentTarget.reset();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeCart();
    closeChat();
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});
renderProducts();
renderCart();
