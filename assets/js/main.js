// Country J Website - Vanilla JavaScript Functionality
document.addEventListener('DOMContentLoaded', function() {

    // ====================
    // LIGHTBOX FUNCTIONALITY
    // ====================
    class Lightbox {
        constructor() {
            this.currentIndex = 0;
            this.images = [];
            this.init();
        }

        init() {
            // Create lightbox elements
            this.createLightboxHTML();

            // Add event listeners to gallery items
            const galleryItems = document.querySelectorAll('.gallery-item img');
            galleryItems.forEach((img, index) => {
                img.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.openLightbox(index);
                });
            });

            // Lightbox controls
            this.addLightboxControls();
        }

        createLightboxHTML() {
            const lightboxHTML = `
                <div class="lightbox" id="lightbox">
                    <button class="btn btn-light position-absolute top-0 end-0 m-3" id="lightbox-close" aria-label="Close lightbox">
                        <i class="bi bi-x-lg"></i>
                    </button>
                    <button class="btn btn-light position-absolute top-50 start-0 translate-middle-y ms-3" id="lightbox-prev" aria-label="Previous image">
                        <i class="bi bi-chevron-left"></i>
                    </button>
                    <button class="btn btn-light position-absolute top-50 end-0 translate-middle-y me-3" id="lightbox-next" aria-label="Next image">
                        <i class="bi bi-chevron-right"></i>
                    </button>
                    <img src="" alt="" id="lightbox-image">
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', lightboxHTML);
        }

        addLightboxControls() {
            const lightbox = document.getElementById('lightbox');
            const closeBtn = document.getElementById('lightbox-close');
            const prevBtn = document.getElementById('lightbox-prev');
            const nextBtn = document.getElementById('lightbox-next');

            // Close lightbox
            closeBtn.addEventListener('click', () => this.closeLightbox());
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) this.closeLightbox();
            });

            // Navigation
            prevBtn.addEventListener('click', () => this.showPrevImage());
            nextBtn.addEventListener('click', () => this.showNextImage());

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (!lightbox.classList.contains('active')) return;

                switch(e.key) {
                    case 'Escape':
                        this.closeLightbox();
                        break;
                    case 'ArrowLeft':
                        this.showPrevImage();
                        break;
                    case 'ArrowRight':
                        this.showNextImage();
                        break;
                }
            });
        }

        openLightbox(index) {
            this.images = Array.from(document.querySelectorAll('.gallery-item img'));
            this.currentIndex = index;
            this.showImage();
            document.getElementById('lightbox').classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        closeLightbox() {
            document.getElementById('lightbox').classList.remove('active');
            document.body.style.overflow = '';
        }

        showImage() {
            const img = this.images[this.currentIndex];
            const lightboxImg = document.getElementById('lightbox-image');
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
        }

        showPrevImage() {
            this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
            this.showImage();
        }

        showNextImage() {
            this.currentIndex = (this.currentIndex + 1) % this.images.length;
            this.showImage();
        }
    }

    // Initialize lightbox
    new Lightbox();

    // ====================
    // FORM VALIDATION & SUBMISSION
    // ====================
    class FormHandler {
        constructor() {
            this.init();
        }

        init() {
            // Newsletter forms
            const newsletterForm = document.getElementById('newsletter-form');
            if (newsletterForm) {
                newsletterForm.addEventListener('submit', (e) => this.handleNewsletter(e));
            }

            // Membership newsletter form
            const membershipNewsletterForm = document.getElementById('membership-newsletter');
            if (membershipNewsletterForm) {
                membershipNewsletterForm.addEventListener('submit', (e) => this.handleMembershipNewsletter(e));
            }

            // Contact form
            const contactForm = document.getElementById('contact-form');
            if (contactForm) {
                contactForm.addEventListener('submit', (e) => this.handleContact(e));
            }

            // Booking form
            const bookingForm = document.getElementById('booking-form');
            if (bookingForm) {
                bookingForm.addEventListener('submit', (e) => this.handleBooking(e));
            }
        }

        validateEmail(email) {
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        }

        showToast(message, type = 'success') {
            // Remove existing toasts
            const existingToasts = document.querySelectorAll('.toast');
            existingToasts.forEach(toast => toast.remove());

            // Create new toast
            const toastHTML = `
                <div class="toast align-items-center text-white border-0 ${type === 'error' ? 'error' : ''}" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="d-flex">
                        <div class="toast-body">${message}</div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', toastHTML);
            const toast = document.querySelector('.toast:last-child');

            // Initialize Bootstrap toast
            const bsToast = new bootstrap.Toast(toast);
            bsToast.show();

            // Auto remove after 5 seconds
            setTimeout(() => {
                toast.remove();
            }, 5000);
        }

        handleNewsletter(e) {
            e.preventDefault();
            const form = e.target;
            const email = form.querySelector('input[type="email"]').value.trim();

            if (!email) {
                this.showToast('Please enter your email address.', 'error');
                return;
            }

            if (!this.validateEmail(email)) {
                this.showToast('Please enter a valid email address.', 'error');
                return;
            }

            // Simulate form submission
            form.querySelector('button').disabled = true;
            form.querySelector('button').innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Subscribing...';

            setTimeout(() => {
                this.showToast('Thanks for subscribing! Check your email for confirmation.');
                form.reset();
                form.querySelector('button').disabled = false;
                form.querySelector('button').innerHTML = 'Subscribe';
            }, 1500);
        }

        handleMembershipNewsletter(e) {
            e.preventDefault();
            const form = e.target;
            const email = form.querySelector('input[type="email"]').value.trim();

            if (!email) {
                this.showToast('Please enter your email address for VIP access.', 'error');
                return;
            }

            if (!this.validateEmail(email)) {
                this.showToast('Please enter a valid email address.', 'error');
                return;
            }

            // Simulate membership form submission
            form.querySelector('button').disabled = true;
            form.querySelector('button').innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Joining...';

            setTimeout(() => {
                this.showToast('Welcome to Country J\'s Inner Circle! Check your email for exclusive access and your first download.');
                form.reset();
                form.querySelector('button').disabled = false;
                form.querySelector('button').innerHTML = '<i class="bi bi-envelope-fill me-2"></i>Sign Up';
            }, 1500);
        }

        handleContact(e) {
            e.preventDefault();
            const form = e.target;
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.classList.add('is-invalid');
                    isValid = false;
                } else {
                    field.classList.remove('is-invalid');
                }
            });

            const email = form.querySelector('input[type="email"]');
            if (email && email.value && !this.validateEmail(email.value)) {
                email.classList.add('is-invalid');
                isValid = false;
            }

            if (!isValid) {
                this.showToast('Please fill in all required fields correctly.', 'error');
                return;
            }

            // Simulate form submission
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending...';

            setTimeout(() => {
                this.showToast('Thanks for your message! We\'ll get back to you soon.');
                form.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Message';
            }, 2000);
        }

        handleBooking(e) {
            e.preventDefault();
            const form = e.target;
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.classList.add('is-invalid');
                    isValid = false;
                } else {
                    field.classList.remove('is-invalid');
                }
            });

            const email = form.querySelector('input[type="email"]');
            if (email && email.value && !this.validateEmail(email.value)) {
                email.classList.add('is-invalid');
                isValid = false;
            }

            if (!isValid) {
                this.showToast('Please fill in all required fields correctly.', 'error');
                return;
            }

            // Simulate form submission
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Submitting...';

            setTimeout(() => {
                this.showToast('Booking request submitted! We\'ll contact you within 24 hours.');
                form.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Submit Booking Request';
            }, 2500);
        }
    }

    // Initialize form handler
    const formHandler = new FormHandler();
    // Make toast available for other UI actions (share/copy/etc.)
    window.CJToast = (message, type = 'success') => {
        try {
            formHandler.showToast(message, type);
        } catch {
            // Fallback: do nothing
        }
    };

    // ====================
    // TOUR FILTERING
    // ====================
    class TourFilter {
        constructor() {
            this.init();
        }

        init() {
            const filterSelect = document.getElementById('tour-filter');
            if (!filterSelect) return;

            filterSelect.addEventListener('change', (e) => {
                this.filterTours(e.target.value);
            });
        }

        filterTours(filterValue) {
            const tourItems = document.querySelectorAll('.tour-item');
            const currentYear = new Date().getFullYear();

            tourItems.forEach(item => {
                const tourDate = item.dataset.date;
                const tourYear = new Date(tourDate).getFullYear();
                let show = true;

                switch(filterValue) {
                    case 'upcoming':
                        show = new Date(tourDate) > new Date();
                        break;
                    case 'past':
                        show = new Date(tourDate) < new Date();
                        break;
                    case '2024':
                    case '2025':
                    case '2026':
                        show = tourYear === parseInt(filterValue);
                        break;
                    default:
                        show = true;
                }

                item.style.display = show ? 'block' : 'none';
            });
        }
    }

    // Initialize tour filter
    new TourFilter();

    // ====================
    // TRACKLIST MODALS
    // ====================
    class TracklistModal {
        constructor() {
            this.init();
        }

        init() {
            const tracklistButtons = document.querySelectorAll('[data-bs-toggle="modal"]');
            tracklistButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const targetId = button.getAttribute('data-bs-target');
                    const modal = document.querySelector(targetId);
                    if (modal) {
                        // Load tracklist content dynamically if needed
                        this.loadTracklist(modal, button.dataset.release);
                    }
                });
            });
        }

        loadTracklist(modal, releaseId) {
            // This would typically load from an API or data file
            // For now, we'll use placeholder content
            const tracklistContent = modal.querySelector('.tracklist-content');
            if (!tracklistContent) return;

            // Sample tracklist data
            const tracklists = {
                'release-1': [
                    '1. Honky Tonk Heart',
                    '2. Dirt Road Dreams',
                    '3. Whiskey & Women',
                    '4. Buffalo Nights',
                    '5. Country Strong',
                    '6. Boot Scootin\' Blues',
                    '7. Southern Comfort',
                    '8. Guitar Town',
                    '9. Red Dirt Road',
                    '10. Last Call'
                ],
                'release-2': [
                    '1. Midnight Train',
                    '2. Barroom Brawl',
                    '3. Heartbreak Highway',
                    '4. Steel Guitar Cry',
                    '5. Lone Star State',
                    '6. Texas Two-Step',
                    '7. Amarillo Wind',
                    '8. Cowboy Boots',
                    '9. Border Town',
                    '10. Homeward Bound'
                ],
                // Add more releases as needed
            };

            const tracks = tracklists[releaseId] || ['Tracklist coming soon...'];
            tracklistContent.innerHTML = tracks.map(track => `<li class="list-group-item bg-transparent text-light border-secondary">${track}</li>`).join('');
        }
    }

    // Initialize tracklist modal handler
    new TracklistModal();

    // ====================
    // STICKY NAVIGATION ENHANCEMENT
    // ====================
    class StickyNav {
        constructor() {
            this.navbar = document.querySelector('.navbar');
            this.init();
        }

        init() {
            if (!this.navbar) return;

            window.addEventListener('scroll', () => {
                if (window.scrollY > 100) {
                    this.navbar.classList.add('navbar-scrolled');
                } else {
                    this.navbar.classList.remove('navbar-scrolled');
                }
            });
        }
    }

    // Initialize sticky nav enhancement
    new StickyNav();

    // ====================
    // SMOOTH SCROLLING
    // ====================
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ====================
    // SCROLL SLIDER (PAGE SCROLL CONTROL)
    // ====================
    (function initScrollSlider() {
        const slider = document.getElementById('scrollSlider');
        if (!slider) return;

        function getScrollableHeight() {
            const doc = document.documentElement;
            return Math.max(0, doc.scrollHeight - doc.clientHeight);
        }

        function updateSliderFromScroll() {
            const scrollable = getScrollableHeight();
            const y = window.scrollY || document.documentElement.scrollTop || 0;
            const ratio = scrollable === 0 ? 0 : (y / scrollable);
            slider.value = String(Math.round(ratio * Number(slider.max)));

            // Hide/disable if no scrolling is possible
            const isScrollable = scrollable > 0;
            slider.style.display = isScrollable ? '' : 'none';
            slider.disabled = !isScrollable;
        }

        function scrollFromSlider() {
            const scrollable = getScrollableHeight();
            if (scrollable === 0) return;
            const ratio = Number(slider.value) / Number(slider.max);
            window.scrollTo({ top: Math.round(ratio * scrollable), behavior: 'auto' });
        }

        window.addEventListener('scroll', updateSliderFromScroll, { passive: true });
        window.addEventListener('resize', updateSliderFromScroll);
        slider.addEventListener('input', scrollFromSlider);

        // Initial sync
        updateSliderFromScroll();
    })();

    // ====================
    // SHARE BUTTONS (NO DEAD LINKS)
    // ====================
    document.addEventListener('click', async (e) => {
        const btn = e.target && e.target.closest ? e.target.closest('.btn-share') : null;
        if (!btn) return;

        const shareUrl = window.location.href;
        const shareData = { title: document.title, url: shareUrl };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                window.CJToast && window.CJToast('Shared successfully.');
                return;
            }
        } catch {
            // Ignore share cancellation/errors and try clipboard fallback
        }

        try {
            await navigator.clipboard.writeText(shareUrl);
            window.CJToast && window.CJToast('Link copied to clipboard.');
        } catch {
            window.CJToast && window.CJToast('Copy failed — please copy the URL from the address bar.', 'error');
        }
    });

    // ====================
    // LAZY LOADING FOR IMAGES
    // ====================
    class LazyLoad {
        constructor() {
            this.init();
        }

        init() {
            const images = document.querySelectorAll('img[data-src]');
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }
    }

    // Initialize lazy loading
    new LazyLoad();

    // ====================
    // ACCESSIBILITY ENHANCEMENTS
    // ====================
    class Accessibility {
        constructor() {
            this.init();
        }

        init() {
            // Skip to main content link
            this.addSkipLink();

            // Focus management for modals
            this.handleModalFocus();

            // High contrast mode detection
            this.detectHighContrast();
        }

        addSkipLink() {
            const skipLink = document.createElement('a');
            skipLink.href = '#main-content';
            skipLink.className = 'sr-only sr-only-focusable btn btn-primary position-absolute top-0 start-0 m-3';
            skipLink.textContent = 'Skip to main content';
            skipLink.style.zIndex = '9999';
            document.body.insertBefore(skipLink, document.body.firstChild);
        }

        handleModalFocus() {
            document.addEventListener('shown.bs.modal', (e) => {
                const modal = e.target;
                const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                const firstFocusable = focusableElements[0];
                const lastFocusable = focusableElements[focusableElements.length - 1];

                modal.addEventListener('keydown', (e) => {
                    if (e.key === 'Tab') {
                        if (e.shiftKey) {
                            if (document.activeElement === firstFocusable) {
                                e.preventDefault();
                                lastFocusable.focus();
                            }
                        } else {
                            if (document.activeElement === lastFocusable) {
                                e.preventDefault();
                                firstFocusable.focus();
                            }
                        }
                    }
                });
            });
        }

        detectHighContrast() {
            // Check for high contrast mode
            const testElement = document.createElement('div');
            testElement.style.color = 'rgb(31, 41, 55)';
            document.body.appendChild(testElement);

            const computedColor = window.getComputedStyle(testElement).color;
            const isHighContrast = computedColor === 'rgb(0, 0, 0)' || computedColor === 'rgb(255, 255, 255)';

            document.body.removeChild(testElement);

            if (isHighContrast) {
                document.body.classList.add('high-contrast');
            }
        }
    }

    // Initialize accessibility enhancements
    new Accessibility();

    // ====================
    // ACTIVE NAV LINKS
    // ====================
    (function setActiveNavLink() {
        const navLinks = document.querySelectorAll('.navbar .nav-link[href]');
        if (!navLinks.length) return;

        const currentPath = (window.location.pathname || '').split('/').pop() || 'index.html';
        navLinks.forEach(link => {
            const href = link.getAttribute('href') || '';
            const hrefPath = href.split('/').pop();
            const isMatch = hrefPath === currentPath;
            link.classList.toggle('active', isMatch);
            if (isMatch) link.setAttribute('aria-current', 'page');
            else link.removeAttribute('aria-current');
        });
    })();

    // ====================
    // REVEAL ON SCROLL
    // ====================
    (function revealOnScroll() {
        const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        // Mark elements we want to reveal without editing every HTML file
        const candidates = [
            ...document.querySelectorAll('section.section'),
            ...document.querySelectorAll('.card'),
            ...document.querySelectorAll('.tour-item'),
            ...document.querySelectorAll('.video-card')
        ];

        const unique = Array.from(new Set(candidates));
        unique.forEach(el => el.classList.add('reveal'));

        if (!('IntersectionObserver' in window)) {
            unique.forEach(el => el.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });

        unique.forEach(el => observer.observe(el));
    })();

    // ====================
    // FUN CURSOR (DESKTOP ONLY)
    // ====================
    (function funCursor() {
        const isFinePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
        const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!isFinePointer || prefersReducedMotion) return;

        const dot = document.createElement('div');
        dot.className = 'cj-cursor-dot';
        const ring = document.createElement('div');
        ring.className = 'cj-cursor-ring';
        document.body.appendChild(dot);
        document.body.appendChild(ring);

        const style = document.createElement('style');
        style.textContent = `
            .cj-cursor-dot, .cj-cursor-ring {
                position: fixed;
                top: 0; left: 0;
                pointer-events: none;
                z-index: 99999;
                transform: translate(-50%, -50%);
            }
            .cj-cursor-dot {
                width: 7px; height: 7px;
                border-radius: 999px;
                background: rgba(124, 58, 237, 0.95);
                box-shadow: 0 0 18px rgba(124, 58, 237, 0.55);
            }
            .cj-cursor-ring {
                width: 26px; height: 26px;
                border-radius: 999px;
                border: 2px solid rgba(255, 255, 255, 0.22);
                backdrop-filter: blur(6px);
                transition: width .15s ease, height .15s ease, border-color .15s ease, box-shadow .15s ease;
                box-shadow: 0 0 30px rgba(0,0,0,0.12);
            }
            .cj-cursor-ring.is-hover {
                width: 34px; height: 34px;
                border-color: rgba(124, 58, 237, 0.65);
                box-shadow: 0 0 36px rgba(124, 58, 237, 0.18);
            }
        `;
        document.head.appendChild(style);

        let x = window.innerWidth / 2;
        let y = window.innerHeight / 2;
        let rx = x;
        let ry = y;

        window.addEventListener('mousemove', (e) => {
            x = e.clientX;
            y = e.clientY;
            dot.style.top = `${y}px`;
            dot.style.left = `${x}px`;
        }, { passive: true });

        function animate() {
            rx += (x - rx) * 0.18;
            ry += (y - ry) * 0.18;
            ring.style.top = `${ry}px`;
            ring.style.left = `${rx}px`;
            requestAnimationFrame(animate);
        }
        animate();

        document.addEventListener('mouseover', (e) => {
            const target = e.target;
            if (!target) return;
            const hoverable = target.closest && target.closest('a, button, .btn, .linktree-link, .card');
            ring.classList.toggle('is-hover', !!hoverable);
        }, { passive: true });
    })();

    // ====================
    // PERFORMANCE OPTIMIZATIONS
    // ====================
    // Preload critical images
    const preloadImages = [
        'assets/media/hero-country-j-live.jpg',
        'assets/media/hero-country-j-music.jpg',
        'assets/media/hero-country-j-tour.jpg',
        'assets/media/LogoStyles/nologoheadercountryj.jpeg'
    ];
    preloadImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });

});
