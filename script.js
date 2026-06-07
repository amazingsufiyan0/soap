/* ==========================================
   ECOSOAP — script.js
   ========================================== */

/* =============================================
   HERO — SOAP BUBBLE BACKGROUND
   ============================================= */
(function spawnBubbles() {
    const container = document.getElementById('heroBubbles');
    if (!container) return;

    const sizes   = [18, 26, 34, 42, 54, 20, 30];
    const count   = 14;

    for (let i = 0; i < count; i++) {
        const b = document.createElement('div');
        b.className = 'hero__bubble';
        const size    = sizes[Math.floor(Math.random() * sizes.length)];
        const left    = Math.random() * 100;
        const delay   = Math.random() * 8;
        const dur     = 7 + Math.random() * 10;
        b.style.cssText = `
            width:${size}px; height:${size}px;
            left:${left}%;
            bottom:${-size}px;
            animation-duration:${dur}s;
            animation-delay:${delay}s;
            opacity:${0.3 + Math.random() * 0.4};
        `;
        container.appendChild(b);
    }
})();

/* =============================================
   HERO — SLIDER
   ============================================= */
const slides    = document.querySelectorAll('.hero__slide');
const dots      = document.querySelectorAll('.dot');
let current     = 0;
let sliderTimer = null;

function goToSlide(n) {
    // Reset — force re-trigger of CSS animations on new active slide
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');

    current = (n + slides.length) % slides.length;

    // Brief DOM flush so CSS animations replay cleanly
    requestAnimationFrame(() => {
        slides[current].classList.add('active');
        dots[current].classList.add('active');
    });
}

function startSlider() {
    sliderTimer = setInterval(() => goToSlide(current + 1), 5500);
}

dots.forEach(dot => {
    dot.addEventListener('click', () => {
        clearInterval(sliderTimer);
        goToSlide(parseInt(dot.dataset.slide));
        startSlider();
    });
});

document.getElementById('heroNext').addEventListener('click', () => {
    clearInterval(sliderTimer);
    goToSlide(current + 1);
    startSlider();
});

document.getElementById('heroPrev').addEventListener('click', () => {
    clearInterval(sliderTimer);
    goToSlide(current - 1);
    startSlider();
});

startSlider();

/* =============================================
   HERO — MOUSE PARALLAX on product image
   ============================================= */
const heroEl = document.getElementById('hero');

heroEl.addEventListener('mousemove', e => {
    const rect   = heroEl.getBoundingClientRect();
    const cx     = rect.width  / 2;
    const cy     = rect.height / 2;
    const dx     = (e.clientX - rect.left - cx) / cx;   // -1 … +1
    const dy     = (e.clientY - rect.top  - cy) / cy;

    const img    = heroEl.querySelector('.hero__slide.active .hero__product-img');
    const decors = heroEl.querySelectorAll('.hero__slide.active .hero__decor');
    const circle = heroEl.querySelector('.hero__slide.active .hero__circle');

    if (img)    img.style.transform    = `scale(1) translate(${dx * 10}px, ${dy * 8}px)`;
    if (circle) circle.style.transform = `translate(${dx * -6}px, ${dy * -6}px)`;
    decors.forEach((d, i) => {
        const factor = i === 0 ? 18 : 12;
        d.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
    });
});

heroEl.addEventListener('mouseleave', () => {
    const img    = heroEl.querySelector('.hero__slide.active .hero__product-img');
    const decors = heroEl.querySelectorAll('.hero__slide.active .hero__decor');
    const circle = heroEl.querySelector('.hero__slide.active .hero__circle');
    if (img)    img.style.transform    = '';
    if (circle) circle.style.transform = '';
    decors.forEach(d => d.style.transform = '');
});

/* =============================================
   HERO — PARALLAX on scroll
   ============================================= */
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const img     = heroEl.querySelector('.hero__slide.active .hero__product-img');
    if (img && scrollY < window.innerHeight) {
        img.style.transform = `translateY(${scrollY * 0.12}px)`;
    }
}, { passive: true });

/* =============================================
   TABS
   ============================================= */
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tab     = btn.dataset.tab;
        const section = btn.closest('.shop-tabs');

        section.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        section.querySelectorAll('.tab-pane').forEach(p => {
            p.classList.remove('active');
            p.style.animation = '';
        });

        btn.classList.add('active');
        const pane = section.querySelector(`[data-tab-pane="${tab}"]`);
        pane.classList.add('active');
        pane.style.animation = 'tabFadeIn 0.4s ease both';
    });
});

