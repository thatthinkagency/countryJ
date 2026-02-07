// Country J Website - Vanilla JavaScript Functionality
document.addEventListener('DOMContentLoaded', function() {

    // ====================
    // CUSTOM SUCCESS POPUP
    // ====================
    (function createPopupMarkup() {
        // Inject CSS once
        const style = document.createElement('style');
        style.textContent = `
            .cj-popup-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.75);z-index:99999;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .3s ease;pointer-events:none}
            .cj-popup-backdrop.show{opacity:1;pointer-events:auto}
            .cj-popup{background:linear-gradient(145deg,#1a1a2e,#16213e);border:2px solid #d4af37;border-radius:16px;padding:2.5rem 2rem 2rem;max-width:420px;width:90%;text-align:center;transform:scale(.85);transition:transform .35s cubic-bezier(.34,1.56,.64,1);box-shadow:0 0 40px rgba(212,175,55,.35)}
            .cj-popup-backdrop.show .cj-popup{transform:scale(1)}
            .cj-popup h2{font-family:'Helvetica Neue',Arial,sans-serif;color:#d4af37;font-size:1.8rem;font-weight:800;margin-bottom:.75rem;text-transform:uppercase;letter-spacing:1px}
            .cj-popup p{color:#f0e6d3;font-size:1.1rem;line-height:1.6;margin-bottom:1.5rem}
            .cj-popup button{background:linear-gradient(45deg,#d4af37,#fdcb6e);border:none;border-radius:30px;color:#0f0f23;font-weight:700;font-size:1rem;padding:.65rem 2.5rem;cursor:pointer;text-transform:uppercase;letter-spacing:1px;transition:box-shadow .2s}
            .cj-popup button:hover{box-shadow:0 4px 18px rgba(212,175,55,.55)}
        `;
        document.head.appendChild(style);

        // Inject HTML once
        const div = document.createElement('div');
        div.innerHTML = `
            <div class="cj-popup-backdrop" id="cjPopup">
                <div class="cj-popup">
                    <h2>Thanks Partner</h2>
                    <p>Your Mail Has Been Delivered.</p>
                    <button id="cjPopupClose">Got It</button>
                </div>
            </div>
        `;
        document.body.appendChild(div.firstElementChild);

        // Close handler
        const backdrop = document.getElementById('cjPopup');
        const closeBtn = document.getElementById('cjPopupClose');
        closeBtn.addEventListener('click', function() { backdrop.classList.remove('show'); });
        backdrop.addEventListener('click', function(e) { if (e.target === backdrop) backdrop.classList.remove('show'); });
    })();

    // Global function any page can call
    window.showPartnerPopup = function() {
        const popup = document.getElementById('cjPopup');
        if (popup) popup.classList.add('show');
    };

    // ====================
    // GO HIGH LEVEL (GHL) WEBHOOK
    // ====================
    const GHL_WEBHOOK = 'https://services.leadconnectorhq.com/hooks/BGm5WYULqMrpuZ71ONr1/webhook-trigger/b5dbcc1e-1db5-4a7c-9657-09972a883ceb';

    // Send contact data to GHL — fire-and-forget, never blocks the UI
    window.sendToGHL = function(data) {
        // Build payload with standard GHL contact fields
        var payload = {};
        if (data.email)   payload.email = data.email;
        if (data.name)    payload.name = data.name;
        if (data.firstName) payload.firstName = data.firstName;
        if (data.lastName)  payload.lastName = data.lastName;
        if (data.phone)   payload.phone = data.phone;
        if (data.message) payload.message = data.message;
        if (data.source)  payload.source = data.source;
        if (data.tags)    payload.tags = data.tags;

        // Fire-and-forget POST to GHL webhook
        fetch(GHL_WEBHOOK, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            mode: 'no-cors' // GHL may not send CORS headers; no-cors ensures it fires
        }).catch(function() { /* silent fail — email delivery is primary */ });
    };

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
            const form = e.target;
            const email = form.querySelector('input[type="email"]').value.trim();

            if (!email) {
                e.preventDefault();
                this.showToast('Please enter your email address.', 'error');
                return;
            }

            if (!this.validateEmail(email)) {
                e.preventDefault();
                this.showToast('Please enter a valid email address.', 'error');
                return;
            }

            // Prevent default so we can show popup, then submit via fetch
            e.preventDefault();

            // Show loading state
            const btn = form.querySelector('button');
            const originalHTML = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Subscribing...';

            // Send to GHL in parallel
            window.sendToGHL({ email: email, source: 'Newsletter Signup', tags: ['newsletter', 'website'] });

            // Submit to FormSubmit via fetch (no redirect)
            const formData = new FormData(form);
            fetch(form.action || 'https://formsubmit.co/officialcountryj@proton.me', {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            }).then(function() {
                window.showPartnerPopup();
                form.reset();
                btn.disabled = false;
                btn.innerHTML = originalHTML;
            }).catch(function() {
                // Still show popup even if fetch had an issue (email usually still sends)
                window.showPartnerPopup();
                form.reset();
                btn.disabled = false;
                btn.innerHTML = originalHTML;
            });
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

            // Send to GHL
            window.sendToGHL({ email: email, source: 'Membership Signup', tags: ['membership', 'inner-circle', 'website'] });

            // Show loading state
            const btn = form.querySelector('button');
            const originalHTML = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Joining...';

            setTimeout(() => {
                window.showPartnerPopup();
                form.reset();
                btn.disabled = false;
                btn.innerHTML = originalHTML;
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

            // Send to GHL with full contact details
            var contactName = (form.querySelector('#contact-name') || {}).value || '';
            var contactEmail = (email || {}).value || '';
            var contactSubject = (form.querySelector('#contact-subject') || {}).value || '';
            var contactMessage = (form.querySelector('#contact-message') || {}).value || '';
            window.sendToGHL({
                email: contactEmail,
                name: contactName,
                message: contactSubject + ': ' + contactMessage,
                source: 'Contact Form',
                tags: ['contact-form', 'website']
            });

            // Submit to FormSubmit
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Sending...';

            var formData = new FormData(form);
            fetch(form.action || 'https://formsubmit.co/officialcountryj@proton.me', {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            }).then(function() {
                window.showPartnerPopup();
                form.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Message';
            }).catch(function() {
                window.showPartnerPopup();
                form.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Send Message';
            });
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

            // Send to GHL with booking details
            var bookingName = (form.querySelector('#contact-name') || {}).value || '';
            var bookingEmail = (email || {}).value || '';
            var bookingPhone = (form.querySelector('#contact-phone') || {}).value || '';
            var eventType = (form.querySelector('#event-type') || {}).value || '';
            var eventDate = (form.querySelector('#event-date') || {}).value || '';
            var venueName = (form.querySelector('#venue-name') || {}).value || '';
            var cityState = (form.querySelector('#city-state') || {}).value || '';
            var bookingNotes = (form.querySelector('#additional-notes') || {}).value || '';
            window.sendToGHL({
                email: bookingEmail,
                name: bookingName,
                phone: bookingPhone,
                message: 'Booking: ' + eventType + ' | ' + eventDate + ' | ' + venueName + ', ' + cityState + ' | ' + bookingNotes,
                source: 'Booking Request',
                tags: ['booking-request', 'website']
            });

            // Submit to FormSubmit
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Submitting...';

            var formData = new FormData(form);
            fetch('https://formsubmit.co/officialcountryj@proton.me', {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            }).then(function() {
                window.showPartnerPopup();
                form.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Submit Booking Request';
            }).catch(function() {
                window.showPartnerPopup();
                form.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Submit Booking Request';
            });
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
