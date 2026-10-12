// ============================================================
// 1. GLOW CURSOR
// ============================================================
const cursor = document.getElementById('glowCursor');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

document.querySelectorAll('button, a, .kpi-card, .strategy-card, .car-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
});

// ============================================================
// 2. BG PARTICLES
// ============================================================
const bgCanvas = document.getElementById('bgCanvas');
const bgCtx = bgCanvas.getContext('2d');
let bgParticles = [];

function resizeBg() {
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
}
resizeBg();
window.addEventListener('resize', resizeBg);

class BgParticle {
    constructor() {
        this.x = Math.random() * bgCanvas.width;
        this.y = Math.random() * bgCanvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.4 + 0.1;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > bgCanvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > bgCanvas.height) this.speedY *= -1;
    }
    draw() {
        bgCtx.beginPath();
        bgCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        bgCtx.fillStyle = `rgba(241,196,15,${this.opacity})`;
        bgCtx.fill();
    }
}

for (let i = 0; i < 120; i++) {
    bgParticles.push(new BgParticle());
}

function animateBg() {
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    bgParticles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateBg);
}
animateBg();

// ============================================================
// 3. FIREWORKS (MUSHAKLAR)
// ============================================================
const fwCanvas = document.getElementById('fireworksCanvas');
const fwCtx = fwCanvas.getContext('2d');
let fireworks = [];
let fwParticles = [];

function resizeFw() {
    fwCanvas.width = window.innerWidth;
    fwCanvas.height = window.innerHeight;
}
resizeFw();
window.addEventListener('resize', resizeFw);

class Firework {
    constructor() {
        this.x = Math.random() * fwCanvas.width;
        this.y = fwCanvas.height;
        this.targetY = Math.random() * fwCanvas.height * 0.4 + 50;
        this.speed = 4 + Math.random() * 4;
        this.color = `hsl(${Math.random() * 360}, 80%, 60%)`;
        this.trail = [];
        this.exploded = false;
    }
    update() {
        if (!this.exploded) {
            this.trail.push({ x: this.x, y: this.y });
            if (this.trail.length > 10) this.trail.shift();
            this.y -= this.speed;
            if (this.y <= this.targetY) {
                this.explode();
            }
        }
    }
    explode() {
        this.exploded = true;
        const count = 60 + Math.floor(Math.random() * 60);
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count + Math.random() * 0.2;
            const speed = 2 + Math.random() * 6;
            fwParticles.push({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                decay: 0.008 + Math.random() * 0.015,
                color: this.color,
                size: 2 + Math.random() * 4
            });
        }
    }
    draw() {
        if (!this.exploded) {
            fwCtx.beginPath();
            fwCtx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            fwCtx.fillStyle = '#fff';
            fwCtx.fill();
            this.trail.forEach((p, i) => {
                fwCtx.beginPath();
                fwCtx.arc(p.x, p.y, i / 3, 0, Math.PI * 2);
                fwCtx.fillStyle = `rgba(255,255,255,${i / this.trail.length * 0.3})`;
                fwCtx.fill();
            });
        }
    }
}

function createFireworks() {
    if (fireworks.length < 8 && Math.random() < 0.3) {
        fireworks.push(new Firework());
    }
}

function updateFireworks() {
    fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
    
    fireworks.forEach(fw => {
        fw.update();
        fw.draw();
    });
    fireworks = fireworks.filter(fw => !fw.exploded);
    
    fwParticles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.life -= p.decay;
        fwCtx.beginPath();
        fwCtx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        fwCtx.fillStyle = p.color;
        fwCtx.globalAlpha = p.life;
        fwCtx.fill();
        fwCtx.globalAlpha = 1;
    });
    fwParticles = fwParticles.filter(p => p.life > 0);
}

let fwInterval;

function startFireworks() {
    if (fwInterval) return;
    fwInterval = setInterval(() => {
        createFireworks();
        updateFireworks();
    }, 50);
}

function stopFireworks() {
    clearInterval(fwInterval);
    fwInterval = null;
    fireworks = [];
    fwParticles = [];
    fwCtx.clearRect(0, 0, fwCanvas.width, fwCanvas.height);
}

// ============================================================
// 4. SUN MODE (QUYOSH REJIMI)
// ============================================================
let isSun = false;