/* inject tab fade keyframe */
const tabStyle = document.createElement('style');
tabStyle.textContent = `
@keyframes tabFadeIn {
    from { opacity:0; transform:translateY(14px); }
    to   { opacity:1; transform:translateY(0); }
}`;
document.head.appendChild(tabStyle);

/* =============================================
   SCROLL REVEAL — IntersectionObserver
   ============================================= */
function observeReveal(selector, extraClass) {
    document.querySelectorAll(selector).forEach((el, i) => {
        if (extraClass) el.classList.add(extraClass);
        // Cascade delay for grid children
        if (el.parentElement && el.parentElement.children.length > 1) {
            const siblings = [...el.parentElement.children];
            const idx      = siblings.indexOf(el);
            el.style.transitionDelay = `${idx * 0.08}s`;
        }
    });
}

observeReveal('.product-card', 'anim');
observeReveal('.blog-card',    'anim');
observeReveal('.testimonial-card', 'anim');
observeReveal('.category-card', 'anim');
observeReveal('.service-item',  'anim');
observeReveal('.promo3-card',   'anim');
observeReveal('.badge-item',    'anim');

const revealObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObs.unobserve(entry.target);
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.anim, .anim-left, .anim-right').forEach(el => {
    revealObs.observe(el);
});

/* About section: left image, right text */
const aboutSection = document.querySelector('.about-section__images');
const aboutContent = document.querySelector('.about-section__content');
if (aboutSection) aboutSection.classList.add('anim-left');
if (aboutContent) aboutContent.classList.add('anim-right');

[aboutSection, aboutContent].forEach(el => {
    if (el) revealObs.observe(el);
});

/* Extra sale section */
const saleSplit = document.querySelectorAll('.extra-sale__content, .extra-sale__image');
saleSplit.forEach((el, i) => {
    el.classList.add(i === 0 ? 'anim-left' : 'anim-right');
    revealObs.observe(el);
});

/* Section titles */
document.querySelectorAll('.section-title, .section-label').forEach(el => {
    el.classList.add('anim');
    revealObs.observe(el);
});

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
    cartTotalEl.textContent = '$' + total.toFixed(2);

    if (!cart.length) {
        cartBody.innerHTML = '<p class="cart-empty">Your cart is currently empty.</p>';
        return;
    }
    cartBody.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item__img">
                <img src="${item.img}" alt="${item.name}">
            </div>
            <div class="cart-item__info">
                <p class="cart-item__name">${item.name}</p>
                <p class="cart-item__price">$${(item.price * item.qty).toFixed(2)}</p>
                <p class="cart-item__qty">${item.qty} × $${item.price.toFixed(2)}</p>
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

function addToCart(name, price, img) {
    const id       = name.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'');
    const existing = cart.find(i => i.id === id);
    existing ? existing.qty++ : cart.push({ id, name, price, img, qty: 1 });
    renderCart();
    showToast(`"${name}" added to cart`);
    openCart();
}

document.addEventListener('click', e => {
    if (!e.target.classList.contains('btn-add-cart')) return;
    const card  = e.target.closest('.product-card');
    if (!card) return;
    const name  = card.dataset.name  || card.querySelector('h4').textContent.trim();
    const price = parseFloat(card.dataset.price) || 0;
    const img   = card.dataset.img   || card.querySelector('img').src;
    addToCart(name, price, img);
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
    let ringX = 0, ringY = 0;
    let dotX  = 0, dotY  = 0;
    let raf;

    document.addEventListener('mousemove', e => {
        dotX = e.clientX;
        dotY = e.clientY;
        cursorDot.style.left = dotX + 'px';
        cursorDot.style.top  = dotY + 'px';
    });

    function animateRing() {
        ringX += (dotX - ringX) * 0.12;
        ringY += (dotY - ringY) * 0.12;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top  = ringY + 'px';
        raf = requestAnimationFrame(animateRing);
    }
    animateRing();

    // Grow ring on hoverable elements
    const hoverEls = 'a, button, .product-card, .category-card, .blog-card, .btn, .tab-btn';
    document.querySelectorAll(hoverEls).forEach(el => {
        el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
    });
} else {
    // Hide on touch devices
    if (cursorDot)  cursorDot.style.display  = 'none';
    if (cursorRing) cursorRing.style.display = 'none';
}

/* =============================================
   PRODUCT CARD — tilt effect on hover
   ============================================= */
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect  = card.getBoundingClientRect();
        const x     = (e.clientX - rect.left) / rect.width  - 0.5;  // -0.5 … 0.5
        const y     = (e.clientY - rect.top)  / rect.height - 0.5;
        card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

/* =============================================
   SMOOTH ANCHOR SCROLL
   ============================================= */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const offset = 70;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    });
});
