/* ============================================================
   青迹 QINGJI ATELIER — 回南天送自由水 售后网站
   交互脚本 script.js
   功能：加载动画 / 回南天雨雾粒子 / 金色尘埃 / 鼠标光晕 /
        打字机 / 滚动揭示 / 导航栏效果 / 移动端菜单 /
        返回顶部 / 香水卡片交互 / 液体晃动
   ============================================================ */

(function () {
    'use strict';

    // JS成功加载后启用揭示动画（如果JS失败，内容默认可见）
    document.body.classList.add('reveal-init');

    /* ========================================================
       1. 页面加载动画
       ======================================================== */
    const loader = document.getElementById('loader');
    const loaderProgress = document.getElementById('loaderProgress');

    // 模拟加载进度
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(loadingInterval);
            // 延迟隐藏加载层，让动画更自然
            setTimeout(() => {
                loader.classList.add('hidden');
                // 加载完成后启动打字机效果
                setTimeout(startTypewriter, 500);
                // 强制揭示所有元素，确保内容可见
                setTimeout(() => {
                    document.querySelectorAll('.reveal').forEach(el => {
                        el.classList.add('visible');
                    });
                }, 600);
            }, 400);
        }
        loaderProgress.style.width = progress + '%';
    }, 150);

    /* ========================================================
       2. 打字机效果（英雄区引言）
       ======================================================== */
    const typewriterEl = document.getElementById('typewriter');
    const typewriterTexts = [
        '我知道你浅薄如锈铁，但我仍走向你。',
        '我知道你灵魂有缺口，但我仍走向你。',
        '爱，是我们共谋的那场窒息，是亲手为彼此戴上的枷锁。'
    ];

    let currentTextIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;

    function startTypewriter() {
        typeText();
    }

    function typeText() {
        const currentText = typewriterTexts[currentTextIndex];

        if (!isDeleting) {
            // 打字阶段
            currentCharIndex++;
            typewriterEl.textContent = currentText.substring(0, currentCharIndex);

            if (currentCharIndex === currentText.length) {
                // 打完一段，停顿后开始删除
                isDeleting = true;
                setTimeout(typeText, 2500);
                return;
            }
            setTimeout(typeText, 80 + Math.random() * 40);
        } else {
            // 删除阶段
            currentCharIndex--;
            typewriterEl.textContent = currentText.substring(0, currentCharIndex);

            if (currentCharIndex === 0) {
                // 删除完毕，切换到下一段
                isDeleting = false;
                currentTextIndex = (currentTextIndex + 1) % typewriterTexts.length;
                setTimeout(typeText, 500);
                return;
            }
            setTimeout(typeText, 30);
        }
    }

    /* ========================================================
       3. 回南天 · 雨滴粒子效果
       ======================================================== */
    const rainCanvas = document.getElementById('rainCanvas');
    const rainCtx = rainCanvas.getContext('2d');
    let rainDrops = [];
    const RAIN_COUNT = 80; // 雨滴数量

    // 初始化画布尺寸
    const goldCanvas = document.getElementById('goldCanvas');
    const goldCtx = goldCanvas ? goldCanvas.getContext('2d') : null;

    function resizeCanvases() {
        rainCanvas.width = window.innerWidth;
        rainCanvas.height = window.innerHeight;
        mistCanvas.width = window.innerWidth;
        mistCanvas.height = window.innerHeight;
        if (goldCanvas) {
            goldCanvas.width = window.innerWidth;
            goldCanvas.height = window.innerHeight;
        }
    }
    resizeCanvases();
    window.addEventListener('resize', resizeCanvases);

    // 雨滴类
    class RainDrop {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * rainCanvas.width;
            this.y = Math.random() * -rainCanvas.height;
            this.length = Math.random() * 20 + 10;
            this.speed = Math.random() * 8 + 6;
            this.opacity = Math.random() * 0.3 + 0.1;
            this.thickness = Math.random() * 0.8 + 0.3;
        }

        update() {
            this.y += this.speed;
            // 略微倾斜，模拟有风的雨
            this.x += this.speed * 0.15;

            if (this.y > rainCanvas.height) {
                this.reset();
            }
        }

        draw() {
            rainCtx.beginPath();
            rainCtx.moveTo(this.x, this.y);
            rainCtx.lineTo(this.x + this.length * 0.15, this.y + this.length);
            rainCtx.strokeStyle = `rgba(180, 200, 220, ${this.opacity})`;
            rainCtx.lineWidth = this.thickness;
            rainCtx.stroke();
        }
    }

    // 初始化雨滴
    for (let i = 0; i < RAIN_COUNT; i++) {
        rainDrops.push(new RainDrop());
    }

    /* ========================================================
       4. 雾气粒子效果（回南天潮湿氛围）
       ======================================================== */
    const mistCanvas = document.getElementById('mistCanvas');
    const mistCtx = mistCanvas.getContext('2d');
    let mistParticles = [];
    const MIST_COUNT = 30;

    // 雾气粒子类
    class MistParticle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * mistCanvas.width;
            this.y = Math.random() * mistCanvas.height;
            this.radius = Math.random() * 120 + 60;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.15;
            this.opacity = Math.random() * 0.04 + 0.01;
            this.pulseSpeed = Math.random() * 0.002 + 0.001;
            this.pulsePhase = Math.random() * Math.PI * 2;
        }

        update(time) {
            this.x += this.speedX;
            this.y += this.speedY;

            // 边界循环
            if (this.x < -this.radius) this.x = mistCanvas.width + this.radius;
            if (this.x > mistCanvas.width + this.radius) this.x = -this.radius;
            if (this.y < -this.radius) this.y = mistCanvas.height + this.radius;
            if (this.y > mistCanvas.height + this.radius) this.y = -this.radius;

            // 呼吸效果
            this.currentOpacity = this.opacity * (0.7 + 0.3 * Math.sin(time * this.pulseSpeed + this.pulsePhase));
        }

        draw() {
            const gradient = mistCtx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.radius
            );
            gradient.addColorStop(0, `rgba(200, 210, 220, ${this.currentOpacity})`);
            gradient.addColorStop(1, 'rgba(200, 210, 220, 0)');
            mistCtx.beginPath();
            mistCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            mistCtx.fillStyle = gradient;
            mistCtx.fill();
        }
    }

    // 初始化雾气
    for (let i = 0; i < MIST_COUNT; i++) {
        mistParticles.push(new MistParticle());
    }

    /* ========================================================
       4.5 金色尘埃粒子（奢华氛围）
       ======================================================== */
    let goldParticles = [];
    const GOLD_COUNT = 60;

    class GoldParticle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * (goldCanvas ? goldCanvas.width : window.innerWidth);
            this.y = Math.random() * (goldCanvas ? goldCanvas.height : window.innerHeight);
            this.size = Math.random() * 2 + 0.5;
            this.speedY = -(Math.random() * 0.4 + 0.1); // 缓慢上升
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.pulseSpeed = Math.random() * 0.02 + 0.01;
            this.pulsePhase = Math.random() * Math.PI * 2;
            this.twinkle = Math.random() * 0.02 + 0.005;
        }

        update(time) {
            this.y += this.speedY;
            this.x += this.speedX + Math.sin(time * 0.005 + this.pulsePhase) * 0.2;

            // 闪烁效果
            this.currentOpacity = this.opacity * (0.4 + 0.6 * Math.abs(Math.sin(time * this.twinkle + this.pulsePhase)));

            // 边界循环
            const w = goldCanvas ? goldCanvas.width : window.innerWidth;
            const h = goldCanvas ? goldCanvas.height : window.innerHeight;
            if (this.y < -10) { this.y = h + 10; this.x = Math.random() * w; }
            if (this.y > h + 10) { this.y = -10; }
            if (this.x < -10) this.x = w + 10;
            if (this.x > w + 10) this.x = -10;
        }

        draw() {
            if (!goldCtx) return;
            // 绘制金色光点（带光晕）
            goldCtx.beginPath();
            goldCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            goldCtx.fillStyle = `rgba(232, 201, 138, ${this.currentOpacity})`;
            goldCtx.fill();

            // 大粒子加光晕
            if (this.size > 1.5) {
                goldCtx.beginPath();
                goldCtx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
                const glow = goldCtx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, this.size * 3
                );
                glow.addColorStop(0, `rgba(201, 169, 110, ${this.currentOpacity * 0.3})`);
                glow.addColorStop(1, 'rgba(201, 169, 110, 0)');
                goldCtx.fillStyle = glow;
                goldCtx.fill();
            }
        }
    }

    if (goldCanvas) {
        for (let i = 0; i < GOLD_COUNT; i++) {
            goldParticles.push(new GoldParticle());
        }
    }

    /* ========================================================
       5. 动画主循环（雨雾）
       ======================================================== */
    let animationTime = 0;

    function animate() {
        animationTime++;

        // 清空画布
        rainCtx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);
        mistCtx.clearRect(0, 0, mistCanvas.width, mistCanvas.height);
        if (goldCtx) goldCtx.clearRect(0, 0, goldCanvas.width, goldCanvas.height);

        // 更新并绘制雾气（底层）
        mistParticles.forEach(p => {
            p.update(animationTime);
            p.draw();
        });

        // 更新并绘制金色尘埃（中层）
        goldParticles.forEach(p => {
            p.update(animationTime);
            p.draw();
        });

        // 更新并绘制雨滴（上层）
        rainDrops.forEach(drop => {
            drop.update();
            drop.draw();
        });

        requestAnimationFrame(animate);
    }
    animate();

    /* ========================================================
       6. 导航栏滚动效果
       ======================================================== */
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');

    function handleScroll() {
        const scrollY = window.scrollY;

        // 导航栏背景
        if (scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // 返回顶部按钮
        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    /* ========================================================
       7. 移动端菜单切换
       ======================================================== */
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        // 切换按钮图标为X
        const spans = navToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // 点击导航链接后关闭移动端菜单
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    /* ========================================================
       8. 滚动揭示动画（Intersection Observer）
       ======================================================== */
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // 揭示后取消观察，提升性能
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px 50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 兜底机制：加载完成3秒后强制揭示所有仍未显示的元素
    // 防止IntersectionObserver在某些环境下不触发
    setTimeout(() => {
        document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
            el.classList.add('visible');
        });
    }, 3000);

    /* ========================================================
       9. 返回顶部
       ======================================================== */
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    /* ========================================================
       10. 香水卡片悬停视差效果
       ======================================================== */
    const perfumeCards = document.querySelectorAll('.perfume-card');

    perfumeCards.forEach(card => {
        const bottle = card.querySelector('.perfume-bottle');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // 计算倾斜角度（最大5度）
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            if (bottle) {
                bottle.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
                bottle.style.transition = 'transform 0.1s ease';
            }
        });

        card.addEventListener('mouseleave', () => {
            if (bottle) {
                bottle.style.transform = 'perspective(600px) rotateX(0) rotateY(0) scale(1)';
                bottle.style.transition = 'transform 0.5s ease';
            }
        });
    });

    /* ========================================================
       11. 平滑滚动（锚点链接）
       ======================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // 考虑导航栏高度的偏移
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    /* ========================================================
       12. 英雄区视差滚动 + 鼠标视差
       ======================================================== */
    const heroContent = document.querySelector('.hero-content');
    const heroDeco = document.querySelector('.hero-perfume-deco');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY < window.innerHeight) {
            if (heroContent) {
                heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
                heroContent.style.opacity = 1 - (scrollY / window.innerHeight) * 0.8;
            }
            if (heroDeco) {
                heroDeco.style.transform = `translateY(calc(-50% + ${scrollY * 0.15}px))`;
            }
        }
    }, { passive: true });

    // 英雄区香水瓶鼠标视差（仅桌面端）
    if (heroDeco && window.matchMedia('(hover: hover)').matches) {
        const heroSection = document.getElementById('hero');
        let decoBaseX = 0, decoBaseY = 0;

        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            decoBaseX = x * 20;
            decoBaseY = y * 15;
            heroDeco.style.transform = `translate(calc(-50% + ${decoBaseX}px), calc(-50% + ${decoBaseY}px))`;
        });

        heroSection.addEventListener('mouseleave', () => {
            heroDeco.style.transform = 'translate(-50%, -50%)';
        });
    }

    /* ========================================================
       13. 时间线卡片交错揭示
       ======================================================== */
    const timelineItems = document.querySelectorAll('.timeline-item');

    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // 添加延迟，营造交错效果
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                timelineObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px 50px 0px'
    });

    timelineItems.forEach(item => {
        // 复用reveal样式
        item.classList.add('reveal');
        timelineObserver.observe(item);
    });

    /* ========================================================
       14. 信纸入场动画
       ======================================================== */
    const letterPaper = document.querySelector('.letter-paper');

    if (letterPaper) {
        const letterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'paperFadeIn 1.2s ease forwards';
                    letterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        letterObserver.observe(letterPaper);
    }

    // 动态添加信纸入场关键帧
    const paperStyle = document.createElement('style');
    paperStyle.textContent = `
        @keyframes paperFadeIn {
            0% {
                opacity: 0;
                transform: translateY(40px);
                box-shadow: 0 0 0 rgba(0,0,0,0);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(paperStyle);

    /* ========================================================
       15. 加载完成后强制揭示可视区域内容（双保险）
       ======================================================== */
    function forceRevealVisible() {
        const windowHeight = window.innerHeight;
        document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
            const rect = el.getBoundingClientRect();
            // 如果元素在可视区域内或即将进入，立即揭示
            if (rect.top < windowHeight + 100 && rect.bottom > -100) {
                el.classList.add('visible');
            }
        });
    }

    // 加载完成后触发一次
    window.addEventListener('load', () => {
        setTimeout(forceRevealVisible, 500);
    });

    // 每次滚动时也检查一次
    window.addEventListener('scroll', forceRevealVisible, { passive: true });

    /* ========================================================
       15.5 鼠标跟随光晕（奢华光效）
       ======================================================== */
    const cursorGlow = document.getElementById('cursorGlow');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX = mouseX;
    let glowY = mouseY;

    // 仅在支持鼠标的设备上启用
    if (cursorGlow && window.matchMedia('(hover: hover)').matches) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // 平滑跟随
        function updateGlow() {
            glowX += (mouseX - glowX) * 0.08;
            glowY += (mouseY - glowY) * 0.08;
            cursorGlow.style.left = glowX + 'px';
            cursorGlow.style.top = glowY + 'px';
            requestAnimationFrame(updateGlow);
        }
        updateGlow();

        // 鼠标进入/离开页面时显隐
        document.addEventListener('mouseenter', () => {
            cursorGlow.style.opacity = '1';
        });
        document.addEventListener('mouseleave', () => {
            cursorGlow.style.opacity = '0';
        });
    } else if (cursorGlow) {
        cursorGlow.style.display = 'none';
    }

    /* ========================================================
       15.6 香水卡片液体晃动（鼠标位置驱动）
       ======================================================== */
    perfumeCards.forEach(card => {
        const liquidWave = card.querySelector('.sm-liquid-wave');

        card.addEventListener('mousemove', (e) => {
            if (!liquidWave) return;
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 ~ 0.5
            // 波纹根据鼠标位置轻微倾斜
            liquidWave.style.transform = `skewX(${x * 10}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            if (liquidWave) {
                liquidWave.style.transform = 'skewX(0deg)';
            }
        });
    });

    /* ========================================================
       16. 控制台彩蛋（调香师签名）
       ======================================================== */
    console.log('%c青迹 QINGJI ATELIER', 'font-size: 24px; font-weight: 300; color: #c9a96e; letter-spacing: 6px;');
    console.log('%c回南天 × 自由水 · 售后专属', 'font-size: 12px; color: #7a8a9a; letter-spacing: 2px;');
    console.log('%c"我知道你浅薄如锈铁，但我仍走向你。"', 'font-size: 13px; color: #b8c4d0; font-style: italic; margin: 8px 0;');
    console.log('%c—— 周礼，调香师，孤儿院长大，心甘情愿的替身', 'font-size: 11px; color: #5a6a7a;');

    /* ========================================================
       17. 背景音乐播放器（李荣浩《恋人》）
       —— 浏览器禁止自动播放有声媒体，需用户首次交互后启动
       ======================================================== */
    const bgMusic = document.getElementById('bgMusic');
    const musicPlayer = document.getElementById('musicPlayer');
    const musicHint = document.getElementById('musicHint');
    let isMusicPlaying = false;
    let musicStarted = false;

    // 音乐播放成功后的统一处理
    function onMusicPlaySuccess() {
        isMusicPlaying = true;
        musicStarted = true;
        if (musicPlayer) musicPlayer.classList.add('playing');
        // 淡出提示
        if (musicHint) {
            musicHint.classList.add('fade-out');
            setTimeout(() => { musicHint.style.display = 'none'; }, 600);
        }
    }

    // 音乐提示8秒后自动消失（避免遮挡内容）
    if (musicHint) {
        setTimeout(() => {
            if (!musicStarted && musicHint.style.display !== 'none') {
                musicHint.classList.add('fade-out');
                setTimeout(() => { musicHint.style.display = 'none'; }, 600);
            }
        }, 8000);
    }

    // 尝试播放音乐（需在用户交互事件中调用）
    function tryPlayMusic() {
        if (!bgMusic || musicStarted) return;
        bgMusic.volume = 0.45;
        const playPromise = bgMusic.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                onMusicPlaySuccess();
            }).catch(() => {
                // 自动播放被阻止，等待用户点击
                isMusicPlaying = false;
            });
        }
    }

    // 切换播放/暂停
    function toggleMusic() {
        if (!bgMusic) return;
        if (isMusicPlaying) {
            bgMusic.pause();
            isMusicPlaying = false;
            if (musicPlayer) musicPlayer.classList.remove('playing');
        } else {
            bgMusic.volume = 0.45;
            bgMusic.play().then(() => {
                onMusicPlaySuccess();
            }).catch((err) => {
                isMusicPlaying = false;
                console.warn('音乐播放失败:', err);
            });
        }
    }

    // 点击播放器切换
    if (musicPlayer) {
        musicPlayer.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMusic();
        });
    }

    // 用户首次与页面交互时尝试自动播放
    // 监听多种交互事件，确保在移动设备上也能触发
    // 注意：只有播放成功后才移除监听器，避免scroll等非激活事件误触发后移除
    const firstInteractionEvents = ['click', 'touchstart', 'keydown'];
    function onFirstInteraction() {
        if (musicStarted) {
            firstInteractionEvents.forEach(evt => {
                document.removeEventListener(evt, onFirstInteraction);
            });
            return;
        }
        tryPlayMusic();
        // 如果播放成功，tryPlayMusic 会设置 musicStarted = true
        if (musicStarted) {
            firstInteractionEvents.forEach(evt => {
                document.removeEventListener(evt, onFirstInteraction);
            });
        }
    }
    firstInteractionEvents.forEach(evt => {
        document.addEventListener(evt, onFirstInteraction, { passive: true });
    });

    // 音乐播放结束时（loop 属性应自动循环，此处为兜底）
    if (bgMusic) {
        bgMusic.addEventListener('ended', () => {
            bgMusic.currentTime = 0;
            bgMusic.play().catch(() => {});
        });
    }

    /* ========================================================
       18. 顶部滚动进度条
       ======================================================== */
    const scrollProgress = document.getElementById('scrollProgress');

    function updateScrollProgress() {
        if (!scrollProgress) return;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = progress + '%';
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    window.addEventListener('resize', updateScrollProgress);
    updateScrollProgress();

    /* ========================================================
       19. 手机端：点击音乐提示也可播放
       ======================================================== */
    if (musicHint) {
        // 提示卡片可点击，但不阻挡下方播放器
        musicHint.style.pointerEvents = 'auto';
        musicHint.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!musicStarted) {
                tryPlayMusic();
            }
        });
        // 关闭按钮
        const hintClose = document.getElementById('musicHintClose');
        if (hintClose) {
            hintClose.addEventListener('click', (e) => {
                e.stopPropagation();
                musicHint.classList.add('fade-out');
                setTimeout(() => { musicHint.style.display = 'none'; }, 600);
            });
        }
    }

})();
