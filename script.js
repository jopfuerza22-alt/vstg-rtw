/* ============================================================
   VSTG.RTW — Main Script (v5 — BULLETPROOF)
   Fixes:
   - New localStorage key to bypass stale data
   - Cart validation/cleanup on load
   - Submit button = type="button" + explicit click handler
   - Auto-open cart after add (visual confirmation)
   - Defensive rendering (always shows item even if product missing)
   - Full error handling
   ============================================================ */

'use strict';

// ---------- CONFIG ----------
const WHATSAPP_NUMBER = '51940779810'; // Perú +51 940 779 810
const CURRENCY = 'S/';
const CART_KEY = 'vstg_cart_v5'; // bumped to invalidate stale data

// ---------- STREAMING PRODUCTS ----------
const STREAMING_PRODUCTS = [
    { id: 'nf', name: 'Netflix Premium',       icon: 'NF', desc: 'Cuenta compartida con perfil privado. Calidad 4K Ultra HD, hasta 4 dispositivos simultáneos.', price: 12, soldOut: true, features: ['Calidad 4K UHD + HDR', 'Perfil privado propio', 'Garantía 30 días', 'Activación inmediata'] },
    { id: 'pv', name: 'Prime Video',           icon: 'PV', desc: 'Acceso completo a Amazon Prime Video: películas, series originales y exclusivas. ¡Oferta por tiempo limitado!', price: 4, oldPrice: 8, sale: true, features: ['Catálogo completo Prime', 'Perfil privado', 'Garantía 30 días', 'Activación inmediata', '50% OFF — Oferta especial'] },
    { id: 'hb', name: 'HBO Max',               icon: 'HB', desc: 'Estrenos de cine, series originales HBO, Warner y DC en un solo lugar. ¡Oferta por tiempo limitado!', price: 4, oldPrice: 8, sale: true, features: ['Estrenos simultáneos cine', 'Perfil privado', 'Garantía 30 días', 'Activación inmediata', '50% OFF — Oferta especial'] },
    { id: 'ds', name: 'Disney Premium',        icon: 'DS', desc: 'Disney+, Marvel, Star Wars, Pixar y Star. Calidad 4K con perfil premium. ¡Oferta por tiempo limitado!', price: 7.50, oldPrice: 15, sale: true, features: ['Calidad 4K UHD', '4 pantallas simultáneas', 'Incluye Star contenido', 'Garantía 30 días', '50% OFF — Oferta especial'] },
    { id: 'cr', name: 'Crunchyroll Mega Fan',  icon: 'CR', desc: 'Anime sin anuncios, simulcast con Japón y descargas offline en HD. ¡Oferta por tiempo limitado!', price: 4, oldPrice: 8, sale: true, features: ['Sin anuncios', 'Simulcast Japón', 'Descargas offline', 'Acceso manga', '50% OFF — Oferta especial'] },
    { id: 'sp', name: 'Spotify Premium',       icon: 'SP', desc: 'Cuenta personal sin anuncios, descargas offline y saltos ilimitados. ¡Oferta por tiempo limitado!', price: 7.50, oldPrice: 15, sale: true, features: ['Cuenta personal', 'Sin anuncios', 'Descarga offline', 'Saltos ilimitados', '50% OFF — Oferta especial'] },
    { id: 'am', name: 'Apple Music',           icon: 'AM', desc: 'Más de 100 millones de canciones, descargas offline y audio sin pérdida.', price: 15, soldOut: true, features: ['Cuenta personal', 'Audio sin pérdida', 'Descargas offline', 'Letras en tiempo real'] }
];

