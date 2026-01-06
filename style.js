window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.querySelector('.canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const colors = ["#00ee67ff", "#0400ffff", "#00660c", "#057eff"];
    let time = 0;

// style.js 内の resize 関数を以下に差し替え
function resize() {
    // 画面のピクセル比を考慮（ぼやけと隙間の防止）
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    
    // 表示サイズは CSS で制御
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    
    // 描画コンテキストのスケールを調整
    ctx.scale(dpr, dpr);
}
    window.addEventListener('resize', resize);
    resize();

    function hexToRgb(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return { r, g, b };
    }

function draw() {
    time += 0.002;
    ctx.clearRect(0, 0, canvas.width, canvas.height); 

    const dpr = window.devicePixelRatio || 1;

    colors.forEach((color, i) => {
        const rgb = hexToRgb(color);
        
        // 座標計算：物理ピクセルではなく論理ピクセルベースで計算してからDPRを掛ける
        const rawX = window.innerWidth * (0.5 + 0.35 * Math.cos(time + i * 1.5));
        const rawY = window.innerHeight * (0.5 + 0.35 * Math.sin(time * 0.8 + i * 2));
        
        // 描画サイズ：画面全体を覆うのに十分な大きさに（1.2倍程度）
        const radius = Math.max(window.innerWidth, window.innerHeight) * 1.2;
        
        const grd = ctx.createRadialGradient(rawX, rawY, 0, rawX, rawY, radius);
        grd.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4)`);
        grd.addColorStop(1, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0)`);

        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    });
    requestAnimationFrame(draw);
}
    draw();

    // particles.js の設定
    if (typeof particlesJS !== 'undefined') {
        particlesJS("particles-js", {
            "particles": {
                "number": { "value": 80 },
                "color": { "value": "#ffffff" },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.5 },
                "size": { "value": 2 },
                "line_linked": { "enable": false },
                "move": { "enable": true, "speed": 1 }
            },
            "interactivity": {
                "detect_on": "window",
                "events": { "onhover": { "enable": true, "mode": "bubble" }, "onclick": { "enable": true, "mode": "repulse" } },
                "modes": { "bubble": { "size": 6 }, "repulse": { "distance": 200 } }
            }
        });
    }

    // スクロール監視：ふわっと表示される挙動
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, {
        threshold: 0.5
    });

    revealElements.forEach(el => observer.observe(el));

    // スクロール時にヘッダー背景を表示
    const nav = document.querySelector('.main-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // マグネティック効果
    const magneticElements = document.querySelectorAll('[data-magneticbtn]');

    magneticElements.forEach(element => {
        const thumb = element.querySelector('.thumb');
        
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const moveX = (x - centerX) / centerX * 20;
            const moveY = (y - centerY) / centerY * 20;
            
            thumb.style.transform = `translate3d(${moveX}px, ${moveY}px, 0px)`;
        });
        
        element.addEventListener('mouseleave', () => {
            thumb.style.transform = 'translate3d(0px, 0px, 0px)';
        });
        
        element.addEventListener('touchstart', (e) => {
            const rect = element.getBoundingClientRect();
            const touch = e.touches[0];
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const moveX = (x - centerX) / centerX * 15;
            const moveY = (y - centerY) / centerY * 15;
            
            thumb.style.transform = `translate3d(${moveX}px, ${moveY}px, 0px)`;
            
            setTimeout(() => {
                thumb.style.transform = 'translate3d(0px, 0px, 0px)';
            }, 1500);
        }, { passive: true });
    });

    // シェアボタンの機能（★この部分を追加★）
    const pageUrl = encodeURIComponent(window.location.href);
    const pageTitle = encodeURIComponent(document.title || 'このサイトをチェック！');

    // X (Twitter) シェア
    const shareTwitterBtn = document.getElementById('shareTwitter');
    if (shareTwitterBtn) {
        shareTwitterBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const twitterUrl = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`;
            window.open(twitterUrl, '_blank', 'noopener,noreferrer,width=550,height=450');
        });
    }

    // Facebook シェア
    const shareFacebookBtn = document.getElementById('shareFacebook');
    if (shareFacebookBtn) {
        shareFacebookBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
            window.open(facebookUrl, '_blank', 'noopener,noreferrer,width=550,height=450');
        });
    }

    // Bluesky シェア
    const shareBlueskyBtn = document.getElementById('shareBluesky');
    if (shareBlueskyBtn) {
        shareBlueskyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const blueskyUrl = `https://bsky.app/intent/compose?text=${pageTitle}%20${pageUrl}`;
            window.open(blueskyUrl, '_blank', 'noopener,noreferrer,width=550,height=450');
        });
    }

// window全体で右クリックを監視し、.no-save内であれば即座にブロックする
window.addEventListener('contextmenu', (e) => {
   // フォーム要素以外はすべて禁止
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        // 画像エリア（.no-save）だった場合は警告を出す（既存の挙動を維持）
        if (e.target.closest('.no-save')) {
            alert('画像の保存は禁止されています');
        }
        return false;
    }
}, true); // true (キャプチャリング) を指定して、ブラウザの挙動より先に割り込む

// テキストコピー操作の禁止
window.addEventListener('copy', (e) => {
    // フォーム要素以外でのコピーを阻止
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        // alert('コピーは禁止されています'); // 必要なら警告を出す
        return false;
    }
}, true);

// ドラッグ（画像の持ち出しなど）の禁止
window.addEventListener('dragstart', (e) => {
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
    }
}, true);

// Initialize Lenis
const lenis = new Lenis();

// Use requestAnimationFrame to continuously update the scroll
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// ピンチズーム（2本指操作）を禁止する
document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) {
        e.preventDefault();
    }
}, { passive: false });

// ダブルタップズームを禁止する（iOS対策）
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);
});