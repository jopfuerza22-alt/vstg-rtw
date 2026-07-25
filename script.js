/* ============================================================
   VSTG.RTW — Main Script
   Cart, filters, animations, products data
   ============================================================ */

// ---------- PRODUCT DATA ----------
const PRODUCTS = {
    streaming: [
        { id: 'st1', name: 'Netflix Premium 4K', cat: 'peliculas', icon: 'N', desc: 'Cuenta compartida con perfiles privados. Calidad 4K Ultra HD.', price: 8.99, oldPrice: 15.99, features: ['Pantalla 4K UHD', '4 perfiles privados', 'Garantía 30 días', 'Entrega inmediata'] },
        { id: 'st2', name: 'Disney+ Estándar', cat: 'peliculas', icon: 'D', desc: 'Acceso completo a Marvel, Star Wars, Pixar y más.', price: 5.99, oldPrice: 9.99, features: ['1080p Full HD', '2 pantallas simultáneas', 'Descargas ilimitadas', 'Garantía 30 días'] },
        { id: 'st3', name: 'Spotify Premium', cat: 'musica', icon: 'S', desc: 'Cuenta personal sin anuncios, descargas offline.', price: 4.99, oldPrice: 10.99, features: ['Sin anuncios', 'Descarga offline', 'Saltos ilimitados', 'Cuenta personal'] },
        { id: 'st4', name: 'YouTube Premium', cat: 'musica', icon: 'Y', desc: 'Sin anuncios, reproducción en segundo plano y YouTube Music.', price: 6.99, oldPrice: 12.99, features: ['Sin anuncios', 'Background play', 'YouTube Music incluido', 'Descargas offline'] },
        { id: 'st5', name: 'HBO Max', cat: 'peliculas', icon: 'H', desc: 'Estrenos de cine, series originales y clásicos.', price: 7.99, oldPrice: 14.99, features: ['4K disponible', '3 perfiles', 'Estrenos simultáneos', 'Garantía 30 días'] },
        { id: 'st6', name: 'DAZN Sports', cat: 'deportes', icon: 'DZ', desc: 'Fútbol, boxeo, MMA y deportes en vivo en HD.', price: 9.99, oldPrice: 19.99, features: ['Deportes en vivo HD', 'Replays ilimitados', 'Multi-dispositivo', 'Sin contratos'] }
    ],
    redes: [
        { id: 'rd1', name: 'Instagram — 5K Seguidores', cat: 'instagram', icon: 'IG', desc: 'Seguidores reales y orgánicos, entrega gradual en 7 días.', price: 24.99, oldPrice: 39.99, features: ['Seguidores reales', 'Entrega gradual 7 días', 'Sin contraseña', 'Garantía reposición'] },
        { id: 'rd2', name: 'Instagram — Gestión Mensual', cat: 'instagram', icon: 'IG', desc: 'Gestión completa: contenido, hashtags y engagement.', price: 79.99, features: ['8 post al mes', 'Análisis mensual', 'Estrategia personalizada', 'Soporte directo'] },
        { id: 'rd3', name: 'TikTok — 10K Seguidores', cat: 'tiktok', icon: 'TK', desc: 'Crecimiento real con engagement activo y reach orgánico.', price: 34.99, oldPrice: 59.99, features: ['Seguidores reales', 'Entrega 5 días', 'Sin riesgo de baneo', 'Garantía 30 días'] },
        { id: 'rd4', name: 'TikTok — Paquete Viral', cat: 'tiktok', icon: 'TK', desc: '50K views + 5K likes + 1K seguidores en 3 videos.', price: 49.99, features: ['50K views garantizadas', '5K likes', '1K seguidores', 'Análisis de rendimiento'] },
        { id: 'rd5', name: 'YouTube — 1K Suscriptores', cat: 'youtube', icon: 'YT', desc: 'Cumple el requisito de monetización con suscriptores reales.', price: 44.99, oldPrice: 89.99, features: ['Suscriptores reales', 'Cumple monetización', 'Entrega 14 días', 'Garantía reposición'] },
        { id: 'rd6', name: 'YouTube — 100K Views', cat: 'youtube', icon: 'YT', desc: 'Views orgánicos distribuidos en cualquier video.', price: 39.99, features: ['100K views', 'Retención 60%+', 'Geo-targeting disponible', 'Entrega 7 días'] }
    ],
    edicion: [
        { id: 'ed1', name: 'Edición de Video — 5 min', cat: 'video', icon: 'PR', desc: 'Edición profesional en Premiere Pro con transiciones y color.', price: 49.99, features: ['Hasta 5 minutos', 'Color grading', 'Musicalización', '2 revisiones gratis'] },
        { id: 'ed2', name: 'Edición de Video — Corto', cat: 'video', icon: 'PR', desc: 'Video corto vertical para Reels, TikTok o Shorts.', price: 19.99, features: ['Video vertical 9:16', 'Hasta 60 segundos', 'Subtítulos animados', '1 revisión gratis'] },
        { id: 'ed3', name: 'Edición de Foto — Lote 10', cat: 'foto', icon: 'PS', desc: 'Retoque profesional de 10 fotos con Lightroom y Photoshop.', price: 29.99, features: ['10 fotos editadas', 'Color grading', 'Retoque de piel', 'Entrega 48h'] },
        { id: 'ed4', name: 'Foto Producto — Pack 20', cat: 'foto', icon: 'PS', desc: 'Fotos de producto profesionales para ecommerce.', price: 89.99, features: ['20 fotos editadas', 'Fondo blanco', 'Ángulos múltiples', 'Uso comercial'] },
        { id: 'ed5', name: 'Diseño de Logo', cat: 'diseno', icon: 'AI', desc: 'Logo profesional vectorial con 4 conceptos iniciales.', price: 59.99, features: ['4 conceptos', 'Archivos AI/PNG/SVG', '3 revisiones', 'Manual de marca básico'] },
        { id: 'ed6', name: 'Diseño Redes — Pack Mensual', cat: 'diseno', icon: 'AI', desc: '15 plantillas para Instagram, historias y reels.', price: 99.99, features: ['15 plantillas', 'Plantilla editable', 'Coherencia visual', 'Soporte directo'] }
    ]
};

