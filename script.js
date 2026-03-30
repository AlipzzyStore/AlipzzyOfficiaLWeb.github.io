// --- Data Produk ---
const products = [
    {
        id: 1,
        name: "[ sᴄʀɪᴘᴛ ʙᴏᴛ ᴡᴀ ᴍᴅ ]",
        variants: [
            { price: 30000, features: ["Free Req Nama/No/Owner/Logo", "Get Enc Script", "2 Fitur Bebas"] },
            { price: 50000, features: ["Free Req Lengkap", "Get No Enc + Enc", "5 Fitur Bebas", "Prefix Menu", "Panel Unli 1 Bulan"] }
        ]
    },
    {
        id: 2,
        name: "[ sᴄʀɪᴘᴛ ʙᴜɢ ᴠɪᴀ ᴛᴇʟᴇɢʀᴀᴍ ]",
        variants: [{ price: 30000, features: ["Free Req Data Bot/Owner", "1 Function Bug Random", "Get Enc & No Enc", "1 Fitur Bebas"] }]
    },
    {
        id: 3,
        name: "[ ᴀᴘᴋ ʙᴜɢ ]",
        variants: [{ price: 110000, features: ["Full Custom Data & Gambar", "5 Fitur Spesial", "Chat Global", "Function Bug 2", "100% Responsif", "No Enc File"] }]
    },
    {
        id: 4,
        name: "[ ᴡᴇʙsɪᴛᴇ ᴘᴏʀᴛᴏғᴏʟɪᴏ ]",
        variants: [{ price: 20000, features: ["Anti DDoS", "Professional Design", "Free Subdomain", "All Device Responsive", "Server 24 Jam"] }]
    },
    {
        id: 5,
        name: "[ ᴡᴇʙsɪᴛᴇ sᴛᴏʀᴇ ]",
        variants: [{ price: 300000, features: ["Modern & Clean UI", "Integrasi Payment", "Admin Panel", "Digital/Physical Product", "Free Revisi"] }]
    },
    {
        id: 6,
        name: "[ ᴡᴇʙsɪᴛᴇ ᴘᴀʏᴍᴇɴᴛ ᴊʙ/ʜᴏsᴛɪɴɢ ᴅʟʟ ]",
        variants: [{ price: 50000, features: ["Payment Manual", "Form Order + Invoice", "Notif Otomatis", "Admin Panel", "Mobile Friendly"] }]
    }
];

// --- State ---
let cart = [];
let currentPayment = null;
let timerInterval = null;
const OWNER_PIN = "1945201011121314";

// --- Initialization ---
window.onload = () => {
    lucide.createIcons();
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.transition = '1s';
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            document.getElementById('main-content').classList.remove('hidden');
            renderProducts();
        }, 1000);
    }, 6000); // Sesuai durasi video permintaan
};

// --- View Controller ---
function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    document.getElementById(`view-${viewId}`).classList.remove('hidden');
    window.scrollTo(0,0);
}

// --- Render Logic ---
function renderProducts() {
    const list = document.getElementById('product-list');
    list.innerHTML = products.map(p => {
        return p.variants.map((v, idx) => `
            <div class="card">
                <h3>${p.name} ${p.variants.length > 1 ? `(V${idx+1})` : ''}</h3>
                <span class="price-tag">Rp${v.price.toLocaleString()}</span>
                <ul>
                    ${v.features.map(f => `<li>➥ ${f}</li>`).join('')}
                </ul>
                <div class="card-btns">
                    <button class="btn-cart" onclick="addToCart(${p.id}, ${idx})">Keranjang</button>
                    <button class="btn-buy" onclick="buyNow(${p.id}, ${idx})">Buy Now</button>
                </div>
            </div>
        `).join('');
    }).join('');
}

// --- Cart Logic ---
function addToCart(pId, vIdx) {
    const p = products.find(x => x.id === pId);
    const item = { ...p, selected: p.variants[vIdx], cartId: Date.now() };
    cart.push(item);
    updateCartUI();
}

function updateCartUI() {
    const count = document.getElementById('cart-count');
    const items = document.getElementById('cart-items');
    const total = document.getElementById('cart-total');
    
    count.innerText = cart.length;
    let sum = 0;
    
    items.innerHTML = cart.map(item => {
        sum += item.selected.price;
        return `
            <div class="cart-item">
                <div>
                    <p>${item.name}</p>
                    <small>Rp${item.selected.price.toLocaleString()}</small>
                </div>
                <button onclick="removeFromCart(${item.cartId})"><i data-lucide="trash-2"></i></button>
            </div>
        `;
    }).join('');
    
    total.innerText = `Rp${sum.toLocaleString()}`;
    lucide.createIcons();
}

function removeFromCart(id) {
    cart = cart.filter(x => x.cartId !== id);
    updateCartUI();
}

function toggleCart() {
    document.getElementById('cart-drawer').classList.toggle('active');
}

// --- Payment Logic ---
function buyNow(pId, vIdx) {
    const p = products.find(x => x.id === pId);
    currentPayment = { name: p.name, price: p.variants[vIdx].price };
    startPayment();
}

function startPayment() {
    showView('payment');
    const detail = document.getElementById('payment-detail');
    detail.innerHTML = `
        <div class="pay-info">
            <p>Produk: <strong>${currentPayment.name}</strong></p>
            <p>Total: <strong style="color:var(--primary); font-size:1.5rem">Rp${currentPayment.price.toLocaleString()}</strong></p>
        </div>
    `;
    
    let time = 300;
    const timerDisplay = document.getElementById('payment-timer');
    
    if(timerInterval) clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        let min = Math.floor(time / 60);
        let sec = time % 60;
        timerDisplay.innerText = `${min < 10 ? '0'+min : min}:${sec < 10 ? '0'+sec : sec}`;
        
        if(time <= 0) {
            clearInterval(timerInterval);
            alert("Waktu habis! Silakan pesan ulang.");
            showView('home');
        }
        time--;
    }, 1000);
}

function verifyPayment() {
    const msg = `Halo Alipzzy, saya ingin konfirmasi pembayaran:\n\nProduk: ${currentPayment.name}\nHarga: Rp${currentPayment.price.toLocaleString()}\n\nBerikut bukti transfernya:`;
    window.open(`https://wa.me/6281399649577?text=${encodeURIComponent(msg)}`, '_blank');
}

// --- Owner Panel Logic ---
function openPinModal() { document.getElementById('pin-modal').classList.add('active'); }
function closePinModal() { document.getElementById('pin-modal').classList.remove('active'); }

function checkPin() {
    const input = document.getElementById('pin-input').value;
    if(input === OWNER_PIN) {
        closePinModal();
        showView('owner');
    } else {
        alert("PIN Salah!");
    }
}

function postAnnouncement() {
    const input = document.getElementById('ann-input');
    const list = document.getElementById('announcement-list');
    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' });
    
    if(!input.value) return;
    
    const div = document.createElement('div');
    div.className = 'ann-card';
    div.innerHTML = `<small>${dateStr}</small><p>${input.value}</p>`;
    list.prepend(div);
    input.value = '';
    alert("Informasi dikirim secara global!");
}