function toggleSun() {
    isSun = !isSun;
    const body = document.body;
    const icon = document.getElementById('sunIcon');
    const overlay = document.getElementById('sunOverlay');
    
    overlay.classList.add('active');
    
    if (isSun) {
        icon.textContent = '☀️';
        body.style.background = 'linear-gradient(180deg, #fff8e7, #ffecd2)';
        body.style.color = '#2c1810';
        document.querySelectorAll('.hero-title, .section-header h2, .kpi-num, .stat-num, .finance-card h4, .tl-content h4, .cta-content h2').forEach(el => {
            el.style.color = '#2c1810';
        });
        document.querySelectorAll('.hero-desc, .f-stat, .tl-content p, .test-card p, .cta-content p, .car-card .car-desc, .car-card .car-year, .kpi-lbl, .kpi-sub').forEach(el => {
            el.style.color = '#6b4f3a';
        });
        document.querySelectorAll('.kpi-card, .strategy-card, .finance-table-wrap, .finance-card, .tl-content, .test-card, .car-card').forEach(el => {
            el.style.background = 'rgba(255,255,255,0.85)';
            el.style.backdropFilter = 'blur(10px)';
        });
        document.querySelectorAll('.status, .sc-tags span, .car-card .car-tags span').forEach(el => {
            el.style.background = 'rgba(0,0,0,0.05)';
        });
        localStorage.setItem('sunMode', 'active');
    } else {
        icon.textContent = '🌙';
        body.style.background = '';
        body.style.color = '';
        document.querySelectorAll('.hero-title, .section-header h2, .kpi-num, .stat-num, .finance-card h4, .tl-content h4, .cta-content h2').forEach(el => {
            el.style.color = '';
        });
        document.querySelectorAll('.hero-desc, .f-stat, .tl-content p, .test-card p, .cta-content p, .car-card .car-desc, .car-card .car-year, .kpi-lbl, .kpi-sub').forEach(el => {
            el.style.color = '';
        });
        document.querySelectorAll('.kpi-card, .strategy-card, .finance-table-wrap, .finance-card, .tl-content, .test-card, .car-card').forEach(el => {
            el.style.background = '';
            el.style.backdropFilter = '';
        });
        document.querySelectorAll('.status, .sc-tags span, .car-card .car-tags span').forEach(el => {
            el.style.background = '';
        });
        localStorage.setItem('sunMode', 'inactive');
    }
    
    setTimeout(() => overlay.classList.remove('active'), 2500);
    createSunBurst();
}

function createSunBurst() {
    for (let i = 0; i < 50; i++) {
        const p = document.createElement('div');
        const angle = Math.random() * Math.PI * 2;
        const dist = 100 + Math.random() * 400;
        p.style.cssText = `
            position: fixed;
            width: ${4 + Math.random() * 10}px;
            height: ${4 + Math.random() * 10}px;
            background: radial-gradient(circle, #ffdd00, #f5a623);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9997;
            left: 50%; top: 50%;
            transform: translate(-50%, -50%);
            animation: burstOut ${0.8 + Math.random() * 0.8}s ease-out forwards;
            --tx: ${Math.cos(angle) * dist}px;
            --ty: ${Math.sin(angle) * dist}px;
            --s: ${0.5 + Math.random()};
        `;
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 2000);
    }
}

// ============================================================
// 5. SIMULATION
// ============================================================
function startSim() {
    const overlay = document.getElementById('simOverlay');
    const fill = document.getElementById('simFill');
    const pct = document.getElementById('simPct');
    
    overlay.classList.add('active');
    startFireworks();
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 4 + 1;
        if (progress > 100) progress = 100;
        fill.style.width = progress + '%';
        pct.textContent = Math.round(progress) + '%';
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                overlay.classList.remove('active');
                stopFireworks();
                simulateGrowth();
                showNotif('✅ Simulyatsiya yakunlandi!');
            }, 500);
        }
    }, 80);
}

// ============================================================
// 6. GROWTH SIMULATION
// ============================================================
function simulateGrowth() {
    document.querySelectorAll('.kpi-num').forEach(el => {
        const target = parseInt(el.dataset.target);
        el.style.transition = 'all 0.3s ease';
        el.style.transform = 'scale(1.3)';
        el.style.color = '#f1c40f';
        setTimeout(() => {
            el.style.transform = 'scale(1)';
            el.style.color = '';
        }, 500);
    });
    
    updateTable();
    updateStats();
    
    const ring = document.querySelector('.ring-wrap circle:last-child');
    if (ring) {
        const p = Math.floor(Math.random() * 30) + 55;
        const circ = 2 * Math.PI * 50;
        ring.style.strokeDashoffset = circ - (p / 100) * circ;
        document.getElementById('ringPercent').textContent = p + '%';
    }
}