// ---------- REDES PRODUCTS ----------
const REDES_PRODUCTS = {
    seguidores: [
        { id: 'sg-ig', name: 'Seguidores Instagram', icon: 'IG', desc: 'Seguidores reales y estables para tu cuenta de Instagram.', features: ['Seguidores reales', 'Entrega gradual', 'Sin contraseña', 'Garantía reposición 30 días'],
          pricePerUnit: 0.012, minQty: 100, maxQty: 50000, step: 100 },
        { id: 'sg-fb', name: 'Seguidores Facebook',  icon: 'FB', desc: 'Impulsa tu página de Facebook con seguidores reales y activos.', features: ['Seguidores reales', 'Entrega gradual', 'Sin contraseña', 'Garantía reposición'],
          pricePerUnit: 0.015, minQty: 100, maxQty: 50000, step: 100 },
        { id: 'sg-tk', name: 'Seguidores TikTok',    icon: 'TK', desc: 'Crece en TikTok con seguidores estables, sin riesgo de baneo.', features: ['Seguidores reales', 'Entrega gradual', 'Sin riesgo de baneo', 'Garantía 30 días'],
          pricePerUnit: 0.010, minQty: 100, maxQty: 50000, step: 100 }
    ],
    likes: [
        { id: 'lk-ig', name: 'Likes Instagram',  icon: 'IG', desc: 'Likes reales para tus publicaciones de Instagram, baja caída.', features: ['Likes reales', 'Reparto gradual', 'Baja caída', 'Garantía 30 días'],
          pricePerUnit: 0.008, minQty: 50, maxQty: 50000, step: 50 },
        { id: 'lk-fb', name: 'Likes Facebook',   icon: 'FB', desc: 'Likes para tus publicaciones o página de Facebook.', features: ['Likes reales', 'Reparto gradual', 'Estables', 'Garantía reposición'],
          pricePerUnit: 0.010, minQty: 50, maxQty: 50000, step: 50 },
        { id: 'lk-tk', name: 'Likes TikTok',     icon: 'TK', desc: 'Likes para tus videos de TikTok y mayor viralidad.', features: ['Likes reales', 'Reparto gradual', 'Sin riesgo de baneo', 'Garantía 30 días'],
          pricePerUnit: 0.006, minQty: 50, maxQty: 50000, step: 50 }
    ],
    comentarios: [
        { id: 'cm-ig', name: 'Comentarios Instagram', icon: 'IG', desc: 'Comentarios reales y personalizados para tu publicación de Instagram.', features: ['Comentarios reales', 'Personalizables', 'Cuentas activas', 'Entrega 1-2 días'],
          pricePerUnit: 0.12, minQty: 10, maxQty: 5000, step: 10 },
        { id: 'cm-fb', name: 'Comentarios Facebook',  icon: 'FB', desc: 'Comentarios reales para tus publicaciones de Facebook.', features: ['Comentarios reales', 'Personalizables', 'Cuentas activas', 'Entrega 1-2 días'],
          pricePerUnit: 0.14, minQty: 10, maxQty: 5000, step: 10 },
        { id: 'cm-tk', name: 'Comentarios TikTok',    icon: 'TK', desc: 'Comentarios reales para tus videos de TikTok.', features: ['Comentarios reales', 'Personalizables', 'Cuentas activas', 'Entrega 1-2 días'],
          pricePerUnit: 0.10, minQty: 10, maxQty: 5000, step: 10 }
    ],
    vistas: [
        { id: 'vs-ig', name: 'Vistas Instagram', icon: 'IG', desc: 'Vistas reales para tus Reels o videos de Instagram.', features: ['Vistas reales', 'Entrega rápida', 'Estables', 'Sin contraseña'],
          pricePerUnit: 0.0008, minQty: 1000, maxQty: 500000, step: 1000 },
        { id: 'vs-fb', name: 'Vistas Facebook',  icon: 'FB', desc: 'Vistas para tus videos publicados en Facebook.', features: ['Vistas reales', 'Entrega gradual', 'Estables', 'Sin contraseña'],
          pricePerUnit: 0.001, minQty: 1000, maxQty: 500000, step: 1000 },
        { id: 'vs-tk', name: 'Vistas TikTok',    icon: 'TK', desc: 'Vistas reales para tus videos de TikTok, empuja al For You.', features: ['Vistas reales', 'Entrega gradual', 'Sin riesgo de baneo', 'Sin contraseña'],
          pricePerUnit: 0.0005, minQty: 1000, maxQty: 500000, step: 1000 }
    ]
};

