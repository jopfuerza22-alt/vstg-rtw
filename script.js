/* ============================================================
   VSTG.RTW — Main Script (v3)
   - Streaming: profile + PIN
   - Redes: cantidad (selector) + link + notas
   - WhatsApp checkout with full message
   ============================================================ */

// ---------- CONFIG ----------
const WHATSAPP_NUMBER = '51940779810'; // Perú +51 940 779 810
const CURRENCY = 'S/';

// ---------- STREAMING PRODUCTS ----------
const STREAMING_PRODUCTS = [
    { id: 'nf', name: 'Netflix Premium',       icon: 'NF', desc: 'Cuenta compartida con perfil privado. Calidad 4K Ultra HD, hasta 4 dispositivos simultáneos.', price: 12, features: ['Calidad 4K UHD + HDR', 'Perfil privado propio', 'Garantía 30 días', 'Activación inmediata'] },
    { id: 'pv', name: 'Prime Video',           icon: 'PV', desc: 'Acceso completo a Amazon Prime Video: películas, series originales y exclusivas.', price: 8,  features: ['Catálogo completo Prime', 'Perfil privado', 'Garantía 30 días', 'Activación inmediata'] },
    { id: 'hb', name: 'HBO Max',               icon: 'HB', desc: 'Estrenos de cine, series originales HBO, Warner y DC en un solo lugar.', price: 8,  features: ['Estrenos simultáneos cine', 'Perfil privado', 'Garantía 30 días', 'Activación inmediata'] },
    { id: 'ds', name: 'Disney Premium',        icon: 'DS', desc: 'Disney+, Marvel, Star Wars, Pixar y Star. Calidad 4K con perfil premium.', price: 15, features: ['Calidad 4K UHD', '4 pantallas simultáneas', 'Incluye Star contenido', 'Garantía 30 días'] },
    { id: 'cr', name: 'Crunchyroll Mega Fan',  icon: 'CR', desc: 'Anime sin anuncios, simulcast con Japón y descargas offline en HD.', price: 8,  features: ['Sin anuncios', 'Simulcast Japón', 'Descargas offline', 'Acceso manga'] },
    { id: 'sp', name: 'Spotify Premium',       icon: 'SP', desc: 'Cuenta personal sin anuncios, descargas offline y saltos ilimitados.', price: 15, features: ['Cuenta personal', 'Sin anuncios', 'Descarga offline', 'Saltos ilimitados'] },
    { id: 'am', name: 'Apple Music',           icon: 'AM', desc: 'Más de 100 millones de canciones, descargas offline y audio sin pérdida.', price: 15, features: ['Cuenta personal', 'Audio sin pérdida', 'Descargas offline', 'Letras en tiempo real'] }
];

