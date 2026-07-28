/* ============================================================
   VSTG.RTW — Main Script
   Streaming + Redes (PEN), profile/link modal, WhatsApp checkout
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
// 4 categorías (seguidores, likes, comentarios, vistas) × 3 plataformas (Instagram, Facebook, TikTok)
const REDES_PRODUCTS = {
    seguidores: [
        { id: 'sg-ig-1k', name: '1,000 Seguidores Instagram', icon: 'IG', desc: 'Seguidores reales y estables para tu cuenta de Instagram.', price: 12, features: ['Seguidores reales', 'Entrega gradual 1-3 días', 'Sin contraseña', 'Garantía reposición 30 días'] },
        { id: 'sg-ig-5k', name: '5,000 Seguidores Instagram', icon: 'IG', desc: 'Paquete intermedio para acelerar tu crecimiento en Instagram.', price: 45, features: ['Seguidores reales', 'Entrega gradual 3-5 días', 'Sin contraseña', 'Garantía reposición 30 días'] },
        { id: 'sg-fb-1k', name: '1,000 Seguidores Facebook',  icon: 'FB', desc: 'Impulsa tu página de Facebook con seguidores reales y activos.', price: 15, features: ['Seguidores reales', 'Entrega 2-4 días', 'Sin contraseña', 'Garantía reposición'] },
        { id: 'sg-fb-5k', name: '5,000 Seguidores Facebook',  icon: 'FB', desc: 'Mayor alcance y credibilidad para tu fanpage o perfil público.', price: 55, features: ['Seguidores reales', 'Entrega 3-6 días', 'Sin contraseña', 'Garantía reposición'] },
        { id: 'sg-tk-1k', name: '1,000 Seguidores TikTok',    icon: 'TK', desc: 'Crece en TikTok con seguidores estables, sin riesgo de baneo.', price: 10, features: ['Seguidores reales', 'Entrega 1-3 días', 'Sin riesgo de baneo', 'Garantía 30 días'] },
        { id: 'sg-tk-5k', name: '5,000 Seguidores TikTok',    icon: 'TK', desc: 'Alcance masivo para tu cuenta de TikTok y mayor viralidad.', price: 40, features: ['Seguidores reales', 'Entrega 2-4 días', 'Sin riesgo de baneo', 'Garantía 30 días'] }
    ],
    likes: [
        { id: 'lk-ig-1k', name: '1,000 Likes Instagram',  icon: 'IG', desc: 'Likes reales para tus publicaciones de Instagram, baja caída.', price: 8,  features: ['Likes reales', 'Reparto gradual', 'Baja caída', 'Garantía 30 días'] },
        { id: 'lk-ig-5k', name: '5,000 Likes Instagram',  icon: 'IG', desc: 'Mayor visibilidad en el feed con miles de likes en tu post.', price: 30, features: ['Likes reales', 'Reparto gradual', 'Baja caída', 'Garantía 30 días'] },
        { id: 'lk-fb-1k', name: '1,000 Likes Facebook',   icon: 'FB', desc: 'Likes para tus publicaciones o página de Facebook.', price: 10, features: ['Likes reales', 'Reparto gradual', 'Estables', 'Garantía reposición'] },
        { id: 'lk-fb-5k', name: '5,000 Likes Facebook',   icon: 'FB', desc: 'Impulsa tus posts con miles de likes en Facebook.', price: 38, features: ['Likes reales', 'Reparto gradual', 'Estables', 'Garantía reposición'] },
        { id: 'lk-tk-1k', name: '1,000 Likes TikTok',     icon: 'TK', desc: 'Likes para tus videos de TikTok y mayor viralidad.', price: 6,  features: ['Likes reales', 'Reparto gradual', 'Sin riesgo de baneo', 'Garantía 30 días'] },
        { id: 'lk-tk-5k', name: '5,000 Likes TikTok',     icon: 'TK', desc: 'Empuja tus videos al feed For You con miles de likes.', price: 22, features: ['Likes reales', 'Reparto gradual', 'Sin riesgo de baneo', 'Garantía 30 días'] }
    ],
    comentarios: [
        { id: 'cm-ig-100', name: '100 Comentarios Instagram', icon: 'IG', desc: 'Comentarios reales y personalizados para tu publicación de Instagram.', price: 12, features: ['Comentarios reales', 'Personalizables', 'Cuentas activas', 'Entrega 1-2 días'] },
        { id: 'cm-ig-500', name: '500 Comentarios Instagram', icon: 'IG', desc: 'Mayor interacción social con cientos de comentarios relevantes.', price: 50, features: ['Comentarios reales', 'Personalizables', 'Cuentas activas', 'Entrega 2-3 días'] },
        { id: 'cm-fb-100', name: '100 Comentarios Facebook',  icon: 'FB', desc: 'Comentarios reales para tus publicaciones de Facebook.', price: 14, features: ['Comentarios reales', 'Personalizables', 'Cuentas activas', 'Entrega 1-2 días'] },
        { id: 'cm-fb-500', name: '500 Comentarios Facebook',  icon: 'FB', desc: 'Impulsa la conversación con cientos de comentarios en tus posts.', price: 58, features: ['Comentarios reales', 'Personalizables', 'Cuentas activas', 'Entrega 2-3 días'] },
        { id: 'cm-tk-100', name: '100 Comentarios TikTok',    icon: 'TK', desc: 'Comentarios reales para tus videos de TikTok.', price: 10, features: ['Comentarios reales', 'Personalizables', 'Cuentas activas', 'Entrega 1-2 días'] },
        { id: 'cm-tk-500', name: '500 Comentarios TikTok',    icon: 'TK', desc: 'Más engagement y viralidad con cientos de comentarios en TikTok.', price: 45, features: ['Comentarios reales', 'Personalizables', 'Cuentas activas', 'Entrega 2-3 días'] }
    ],
    vistas: [
        { id: 'vs-ig-10k', name: '10,000 Vistas Instagram', icon: 'IG', desc: 'Vistas reales para tus Reels o videos de Instagram.', price: 8,  features: ['Vistas reales', 'Entrega rápida', 'Estables', 'Sin contraseña'] },
        { id: 'vs-ig-50k', name: '50,000 Vistas Instagram', icon: 'IG', desc: 'Mayor alcance en Reels con decenas de miles de vistas.', price: 28, features: ['Vistas reales', 'Entrega gradual', 'Estables', 'Sin contraseña'] },
        { id: 'vs-fb-10k', name: '10,000 Vistas Facebook',  icon: 'FB', desc: 'Vistas para tus videos publicados en Facebook.', price: 10, features: ['Vistas reales', 'Entrega rápida', 'Estables', 'Sin contraseña'] },
        { id: 'vs-fb-50k', name: '50,000 Vistas Facebook',  icon: 'FB', desc: 'Impulsa tus videos de Facebook con miles de vistas.', price: 32, features: ['Vistas reales', 'Entrega gradual', 'Estables', 'Sin contraseña'] },
        { id: 'vs-tk-10k', name: '10,000 Vistas TikTok',    icon: 'TK', desc: 'Vistas reales para tus videos de TikTok, empuja al For You.', price: 5,  features: ['Vistas reales', 'Entrega rápida', 'Sin riesgo de baneo', 'Sin contraseña'] },
        { id: 'vs-tk-50k', name: '50,000 Vistas TikTok',    icon: 'TK', desc: 'Alcance masivo para tus videos de TikTok con vistas virales.', price: 18, features: ['Vistas reales', 'Entrega gradual', 'Sin riesgo de baneo', 'Sin contraseña'] }
    ]
};

// All products flat list (for lookup by id)
const ALL_PRODUCTS = [
    ...STREAMING_PRODUCTS,
    ...Object.values(REDES_PRODUCTS).flat()
];

// ---------- CART STATE ----------
let cart = JSON.parse(localStorage.getItem('vstg_cart') || '[]');
let pendingProduct = null; // { id, type: 'streaming' | 'redes' }

// ---------- DOM HELPERS ----------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);
const formatPrice = (n) => `${CURRENCY} ${Number(n).toFixed(2)}`;

// ---------- LOADER ----------
window.addEventListener('load', () => {
    setTimeout(() => $('#loader').classList.add('hidden'), 600);
});

// ---------- RENDER PRODUCTS ----------
function renderStreaming() {
    const grid = $('#streamingGrid');
    if (!grid) return;
    grid.innerHTML = STREAMING_PRODUCTS.map(p => productCardHTML(p, 'streaming')).join('');
}

function renderRedes() {
    Object.entries(REDES_PRODUCTS).forEach(([key, items]) => {
        const grid = $(`#${key}Grid`);
        if (!grid) return;
        grid.innerHTML = items.map(p => productCardHTML(p, 'redes')).join('');
    });
}

function productCardHTML(p, type) {
    const btnLabel = type === 'streaming' ? 'ALQUILAR' : 'COMPRAR';
    return `
        <article class="product-card" data-id="${p.id}" data-type="${type}">
            <span class="product-tag">${p.icon}</span>
            <div class="product-icon">${p.icon}</div>
            <h3 class="product-name">${p.name}</h3>
            <p class="product-desc">${p.desc}</p>
            <ul class="product-features">
                ${p.features.map(f => `<li>${f}</li>`).join('')}
            </ul>
            <div class="product-footer">
                <div class="product-price">${formatPrice(p.price)}</div>
                <button class="add-cart-btn" data-add="${p.id}" data-type="${type}">${btnLabel}</button>
            </div>
        </article>
    `;
}

function bindAddButtons() {
    $$('[data-add]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            openModal(btn.dataset.add, btn.dataset.type);
        });
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
    $('#modalServicePrice').textContent = formatPrice(p.price);
    $('#modalTag').textContent = type === 'streaming' ? 'CONFIGURA TU PERFIL' : 'CONFIGURA TU PEDIDO';

    // Reset fields
    $('#profileName').value = '';
    $('#profilePin').value = '';
    $('#redesLink').value = '';
    $('#redesNote').value = '';
    $('#profileName').classList.remove('invalid');
    $('#profilePin').classList.remove('invalid');
    $('#redesLink').classList.remove('invalid');

    // Toggle field groups
    $('#formFieldsStreaming').style.display = type === 'streaming' ? 'block' : 'none';
    $('#formFieldsRedes').style.display = type === 'redes' ? 'block' : 'none';

    $('#modalOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
        if (type === 'streaming') $('#profileName').focus();
        else $('#redesLink').focus();
    }, 300);
}

function closeModal() {
    $('#modalOverlay').classList.remove('open');
    document.body.style.overflow = '';
    pendingProduct = null;
}

// ---------- CART ----------
function addToCart(item) {
    // For streaming: key by id+profileName. For redes: key by id+link.
    const key = item.type === 'streaming' ? item.profileName : item.redesLink;
    const existing = cart.find(c => c.id === item.id && (
        (item.type === 'streaming' && c.profileName === item.profileName) ||
        (item.type === 'redes' && c.redesLink === item.redesLink)
    ));
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push(item);
    }
    saveCart();
    updateCartUI();
    showToast(`${findProduct(item.id).name} agregado al carrito`);
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

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
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
            let meta = '';
            if (item.type === 'streaming') {
                meta = `
                    <span class="cart-item-meta"><strong>Perfil:</strong> ${escapeHtml(item.profileName)}</span>
                    <span class="cart-item-meta"><strong>PIN:</strong> ${escapeHtml(item.profilePin)}</span>`;
            } else {
                meta = `
                    <span class="cart-item-meta"><strong>Enlace:</strong> ${escapeHtml(truncateUrl(item.redesLink))}</span>
                    ${item.redesNote ? `<span class="cart-item-meta"><strong>Notas:</strong> ${escapeHtml(item.redesNote)}</span>` : ''}`;
            }
            return `
                <div class="cart-item">
                    <div class="cart-item-icon">${p.icon}</div>
                    <div class="cart-item-info">
                        <span class="cart-item-name">${p.name}</span>
                        ${meta}
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

function truncateUrl(url) {
    if (url.length <= 45) return url;
    return url.slice(0, 42) + '...';
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
            addToCart({ id, type: 'streaming', qty: 1, profileName: name, profilePin: pin });
        } else {
            const linkInput = $('#redesLink');
            const link = linkInput.value.trim();
            const note = $('#redesNote').value.trim();
            let valid = true;
            if (!/^https?:\/\/.+\..+/.test(link)) { linkInput.classList.add('invalid'); valid = false; }
            else linkInput.classList.remove('invalid');
            if (!valid) { showToast('Ingresa un enlace válido'); return; }
            addToCart({ id, type: 'redes', qty: 1, redesLink: link, redesNote: note });
        }

        // Visual feedback on the product button
        const prodBtn = document.querySelector(`[data-add="${id}"]`);
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
    let msg = '*VSTG.RTW — NUEVO PEDIDO*%0A%0A';
    let total = 0;
    let streamingCount = 0, redesCount = 0;
    let streamingTotal = 0, redesTotal = 0;

    cart.forEach((item, idx) => {
        const p = findProduct(item.id);
        if (!p) return;
        const subtotal = p.price * item.qty;
        total += subtotal;
        msg += `*${idx + 1}. ${p.name}*%0A`;
        msg += `   Precio: ${formatPrice(p.price)}%0A`;
        msg += `   Cantidad: ${item.qty}%0A`;
        if (item.type === 'streaming') {
            streamingCount += item.qty;
            streamingTotal += subtotal;
            msg += `   Nombre del perfil: ${encodeURIComponent(item.profileName)}%0A`;
            msg += `   PIN: ${encodeURIComponent(item.profilePin)}%0A`;
        } else {
            redesCount += item.qty;
            redesTotal += subtotal;
            msg += `   Enlace: ${encodeURIComponent(item.redesLink)}%0A`;
            if (item.redesNote) msg += `   Notas: ${encodeURIComponent(item.redesNote)}%0A`;
        }
        msg += `   Subtotal: ${formatPrice(subtotal)}%0A%0A`;
    });

    msg += `*TOTAL: ${formatPrice(total)}*%0A%0A`;
    if (streamingCount) msg += `Streaming: ${streamingCount} item(s) — ${formatPrice(streamingTotal)}%0A`;
    if (redesCount) msg += `Redes: ${redesCount} item(s) — ${formatPrice(redesTotal)}%0A`;
    if (streamingCount || redesCount) msg += '%0A';
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
    renderStreaming();
    renderRedes();
    bindAddButtons();
    bindNavbarScroll();
    bindMobileMenu();
    bindReveal();
    animateCounters();
    bindCheckout();
    bindPinInput();
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