// ============================================================
// 7. TABLE UPDATE
// ============================================================
function updateTable() {
    const rows = document.querySelectorAll('#financeTable tr');
    const data = [
        { s: 2, r: 1500, c: 4300, p: -2800, st: 'danger' },
        { s: 4, r: 3000, c: 4300, p: -1300, st: 'danger' },
        { s: 6, r: 4500, c: 4300, p: 200, st: 'warning' },
        { s: 8, r: 6000, c: 4500, p: 1500, st: 'success' },
        { s: 10, r: 7500, c: 4600, p: 2900, st: 'success' },
        { s: 13, r: 9800, c: 4800, p: 5000, st: 'success' }
    ];
    
    rows.forEach((row, i) => {
        if (i < data.length) {
            const cells = row.querySelectorAll('td');
            const d = data[i];
            cells[0].textContent = i + 1;
            cells[1].textContent = d.s;
            cells[2].textContent = '$' + d.r.toLocaleString();
            cells[3].textContent = '$' + d.c.toLocaleString();
            const pCell = cells[4];
            pCell.textContent = (d.p >= 0 ? '+' : '') + '$' + d.p.toLocaleString();
            pCell.className = d.p >= 0 ? 'profit' : 'loss';
            const statusMap = { danger: 'Investitsiya', warning: "Turg'unlik", success: "O'sish" };
            cells[5].innerHTML = `<span class="status ${d.st}">${statusMap[d.st]}</span>`;
        }
    });
}

function updateStats() {
    const r = Math.floor(Math.random() * 5000) + 22000;
    const c = Math.floor(Math.random() * 3000) + 24000;
    document.getElementById('totalRev').textContent = '$' + r.toLocaleString();
    document.getElementById('totalCost').textContent = '$' + c.toLocaleString();
    const p = r - c;
    document.getElementById('totalProfit').textContent = (p >= 0 ? '+' : '') + '$' + p.toLocaleString();
}

// ============================================================
// 8. CARS SECTION
// ============================================================
const carsData = [
    { emoji: '🚗', name: 'Chevrolet Cobalt', year: '2024', price: '$12,500', desc: 'Yangi, ekonom klass, 1.5L dvigatel', tags: ['Yangi', 'Ekonom', 'Kredit'] },
    { emoji: '🚙', name: 'KIA K5', year: '2023', price: '$22,800', desc: '3 yoshgacha, premium salon, 2.0L', tags: ['Premium', '3 yoshgacha', 'Lizing'] },
    { emoji: '🏎️', name: 'Toyota Camry', year: '2024', price: '$31,500', desc: 'Yangi, biznes klass, gibrid', tags: ['Yangi', 'Biznes', 'Gibrid'] },
    { emoji: '🚘', name: 'Hyundai Elantra', year: '2023', price: '$18,200', desc: '3 yoshgacha, qulay, tejamkor', tags: ['3 yoshgacha', 'Tejamkor', 'Kredit'] },
    { emoji: '🚙', name: 'BMW X5', year: '2022', price: '$45,000', desc: 'Premium SUV, 3.0L, 4x4', tags: ['Premium', 'SUV', 'Lizing'] },
    { emoji: '🚗', name: 'Nissan Sentra', year: '2024', price: '$16,800', desc: 'Yangi, yengil, shaharlik', tags: ['Yangi', 'Shaharlik', 'Ekonom'] }
];

function renderCars() {
    const grid = document.getElementById('carsGrid');
    grid.innerHTML = '';
    carsData.forEach((car, index) => {
        const card = document.createElement('div');
        card.className = 'car-card';
        card.style.animationDelay = (index * 100) + 'ms';
        card.innerHTML = `
            <span class="car-emoji">${car.emoji}</span>
            <h3>${car.name}</h3>
            <div class="car-year">${car.year}</div>
            <div class="car-price">${car.price}</div>
            <div class="car-desc">${car.desc}</div>
            <div class="car-tags">${car.tags.map(t => `<span>${t}</span>`).join('')}</div>
            <button class="car-btn" onclick="showNotif('📞 ${car.name} bo\'yicha ma\'lumot so\'raldi!')">Batafsil</button>
        `;
        grid.appendChild(card);
        setTimeout(() => card.classList.add('visible'), 100 + index * 150);
    });
}

function showCars() {
    document.getElementById('cars').scrollIntoView({ behavior: 'smooth' });
    setTimeout(renderCars, 500);
}