// ---------- CART STATE ----------
let cart = JSON.parse(localStorage.getItem('vstg_cart') || '[]');

// ---------- DOM HELPERS ----------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ---------- LOADER ----------
window.addEventListener('load', () => {
    setTimeout(() => {
        $('#loader').classList.add('hidden');
    }, 600);
});

// ---------- RENDER PRODUCTS ----------
function renderProducts() {
    Object.keys(PRODUCTS).forEach(category => {
        const grid = $(`#${category}Grid`);
        if (!grid) return;
        grid.innerHTML = PRODUCTS[category].map(p => `
            <article class="product-card" data-cat="${p.cat}" data-id="${p.id}">
                <span class="product-tag">${p.cat}</span>
                <div class="product-icon">${p.icon}</div>
                <h3 class="product-name">${p.name}</h3>
                <p class="product-desc">${p.desc}</p>
                <ul class="product-features">
                    ${p.features.map(f => `<li>${f}</li>`).join('')}
                </ul>
                <div class="product-footer">
                    <div class="product-price">
                        ${p.oldPrice ? `<span class="product-price-old">$${p.oldPrice.toFixed(2)}</span>` : ''}
                        $${p.price.toFixed(2)}
                    </div>
                    <button class="add-cart-btn" data-add="${p.id}">
                        AGREGAR
                    </button>
                </div>
            </article>
        `).join('');
    });
    bindAddButtons();
}

