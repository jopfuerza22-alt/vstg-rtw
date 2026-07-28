/* ============================================================
   VSTG.RTW — Main Script
   Streaming catalog (PEN), profile modal, WhatsApp checkout
   ============================================================ */

// ---------- CONFIG ----------
const WHATSAPP_NUMBER = '519407799810'; // Perú +51 940 779 810
const CURRENCY = 'S/';

// ---------- PRODUCT DATA ----------
const PRODUCTS = [
    { id: 'nf',     name: 'Netflix Premium',       icon: 'NF', desc: 'Cuenta compartida con perfil privado. Calidad 4K Ultra HD, hasta 4 dispositivos simultáneos.', price: 12, features: ['Calidad 4K UHD + HDR', 'Perfil privado propio', 'Garantía 30 días', 'Activación inmediata'] },
    { id: 'pv',     name: 'Prime Video',           icon: 'PV', desc: 'Acceso completo a Amazon Prime Video: películas, series originales y exclusivas.', price: 8,  features: ['Catálogo completo Prime', 'Perfil privado', 'Garantía 30 días', 'Activación inmediata'] },
    { id: 'hb',     name: 'HBO Max',               icon: 'HB', desc: 'Estrenos de cine, series originales HBO, Warner y DC en un solo lugar.', price: 8,  features: ['Estrenos simultáneos cine', 'Perfil privado', 'Garantía 30 días', 'Activación inmediata'] },
    { id: 'ds',     name: 'Disney Premium',        icon: 'DS', desc: 'Disney+, Marvel, Star Wars, Pixar y Star. Calidad 4K con perfil premium.', price: 15, features: ['Calidad 4K UHD', '4 pantallas simultáneas', 'Incluye Star contenido', 'Garantía 30 días'] },
    { id: 'cr',     name: 'Crunchyroll Mega Fan',  icon: 'CR', desc: 'Anime sin anuncios, simulcast con Japón y descargas offline en HD.', price: 8,  features: ['Sin anuncios', 'Simulcast Japón', 'Descargas offline', 'Acceso manga'] },
    { id: 'sp',     name: 'Spotify Premium',       icon: 'SP', desc: 'Cuenta personal sin anuncios, descargas offline y saltos ilimitados.', price: 15, features: ['Cuenta personal', 'Sin anuncios', 'Descarga offline', 'Saltos ilimitados'] },
    { id: 'am',     name: 'Apple Music',           icon: 'AM', desc: 'Más de 100 millones de canciones, descargas offline y audio sin pérdida.', price: 15, features: ['Cuenta personal', 'Audio sin pérdida', 'Descargas offline', 'Letras en tiempo real'] }
];

// ---------- CART STATE ----------
let cart = JSON.parse(localStorage.getItem('vstg_cart') || '[]');
let pendingProductId = null;

// ---------- DOM HELPERS ----------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const formatPrice = (n) => `${CURRENCY} ${Number(n).toFixed(2)}`;

// ---------- LOADER ----------
window.addEventListener('load', () => {
    setTimeout(() => $('#loader').classList.add('hidden'), 600);
});

// ---------- RENDER PRODUCTS ----------
function renderProducts() {
    const grid = $('#streamingGrid');
    if (!grid) return;
    grid.innerHTML = PRODUCTS.map(p => `
        <article class="product-card" data-id="${p.id}">
            <span class="product-tag">PERFIL</span>
            <div class="product-icon">${p.icon}</div>
            <h3 class="product-name">${p.name}</h3>
            <p class="product-desc">${p.desc}</p>
            <ul class="product-features">
                ${p.features.map(f => `<li>${f}</li>`).join('')}
            </ul>
            <div class="product-footer">
                <div class="product-price">${formatPrice(p.price)}</div>
                <button class="add-cart-btn" data-add="${p.id}">ALQUILAR</button>
            </div>
        </article>
    `).join('');
    bindAddButtons();
}

function bindAddButtons() {
    $$('[data-add]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            openProfileModal(btn.dataset.add);
        });
    });
}

