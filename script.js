/* ============================================
   TECHFLOW - GSAP Animations
   Inspired by pomegranate.health
   ============================================ */

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// ============================================
// 1. TELEFONER SOM ÅKER UPP (Hero Section)
// ============================================
function initPhoneAnimations() {
    // Telefonerna börjar en bit ner och åker sakta upp
    gsap.set('.phones-container .phone', {
        y: 100,
        opacity: 0
    });

    gsap.to('.phones-container .phone', {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.phones-section',
            start: 'top 80%',
            end: 'top 30%',
            scrub: 1
        }
    });

    // Parallax-effekt på telefonerna vid scroll
    gsap.to('.phone-center', {
        y: -50,
        scrollTrigger: {
            trigger: '.phones-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });

    gsap.to('.phone-left, .phone-right', {
        y: -30,
        scrollTrigger: {
            trigger: '.phones-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });
}

// ============================================
// 2. PROFIL-KORT SOM RÖR SIG FRAM OCH TILLBAKA
// ============================================
function initProfileCardAnimations() {
    const cards = document.querySelectorAll('.profile-card');
    const lines = document.querySelectorAll('.connection-line');

    // Animera linjerna så de "ritas" fram
    lines.forEach((line, index) => {
        const length = line.getTotalLength ? line.getTotalLength() : 200;
        gsap.set(line, {
            strokeDasharray: length,
            strokeDashoffset: length
        });

        gsap.to(line, {
            strokeDashoffset: 0,
            duration: 1.5,
            ease: 'power2.out',
            delay: index * 0.15,
            scrollTrigger: {
                trigger: '.floating-profiles',
                start: 'top 80%'
            }
        });
    });

    cards.forEach((card, index) => {
        // Slumpmässig förskjutning för varje kort
        const xOffset = (index % 2 === 0) ? 12 : -12;
        const yOffset = (index % 3 === 0) ? 8 : -8;
        const duration = 3 + (index * 0.4);
        const delay = index * 0.2;

        // Kombinerad X och Y rörelse
        gsap.to(card, {
            x: xOffset,
            y: yOffset,
            duration: duration,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: delay
        });

        // Animera motsvarande linje tillsammans med kortet
        if (lines[index]) {
            gsap.to(lines[index], {
                attr: {
                    d: getAnimatedPath(index, xOffset, yOffset)
                },
                duration: duration,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
                delay: delay
            });
        }
    });
}

// Hjälpfunktion för att få animerad path
function getAnimatedPath(index, offsetX, offsetY) {
    const paths = [
        `M150 250 Q250 ${150 + offsetY} ${320 + offsetX} ${80 + offsetY}`,
        `M150 250 Q280 ${180 + offsetY} ${350 + offsetX} ${150 + offsetY}`,
        `M150 250 Q250 ${250 + offsetY} ${330 + offsetX} ${220 + offsetY}`,
        `M150 250 Q220 ${300 + offsetY} ${300 + offsetX} ${300 + offsetY}`,
        `M150 250 Q250 ${350 + offsetY} ${320 + offsetX} ${380 + offsetY}`,
        `M150 250 Q200 ${400 + offsetY} ${280 + offsetX} ${450 + offsetY}`
    ];
    return paths[index] || paths[0];
}

// ============================================
// 3. ANVÄNDARKORT SOM GUPPAR UPP OCH NER
// ============================================
function initUserCardAnimations() {
    const userCards = document.querySelectorAll('.user-card');

    userCards.forEach((card, index) => {
        gsap.to(card, {
            y: -15,
            duration: 2.5 + (index * 0.3),
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: index * 0.5
        });
    });

    // Scroll-triggered entrance
    gsap.from('.caring-cards', {
        x: -100,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
            trigger: '.caring-section',
            start: 'top 70%',
            end: 'top 40%',
            scrub: 1
        }
    });
}

// ============================================
// 4. ELEKTRISKA PULSER I KRETSEN
// ============================================
function initCircuitAnimations() {
    const paths = document.querySelectorAll('.circuit-path');
    const pulses = document.querySelectorAll('.pulse');
    const nodes = document.querySelectorAll('.circuit-node');

    // Animera elektriska pulser längs ledningarna
    const pathData = [
        { path: '.path-1', duration: 1.5 },
        { path: '.path-2', duration: 2 },
        { path: '.path-3', duration: 1.8 },
        { path: '.path-4', duration: 1.2 },
        { path: '.path-5', duration: 1.6 },
        { path: '.path-6', duration: 1.4 },
        { path: '.path-7', duration: 1 },
        { path: '.path-8', duration: 1.7 }
    ];

    // Skapa puls-animationer för varje ledning
    pulses.forEach((pulse, index) => {
        if (index < pathData.length) {
            const pathElement = document.querySelector(pathData[index].path);
            if (pathElement) {
                const pathLength = pathElement.getTotalLength();

                gsap.to(pulse, {
                    motionPath: {
                        path: pathElement,
                        align: pathElement,
                        alignOrigin: [0.5, 0.5]
                    },
                    duration: pathData[index].duration,
                    repeat: -1,
                    ease: 'none',
                    delay: index * 0.4
                });

                gsap.to(pulse, {
                    opacity: 1,
                    duration: 0.3,
                    repeat: -1,
                    yoyo: true
                });
            }
        }
    });

    // Noder som blinkar
    nodes.forEach((node, index) => {
        gsap.to(node, {
            scale: 1.3,
            opacity: 0.7,
            duration: 0.8,
            ease: 'power2.inOut',
            repeat: -1,
            yoyo: true,
            delay: index * 0.2
        });
    });

    // Alternativ: Enkel puls-animation utan MotionPath
    function createSimplePulse() {
        pulses.forEach((pulse, index) => {
            // Sätt startposition
            const startPositions = [
                { x: 200, y: 50 },
                { x: 200, y: 50 },
                { x: 250, y: 150 },
                { x: 250, y: 150 }
            ];

            const endPositions = [
                { x: 280, y: 20 },
                { x: 320, y: 10 },
                { x: 320, y: 80 },
                { x: 350, y: 150 }
            ];

            if (startPositions[index] && endPositions[index]) {
                gsap.set(pulse, {
                    attr: { cx: startPositions[index].x, cy: startPositions[index].y },
                    opacity: 0
                });

                gsap.to(pulse, {
                    attr: { cx: endPositions[index].x, cy: endPositions[index].y },
                    opacity: 1,
                    duration: 1.5,
                    repeat: -1,
                    ease: 'power1.inOut',
                    delay: index * 0.5,
                    onRepeat: function() {
                        gsap.set(pulse, {
                            attr: { cx: startPositions[index].x, cy: startPositions[index].y }
                        });
                    }
                });
            }
        });
    }

    createSimplePulse();

    // Chip glöd-effekt
    gsap.to('.chip', {
        boxShadow: '0 0 30px rgba(99, 102, 241, 0.5)',
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
}

// ============================================
// 5. DATA-KORT MED ANIMERADE LINJER OCH HJÄRTAN
// ============================================
function initDataCardAnimations() {
    // Animerad linje i grafen
    const chartLine = document.querySelector('.animated-line');
    if (chartLine) {
        const lineLength = chartLine.getTotalLength ? chartLine.getTotalLength() : 200;

        gsap.set(chartLine, {
            strokeDasharray: lineLength,
            strokeDashoffset: lineLength
        });

        gsap.to(chartLine, {
            strokeDashoffset: 0,
            duration: 2,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.card-graph',
                start: 'top 80%'
            }
        });
    }

    // Animerad area-linje
    const areaLine = document.querySelector('.animated-area');
    if (areaLine) {
        gsap.from(areaLine, {
            strokeDasharray: '0 1000',
            duration: 2,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.card-resting',
                start: 'top 80%'
            }
        });
    }

    // Pulsande hjärta
    gsap.to('.animated-heart', {
        scale: 1.15,
        duration: 0.8,
        ease: 'power2.inOut',
        repeat: -1,
        yoyo: true
    });

    // Intensity ring animation
    gsap.to('.intensity-progress', {
        strokeDashoffset: 0,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.card-intensity',
            start: 'top 80%'
        }
    });

    // Progress circle animation
    gsap.to('.progress-circle', {
        strokeDashoffset: 42,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.phone-center',
            start: 'top 80%'
        }
    });

    // Gauge needle animation
    gsap.to('.gauge-needle', {
        rotation: 40,
        duration: 2,
        ease: 'elastic.out(1, 0.5)',
        scrollTrigger: {
            trigger: '.card-body',
            start: 'top 80%'
        }
    });

    // Data cards entrance animation
    gsap.from('.data-card', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.data-cards-grid',
            start: 'top 80%'
        }
    });
}

