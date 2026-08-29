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
    { id: 'nf', name: 'Netflix Premium',       icon: 'NF', logo: 'logo-netflix.png',    color: '#E50914', desc: 'Cuenta compartida con perfil privado. Calidad 4K Ultra HD, hasta 4 dispositivos simultáneos.', price: 12, soldOut: true, features: ['Calidad 4K UHD + HDR', 'Perfil privado propio', 'Garantía 30 días', 'Activación inmediata'] },
    { id: 'pv', name: 'Prime Video',           icon: 'PV', logo: 'logo-prime.jpg',      color: '#00A8E1', desc: 'Acceso completo a Amazon Prime Video: películas, series originales y exclusivas. ¡Oferta por tiempo limitado!', price: 4, oldPrice: 8, sale: true, features: ['Catálogo completo Prime', 'Perfil privado', 'Garantía 30 días', 'Activación inmediata', '50% OFF — Oferta especial'] },
    { id: 'hb', name: 'HBO Max',               icon: 'HB', logo: 'logo-hbomax.jpg',     color: '#7B2BF9', desc: 'Estrenos de cine, series originales HBO, Warner y DC en un solo lugar. ¡Oferta por tiempo limitado!', price: 4, oldPrice: 8, sale: true, features: ['Estrenos simultáneos cine', 'Perfil privado', 'Garantía 30 días', 'Activación inmediata', '50% OFF — Oferta especial'] },
    { id: 'ds', name: 'Disney Premium',        icon: 'DS', logo: 'logo-disney.jpg',     color: '#0CC5E8', desc: 'Disney+, Marvel, Star Wars, Pixar y Star. Calidad 4K con perfil premium. ¡Oferta por tiempo limitado!', price: 7.50, oldPrice: 15, sale: true, features: ['Calidad 4K UHD', '4 pantallas simultáneas', 'Incluye Star contenido', 'Garantía 30 días', '50% OFF — Oferta especial'] },
    { id: 'cr', name: 'Crunchyroll Mega Fan',  icon: 'CR', logo: 'logo-crunchyroll.jpg', color: '#F47521', desc: 'Anime sin anuncios, simulcast con Japón y descargas offline en HD. ¡Oferta por tiempo limitado!', price: 4, oldPrice: 8, sale: true, features: ['Sin anuncios', 'Simulcast Japón', 'Descargas offline', 'Acceso manga', '50% OFF — Oferta especial'] },
    { id: 'sp', name: 'Spotify Premium',       icon: 'SP', logo: 'logo-spotify.jpg',    color: '#1DB954', desc: 'Cuenta personal sin anuncios, descargas offline y saltos ilimitados. ¡Promo especial 3 meses por S/30!', price: 30, oldPrice: 45, sale: true, period: 'x 3 meses',
      customFields: {
          nameLabel: 'Nombre',
          nameHint: 'Tu nombre completo',
          namePlaceholder: 'Ej: Juan Pérez',
          secondLabel: 'Correo electrónico',
          secondHint: 'Te enviaremos los datos de la cuenta a este correo',
          secondType: 'email',
          secondPlaceholder: 'tu@correo.com'
      },
      urgency: 'SOLO QUEDAN 2 ÚLTIMOS CUPOS LIBRES',
      features: ['Cuenta personal', 'Sin anuncios', 'Descarga offline', 'Saltos ilimitados', 'Promo 3 meses — Antes S/45, ahora S/30'] },
    { id: 'am', name: 'Apple Combo', icon: 'AP', logo: null, color: '#FA2572',
      desc: 'Combo completo Apple: Apple Music + iCloud + Apple TV + Apple Arcade. Renovación mensual.',
      price: 20, period: 'x mes',
      bgImage: 'logo-applecombo.png',
      customFields: {
          nameLabel: 'Correo electrónico',
          nameHint: 'Te enviaremos los datos de la cuenta a este correo',
          namePlaceholder: 'tu@correo.com',
          nameType: 'email',
          hideSecond: true
      },
      features: ['Apple Music — audio sin pérdida', 'iCloud — almacenamiento en la nube', 'Apple TV — series y películas originales', 'Apple Arcade — +200 juegos sin anuncios', 'Renovación mensual automática', 'Garantía 30 días'] },
];

