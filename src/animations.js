/* Animations & Micro-Interactions */

// Parallax Hero Effect
export function initParallax() {
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scrollValue = window.scrollY;
            // Use different speeds or methods if needed, but keeping it simple for now
            heroBg.style.backgroundPositionY = `calc(20% + ${scrollValue * 0.2}px)`;
        });
    }
}

// Reveal on Scroll (already partially in main.js, enhancing here)
export function initScrollReveal() {
    const elements = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    });

    elements.forEach(el => observer.observe(el));
}

// Hover effects for cards handled via CSS transition (in style.css)