// Volume discount tiers
const TIERS = [
    { min: 0,     multiplier: 1.0 },
    { min: 1000,  multiplier: 0.95 },
    { min: 5000,  multiplier: 0.90 },
    { min: 10000, multiplier: 0.85 },
    { min: 25000, multiplier: 0.80 }
];

const ALL_PRODUCTS = [
    ...STREAMING_PRODUCTS,
    ...Object.values(REDES_PRODUCTS).flat()
];

// ---------- CART STATE (with cleanup on load) ----------
let cart = [];
try {
    const raw = localStorage.getItem(CART_KEY) || '[]';
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
        // Filter out items with invalid product IDs
        cart = parsed.filter(item => item && item.id && findProduct(item.id));
    }
} catch (e) {
    console.warn('Cart load error, starting fresh:', e);
    cart = [];
}

let pendingProduct = null;

// ---------- DOM HELPERS ----------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
const formatPrice = (n) => `${CURRENCY} ${Number(n || 0).toFixed(2)}`;
const escapeHtml = (s) => String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const formatQty = (n) => Number(n || 0).toLocaleString('es-PE');

// ---------- PRICE CALCULATION ----------
function calcRedesPrice(product, qty) {
    if (!product || !qty) return 0;
    const tier = [...TIERS].reverse().find(t => qty >= t.min) || TIERS[0];
    return qty * product.pricePerUnit * tier.multiplier;
}

function getTierLabel(qty) {
    const tier = [...TIERS].reverse().find(t => qty >= t.min) || TIERS[0];
    if (tier.multiplier < 1) {
        return `${Math.round((1 - tier.multiplier) * 100)}% OFF aplicado`;
    }
    return '';
}

// ---------- FIND PRODUCT ----------
function findProduct(id) {
    return ALL_PRODUCTS.find(p => p.id === id);
}

// ---------- LOADER ----------
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = $('#loader');
        if (loader) loader.classList.add('hidden');
    }, 600);
});

// ---------- RENDER PRODUCTS ----------
function renderStreaming() {
    const grid = $('#streamingGrid');
    if (!grid) return;
    grid.innerHTML = STREAMING_PRODUCTS.map(p => streamingCardHTML(p)).join('');
}

function renderRedes() {
    Object.entries(REDES_PRODUCTS).forEach(([key, items]) => {
        const grid = $(`#${key}Grid`);
        if (!grid) return;
        grid.innerHTML = items.map(p => redesCardHTML(p)).join('');
    });
}

function streamingCardHTML(p) {
    const isSoldOut = p.soldOut === true;
    const isOnSale = p.sale === true && !isSoldOut;

    // Tag/badge in top-right corner
    let badge = '';
    if (isSoldOut) {
        badge = `<span class="product-tag tag-soldout">AGOTADO</span>`;
    } else if (isOnSale) {
        badge = `<span class="product-tag tag-sale">OFERTA -50%</span>`;
    } else {
        badge = `<span class="product-tag">PERFIL</span>`;
    }

    // Price block
    let priceBlock = '';
    if (isSoldOut) {
        priceBlock = `<div class="product-price price-soldout">${formatPrice(p.price)}</div>`;
    } else if (isOnSale) {
        priceBlock = `
            <div class="product-price price-sale">
                <span class="price-old">${formatPrice(p.oldPrice)}</span>
                <span class="price-new">${formatPrice(p.price)}</span>
            </div>`;
    } else {
        priceBlock = `<div class="product-price">${formatPrice(p.price)}</div>`;
    }

    // Button
    let button = '';
    if (isSoldOut) {
        button = `<button class="add-cart-btn btn-soldout" disabled type="button">AGOTADO</button>`;
    } else {
        button = `<button class="add-cart-btn" data-action="open-modal" data-id="${p.id}" data-type="streaming" type="button">ALQUILAR</button>`;
    }

    const cardClass = isSoldOut ? 'product-card soldout' : (isOnSale ? 'product-card onsale' : 'product-card');

    return `
        <article class="${cardClass}" data-id="${p.id}">
            ${badge}
            <div class="product-icon">${p.icon}</div>
            <h3 class="product-name">${p.name}</h3>
            <p class="product-desc">${p.desc}</p>
            <ul class="product-features">
                ${p.features.map(f => `<li>${f}</li>`).join('')}
            </ul>
            <div class="product-footer">
                ${priceBlock}
                ${button}
            </div>
        </article>
    `;
}