// ---------- FIND PRODUCT ----------
function findProduct(id) {
    return PRODUCTS.find(p => p.id === id);
}

// ---------- PROFILE MODAL ----------
function openProfileModal(id) {
    const p = findProduct(id);
    if (!p) return;
    pendingProductId = id;
    $('#modalServiceName').textContent = p.name;
    $('#modalServiceDesc').textContent = p.desc;
    $('#modalServicePrice').textContent = formatPrice(p.price);
    $('#profileName').value = '';
    $('#profilePin').value = '';
    $('#profileName').classList.remove('invalid');
    $('#profilePin').classList.remove('invalid');
    $('#modalOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => $('#profileName').focus(), 300);
}

function closeProfileModal() {
    $('#modalOverlay').classList.remove('open');
    document.body.style.overflow = '';
    pendingProductId = null;
}

// ---------- CART ----------
function addToCart(id, profileName, profilePin) {
    // Each unique combination (product + profile name) is a separate line item
    const existing = cart.find(item => item.id === id && item.profileName === profileName);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ id, qty: 1, profileName, profilePin });
    }
    saveCart();
    updateCartUI();
    showToast(`${findProduct(id).name} agregado al carrito`);
}

function removeFromCart(idx) {
    cart.splice(idx, 1);
    saveCart();
    updateCartUI();
}

function clearCart() {
    cart = [];
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('vstg_cart', JSON.stringify(cart));
}

