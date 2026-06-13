/* ==========================================
   VERDAURA — script.js
   ========================================== */

/* =============================================
   HERO — hero-dot carousel
   ============================================= */
(function initHeroDots() {
    const dots = document.querySelectorAll('.es-dot');
    if (!dots.length) return;
    let current = 0;
    setInterval(() => {
        dots[current].classList.remove('active');
        current = (current + 1) % dots.length;
        dots[current].classList.add('active');
    }, 3000);
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            dots[current].classList.remove('active');
            current = i;
            dot.classList.add('active');
        });
    });
})();

/* =============================================
   PRODUCT DATA
   ============================================= */
const esProducts = [
  { id:1, name:'Activated Charcoal Handmade Soap', price:240, oldPrice:320, tag:'charcoal', img:'images/products/p-01-600x600.jpg', badge:'Best Seller' },
  { id:2, name:'Apple-Enriched Handmade Soap',      price:195, oldPrice:260, tag:'fruit',    img:'images/products/p-02-600x600.jpg', badge:'' },
  { id:3, name:'Chamomile Handmade Soap',            price:220, oldPrice:290, tag:'floral',   img:'images/products/p-03-600x600.jpg', badge:'New' },
  { id:4, name:'Coconut Almond Handmade Soap',       price:210, oldPrice:270, tag:'charcoal', img:'images/products/p-04-600x600.jpg', badge:'' },
  { id:5, name:'Rose Bouquet Handmade Soap',         price:265, oldPrice:340, tag:'floral',   img:'images/products/p-05-600x600.jpg', badge:'Sale' },
  { id:6, name:'Lavender Dream Soap',                price:235, oldPrice:300, tag:'floral',   img:'images/products/p-06-600x600.jpg', badge:'New' },
  { id:7, name:'Lemon Citrus Handmade Soap',         price:185, oldPrice:240, tag:'fruit',    img:'images/products/p-07-600x600.jpg', badge:'' },
  { id:8, name:'Citrus Peppermint Soap',             price:200, oldPrice:260, tag:'charcoal', img:'images/Citrus_Peppermint_Soap1.webp', badge:'New' },
];

const esNewCollection = [
  { id:9,  name:'Cotton Fields Soap',         price:245, oldPrice:310, tag:'floral',   img:'images/products/p-09-600x600.jpg' },
  { id:10, name:'Rose Bouquet Bar Soap',       price:270, oldPrice:350, tag:'floral',   img:'images/products/p-10-600x600.jpg' },
  { id:11, name:'Mango Handmade Soap',         price:215, oldPrice:280, tag:'fruit',    img:'images/mango-handmade-soap.jpg' },
  { id:12, name:'Activated Charcoal Bar Soap', price:255, oldPrice:330, tag:'charcoal', img:'images/products/p-12-600x600.jpg' },
];

function esRenderProducts(data, containerId) {
    const grid = document.getElementById(containerId);
    if (!grid) return;
    grid.innerHTML = '';
    data.forEach(p => {
        const badgeHtml = p.badge
            ? `<div class="es-badge-wrap"><span class="es-badge-${p.badge === 'Sale' ? 'red' : 'green'}">${p.badge}</span></div>`
            : '';
        const oldPriceHtml = p.oldPrice
            ? `<span class="es-price-old">₹${p.oldPrice}.00</span>`
            : '';
        grid.innerHTML += `
          <div class="es-product-card fade-up" data-tag="${p.tag}" data-name="${p.name}" data-price="${p.price}" data-emoji="🧼">
            <div class="es-product-img">
              <img src="${p.img}" alt="${p.name}" class="es-product-img-real" loading="lazy">
              <div class="es-product-wishlist">♡</div>
              ${badgeHtml}
            </div>
            <div class="es-product-info">
              <h3>${p.name}</h3>
              <div class="es-product-price">
                <span class="es-price-current">₹${p.price}.00</span>
                ${oldPriceHtml}
              </div>
              <button class="es-product-add">Add to Cart</button>
            </div>
          </div>
        `;
    });
    observeFadeUps();
}

function esFilterProducts(tag, btn) {
    document.querySelectorAll('.es-tab-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    const filtered = tag === 'all' ? esProducts : esProducts.filter(p => p.tag === tag);
    esRenderProducts(filtered, 'esProductsGrid');
}

/* =============================================
   FADE-UP OBSERVER
   ============================================= */
function observeFadeUps() {
    const els = document.querySelectorAll('.fade-up:not(.observed)');
    const obs = new IntersectionObserver((entries) => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                setTimeout(() => e.target.classList.add('visible'), i * 80);
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.12 });
    els.forEach(el => { el.classList.add('observed'); obs.observe(el); });
}

/* =============================================
   CART
   ============================================= */
let cart = [];

const cartSidebar  = document.getElementById('cartSidebar');
const cartOverlay  = document.getElementById('cartOverlay');
const cartBody     = document.getElementById('cartBody');
const cartTotalEl  = document.getElementById('cartTotal');
const cartCountEl  = document.querySelector('.cart-count');

