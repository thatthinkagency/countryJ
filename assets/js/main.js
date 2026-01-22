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
            // Newsletter form
            const newsletterForm = document.getElementById('newsletter-form');
            if (newsletterForm) {
                newsletterForm.addEventListener('submit', (e) => this.handleNewsletter(e));
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
    new FormHandler();

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
    // PERFORMANCE OPTIMIZATIONS
    // ====================
    // Preload critical images
    const preloadImages = [
        'assets/media/hero-country-j-live.jpg',
        'assets/media/hero-country-j-music.jpg',
        'assets/media/hero-country-j-tour.jpg'
    ];
    preloadImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });

});