function updateCartUI() {
    const count = cart.reduce((s, i) => s + i.qty, 0);
    $('#cartCount').textContent = count;
    $('#cartBadge').textContent = count;
    $('#cartCount').classList.toggle('visible', count > 0);

    const cartBody = $('#cartBody');
    const cartFooter = $('#cartFooter');
    if (cart.length === 0) {
        cartBody.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty-icon">▣</div>
                <p>Tu carrito está vacío</p>
                <span>Agrega servicios para continuar</span>
            </div>`;
        cartFooter.style.display = 'none';
    } else {
        let total = 0;
        cartBody.innerHTML = cart.map((item, idx) => {
            const p = findProduct(item.id);
            if (!p) return '';
            const subtotal = p.price * item.qty;
            total += subtotal;
            return `
                <div class="cart-item">
                    <div class="cart-item-icon">${p.icon}</div>
                    <div class="cart-item-info">
                        <span class="cart-item-name">${p.name}</span>
                        <span class="cart-item-meta"><strong>Perfil:</strong> ${escapeHtml(item.profileName)}</span>
                        <span class="cart-item-meta"><strong>PIN:</strong> ${escapeHtml(item.profilePin)}</span>
                        <span class="cart-item-meta"><strong>Cant:</strong> ${item.qty}</span>
                    </div>
                    <div class="cart-item-price">${formatPrice(subtotal)}</div>
                    <button class="cart-item-remove" data-remove="${idx}">Eliminar</button>
                </div>`;
        }).join('');
        cartFooter.style.display = 'flex';
        $('#cartTotal').textContent = formatPrice(total);

        $$('[data-remove]').forEach(btn => {
            btn.addEventListener('click', () => removeFromCart(parseInt(btn.dataset.remove, 10)));
        });
    }
}

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

// ---------- CART DRAWER ----------
function openCart() {
    $('#cartDrawer').classList.add('open');
    $('#cartOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeCart() {
    $('#cartDrawer').classList.remove('open');
    $('#cartOverlay').classList.remove('open');
    document.body.style.overflow = '';
}

// ---------- TOAST ----------
let toastTimer;
function showToast(msg) {
    const toast = $('#toast');
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

// ---------- NAVBAR SCROLL ----------
function bindNavbarScroll() {
    const navbar = $('#navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
}

// ---------- MOBILE MENU ----------
function bindMobileMenu() {
    const toggle = $('#menuToggle');
    const links = $('#navLinks');
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            toggle.classList.remove('active');
            links.classList.remove('open');
        });
    });
}

// ---------- REVEAL ON SCROLL ----------
function bindReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.15 });
    $$('.reveal').forEach(el => observer.observe(el));
}

// ---------- COUNTER ANIMATION ----------
function animateCounters() {
    const counters = $$('[data-target]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target, 10);
                const duration = 2000;
                const start = performance.now();
                const step = (now) => {
                    const progress = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.floor(eased * target).toLocaleString();
                    if (progress < 1) requestAnimationFrame(step);
                };
                requestAnimationFrame(step);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => observer.observe(c));
}

// ---------- PIN INPUT MASK ----------
function bindPinInput() {
    const pinInput = $('#profilePin');
    pinInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
    });
}

// ---------- PROFILE FORM SUBMIT ----------
function bindProfileForm() {
    $('#profileForm').addEventListener('submit', (e) => {
        e.preventDefault();
        if (!pendingProductId) return;
        const nameInput = $('#profileName');
        const pinInput = $('#profilePin');
        const name = nameInput.value.trim();
        const pin = pinInput.value.trim();
        let valid = true;

        if (name.length < 2 || name.length > 20) {
            nameInput.classList.add('invalid');
            valid = false;
        } else {
            nameInput.classList.remove('invalid');
        }
        if (!/^\d{4}$/.test(pin)) {
            pinInput.classList.add('invalid');
            valid = false;
        } else {
            pinInput.classList.remove('invalid');
        }
        if (!valid) {
            showToast('Revisa los datos ingresados');
            return;
        }
        addToCart(pendingProductId, name, pin);
        // Visual feedback on the product button
        const prodBtn = document.querySelector(`[data-add="${pendingProductId}"]`);
        if (prodBtn) {
            const originalText = prodBtn.textContent;
            prodBtn.classList.add('added');
            prodBtn.textContent = '✓ AGREGADO';
            setTimeout(() => {
                prodBtn.classList.remove('added');
                prodBtn.textContent = originalText;
            }, 1500);
        }
        closeProfileModal();
    });
}

// ---------- WHATSAPP CHECKOUT ----------
function buildWhatsAppMessage() {
    let msg = '*VSTG.RTW — NUEVO PEDIDO*%0A%0A';
    let total = 0;
    cart.forEach((item, idx) => {
        const p = findProduct(item.id);
        if (!p) return;
        const subtotal = p.price * item.qty;
        total += subtotal;
        msg += `*${idx + 1}. ${p.name}*%0A`;
        msg += `   Precio: ${formatPrice(p.price)}%0A`;
        msg += `   Cantidad: ${item.qty}%0A`;
        msg += `   Nombre del perfil: ${encodeURIComponent(item.profileName)}%0A`;
        msg += `   PIN: ${encodeURIComponent(item.profilePin)}%0A`;
        msg += `   Subtotal: ${formatPrice(subtotal)}%0A%0A`;
    });
    msg += `*TOTAL: ${formatPrice(total)}*%0A%0A`;
    msg += 'Por favor confirmar el pedido y enviar los datos de pago. 🙌';
    return msg;
}

function sendWhatsAppOrder() {
    if (cart.length === 0) return;
    const message = buildWhatsAppMessage();
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(url, '_blank');
    showToast('Abriendo WhatsApp...');
}

// ---------- BIND CHECKOUT ----------
function bindCheckout() {
    $('#checkoutBtn').addEventListener('click', sendWhatsAppOrder);
    $('#clearCartBtn').addEventListener('click', clearCart);
}

// ---------- INIT ----------
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    bindNavbarScroll();
    bindMobileMenu();
    bindReveal();
    animateCounters();
    bindCheckout();
    bindPinInput();
    bindProfileForm();
    updateCartUI();

    $('#cartBtn').addEventListener('click', openCart);
    $('#cartClose').addEventListener('click', closeCart);
    $('#cartOverlay').addEventListener('click', closeCart);
    $('#modalClose').addEventListener('click', closeProfileModal);
    $('#modalOverlay').addEventListener('click', (e) => {
        if (e.target === $('#modalOverlay')) closeProfileModal();
    });

    // ESC closes any overlay
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCart();
            closeProfileModal();
        }
    });
});
