// Rive Demo JavaScript
// Laddar och visar Rive-animationer från Rive Community

document.addEventListener('DOMContentLoaded', function() {

    // Kontrollera om Rive-biblioteket är laddat
    if (typeof rive !== 'undefined') {
        initRiveAnimations();
    } else {
        console.log('Rive library not loaded. Showing placeholder content.');
        showRivePlaceholders();
    }

    // Kontrollera om Lottie-biblioteket är laddat
    if (typeof lottie !== 'undefined') {
        initLottieAnimation();
    } else {
        console.log('Lottie library not loaded.');
    }
});

// Initiera Rive-animationer
function initRiveAnimations() {

    // Animation 1: Simple shapes/loader (gratis från Rive Community)
    try {
        const riveInstance1 = new rive.Rive({
            src: 'https://public.rive.app/community/runtime-files/2244-4463-animated-icon-set.riv',
            canvas: document.getElementById('rive-canvas-1'),
            autoplay: true,
            stateMachines: 'State Machine 1',
            onLoad: () => {
                console.log('Rive animation 1 loaded');
                riveInstance1.resizeDrawingSurfaceToCanvas();
            },
            onLoadError: (e) => {
                console.log('Could not load Rive animation 1:', e);
                showPlaceholder('rive-canvas-1', 'Animerade ikoner');
            }
        });
    } catch (e) {
        console.log('Error initializing Rive 1:', e);
        showPlaceholder('rive-canvas-1', 'Animerade ikoner');
    }

    // Animation 2: Heart/health animation
    try {
        const riveInstance2 = new rive.Rive({
            src: 'https://public.rive.app/community/runtime-files/2195-4376-heart.riv',
            canvas: document.getElementById('rive-canvas-2'),
            autoplay: true,
            onLoad: () => {
                console.log('Rive animation 2 loaded');
                riveInstance2.resizeDrawingSurfaceToCanvas();
            },
            onLoadError: (e) => {
                console.log('Could not load Rive animation 2:', e);
                showPlaceholder('rive-canvas-2', 'Hjärtanimation');
            }
        });
    } catch (e) {
        console.log('Error initializing Rive 2:', e);
        showPlaceholder('rive-canvas-2', 'Hjärtanimation');
    }

    // Animation 3: Loading/spinner animation
    try {
        const riveInstance3 = new rive.Rive({
            src: 'https://public.rive.app/community/runtime-files/2063-4104-loader.riv',
            canvas: document.getElementById('rive-canvas-3'),
            autoplay: true,
            onLoad: () => {
                console.log('Rive animation 3 loaded');
                riveInstance3.resizeDrawingSurfaceToCanvas();
            },
            onLoadError: (e) => {
                console.log('Could not load Rive animation 3:', e);
                showPlaceholder('rive-canvas-3', 'Laddningsanimation');
            }
        });
    } catch (e) {
        console.log('Error initializing Rive 3:', e);
        showPlaceholder('rive-canvas-3', 'Laddningsanimation');
    }
}

// Visa placeholder om Rive inte kan laddas
function showRivePlaceholders() {
    showPlaceholder('rive-canvas-1', 'Animerade ikoner');
    showPlaceholder('rive-canvas-2', 'Hjärtanimation');
    showPlaceholder('rive-canvas-3', 'Laddningsanimation');
}

// Skapa en placeholder-animation med CSS
function showPlaceholder(canvasId, label) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const container = canvas.parentElement;

    // Dölj canvas
    canvas.style.display = 'none';

    // Skapa placeholder
    const placeholder = document.createElement('div');
    placeholder.className = 'rive-placeholder';
    placeholder.innerHTML = `
        <div class="placeholder-animation">
            <div class="placeholder-circle"></div>
            <div class="placeholder-pulse"></div>
        </div>
        <span>${label}</span>
        <small>Rive-animation (demo)</small>
    `;

    container.insertBefore(placeholder, canvas);
}

// Initiera Lottie-animation
function initLottieAnimation() {
    const lottieContainer = document.getElementById('lottie-container');
    if (!lottieContainer) return;

    // Ladda en gratis Lottie-animation från LottieFiles
    try {
        const animation = lottie.loadAnimation({
            container: lottieContainer,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            // Gratis animation från LottieFiles
            path: 'https://assets5.lottiefiles.com/packages/lf20_V9t630.json'
        });

        animation.addEventListener('data_failed', function() {
            console.log('Lottie animation failed to load');
            showLottiePlaceholder(lottieContainer);
        });

        animation.addEventListener('error', function() {
            console.log('Lottie animation error');
            showLottiePlaceholder(lottieContainer);
        });

    } catch (e) {
        console.log('Error initializing Lottie:', e);
        showLottiePlaceholder(lottieContainer);
    }
}

// Visa Lottie placeholder
function showLottiePlaceholder(container) {
    container.innerHTML = `
        <div class="lottie-placeholder">
            <div class="placeholder-animation">
                <div class="placeholder-circle"></div>
                <div class="placeholder-pulse"></div>
            </div>
            <span>Lottie Animation</span>
            <small>Alternativ till Rive</small>
        </div>
    `;
}

// Lägg till placeholder-stilar dynamiskt
const placeholderStyles = document.createElement('style');
placeholderStyles.textContent = `
    .rive-placeholder,
    .lottie-placeholder {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 200px;
        background: linear-gradient(135deg, #f0f0ff 0%, #e8e8ff 100%);
        border-radius: 16px;
        gap: 12px;
    }

    .rive-placeholder span,
    .lottie-placeholder span {
        font-weight: 600;
        color: var(--text-dark, #1e1b4b);
    }

    .rive-placeholder small,
    .lottie-placeholder small {
        font-size: 12px;
        color: var(--text-muted, #64748b);
    }

    .placeholder-animation {
        position: relative;
        width: 60px;
        height: 60px;
    }

    .placeholder-circle {
        position: absolute;
        inset: 10px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--primary, #6366f1), var(--primary-light, #818cf8));
        animation: placeholderPulse 2s ease-in-out infinite;
    }

    .placeholder-pulse {
        position: absolute;
        inset: 0;
        border-radius: 50%;
        border: 2px solid var(--primary, #6366f1);
        animation: placeholderRing 2s ease-out infinite;
    }

    @keyframes placeholderPulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(0.9); opacity: 0.8; }
    }

    @keyframes placeholderRing {
        0% { transform: scale(0.8); opacity: 1; }
        100% { transform: scale(1.5); opacity: 0; }
    }
`;
document.head.appendChild(placeholderStyles);

console.log('Rive Demo JS loaded');