// ---------- REDES PRODUCTS ----------
// Each product has options: [{label, qty, price}] — user picks from select
const REDES_PRODUCTS = {
    seguidores: [
        { id: 'sg-ig', name: 'Seguidores Instagram', icon: 'IG', desc: 'Seguidores reales y estables para tu cuenta de Instagram.', features: ['Seguidores reales', 'Entrega gradual', 'Sin contraseña', 'Garantía reposición 30 días'],
          options: [
            { label: '1,000 seguidores', qty: 1000, price: 12 },
            { label: '5,000 seguidores', qty: 5000, price: 45 },
            { label: '10,000 seguidores', qty: 10000, price: 80 }
          ]
        },
        { id: 'sg-fb', name: 'Seguidores Facebook',  icon: 'FB', desc: 'Impulsa tu página de Facebook con seguidores reales y activos.', features: ['Seguidores reales', 'Entrega gradual', 'Sin contraseña', 'Garantía reposición'],
          options: [
            { label: '1,000 seguidores', qty: 1000, price: 15 },
            { label: '5,000 seguidores', qty: 5000, price: 55 },
            { label: '10,000 seguidores', qty: 10000, price: 100 }
          ]
        },
        { id: 'sg-tk', name: 'Seguidores TikTok',    icon: 'TK', desc: 'Crece en TikTok con seguidores estables, sin riesgo de baneo.', features: ['Seguidores reales', 'Entrega gradual', 'Sin riesgo de baneo', 'Garantía 30 días'],
          options: [
            { label: '1,000 seguidores', qty: 1000, price: 10 },
            { label: '5,000 seguidores', qty: 5000, price: 40 },
            { label: '10,000 seguidores', qty: 10000, price: 70 }
          ]
        }
    ],
    likes: [
        { id: 'lk-ig', name: 'Likes Instagram',  icon: 'IG', desc: 'Likes reales para tus publicaciones de Instagram, baja caída.', features: ['Likes reales', 'Reparto gradual', 'Baja caída', 'Garantía 30 días'],
          options: [
            { label: '1,000 likes', qty: 1000, price: 8 },
            { label: '5,000 likes', qty: 5000, price: 30 },
            { label: '10,000 likes', qty: 10000, price: 50 }
          ]
        },
        { id: 'lk-fb', name: 'Likes Facebook',   icon: 'FB', desc: 'Likes para tus publicaciones o página de Facebook.', features: ['Likes reales', 'Reparto gradual', 'Estables', 'Garantía reposición'],
          options: [
            { label: '1,000 likes', qty: 1000, price: 10 },
            { label: '5,000 likes', qty: 5000, price: 38 },
            { label: '10,000 likes', qty: 10000, price: 65 }
          ]
        },
        { id: 'lk-tk', name: 'Likes TikTok',     icon: 'TK', desc: 'Likes para tus videos de TikTok y mayor viralidad.', features: ['Likes reales', 'Reparto gradual', 'Sin riesgo de baneo', 'Garantía 30 días'],
          options: [
            { label: '1,000 likes', qty: 1000, price: 6 },
            { label: '5,000 likes', qty: 5000, price: 22 },
            { label: '10,000 likes', qty: 10000, price: 40 }
          ]
        }
    ],
    comentarios: [
        { id: 'cm-ig', name: 'Comentarios Instagram', icon: 'IG', desc: 'Comentarios reales y personalizados para tu publicación de Instagram.', features: ['Comentarios reales', 'Personalizables', 'Cuentas activas', 'Entrega 1-2 días'],
          options: [
            { label: '100 comentarios', qty: 100, price: 12 },
            { label: '500 comentarios', qty: 500, price: 50 },
            { label: '1,000 comentarios', qty: 1000, price: 90 }
          ]
        },
        { id: 'cm-fb', name: 'Comentarios Facebook',  icon: 'FB', desc: 'Comentarios reales para tus publicaciones de Facebook.', features: ['Comentarios reales', 'Personalizables', 'Cuentas activas', 'Entrega 1-2 días'],
          options: [
            { label: '100 comentarios', qty: 100, price: 14 },
            { label: '500 comentarios', qty: 500, price: 58 },
            { label: '1,000 comentarios', qty: 1000, price: 100 }
          ]
        },
        { id: 'cm-tk', name: 'Comentarios TikTok',    icon: 'TK', desc: 'Comentarios reales para tus videos de TikTok.', features: ['Comentarios reales', 'Personalizables', 'Cuentas activas', 'Entrega 1-2 días'],
          options: [
            { label: '100 comentarios', qty: 100, price: 10 },
            { label: '500 comentarios', qty: 500, price: 45 },
            { label: '1,000 comentarios', qty: 1000, price: 80 }
          ]
        }
    ],
    vistas: [
        { id: 'vs-ig', name: 'Vistas Instagram', icon: 'IG', desc: 'Vistas reales para tus Reels o videos de Instagram.', features: ['Vistas reales', 'Entrega rápida', 'Estables', 'Sin contraseña'],
          options: [
            { label: '10,000 vistas', qty: 10000, price: 8 },
            { label: '50,000 vistas', qty: 50000, price: 28 },
            { label: '100,000 vistas', qty: 100000, price: 50 }
          ]
        },
        { id: 'vs-fb', name: 'Vistas Facebook',  icon: 'FB', desc: 'Vistas para tus videos publicados en Facebook.', features: ['Vistas reales', 'Entrega gradual', 'Estables', 'Sin contraseña'],
          options: [
            { label: '10,000 vistas', qty: 10000, price: 10 },
            { label: '50,000 vistas', qty: 50000, price: 32 },
            { label: '100,000 vistas', qty: 100000, price: 55 }
          ]
        },
        { id: 'vs-tk', name: 'Vistas TikTok',    icon: 'TK', desc: 'Vistas reales para tus videos de TikTok, empuja al For You.', features: ['Vistas reales', 'Entrega gradual', 'Sin riesgo de baneo', 'Sin contraseña'],
          options: [
            { label: '10,000 vistas', qty: 10000, price: 5 },
            { label: '50,000 vistas', qty: 50000, price: 18 },
            { label: '100,000 vistas', qty: 100000, price: 30 }
          ]
        }
    ]
};