function openCart() {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeCart() {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

document.getElementById('cartToggle').addEventListener('click', openCart);
document.getElementById('cartClose').addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

function renderCart() {
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    const count = cart.reduce((s, i) => s + i.qty, 0);
    cartCountEl.textContent = count;
    cartTotalEl.textContent = '₹' + total.toFixed(2);

    if (!cart.length) {
        cartBody.innerHTML = '<p class="cart-empty">Your cart is currently empty.</p>';
        return;
    }
    cartBody.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item__img" style="display:flex;align-items:center;justify-content:center;font-size:1.5rem;background:#f5f0e8">
                ${item.emoji || '🧼'}
            </div>
            <div class="cart-item__info">
                <p class="cart-item__name">${item.name}</p>
                <p class="cart-item__price">₹${(item.price * item.qty).toFixed(2)}</p>
                <p class="cart-item__qty">${item.qty} × ₹${item.price.toFixed(2)}</p>
            </div>
            <button class="cart-item__remove" data-id="${item.id}">
                <i class="fas fa-times"></i>
            </button>
        </div>`).join('');

    cartBody.querySelectorAll('.cart-item__remove').forEach(btn => {
        btn.addEventListener('click', () => {
            cart = cart.filter(i => i.id !== btn.dataset.id);
            renderCart();
        });
    });
}

function addToCart(name, price, emoji, id) {
    const itemId    = id || name.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'');
    const existing  = cart.find(i => i.id === itemId);
    existing ? existing.qty++ : cart.push({ id: itemId, name, price: parseFloat(price), emoji: emoji || '🧼', qty: 1 });
    renderCart();
    showToast(`"${name}" added to cart`);
    openCart();
}

/* click delegation — handles both old .btn-add-cart and new .es-product-add */
document.addEventListener('click', e => {
    const btn = e.target.closest('.btn-add-cart, .es-product-add');
    if (!btn) return;
    const card  = btn.closest('.product-card, .es-product-card');
    if (!card) return;
    const name  = card.dataset.name  || card.querySelector('h4,h3')?.textContent.trim();
    const price = parseFloat(card.dataset.price) || 0;
    const emoji = card.dataset.emoji || '🧼';
    addToCart(name, price, emoji);
});

/* =============================================
   TOAST
   ============================================= */
const toastEl = document.getElementById('toast');
let toastTimer;
function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 3000);
}

/* =============================================
   SCROLL-TO-TOP
   ============================================= */
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });
scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* =============================================
   HEADER — shrink on scroll
   ============================================= */
const headerEl = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
        headerEl.style.backdropFilter = 'blur(12px)';
        headerEl.style.background     = 'rgba(42,61,51,0.97)';
    } else {
        headerEl.style.backdropFilter = '';
        headerEl.style.background     = '';
    }
}, { passive: true });

/* =============================================
   MOBILE NAV
   ============================================= */
const mobileMenuBtn = document.getElementById('mobileMenu');
const headerNav     = document.querySelector('.header__nav');

if (mobileMenuBtn && headerNav) {
    mobileMenuBtn.addEventListener('click', () => {
        const isOpen = headerNav.classList.toggle('nav--open');
        mobileMenuBtn.querySelector('i').className = isOpen ? 'fas fa-times' : 'fas fa-bars';
    });
    headerNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            headerNav.classList.remove('nav--open');
            mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
        });
    });
}

/* =============================================
   NEWSLETTER
   ============================================= */
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', e => {
        e.preventDefault();
        const input = newsletterForm.querySelector('input');
        if (input.value.trim()) {
            showToast('Subscribed! Check your inbox for your 10% off code 🌿');
            input.value = '';
        }
    });
}

/* =============================================
   CUSTOM CURSOR (desktop only)
   ============================================= */
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

if (cursorDot && cursorRing && window.matchMedia('(pointer:fine)').matches) {
    let ringX = 0, ringY = 0, dotX = 0, dotY = 0;

    document.addEventListener('mousemove', e => {
        dotX = e.clientX; dotY = e.clientY;
        cursorDot.style.left = dotX + 'px';
        cursorDot.style.top  = dotY + 'px';
    });

    function animateRing() {
        ringX += (dotX - ringX) * 0.12;
        ringY += (dotY - ringY) * 0.12;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top  = ringY + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();

    const hoverEls = 'a, button, .es-product-card, .product-card, .blog-card, .es-collection-item, .es-tab-btn';
    document.querySelectorAll(hoverEls).forEach(el => {
        el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
    });
} else {
    if (cursorDot)  cursorDot.style.display  = 'none';
    if (cursorRing) cursorRing.style.display = 'none';
}

/* =============================================
   SMOOTH ANCHOR SCROLL
   ============================================= */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
    });
});

/* =============================================
   INIT
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
    esRenderProducts(esProducts, 'esProductsGrid');
    esRenderProducts(esNewCollection, 'esNewCollectionGrid');
    observeFadeUps();
});