// ---------- REDES PRODUCTS (REMOVED) ----------
// User requested to remove "Crece en Redes" section entirely.
// Only streaming services are now shown.

const ALL_PRODUCTS = [...STREAMING_PRODUCTS];

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
// (redes pricing removed — only streaming flat prices used now)

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

function streamingCardHTML(p) {
    const isSoldOut = p.soldOut === true;
    const isOnSale = p.sale === true && !isSoldOut;
    const platformColor = p.color || '#fafafa';

    // Logo HTML: image if available, else text icon
    const logoHTML = p.logo
        ? `<img src="${p.logo}?v=15" alt="${escapeHtml(p.name)}" class="product-logo-img">`
        : `<div class="product-icon">${p.icon}</div>`;

    // Tag/badge in top-right corner
    let badge = '';
    if (isSoldOut) {
        badge = `<span class="product-tag tag-soldout">AGOTADO</span>`;
    } else if (isOnSale) {
        const saleLabel = p.period ? `PROMO ${p.period.toUpperCase().replace('X ', '')}` : 'OFERTA -50%';
        badge = `<span class="product-tag tag-sale">${saleLabel}</span>`;
    } else {
        badge = `<span class="product-tag">PERFIL</span>`;
    }

    // Price block
    let priceBlock = '';
    const periodLabel = p.period ? `<span class="price-period">${p.period}</span>` : '';
    if (isSoldOut) {
        priceBlock = `<div class="product-price price-soldout">${formatPrice(p.price)}${periodLabel}</div>`;
    } else if (isOnSale) {
        priceBlock = `
            <div class="product-price price-sale">
                <span class="price-old">${formatPrice(p.oldPrice)}${p.period ? ` ${p.period}` : ''}</span>
                <span class="price-new">${formatPrice(p.price)}${periodLabel}</span>
            </div>`;
    } else {
        priceBlock = `<div class="product-price">${formatPrice(p.price)}${periodLabel}</div>`;
    }

    // Button
    let button = '';
    if (isSoldOut) {
        button = `<button class="add-cart-btn btn-soldout" disabled type="button">AGOTADO</button>`;
    } else {
        button = `<button class="add-cart-btn" data-action="open-modal" data-id="${p.id}" data-type="streaming" type="button">ALQUILAR</button>`;
    }

    const cardClass = isSoldOut ? 'product-card soldout' : (isOnSale ? 'product-card onsale' : 'product-card');
    const cardExtraClass = p.bgImage ? ' has-bgimage' : '';
    const bgStyle = p.bgImage ? ` style="background-image: url('${p.bgImage}?v=15'); --platform-color: ${platformColor};"` : ` style="--platform-color: ${platformColor};"`;

    return `
        <article class="${cardClass}${cardExtraClass}" data-id="${p.id}"${bgStyle}>
            <div class="card-bg-overlay"></div>
            ${badge}
            ${logoHTML}
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
        $('#modalServicePrice').textContent = formatPrice(p.price) + (p.period ? `  (${p.period})` : '');

        // Apply custom field labels if present (e.g. Spotify uses "Nombre" + "Correo electrónico")
        const cf = p.customFields || {};
        const nameLabelEl = $('#profileNameLabel');
        const nameHintEl = $('#profileNameHint');
        const nameInput = $('#profileName');
        const pinLabelEl = $('#profilePinLabel');
        const pinHintEl = $('#profilePinHint');
        const pinInput = $('#profilePin');
        const pinFormGroup = pinInput ? pinInput.closest('.form-group') : null;

        if (nameLabelEl) nameLabelEl.textContent = cf.nameLabel || 'Nombre del perfil';
        if (nameHintEl) nameHintEl.textContent = cf.nameHint || 'Así aparecerá tu perfil dentro de la cuenta';
        if (nameInput) nameInput.placeholder = cf.namePlaceholder || 'Ej: Juan';
        if (nameInput) nameInput.maxLength = cf.namePlaceholder ? 100 : 20;

        // Configure name input type (email or text)
        if (cf.nameType === 'email') {
            nameInput.type = 'email';
            nameInput.inputMode = 'email';
            nameInput.dataset.mode = 'email';
        } else {
            nameInput.type = 'text';
            nameInput.inputMode = 'text';
            nameInput.dataset.mode = 'text';
        }

        // Hide the second field (PIN) entirely when cf.hideSecond is true
        if (cf.hideSecond) {
            if (pinFormGroup) pinFormGroup.style.display = 'none';
            pinInput.value = '';
            pinInput.required = false;
        } else {
            if (pinFormGroup) pinFormGroup.style.display = '';
            if (pinLabelEl) pinLabelEl.textContent = cf.secondLabel || 'PIN de 4 dígitos';
            if (pinHintEl) pinHintEl.textContent = cf.secondHint || 'PIN de seguridad para bloquear tu perfil';

            if (cf.secondType === 'email') {
                pinInput.type = 'email';
                pinInput.inputMode = 'email';
                pinInput.maxLength = 100;
                pinInput.pattern = '';
                pinInput.placeholder = cf.secondPlaceholder || 'tu@correo.com';
                pinInput.dataset.mode = 'email';
            } else {
                pinInput.type = 'text';
                pinInput.inputMode = 'numeric';
                pinInput.maxLength = 4;
                pinInput.pattern = '\\d{4}';
                pinInput.placeholder = '1234';
                pinInput.dataset.mode = 'pin';
            }
        }

        // Urgency banner
        const urgencyEl = $('#urgencyBanner');
        if (urgencyEl) {
            if (p.urgency) {
                urgencyEl.textContent = '⚠ ' + p.urgency;
                urgencyEl.style.display = 'block';
            } else {
                urgencyEl.style.display = 'none';
            }
        }
    }
    // (redes branch removed — only streaming products exist now)

    $('#modalOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const overlay = $('#modalOverlay');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
    pendingProduct = null;
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
            const nameLabel = item.nameLabel || 'Perfil';
            const secondLabel = item.secondLabel || 'PIN';
            meta = `
                <span class="cart-item-meta"><strong>${escapeHtml(nameLabel)}:</strong> ${escapeHtml(item.profileName)}</span>`;
            if (!item.hideSecond && item.profilePin) {
                meta += `
                <span class="cart-item-meta"><strong>${escapeHtml(secondLabel)}:</strong> ${escapeHtml(item.profilePin)}</span>`;
            }
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
        // Skip mask when in email mode
        if (e.target.dataset.mode === 'email') return;
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
    });

    // Name input (for Apple Combo) also has email mode — no mask needed, but we keep dataset.mode in sync
    const nameInput = $('#profileName');
    if (nameInput) {
        nameInput.addEventListener('input', (e) => {
            // No mask for email or text — just clear invalid state
            e.target.classList.remove('invalid');
        });
    }
}

// ---------- URGENT POPUP (Spotify Premium on load) ----------
const URGENT_PRODUCT_ID = 'sp'; // Spotify Premium x 3 meses
const URGENT_POPUP_KEY = 'vstg_popup_seen_v1'; // session flag

function openUrgentPopup() {
    const overlay = $('#popupOverlay');
    if (!overlay) return;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeUrgentPopup() {
    const overlay = $('#popupOverlay');
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
}

function bindUrgentPopup() {
    // Show popup after 1.5s if not seen in this session
    try {
        const seen = sessionStorage.getItem(URGENT_POPUP_KEY);
        if (!seen) {
            setTimeout(() => {
                openUrgentPopup();
                sessionStorage.setItem(URGENT_POPUP_KEY, '1');
            }, 1500);
        }
    } catch (e) {
        // sessionStorage might be blocked; show popup anyway
        setTimeout(openUrgentPopup, 1500);
    }

    // Close button
    const closeBtn = $('#popupClose');
    if (closeBtn) closeBtn.addEventListener('click', closeUrgentPopup);

    // Dismiss ("Seguir explorando")
    const dismissBtn = $('#popupDismiss');
    if (dismissBtn) dismissBtn.addEventListener('click', closeUrgentPopup);

    // Click outside to close
    const overlay = $('#popupOverlay');
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeUrgentPopup();
        });
    }

    // CTA button → smooth scroll to the Spotify card in the streaming section
    const ctaBtn = $('#popupCta');
    if (ctaBtn) {
        ctaBtn.addEventListener('click', () => {
            closeUrgentPopup();
            // Find the Spotify product card in the streaming grid
            const spotifyCard = document.querySelector('[data-id="sp"]');
            if (spotifyCard) {
                setTimeout(() => {
                    const top = spotifyCard.getBoundingClientRect().top + window.pageYOffset - 80;
                    window.scrollTo({ top, behavior: 'smooth' });
                    // Briefly highlight the card to draw attention
                    setTimeout(() => {
                        spotifyCard.classList.add('card-highlight');
                        setTimeout(() => spotifyCard.classList.remove('card-highlight'), 2000);
                    }, 700);
                }, 300);
            } else {
                // Fallback: scroll to streaming section
                const streamingSection = document.getElementById('streaming');
                if (streamingSection) {
                    const top = streamingSection.getBoundingClientRect().top + window.pageYOffset - 60;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            }
        });
    }
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
        const p = findProduct(id);
        const cf = p.customFields || {};
        const nameInput = $('#profileName');
        const pinInput = $('#profilePin');
        const name = nameInput.value.trim();
        const secondValue = cf.hideSecond ? '' : pinInput.value.trim();
        const nameLabel = cf.nameLabel || 'Nombre del perfil';
        const secondLabel = cf.secondLabel || 'PIN';
        const secondType = cf.secondType || 'pin';
        const nameType = cf.nameType || 'text';

        let valid = true;
        // Validate the first field (name or email)
        if (nameType === 'email') {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(name)) {
                nameInput.classList.add('invalid'); valid = false;
            } else nameInput.classList.remove('invalid');
        } else {
            if (name.length < 2 || name.length > 50) {
                nameInput.classList.add('invalid'); valid = false;
            } else nameInput.classList.remove('invalid');
        }

        // Validate the second field (only when not hidden)
        if (!cf.hideSecond) {
            if (secondType === 'email') {
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(secondValue)) {
                    pinInput.classList.add('invalid'); valid = false;
                } else pinInput.classList.remove('invalid');
            } else {
                if (!/^\d{4}$/.test(secondValue)) { pinInput.classList.add('invalid'); valid = false; }
                else pinInput.classList.remove('invalid');
            }
        } else {
            pinInput.classList.remove('invalid');
        }

        if (!valid) { showToast('Revisa los datos ingresados'); return; }

        // For Apple Combo (hideSecond), use empty string for profilePin
        addToCart({
            id, type: 'streaming',
            price: p.price,
            profileName: name,
            profilePin: secondValue,
            nameLabel,
            secondLabel,
            hideSecond: !!cf.hideSecond
        });
    }
    // (redes branch removed — only streaming products exist now)

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
            const nameLabel = item.nameLabel || 'Nombre del perfil';
            const secondLabel = item.secondLabel || 'PIN';
            const periodLabel = p.period ? ` ${p.period}` : '';
            msg += `%0A${i + 1}. ${p.name}%0A`;
            msg += `   Precio: ${formatPrice(item.price)}${encodeURIComponent(periodLabel)}%0A`;
            msg += `   ${encodeURIComponent(nameLabel)}: ${encodeURIComponent(item.profileName)}%0A`;
            if (!item.hideSecond && item.profilePin) {
                msg += `   ${encodeURIComponent(secondLabel)}: ${encodeURIComponent(item.profilePin)}%0A`;
            }
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

    // Other UI bindings
    bindNavbarScroll();
    bindMobileMenu();
    bindReveal();
    animateCounters();
    bindPinInput();

    // Bind urgent popup (Spotify Premium promo on load)
    bindUrgentPopup();

    // ESC closes everything
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCart();
            closeModal();
            closeUrgentPopup();
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