// Flat list of all products for lookup
const ALL_PRODUCTS = [
    ...STREAMING_PRODUCTS,
    ...Object.values(REDES_PRODUCTS).flat()
];

// ---------- CART STATE ----------
let cart = JSON.parse(localStorage.getItem('vstg_cart') || '[]');
let pendingProduct = null; // { id, type }

// ---------- DOM HELPERS ----------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const formatPrice = (n) => `${CURRENCY} ${Number(n).toFixed(2)}`;
const escapeHtml = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// ---------- LOADER ----------
window.addEventListener('load', () => {
    setTimeout(() => $('#loader').classList.add('hidden'), 600);
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
    return `
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
                <button class="add-cart-btn" data-action="open-modal" data-id="${p.id}" data-type="streaming">ALQUILAR</button>
            </div>
        </article>
    `;
}

function redesCardHTML(p) {
    // Show starting price (cheapest option)
    const startingPrice = Math.min(...p.options.map(o => o.price));
    return `
        <article class="product-card" data-id="${p.id}">
            <span class="product-tag">${p.icon}</span>
            <div class="product-icon">${p.icon}</div>
            <h3 class="product-name">${p.name}</h3>
            <p class="product-desc">${p.desc}</p>
            <ul class="product-features">
                ${p.features.map(f => `<li>${f}</li>`).join('')}
            </ul>
            <div class="product-footer">
                <div class="product-price">Desde ${formatPrice(startingPrice)}</div>
                <button class="add-cart-btn" data-action="open-modal" data-id="${p.id}" data-type="redes">COMPRAR</button>
            </div>
        </article>
    `;
}

// ---------- BIND ALL "ALQUILAR/COMPRAR" BUTTONS ----------
// Critical: use event delegation so it works on dynamically injected buttons
function bindAddButtons() {
    document.body.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action="open-modal"]');
        if (!btn) return;
        e.preventDefault();
        e.stopPropagation();
        openModal(btn.dataset.id, btn.dataset.type);
    });
}

// ---------- FIND PRODUCT ----------
function findProduct(id) {
    return ALL_PRODUCTS.find(p => p.id === id);
}

