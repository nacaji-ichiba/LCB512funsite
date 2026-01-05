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
        // 修正：source-overでの黒塗りつぶしを廃止。
        // これにより、Canvas自体を透明にし、CSSの背景色を透過させます。
        ctx.clearRect(0, 0, canvas.width, canvas.height); 

        colors.forEach((color, i) => {
            // （中略：既存のグラデーション描画処理）
            
            ctx.globalCompositeOperation = 'lighter';
            ctx.fillStyle = grd;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
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
        threshold: 0.8
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
    // 右クリックされた要素、またはその親要素に .no-save があるかチェック
    const isNoSave = e.target.closest('.no-save');
    
    if (isNoSave) {
        e.preventDefault(); // ブラウザ標準メニューを阻止
        e.stopPropagation(); // イベントの拡散を阻止
        alert('触るな');
        return false;
    }
}, true); // true (キャプチャリング) を指定して、ブラウザの挙動より先に割り込む

// ドラッグも同様に防止
window.addEventListener('dragstart', (e) => {
    if (e.target.closest('.no-save')) {
        e.preventDefault();
    }
}, true);
});