// ============================================================
// 9. SHOW GOAL
// ============================================================
function showGoal() {
    const msg = `
🎯 12 OYLIK MAQSAD:

📅 1-3 oy: 4 ta mashina, SMM, $500 marja
🚀 4-6 oy: 8-10 ta mashina, kredit, sug'urta
💪 7-9 oy: 20 ta mashina, kengayish
🏆 10-12 oy: 30 ta mashina, $15,000 foyda

💰 12-oy yakunida: $15,000 sof foyda!
    `;
    
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed; inset: 0; z-index: 9999;
        background: rgba(0,0,0,0.8); backdrop-filter: blur(20px);
        display: flex; align-items: center; justify-content: center;
        animation: fadeIn 0.3s ease;
    `;
    const content = document.createElement('div');
    content.style.cssText = `
        background: var(--bg); border: 1px solid var(--border);
        border-radius: 24px; padding: 40px; max-width: 600px;
        max-height: 80vh; overflow-y: auto;
        box-shadow: 0 40px 100px rgba(0,0,0,0.6);
        animation: slideUp 0.4s ease;
    `;
    content.innerHTML = `
        <h2 style="font-size:28px; margin-bottom:20px; color:#fff;">🎯 Maqsadga erishish yo'li</h2>
        <div style="white-space:pre-line; line-height:1.8; color:var(--text2);">${msg}</div>
        <button onclick="this.closest('div[style]').parentElement.remove()" 
                style="margin-top:24px; background:var(--accent); color:var(--bg); 
                       border:none; padding:12px 32px; border-radius:50px; font-weight:700; 
                       font-size:16px; cursor:pointer; transition:all 0.3s;">
            Yopish ✕
        </button>
    `;
    modal.appendChild(content);
    document.body.appendChild(modal);
    modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
}

// ============================================================
// 10. NOTIFICATION
// ============================================================
function showNotif(msg) {
    const n = document.createElement('div');
    n.style.cssText = `
        position: fixed; bottom: 30px; right: 30px; z-index: 9998;
        background: var(--bg); border: 1px solid var(--accent);
        color: #fff; padding: 16px 28px; border-radius: 12px;
        font-weight: 600; box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        animation: slideIn 0.5s ease;
        border-left: 4px solid var(--accent);
        max-width: 400px;
    `;
    n.textContent = msg;
    document.body.appendChild(n);
    setTimeout(() => {
        n.style.opacity = '0';
        n.style.transition = 'opacity 0.5s';
        setTimeout(() => n.remove(), 500);
    }, 4000);
}

// ============================================================
// 11. SCROLL FUNCTIONS
// ============================================================
function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// ============================================================
// 12. KPI ANIMATION
// ============================================================
function animateKPI() {
    document.querySelectorAll('.kpi-card').forEach((card, i) => {
        setTimeout(() => {
            card.classList.add('visible');
        }, parseInt(card.dataset.delay) || i * 100);
    });
}

// ============================================================
// 13. SCROLL HANDLER
// ============================================================
function handleScroll() {
    document.querySelectorAll('.strategy-card, .test-card, .tl-item').forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            setTimeout(() => {
                el.style.animation = `fadeUp 0.6s ease forwards`;
            }, i * 100);
        }
    });
}

// ============================================================
// 14. NAVBAR SCROLL
// ============================================================
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
    handleScroll();
});

// ============================================================
// 15. KEYBOARD SHORTCUTS
// ============================================================
document.addEventListener('keydown', e => {
    if (e.key === 's' || e.key === 'S') startSim();
    if (e.key === 'g' || e.key === 'G') showGoal();
    if (e.key === 't' || e.key === 'T') toggleSun();
    if (e.key === 'c' || e.key === 'C') showCars();
});

// ============================================================
// 16. INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    animateKPI();
    handleScroll();
    renderCars();
    
    if (localStorage.getItem('sunMode') === 'active') {
        setTimeout(toggleSun, 500);
    }
    
    console.log('🚗 Avto-Bozor 24 ULTIMATE PREMIUM');
    console.log('⌨️ S - Simulyatsiya | G - Maqsad | T - Quyosh | C - Mashinalar');
});

// ============================================================
// 17. ADD CSS ANIMATIONS
// ============================================================
const styleAnim = document.createElement('style');
styleAnim.textContent = `
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(30px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
    @keyframes slideIn { from { opacity: 0; transform: translateX(100px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes burstOut {
        0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(var(--s)); }
    }
    @keyframes fadeUp {
        from { opacity: 0; transform: translateY(40px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(styleAnim);