// ============================================
// 6. ISOMETRISKA STAPLADE KORT
// ============================================
function initStackAnimations() {
    const isoCards = document.querySelectorAll('.iso-card');

    // Entrance animation - korten faller ner
    gsap.from('.iso-card', {
        y: -100,
        opacity: 0,
        rotateX: 75,
        duration: 0.8,
        stagger: 0.15,
        ease: 'bounce.out',
        scrollTrigger: {
            trigger: '.stack-section',
            start: 'top 70%'
        }
    });

    // Guppande animation för varje kort
    isoCards.forEach((card, index) => {
        gsap.to(card, {
            y: -8,
            duration: 2 + (index * 0.2),
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: index * 0.15
        });
    });

    // Bakgrundscirkel animation
    gsap.from('.iso-bg-circle', {
        scale: 0,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.stack-section',
            start: 'top 75%'
        }
    });

    // Floating logo
    gsap.to('.floating-logo', {
        y: -20,
        rotation: 5,
        duration: 3,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
    });
}

// ============================================
// 7. PREDICTIVE PHONES (Hover + Float)
// ============================================
function initPredictivePhoneAnimations() {
    const predPhones = document.querySelectorAll('.pred-phone');

    // Guppande animation
    predPhones.forEach((phone, index) => {
        gsap.to(phone, {
            y: -15,
            duration: 2.5 + (index * 0.3),
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: index * 0.4
        });
    });

    // Scroll entrance
    gsap.from('.pred-phone', {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.predictive-section',
            start: 'top 70%'
        }
    });

    // Map dots blinking
    gsap.to('.map-dot', {
        scale: 1.5,
        opacity: 0.5,
        duration: 1,
        stagger: 0.3,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
    });
}