function redesCardHTML(p) {
    return `
        <article class="product-card" data-id="${p.id}">
            <span class="product-tag">${p.icon}</span>
            <div class="product-icon">${p.icon}</div>
            <h3 class="product-name">${p.name}</h3>
            <p class="product-desc">${p.desc}</p>
            <ul class="product-features">
                ${p.features.map(f => `<li>${f}</li>`).join('')}
                <li>Cantidad: ${formatQty(p.minQty)} a ${formatQty(p.maxQty)}</li>
                <li>Descuentos por volumen</li>
            </ul>
            <div class="product-footer">
                <div class="product-price">Desde ${formatPrice(p.pricePerUnit * p.minQty)}</div>
                <button class="add-cart-btn" data-action="open-modal" data-id="${p.id}" data-type="redes" type="button">COMPRAR</button>
            </div>
        </article>
    `;
}

// ---------- MODAL ----------
function openModal(id, type) {
    const p = findProduct(id);
    if (!p) {
        showToast('Error: producto no encontrado');
        return;
    }
    pendingProduct = { id, type };

    $('#modalServiceName').textContent = p.name;
    $('#modalServiceDesc').textContent = p.desc;
    $('#modalTag').textContent = type === 'streaming' ? 'CONFIGURA TU PERFIL' : 'CONFIGURA TU PEDIDO';

    // Reset all fields
    $('#profileName').value = '';
    $('#profilePin').value = '';
    $('#redesLink').value = '';
    $('#redesNote').value = '';
    ['profileName', 'profilePin', 'redesLink'].forEach(fid => $('#' + fid).classList.remove('invalid'));

    if (type === 'streaming') {
        $('#formFieldsStreaming').style.display = 'block';
        $('#formFieldsRedes').style.display = 'none';
        $('#modalServicePrice').textContent = formatPrice(p.price);
    } else {
        $('#formFieldsStreaming').style.display = 'none';
        $('#formFieldsRedes').style.display = 'block';
        const input = $('#redesCantidad');
        input.min = p.minQty;
        input.max = p.maxQty;
        input.step = p.step;
        input.value = p.minQty * 10;
        // Reset preset buttons
        $$('.preset-btn').forEach(b => b.classList.remove('active'));
        updateRedesPrice();
    }

    $('#modalOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const overlay = $('#modalOverlay');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
    pendingProduct = null;
}

function updateRedesPrice() {
    if (!pendingProduct || pendingProduct.type !== 'redes') return;
    const p = findProduct(pendingProduct.id);
    if (!p) return;
    const input = $('#redesCantidad');
    let qty = parseInt(input.value, 10);
    if (isNaN(qty)) qty = p.minQty;
    qty = Math.max(p.minQty, Math.min(p.maxQty, qty));
    const price = calcRedesPrice(p, qty);
    const tierLabel = getTierLabel(qty);
    $('#modalServicePrice').textContent = formatPrice(price) + (tierLabel ? `  (${tierLabel})` : '');
}

function handleCantidadInput() {
    if (!pendingProduct || pendingProduct.type !== 'redes') return;
    const p = findProduct(pendingProduct.id);
    if (!p) return;
    const input = $('#redesCantidad');
    let qty = parseInt(input.value, 10);
    if (isNaN(qty) || qty < p.minQty) {
        input.classList.add('invalid');
    } else {
        input.classList.remove('invalid');
    }
    updateRedesPrice();
}

function handleCantidadBlur() {
    if (!pendingProduct || pendingProduct.type !== 'redes') return;
    const p = findProduct(pendingProduct.id);
    if (!p) return;
    const input = $('#redesCantidad');
    let qty = parseInt(input.value, 10);
    if (isNaN(qty) || qty < p.minQty) qty = p.minQty;
    if (qty > p.maxQty) qty = p.maxQty;
    input.value = qty;
    input.classList.remove('invalid');
    updateRedesPrice();
    $$('.preset-btn').forEach(b => b.classList.toggle('active', parseInt(b.dataset.preset, 10) === qty));
}

function bindPresetButtons() {
    $$('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const val = parseInt(btn.dataset.preset, 10);
            $('#redesCantidad').value = val;
            $$('.preset-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            $('#redesCantidad').classList.remove('invalid');
            updateRedesPrice();
        });
    });
}

