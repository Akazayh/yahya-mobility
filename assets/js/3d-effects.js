/**
 * YAHYA Mobility — 3D / Depth Effects
 * Interactive mouse-based tilt, parallax, and depth effects
 * Vanilla JavaScript — no dependencies
 */

(function() {
    'use strict';

    // ── Respect reduced motion ──
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // ── Mouse Tilt on Cards ──
    function initCardTilt() {
        const cards = document.querySelectorAll('.car-card, .about-card, .mission-card, .contrat-card, .reservation-card');
        
        cards.forEach(card => {
            card.classList.add('card-3d');
            
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -6;
                const rotateY = ((x - centerX) / centerX) * 6;
                
                card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)';
            });
        });
    }

    // ── Hero Parallax on Scroll ──
    function initHeroParallax() {
        const heroVideo = document.querySelector('.hero-video');
        const heroContent = document.querySelector('.hero-content');
        
        if (!heroVideo) return;
        
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    const heroHeight = window.innerHeight;
                    
                    if (scrollY < heroHeight) {
                        const progress = scrollY / heroHeight;
                        heroVideo.style.transform = `translateY(${scrollY * 0.3}px) scale(${1 + progress * 0.1})`;
                        heroVideo.style.opacity = Math.max(0, 0.35 - progress * 0.35);
                        
                        if (heroContent) {
                            heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
                            heroContent.style.opacity = Math.max(0, 1 - progress * 1.2);
                        }
                    }
                    
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // ── Mouse Move Parallax on Hero ──
    function initMouseParallax() {
        const hero = document.querySelector('.hero-welcome');
        const heroContent = document.querySelector('.hero-content');
        
        if (!hero || !heroContent) return;
        
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            heroContent.style.transform = `translate(${x * 15}px, ${y * 10}px)`;
        });
        
        hero.addEventListener('mouseleave', () => {
            heroContent.style.transform = 'translate(0, 0)';
            heroContent.style.transition = 'transform 0.5s ease';
            setTimeout(() => { heroContent.style.transition = ''; }, 500);
        });
    }

    // ── Image Hover 3D Effect ──
    function initImageHover3D() {
        const images = document.querySelectorAll('.about-image img, .offer-image img');
        
        images.forEach(img => {
            img.classList.add('img-3d');
            
            img.parentElement.addEventListener('mousemove', (e) => {
                const rect = img.parentElement.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                
                img.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.03)`;
            });
            
            img.parentElement.addEventListener('mouseleave', () => {
                img.style.transform = 'perspective(600px) rotateY(0) rotateX(0) scale(1)';
            });
        });
    }

    // ── Scroll-based Reveal ──
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal');
        
        if (revealElements.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        
        revealElements.forEach(el => observer.observe(el));
    }

    // ── Smooth Scroll for anchor links ──
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    // ── Initialize everything on DOM ready ──
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        initCardTilt();
        initHeroParallax();
        initMouseParallax();
        initImageHover3D();
        initScrollReveal();
        initSmoothScroll();
    }

})();