// ============================================
// 8. FOOTER PHONES (Åker upp från botten)
// ============================================
function initFooterAnimations() {
    gsap.from('.footer-phone', {
        y: 150,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.footer',
            start: 'top 80%'
        }
    });

    // Rainbow arcs animation
    gsap.from('.r-arc', {
        scaleX: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.footer-phones',
            start: 'top 80%'
        }
    });
}

// ============================================
// 9. SECTION ENTRANCES
// ============================================
function initSectionAnimations() {
    // Section badges
    gsap.utils.toArray('.section-badge').forEach(badge => {
        gsap.from(badge, {
            y: 20,
            opacity: 0,
            duration: 0.6,
            scrollTrigger: {
                trigger: badge,
                start: 'top 85%'
            }
        });
    });

    // Section headings
    gsap.utils.toArray('section h2').forEach(heading => {
        gsap.from(heading, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: heading,
                start: 'top 80%'
            }
        });
    });

    // Section paragraphs
    gsap.utils.toArray('section > div > p, .end-content p, .caring-content p, .circuit-content p, .stack-content p, .predictive-content p').forEach(p => {
        gsap.from(p, {
            y: 30,
            opacity: 0,
            duration: 0.6,
            delay: 0.2,
            scrollTrigger: {
                trigger: p,
                start: 'top 85%'
            }
        });
    });
}