// ---------- CART ----------
function addToCart(item) {
    if (!item || !item.id) {
        showToast('Error: item inválido');
        return;
    }
    cart.push(item);
    saveCart();
    updateCartUI();
    const p = findProduct(item.id);
    showToast(`${p ? p.name : 'Item'} agregado al carrito`);
}

function removeFromCart(idx) {
    if (idx < 0 || idx >= cart.length) return;
    cart.splice(idx, 1);
    saveCart();
    updateCartUI();
}

function clearCart() {
    cart = [];
    saveCart();
    updateCartUI();
    showToast('Carrito vaciado');
}

function saveCart() {
    try {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) {
        console.warn('Cart save error:', e);
    }
}

function truncateUrl(url, max = 50) {
    if (!url) return '';
    if (url.length <= max) return url;
    return url.slice(0, max - 3) + '...';
}

// ---------- BULLETPROOF CART RENDER ----------
function updateCartUI() {
    const count = cart.length;

    // Update count badges
    const cartCountEl = $('#cartCount');
    const cartBadgeEl = $('#cartBadge');
    if (cartCountEl) {
        cartCountEl.textContent = String(count);
        cartCountEl.classList.toggle('visible', count > 0);
    }
    if (cartBadgeEl) {
        cartBadgeEl.textContent = String(count);
    }

    const cartBody = $('#cartBody');
    const cartFooter = $('#cartFooter');
    if (!cartBody || !cartFooter) return;

    if (count === 0) {
        // Empty state
        cartBody.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty-icon">▣</div>
                <p>Tu carrito está vacío</p>
                <span>Agrega servicios para continuar</span>
            </div>`;
        cartFooter.style.display = 'none';
        return;
    }

    // Render items defensively — if a product is missing, still show something
    let total = 0;
    const itemsHTML = cart.map((item, idx) => {
        const p = findProduct(item.id);
        // Use product data if found, fallback to item data
        const name = p ? p.name : (item.name || 'Producto');
        const icon = p ? p.icon : '?';
        const subtotal = Number(item.price) || 0;
        total += subtotal;

        let meta = '';
        if (item.type === 'streaming') {
            meta = `
                <span class="cart-item-meta"><strong>Perfil:</strong> ${escapeHtml(item.profileName)}</span>
                <span class="cart-item-meta"><strong>PIN:</strong> ${escapeHtml(item.profilePin)}</span>`;
        } else {
            meta = `
                <span class="cart-item-meta"><strong>Cantidad:</strong> ${formatQty(item.qty)}</span>
                <span class="cart-item-meta"><strong>Link:</strong> ${escapeHtml(truncateUrl(item.redesLink))}</span>
                ${item.redesNote ? `<span class="cart-item-meta"><strong>Notas:</strong> ${escapeHtml(item.redesNote)}</span>` : ''}`;
        }
        return `
            <div class="cart-item">
                <div class="cart-item-icon">${escapeHtml(icon)}</div>
                <div class="cart-item-info">
                    <span class="cart-item-name">${escapeHtml(name)}</span>
                    ${meta}
                </div>
                <div class="cart-item-price">${formatPrice(subtotal)}</div>
                <button class="cart-item-remove" data-remove="${idx}" type="button">Eliminar</button>
            </div>`;
    }).join('');

    cartBody.innerHTML = itemsHTML;
    cartFooter.style.display = 'flex';
    const totalEl = $('#cartTotal');
    if (totalEl) totalEl.textContent = formatPrice(total);

    // Bind remove buttons freshly
    $$('[data-remove]').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.remove, 10);
            removeFromCart(idx);
        });
    });
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
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

// ---------- NAVBAR SCROLL ----------
function bindNavbarScroll() {
    const navbar = $('#navbar');
    if (!navbar) return;
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
}

// ---------- MOBILE MENU ----------
function bindMobileMenu() {
    const toggle = $('#menuToggle');
    const links = $('#navLinks');
    if (!toggle || !links) return;
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
    if (!pinInput) return;
    pinInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
    });
}

// ---------- HANDLE "AGREGAR AL CARRITO" CLICK ----------
// Using button click instead of form submit for maximum reliability on mobile
function handleAddToCart() {
    if (!pendingProduct) {
        showToast('Error: ningún producto seleccionado');
        return;
    }
    const { id, type } = pendingProduct;

    if (type === 'streaming') {
        const nameInput = $('#profileName');
        const pinInput = $('#profilePin');
        const name = nameInput.value.trim();
        const pin = pinInput.value.trim();
        let valid = true;
        if (name.length < 2 || name.length > 20) { nameInput.classList.add('invalid'); valid = false; }
        else nameInput.classList.remove('invalid');
        if (!/^\d{4}$/.test(pin)) { pinInput.classList.add('invalid'); valid = false; }
        else pinInput.classList.remove('invalid');
        if (!valid) { showToast('Revisa los datos ingresados'); return; }

        const p = findProduct(id);
        addToCart({
            id, type: 'streaming',
            price: p.price,
            profileName: name,
            profilePin: pin
        });
    } else {
        const cantidadInput = $('#redesCantidad');
        const linkInput = $('#redesLink');
        const p = findProduct(id);
        let qty = parseInt(cantidadInput.value, 10);
        const link = linkInput.value.trim();
        const note = $('#redesNote').value.trim();
        let valid = true;
        if (isNaN(qty) || qty < p.minQty) { cantidadInput.classList.add('invalid'); valid = false; }
        else cantidadInput.classList.remove('invalid');
        if (!/^https?:\/\/.+\..+/.test(link)) { linkInput.classList.add('invalid'); valid = false; }
        else linkInput.classList.remove('invalid');
        if (!valid) { showToast('Revisa los datos ingresados'); return; }

        if (qty > p.maxQty) qty = p.maxQty;

        addToCart({
            id, type: 'redes',
            qty,
            price: calcRedesPrice(p, qty),
            redesLink: link,
            redesNote: note
        });
    }

    // Visual feedback on the product button
    const prodBtn = document.querySelector(`[data-action="open-modal"][data-id="${id}"]`);
    if (prodBtn) {
        const originalText = prodBtn.textContent;
        prodBtn.classList.add('added');
        prodBtn.textContent = '✓ AGREGADO';
        setTimeout(() => {
            prodBtn.classList.remove('added');
            prodBtn.textContent = originalText;
        }, 1500);
    }

    closeModal();
    // AUTO-OPEN cart drawer so user sees the item added
    setTimeout(() => {
        openCart();
    }, 200);
}

// ---------- WHATSAPP CHECKOUT ----------
function buildWhatsAppMessage() {
    const now = new Date();
    const fecha = now.toLocaleString('es-PE', { timeZone: 'America/Lima' });
    let msg = `*VSTG.RTW — NUEVO PEDIDO*%0A`;
    msg += `Fecha: ${encodeURIComponent(fecha)}%0A`;
    msg += `%0A`;

    let total = 0;
    let streamingItems = [];
    let redesItems = [];

    cart.forEach((item) => {
        const p = findProduct(item.id);
        if (!p) return;
        if (item.type === 'streaming') {
            streamingItems.push({ p, item });
        } else {
            redesItems.push({ p, item });
        }
        total += Number(item.price) || 0;
    });

    if (streamingItems.length) {
        msg += `*STREAMING*%0A`;
        streamingItems.forEach(({ p, item }, i) => {
            msg += `%0A${i + 1}. ${p.name}%0A`;
            msg += `   Precio: ${formatPrice(item.price)}%0A`;
            msg += `   Nombre del perfil: ${encodeURIComponent(item.profileName)}%0A`;
            msg += `   PIN: ${encodeURIComponent(item.profilePin)}%0A`;
        });
        msg += `%0A`;
    }

    if (redesItems.length) {
        msg += `*CRECE EN REDES*%0A`;
        redesItems.forEach(({ p, item }, i) => {
            msg += `%0A${i + 1}. ${p.name}%0A`;
            msg += `   Cantidad: ${formatQty(item.qty)}%0A`;
            msg += `   Precio: ${formatPrice(item.price)}%0A`;
            msg += `   Link: ${encodeURIComponent(item.redesLink)}%0A`;
            if (item.redesNote) msg += `   Notas: ${encodeURIComponent(item.redesNote)}%0A`;
        });
        msg += `%0A`;
    }

    msg += `*TOTAL: ${formatPrice(total)}*%0A%0A`;
    msg += `Por favor confirmar el pedido y enviar los datos de pago. 🙌%0A`;
    msg += `_Mensaje generado automáticamente desde vstg.rtw_`;

    return msg;
}

function sendWhatsAppOrder() {
    if (cart.length === 0) {
        showToast('Tu carrito está vacío');
        return;
    }
    const message = buildWhatsAppMessage();
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(url, '_blank');
    showToast('Abriendo WhatsApp...');
}

// ---------- INIT ----------
document.addEventListener('DOMContentLoaded', () => {
    // Render products
    renderStreaming();
    renderRedes();

    // Bind all "ALQUILAR/COMPRAR" buttons via event delegation
    document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action="open-modal"]');
        if (!btn) return;
        e.preventDefault();
        openModal(btn.dataset.id, btn.dataset.type);
    });

    // Cart buttons — explicit binding
    const cartBtn = $('#cartBtn');
    const cartClose = $('#cartClose');
    const cartOverlay = $('#cartOverlay');
    if (cartBtn) cartBtn.addEventListener('click', openCart);
    if (cartClose) cartClose.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

    // Modal close — explicit binding
    const modalClose = $('#modalClose');
    const modalOverlay = $('#modalOverlay');
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    // AGREGAR AL CARRITO button — explicit click handler (more reliable than form submit)
    const addBtn = $('#addToCartBtn');
    if (addBtn) {
        addBtn.addEventListener('click', handleAddToCart);
    }
    // Also handle form submit (Enter key)
    const form = $('#profileForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            handleAddToCart();
        });
    }

    // Bind checkout buttons
    const checkoutBtn = $('#checkoutBtn');
    const clearCartBtn = $('#clearCartBtn');
    if (checkoutBtn) checkoutBtn.addEventListener('click', sendWhatsAppOrder);
    if (clearCartBtn) clearCartBtn.addEventListener('click', clearCart);

    // Bind cantidad input
    const redesCantidad = $('#redesCantidad');
    if (redesCantidad) {
        redesCantidad.addEventListener('input', handleCantidadInput);
        redesCantidad.addEventListener('blur', handleCantidadBlur);
    }

    // Bind preset buttons
    bindPresetButtons();

    // Other UI bindings
    bindNavbarScroll();
    bindMobileMenu();
    bindReveal();
    animateCounters();
    bindPinInput();

    // ESC closes everything
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCart();
            closeModal();
        }
    });

    // Spotlight effect on product cards (mouse-follow radial gradient)
    document.body.addEventListener('mousemove', (e) => {
        const card = e.target.closest('.product-card');
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mx', x + '%');
        card.style.setProperty('--my', y + '%');
    });

    // Smooth scroll for in-page anchors (improves UX fluidity)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.length < 2) return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.pageYOffset - 60;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    // Initial UI render
    updateCartUI();
});
