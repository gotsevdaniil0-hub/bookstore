// ======================== ДАННЫЕ ========================
const books = [
  { id: 1, title: "Чистый код", author: "Роберт Мартин", price: 850, img: "images/1.jpg" },
  { id: 2, title: "JavaScript: Руководство", author: "Дэвид Флэнаган", price: 1200, img: "images/2.jpg" },
  { id: 3, title: "Алгоритмы", author: "Адитья Бхаргава", price: 450, img: "images/3.jpg" },
  { id: 4, title: "Реакт в действии", author: "Алекс Бэнкс", price: 980, img: "images/4.jpg" },
  { id: 5, title: "CSS для профи", author: "Лия Веру", price: 390, img: "images/5.jpg" },
  { id: 6, title: "Дизайн вещей", author: "Дон Норман", price: 540, img: "images/6.jpg" }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

const booksGrid = document.getElementById('booksGrid');
const cartBody = document.getElementById('cartBody');
const cartTotal = document.getElementById('cartTotal');
const themeToggle = document.getElementById('themeToggle');
const backToTop = document.getElementById('backToTop');
const orderForm = document.getElementById('orderForm');
const filterBtns = document.querySelectorAll('.filter-btn');

document.addEventListener('DOMContentLoaded', function() {
  renderBooks(books);
  renderCart();
  loadTheme();
  setupEventListeners();
});

function renderBooks(booksToRender) {
  booksGrid.innerHTML = '';
  booksToRender.forEach(book => {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.innerHTML = `
      <img src="${book.img}" alt="${book.title}" class="book-img">
      <div class="book-info">
        <div class="book-title">${book.title}</div>
        <div class="book-author">${book.author}</div>
        <div class="book-price">${book.price} ₽</div>
      </div>
      <button class="add-btn" data-id="${book.id}">В корзину</button>
    `;
    booksGrid.appendChild(card);
  });
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', function() {
    filterBtns.forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const filter = this.dataset.filter;
    let filteredBooks = books;
    if (filter === 'under500') filteredBooks = books.filter(b => b.price < 500);
    else if (filter === 'over500') filteredBooks = books.filter(b => b.price >= 500);
    renderBooks(filteredBooks);
  });
});

function addToCart(bookId) {
  const book = books.find(b => b.id === bookId);
  if (!book) return;
  const existing = cart.find(i => i.id === bookId);
  if (existing) existing.quantity++;
  else cart.push({ id: book.id, title: book.title, price: book.price, quantity: 1 });
  saveCart(); renderCart();
}

function removeFromCart(bookId) {
  cart = cart.filter(i => i.id !== bookId);
  saveCart(); renderCart();
}

function updateQuantity(bookId, change) {
  const item = cart.find(i => i.id === bookId);
  if (!item) return;
  item.quantity += change;
  if (item.quantity <= 0) { removeFromCart(bookId); return; }
  saveCart(); renderCart();
}

function renderCart() {
  cartBody.innerHTML = '';
  if (cart.length === 0) {
    cartBody.innerHTML = '<tr><td colspan="5" style="text-align:center;padding:2rem;color:var(--text-secondary)">Корзина пуста</td></tr>';
    cartTotal.textContent = '0 ₽'; return;
  }
  let total = 0;
  cart.forEach(item => {
    const sum = item.price * item.quantity;
    total += sum;
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.title}</td>
      <td>${item.price} ₽</td>
      <td><div class="quantity-control">
        <button class="quantity-btn" data-id="${item.id}" data-action="decrease">−</button>
        <span>${item.quantity}</span>
        <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
      </div></td>
      <td>${sum} ₽</td>
      <td><button class="remove-btn" data-id="${item.id}">Удалить</button></td>`;
    cartBody.appendChild(row);
  });
  cartTotal.textContent = total + ' ₽';
}

function saveCart() { localStorage.setItem('cart', JSON.stringify(cart)); }

function toggleTheme() {
  document.body.classList.toggle('dark-theme');
  const isDark = document.body.classList.contains('dark-theme');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  themeToggle.textContent = isDark ? '☀️ Тема' : '🌙 Тема';
}

function loadTheme() {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
    themeToggle.textContent = '☀️ Тема';
  }
}

function validateForm() {
  let isValid = true;
  document.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));
  const name = document.getElementById('name').value.trim();
  if (!name) { showError('name', 'Введите имя'); isValid = false; }
  const email = document.getElementById('email').value.trim();
  if (!email || !email.includes('@')) { showError('email', 'Введите корректный email'); isValid = false; }
  const phone = document.getElementById('phone').value.trim();
  if (!phone || phone.replace(/\D/g,'').length < 10) { showError('phone', 'Телефон должен содержать только цифры'); isValid = false; }
  const address = document.getElementById('address').value.trim();
  if (!address) { showError('address', 'Введите адрес'); isValid = false; }
  if (!document.getElementById('agree').checked) { showError('agree', 'Необходимо согласие'); isValid = false; }
  return isValid;
}

function showError(id, msg) {
  const group = document.getElementById(id).closest('.form-group');
  group.classList.add('error');
  let err = group.querySelector('.form-error');
  if (!err) { err = document.createElement('div'); err.className = 'form-error'; group.appendChild(err); }
  err.textContent = msg;
}

function setupEventListeners() {
  booksGrid.addEventListener('click', e => {
    if (e.target.classList.contains('add-btn')) {
      addToCart(parseInt(e.target.dataset.id));
      const btn = e.target;
      const orig = btn.textContent;
      btn.textContent = '✓ Добавлено'; btn.style.background = '#27ae60';
      setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 1500);
    }
  });
  cartBody.addEventListener('click', e => {
    if (e.target.classList.contains('remove-btn')) removeFromCart(parseInt(e.target.dataset.id));
    if (e.target.classList.contains('quantity-btn')) {
      const change = e.target.dataset.action === 'increase' ? 1 : -1;
      updateQuantity(parseInt(e.target.dataset.id), change);
    }
  });
  themeToggle.addEventListener('click', toggleTheme);
  window.addEventListener('scroll', () => backToTop.classList.toggle('visible', window.scrollY > 300));
  orderForm.addEventListener('submit', e => {
    e.preventDefault();
    if (validateForm()) {
      alert('Заказ оформлен!');
      orderForm.reset();
      document.querySelectorAll('.form-group').forEach(g => g.classList.remove('error'));
    }
  });
}