// ============================================
// 10. HERO ANIMATIONS
// ============================================
function initHeroAnimations() {
    // Hero content entrance
    gsap.from('.hero-content > *', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.3
    });

    // Background layers
    gsap.from('.bg-layer', {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power2.out'
    });

    // Logo icon float
    gsap.to('.logo-icon', {
        y: -10,
        duration: 2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true
    });
}

// ============================================
// 11. PARALLAX EFFECTS
// ============================================
function initParallaxEffects() {
    // Main node parallax
    gsap.to('.main-node', {
        y: -30,
        scrollTrigger: {
            trigger: '.end-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });

    // Circuit board parallax
    gsap.to('.circuit-board', {
        y: -20,
        scrollTrigger: {
            trigger: '.circuit-section',
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
        }
    });
}

// ============================================
// 12. HOVER ENHANCEMENTS
// ============================================
function initHoverEffects() {
    // Enhanced phone hover
    document.querySelectorAll('.phone, .pred-phone').forEach(phone => {
        phone.addEventListener('mouseenter', () => {
            gsap.to(phone, {
                scale: 1.05,
                y: -15,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        phone.addEventListener('mouseleave', () => {
            gsap.to(phone, {
                scale: 1,
                y: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    // Button hover effects
    document.querySelectorAll('.nav-btn, .cta-button').forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            gsap.to(btn, {
                scale: 1.05,
                duration: 0.2
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                scale: 1,
                duration: 0.2
            });
        });
    });

    // Data card hover
    document.querySelectorAll('.data-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -5,
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                duration: 0.3
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                duration: 0.3
            });
        });
    });
}

// ============================================
// 13. DROPDOWN MENU
// ============================================
function initDropdownMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const btnText = menuToggle.querySelector('.btn-text');

    if (menuToggle && dropdownMenu) {
        menuToggle.addEventListener('click', () => {
            const isOpen = dropdownMenu.classList.contains('active');

            if (isOpen) {
                // Stäng menyn
                dropdownMenu.classList.remove('active');
                menuToggle.classList.remove('menu-open');
                btnText.textContent = 'LEARN MORE';

                // Animera menyobjekten ut
                gsap.to('.menu-item', {
                    y: -20,
                    opacity: 0,
                    duration: 0.2,
                    stagger: 0.05
                });
            } else {
                // Öppna menyn
                dropdownMenu.classList.add('active');
                menuToggle.classList.add('menu-open');
                btnText.textContent = 'CLOSE MENU';

                // Animera menyobjekten in
                gsap.fromTo('.menu-item',
                    { y: 20, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.4,
                        stagger: 0.08,
                        ease: 'power2.out',
                        delay: 0.1
                    }
                );
            }
        });

        // Stäng menyn om man klickar utanför
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
                if (dropdownMenu.classList.contains('active')) {
                    dropdownMenu.classList.remove('active');
                    menuToggle.classList.remove('menu-open');
                    btnText.textContent = 'LEARN MORE';
                }
            }
        });
    }
}

// ============================================
// 14. SMOOTH SCROLL FOR NAV
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('.nav-btn-right').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Scrolla till footer
            document.querySelector('.footer').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// ============================================
// INITIALIZE ALL ANIMATIONS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Vänta lite för att säkerställa att allt laddats
    setTimeout(() => {
        initHeroAnimations();
        initPhoneAnimations();
        initProfileCardAnimations();
        initUserCardAnimations();
        initCircuitAnimations();
        initDataCardAnimations();
        initStackAnimations();
        initPredictivePhoneAnimations();
        initFooterAnimations();
        initSectionAnimations();
        initParallaxEffects();
        initHoverEffects();
        initDropdownMenu();
        initSmoothScroll();

        // Refresh ScrollTrigger after all animations are set up
        ScrollTrigger.refresh();
    }, 100);
});

// Refresh on resize
window.addEventListener('resize', () => {
    ScrollTrigger.refresh();
});

// ============================================
// PERFORMANCE: Reduce animations on low-end devices
// ============================================
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.globalTimeline.timeScale(0);
}