// ---------- MODAL ----------
function openModal(id, type) {
    const p = findProduct(id);
    if (!p) return;
    pendingProduct = { id, type };

    $('#modalServiceName').textContent = p.name;
    $('#modalServiceDesc').textContent = p.desc;
    $('#modalTag').textContent = type === 'streaming' ? 'CONFIGURA TU PERFIL' : 'CONFIGURA TU PEDIDO';

    // Reset all fields
    $('#profileName').value = '';
    $('#profilePin').value = '';
    $('#redesLink').value = '';
    $('#redesNote').value = '';
    ['profileName', 'profilePin', 'redesLink'].forEach(id => $('#' + id).classList.remove('invalid'));

    if (type === 'streaming') {
        $('#formFieldsStreaming').style.display = 'block';
        $('#formFieldsRedes').style.display = 'none';
        $('#modalServicePrice').textContent = formatPrice(p.price);
        setTimeout(() => $('#profileName').focus(), 300);
    } else {
        $('#formFieldsStreaming').style.display = 'none';
        $('#formFieldsRedes').style.display = 'block';
        // Build the quantity select
        const select = $('#redesCantidad');
        select.innerHTML = p.options.map((opt, i) =>
            `<option value="${i}" data-qty="${opt.qty}" data-price="${opt.price}">${opt.label} — ${formatPrice(opt.price)}</option>`
        ).join('');
        updateModalPriceFromSelect();
        setTimeout(() => $('#redesLink').focus(), 300);
    }

    $('#modalOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function updateModalPriceFromSelect() {
    const select = $('#redesCantidad');
    const opt = select.options[select.selectedIndex];
    if (!opt) return;
    const price = parseFloat(opt.dataset.price);
    $('#modalServicePrice').textContent = formatPrice(price);
}

function closeModal() {
    $('#modalOverlay').classList.remove('open');
    document.body.style.overflow = '';
    pendingProduct = null;
}

// ---------- CART ----------
function addToCart(item) {
    cart.push(item);
    saveCart();
    updateCartUI();
    const p = findProduct(item.id);
    showToast(`${p.name} agregado al carrito`);
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

function truncateUrl(url, max = 50) {
    if (url.length <= max) return url;
    return url.slice(0, max - 3) + '...';
}

function updateCartUI() {
    const count = cart.length;
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
            const subtotal = item.price;
            total += subtotal;
            let meta = '';
            if (item.type === 'streaming') {
                meta = `
                    <span class="cart-item-meta"><strong>Perfil:</strong> ${escapeHtml(item.profileName)}</span>
                    <span class="cart-item-meta"><strong>PIN:</strong> ${escapeHtml(item.profilePin)}</span>`;
            } else {
                meta = `
                    <span class="cart-item-meta"><strong>Cantidad:</strong> ${item.qtyLabel}</span>
                    <span class="cart-item-meta"><strong>Link:</strong> ${escapeHtml(truncateUrl(item.redesLink))}</span>
                    ${item.redesNote ? `<span class="cart-item-meta"><strong>Notas:</strong> ${escapeHtml(item.redesNote)}</span>` : ''}`;
            }
            return `
                <div class="cart-item">
                    <div class="cart-item-icon">${p.icon}</div>
                    <div class="cart-item-info">
                        <span class="cart-item-name">${p.name}</span>
                        ${meta}
                    </div>
                    <div class="cart-item-price">${formatPrice(subtotal)}</div>
                    <button class="cart-item-remove" data-remove="${idx}">Eliminar</button>
                </div>`;
        }).join('');
        cartFooter.style.display = 'flex';
        $('#cartTotal').textContent = formatPrice(total);

        // Bind remove buttons
        $$('[data-remove]').forEach(btn => {
            btn.addEventListener('click', () => removeFromCart(parseInt(btn.dataset.remove, 10)));
        });
    }
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
    $('#profilePin').addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
    });
}

// ---------- SELECT CHANGE ----------
function bindCantidadSelect() {
    $('#redesCantidad').addEventListener('change', updateModalPriceFromSelect);
}

// ---------- FORM SUBMIT ----------
function bindForm() {
    $('#profileForm').addEventListener('submit', (e) => {
        e.preventDefault();
        if (!pendingProduct) return;
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
            const select = $('#redesCantidad');
            const opt = select.options[select.selectedIndex];
            const linkInput = $('#redesLink');
            const link = linkInput.value.trim();
            const note = $('#redesNote').value.trim();
            let valid = true;
            if (!/^https?:\/\/.+\..+/.test(link)) { linkInput.classList.add('invalid'); valid = false; }
            else linkInput.classList.remove('invalid');
            if (!valid) { showToast('Ingresa un enlace válido (http/https)'); return; }

            addToCart({
                id, type: 'redes',
                qty: parseInt(opt.dataset.qty, 10),
                qtyLabel: opt.label.split(' — ')[0],
                price: parseFloat(opt.dataset.price),
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
    });
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
        total += item.price;
    });

    // Streaming section
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

    // Redes section
    if (redesItems.length) {
        msg += `*CRECE EN REDES*%0A`;
        redesItems.forEach(({ p, item }, i) => {
            msg += `%0A${i + 1}. ${p.name}%0A`;
            msg += `   Cantidad: ${encodeURIComponent(item.qtyLabel)}%0A`;
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
    renderStreaming();
    renderRedes();
    bindAddButtons();          // Event delegation — must work for all dynamically injected buttons
    bindNavbarScroll();
    bindMobileMenu();
    bindReveal();
    animateCounters();
    bindCheckout();
    bindPinInput();
    bindCantidadSelect();
    bindForm();
    updateCartUI();

    $('#cartBtn').addEventListener('click', openCart);
    $('#cartClose').addEventListener('click', closeCart);
    $('#cartOverlay').addEventListener('click', closeCart);
    $('#modalClose').addEventListener('click', closeModal);
    $('#modalOverlay').addEventListener('click', (e) => {
        if (e.target === $('#modalOverlay')) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCart();
            closeModal();
        }
    });
});