function bindAddButtons() {
    $$('[data-add]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = btn.dataset.add;
            addToCart(id);
            btn.classList.add('added');
            btn.textContent = '✓ AGREGADO';
            setTimeout(() => {
                btn.classList.remove('added');
                btn.textContent = 'AGREGAR';
            }, 1500);
        });
    });
}

// ---------- FIND PRODUCT ----------
function findProduct(id) {
    for (const cat of Object.values(PRODUCTS)) {
        const p = cat.find(p => p.id === id);
        if (p) return p;
    }
    return null;
}

// ---------- CART ----------
function addToCart(id) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ id, qty: 1 });
    }
    saveCart();
    updateCartUI();
    showToast('Producto agregado al carrito');
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
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
    const cartCount = $('#cartCount');
    const cartBadge = $('#cartBadge');
    cartCount.textContent = count;
    cartBadge.textContent = count;
    cartCount.classList.toggle('visible', count > 0);

    const cartBody = $('#cartBody');
    const cartFooter = $('#cartFooter');
    if (cart.length === 0) {
        cartBody.innerHTML = `
            <div class="cart-empty" id="cartEmpty">
                <div class="cart-empty-icon">▣</div>
                <p>Tu carrito está vacío</p>
                <span>Agrega servicios para continuar</span>
            </div>`;
        cartFooter.style.display = 'none';
    } else {
        let total = 0;
        cartBody.innerHTML = cart.map(item => {
            const p = findProduct(item.id);
            if (!p) return '';
            total += p.price * item.qty;
            return `
                <div class="cart-item">
                    <div class="cart-item-icon">${p.icon}</div>
                    <div class="cart-item-info">
                        <span class="cart-item-name">${p.name}</span>
                        <span class="cart-item-cat">Cant: ${item.qty}</span>
                    </div>
                    <div class="cart-item-price">$${(p.price * item.qty).toFixed(2)}</div>
                    <button class="cart-item-remove" data-remove="${p.id}">Eliminar</button>
                </div>`;
        }).join('');
        cartFooter.style.display = 'flex';
        $('#cartTotal').textContent = `$${total.toFixed(2)}`;

        $$('[data-remove]').forEach(btn => {
            btn.addEventListener('click', () => removeFromCart(btn.dataset.remove));
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
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

// ---------- FILTERS ----------
function bindFilters() {
    $$('.filters').forEach(filterGroup => {
        const grid = filterGroup.parentElement.querySelector('.products-grid');
        filterGroup.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                filterGroup.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.dataset.filter;
                grid.querySelectorAll('.product-card').forEach(card => {
                    const show = filter === 'all' || card.dataset.cat === filter;
                    card.classList.toggle('hidden', !show);
                });
            });
        });
    });
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
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
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
                const target = parseInt(el.dataset.target);
                const duration = 2000;
                const start = performance.now();
                const step = (now) => {
                    const progress = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const value = Math.floor(eased * target);
                    el.textContent = value.toLocaleString();
                    if (progress < 1) requestAnimationFrame(step);
                };
                requestAnimationFrame(step);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => observer.observe(c));
}

// ---------- CHECKOUT ----------
function bindCheckout() {
    $('#checkoutBtn').addEventListener('click', () => {
        if (cart.length === 0) return;
        showToast('Redirigiendo a checkout... (demo)');
        // Aquí se integraría Stripe / PayPal / MercadoPago
        setTimeout(() => {
            alert('Gracias por tu compra en VSTG.RTW!\n\nEste es un demo. En producción se integraría una pasarela de pago real.');
        }, 800);
    });
    $('#clearCartBtn').addEventListener('click', clearCart);
}

// ---------- INIT ----------
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    bindFilters();
    bindNavbarScroll();
    bindMobileMenu();
    bindReveal();
    animateCounters();
    bindCheckout();
    updateCartUI();

    $('#cartBtn').addEventListener('click', openCart);
    $('#cartClose').addEventListener('click', closeCart);
    $('#cartOverlay').addEventListener('click', closeCart);

    // ESC to close cart
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeCart();
    });
});
