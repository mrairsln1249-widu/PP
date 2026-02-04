// Main JavaScript for Pesantren Peradaban Website

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.innerHTML = navMenu.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
                navToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
        
        // Handle dropdown on mobile
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    const dropdown = this.parentElement;
                    dropdown.classList.toggle('active');
                }
            });
        });
    }
    
    // Carousel Functionality
    const carouselContainer = document.querySelector('.carousel-container');
    
    if (carouselContainer) {
        // Element references
        const slides = document.querySelectorAll('.carousel-slide');
        const dots = document.querySelectorAll('.dot');
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');
        
        let currentSlide = 0;
        const totalSlides = slides.length;
        let slideInterval;
        let isTransitioning = false;
        
        // Initialize carousel
        function initCarousel() {
            // Start auto slide
            startAutoSlide();
            
            // Set initial active state
            updateSlide();
            
            // Event listeners for arrows
            if (prevBtn) {
                prevBtn.addEventListener('click', showPrevSlide);
            }
            
            if (nextBtn) {
                nextBtn.addEventListener('click', showNextSlide);
            }
            
            // Event listeners for dots
            dots.forEach(dot => {
                dot.addEventListener('click', function() {
                    if (isTransitioning) return;
                    const slideIndex = parseInt(this.getAttribute('data-slide'));
                    goToSlide(slideIndex);
                });
            });
            
            // Pause auto slide on hover
            carouselContainer.addEventListener('mouseenter', pauseAutoSlide);
            carouselContainer.addEventListener('mouseleave', startAutoSlide);
            
            // Touch events for mobile swipe
            setupTouchEvents();
        }
        
        // Setup touch events for mobile
        function setupTouchEvents() {
            let startX = 0;
            let endX = 0;
            let startY = 0;
            let isScrolling = false;
            
            carouselContainer.addEventListener('touchstart', function(e) {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                isScrolling = false;
                pauseAutoSlide();
            });
            
            carouselContainer.addEventListener('touchmove', function(e) {
                if (!isScrolling) {
                    const moveY = e.touches[0].clientY - startY;
                    const moveX = e.touches[0].clientX - startX;
                    
                    // Check if the user is scrolling vertically
                    if (Math.abs(moveY) > Math.abs(moveX)) {
                        isScrolling = true;
                    }
                }
            });
            
            carouselContainer.addEventListener('touchend', function(e) {
                if (isScrolling) {
                    startAutoSlide();
                    return;
                }
                
                endX = e.changedTouches[0].clientX;
                handleSwipe();
                startAutoSlide();
            });
            
            function handleSwipe() {
                const swipeThreshold = 50;
                
                if (startX - endX > swipeThreshold) {
                    // Swipe kiri - next slide
                    showNextSlide();
                } else if (endX - startX > swipeThreshold) {
                    // Swipe kanan - prev slide
                    showPrevSlide();
                }
            }
        }
        
        // Show next slide
        function showNextSlide() {
            if (isTransitioning) return;
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlide();
            resetAutoSlide();
        }
        
        // Show previous slide
        function showPrevSlide() {
            if (isTransitioning) return;
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlide();
            resetAutoSlide();
        }
        
        // Go to specific slide
        function goToSlide(slideIndex) {
            if (isTransitioning || slideIndex === currentSlide) return;
            currentSlide = slideIndex;
            updateSlide();
            resetAutoSlide();
        }
        
        // Update slide display
        function updateSlide() {
            isTransitioning = true;
            
            // Hide all slides
            slides.forEach(slide => {
                slide.classList.remove('active');
            });
            
            // Remove active class from all dots
            dots.forEach(dot => {
                dot.classList.remove('active');
            });
            
            // Show current slide
            setTimeout(() => {
                slides[currentSlide].classList.add('active');
                
                // Activate current dot
                if (dots[currentSlide]) {
                    dots[currentSlide].classList.add('active');
                }
                
                isTransitioning = false;
            }, 50);
        }
        
        // Auto slide functionality
        function startAutoSlide() {
            slideInterval = setInterval(showNextSlide, 5000); // Change slide every 5 seconds
        }
        
        function pauseAutoSlide() {
            clearInterval(slideInterval);
        }
        
        function resetAutoSlide() {
            pauseAutoSlide();
            startAutoSlide();
        }
        
        // Initialize the carousel
        initCarousel();
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            // Hanya aktifkan jika carousel ada di halaman
            if (slides.length > 0) {
                if (e.key === 'ArrowLeft') {
                    showPrevSlide();
                } else if (e.key === 'ArrowRight') {
                    showNextSlide();
                }
            }
        });
        
        // Public API untuk kontrol dari luar jika diperlukan
        window.pesantrenCarousel = {
            nextSlide: showNextSlide,
            prevSlide: showPrevSlide,
            goToSlide: goToSlide,
            pause: pauseAutoSlide,
            play: startAutoSlide
        };
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#" or external link
            if (href === '#' || href.startsWith('http')) return;
            
            // Check if the target is on the same page
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    if (navToggle) {
                        navToggle.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                }
                
                // Calculate header height for offset
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add active class to current page in navigation
    function setActiveNavLink() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            
            // Remove active class from all
            link.classList.remove('active');
            
            // Check if this link matches current page
            if (linkHref === currentPage || 
                (currentPage === 'index.html' && linkHref === 'index.html') ||
                (currentPage === '' && linkHref === 'index.html')) {
                link.classList.add('active');
            }
            
            // Handle program pages
            const programPages = ['smp-pesantren.html', 'sma-fullday.html', 'sma-boarding.html'];
            if (programPages.includes(currentPage) && linkHref === '#') {
                // This is for the program dropdown
                link.classList.add('active');
            }
        });
    }
    
    setActiveNavLink();
    
    // Form validation for contact/registration forms
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
            
            inputs.forEach(input => {
                // Reset error state
                input.classList.remove('error');
                
                // Check if field is empty
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                    
                    // Create error message if it doesn't exist
                    if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
                        const errorMsg = document.createElement('div');
                        errorMsg.className = 'error-message';
                        errorMsg.textContent = 'Field ini harus diisi';
                        errorMsg.style.color = '#e74c3c';
                        errorMsg.style.fontSize = '0.85rem';
                        errorMsg.style.marginTop = '0.3rem';
                        input.parentNode.insertBefore(errorMsg, input.nextSibling);
                    }
                } else {
                    // Remove error message if it exists
                    if (input.nextElementSibling && input.nextElementSibling.classList.contains('error-message')) {
                        input.nextElementSibling.remove();
                    }
                    
                    // Email validation
                    if (input.type === 'email') {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(input.value)) {
                            isValid = false;
                            input.classList.add('error');
                            
                            if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
                                const errorMsg = document.createElement('div');
                                errorMsg.className = 'error-message';
                                errorMsg.textContent = 'Format email tidak valid';
                                errorMsg.style.color = '#e74c3c';
                                errorMsg.style.fontSize = '0.85rem';
                                errorMsg.style.marginTop = '0.3rem';
                                input.parentNode.insertBefore(errorMsg, input.nextSibling);
                            }
                        }
                    }
                    
                    // Phone validation
                    if (input.type === 'tel' || input.name === 'phone') {
                        const phoneRegex = /^[0-9+\-\s()]{10,}$/;
                        if (!phoneRegex.test(input.value)) {
                            isValid = false;
                            input.classList.add('error');
                            
                            if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
                                const errorMsg = document.createElement('div');
                                errorMsg.className = 'error-message';
                                errorMsg.textContent = 'Format nomor telepon tidak valid';
                                errorMsg.style.color = '#e74c3c';
                                errorMsg.style.fontSize = '0.85rem';
                                errorMsg.style.marginTop = '0.3rem';
                                input.parentNode.insertBefore(errorMsg, input.nextSibling);
                            }
                        }
                    }
                }
            });
            
            if (isValid) {
                // Show success message
                const successMsg = document.createElement('div');
                successMsg.className = 'success-message';
                successMsg.textContent = 'Form berhasil dikirim! Kami akan menghubungi Anda segera.';
                successMsg.style.backgroundColor = '#2ecc71';
                successMsg.style.color = 'white';
                successMsg.style.padding = '1rem';
                successMsg.style.borderRadius = '8px';
                successMsg.style.marginTop = '1.5rem';
                successMsg.style.textAlign = 'center';
                
                // Remove any existing success message
                const existingMsg = form.querySelector('.success-message');
                if (existingMsg) {
                    existingMsg.remove();
                }
                
                form.appendChild(successMsg);
                
                // Reset form after 3 seconds
                setTimeout(() => {
                    form.reset();
                    successMsg.remove();
                }, 3000);
                
                // In a real application, you would submit the form data here
                // form.submit();
            }
        });
        
        // Clear error on input
        form.addEventListener('input', function(e) {
            if (e.target.classList.contains('error')) {
                e.target.classList.remove('error');
                
                // Remove error message
                const errorMsg = e.target.nextElementSibling;
                if (errorMsg && errorMsg.classList.contains('error-message')) {
                    errorMsg.remove();
                }
            }
        });
    });
    
    // Counter animation for stats
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const increment = target / (duration / 16); // 60fps
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + (element.textContent.includes('+') ? '+' : '');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '');
            }
        }, 16);
    }
    
    // Initialize counter animation when stats are in viewport
    function initCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        if (statNumbers.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const target = parseInt(element.textContent.replace('+', ''));
                    
                    if (!element.classList.contains('animated')) {
                        element.classList.add('animated');
                        animateCounter(element, target);
                    }
                }
            });
        }, { threshold: 0.5 });
        
        statNumbers.forEach(number => {
            observer.observe(number);
        });
    }
    
    // Call counter initialization
    initCounters();
    
    // Back to top button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.style.position = 'fixed';
    backToTopBtn.style.bottom = '2rem';
    backToTopBtn.style.right = '2rem';
    backToTopBtn.style.width = '50px';
    backToTopBtn.style.height = '50px';
    backToTopBtn.style.backgroundColor = 'var(--gold)';
    backToTopBtn.style.color = 'var(--navy)';
    backToTopBtn.style.borderRadius = '50%';
    backToTopBtn.style.border = 'none';
    backToTopBtn.style.fontSize = '1.2rem';
    backToTopBtn.style.cursor = 'pointer';
    backToTopBtn.style.boxShadow = '0 4px 12px rgba(10, 42, 94, 0.2)';
    backToTopBtn.style.zIndex = '100';
    backToTopBtn.style.opacity = '0';
    backToTopBtn.style.transition = 'all 0.3s ease';
    backToTopBtn.style.display = 'flex';
    backToTopBtn.style.alignItems = 'center';
    backToTopBtn.style.justifyContent = 'center';
    
    document.body.appendChild(backToTopBtn);
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.transform = 'translateY(0)';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.transform = 'translateY(20px)';
        }
    });
    
    // Add loading animation for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        // Add loading class for fade-in effect
        img.classList.add('loading');
        
        img.addEventListener('load', function() {
            this.classList.remove('loading');
            this.classList.add('loaded');
        });
        
        // If image already loaded
        if (img.complete) {
            img.classList.remove('loading');
            img.classList.add('loaded');
        }
    });
    
    // Add loading styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        img.loading {
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        img.loaded {
            opacity: 1;
        }
        .back-to-top:hover {
            background-color: var(--gold-light) !important;
            transform: translateY(-5px) !important;
            box-shadow: 0 8px 20px rgba(10, 42, 94, 0.3) !important;
        }
    `;
    document.head.appendChild(style);
});

// ============================================
// JAVASCRIPT KHUSUS UNTUK HALMAN PESANTREN PERADABAN
// Semua fungsi dimulai dengan prefix "pp_" untuk menghindari konflik
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi semua komponen halaman
    pp_initPageComponents();
});

function pp_initPageComponents() {
    // Initialize form validation
    pp_initFormValidation();
    
    // Initialize registration form steps
    pp_initRegistrationSteps();
    
    // Initialize teacher modal
    pp_initTeacherModal();
    
    // Initialize image gallery
    pp_initImageGallery();
    
    // Initialize counters
    pp_initCounters();
    
    // Initialize accordion
    pp_initAccordion();
}

// Form Validation untuk semua form
function pp_initFormValidation() {
    const forms = document.querySelectorAll('.pp-form-container form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (pp_validateForm(this)) {
                pp_showFormSuccess(this);
                pp_submitToGoogleSheets(this);
            }
        });
        
        // Real-time validation
        const inputs = form.querySelectorAll('.pp-form-control');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                pp_validateField(this);
            });
            
            input.addEventListener('input', function() {
                const errorElement = this.nextElementSibling;
                if (errorElement && errorElement.classList.contains('pp-form-error')) {
                    errorElement.classList.remove('show');
                    this.classList.remove('error');
                }
            });
        });
    });
}

function pp_validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!pp_validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function pp_validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Field ini harus diisi';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Format email tidak valid';
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[0-9+\-\s()]{10,}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Format nomor telepon tidak valid';
        }
    }
    
    // Show error message
    if (!isValid) {
        field.classList.add('error');
        let errorElement = field.nextElementSibling;
        
        if (!errorElement || !errorElement.classList.contains('pp-form-error')) {
            errorElement = document.createElement('div');
            errorElement.className = 'pp-form-error';
            field.parentNode.insertBefore(errorElement, field.nextSibling);
        }
        
        errorElement.textContent = errorMessage;
        errorElement.classList.add('show');
    } else {
        field.classList.remove('error');
        const errorElement = field.nextElementSibling;
        if (errorElement && errorElement.classList.contains('pp-form-error')) {
            errorElement.classList.remove('show');
        }
    }
    
    return isValid;
}

function pp_showFormSuccess(form) {
    const successElement = form.querySelector('.pp-form-success') || 
                          document.createElement('div');
    
    if (!successElement.classList.contains('pp-form-success')) {
        successElement.className = 'pp-form-success';
        form.appendChild(successElement);
    }
    
    successElement.textContent = 'Form berhasil dikirim! Kami akan menghubungi Anda segera.';
    successElement.classList.add('show');
    
    // Clear form after 3 seconds
    setTimeout(() => {
        form.reset();
        successElement.classList.remove('show');
    }, 3000);
}

// Google Sheets Integration
function pp_submitToGoogleSheets(form) {
    // URL Google Apps Script Web App (ganti dengan URL Anda)
    const scriptURL = 'https://script.google.com/macros/s/YOUR_GOOGLE_APPS_SCRIPT_ID/exec';
    
    // Collect form data
    const formData = new FormData(form);
    const data = {};
    
    formData.forEach((value, key) => {
        data[key] = value;
    });
    
    // Add timestamp
    data['timestamp'] = new Date().toISOString();
    
    // Kirim data ke Google Sheets
    fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(() => {
        console.log('Data berhasil dikirim ke Google Sheets');
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Registration Form Steps
function pp_initRegistrationSteps() {
    const registrationForm = document.querySelector('.pp-registration-form');
    if (!registrationForm) return;
    
    const steps = registrationForm.querySelectorAll('.pp-step');
    const stepForms = registrationForm.querySelectorAll('.pp-step-form');
    const btnPrev = registrationForm.querySelector('.pp-btn-prev');
    const btnNext = registrationForm.querySelector('.pp-btn-next');
    
    let currentStep = 0;
    
    // Initialize steps
    pp_updateStepDisplay(currentStep);
    
    // Next button click
    if (btnNext) {
        btnNext.addEventListener('click', function() {
            const currentForm = stepForms[currentStep];
            if (pp_validateStepForm(currentForm)) {
                if (currentStep < steps.length - 1) {
                    currentStep++;
                    pp_updateStepDisplay(currentStep);
                } else {
                    // Submit the final form
                    registrationForm.submit();
                }
            }
        });
    }
    
    // Previous button click
    if (btnPrev) {
        btnPrev.addEventListener('click', function() {
            if (currentStep > 0) {
                currentStep--;
                pp_updateStepDisplay(currentStep);
            }
        });
    }
    
    // Step click
    steps.forEach((step, index) => {
        step.addEventListener('click', function() {
            if (index < currentStep || steps[index].classList.contains('completed')) {
                currentStep = index;
                pp_updateStepDisplay(currentStep);
            }
        });
    });
}

function pp_updateStepDisplay(stepIndex) {
    const registrationForm = document.querySelector('.pp-registration-form');
    const steps = registrationForm.querySelectorAll('.pp-step');
    const stepForms = registrationForm.querySelectorAll('.pp-step-form');
    const btnPrev = registrationForm.querySelector('.pp-btn-prev');
    const btnNext = registrationForm.querySelector('.pp-btn-next');
    
    // Update step indicators
    steps.forEach((step, index) => {
        step.classList.remove('active', 'completed');
        
        if (index < stepIndex) {
            step.classList.add('completed');
        } else if (index === stepIndex) {
            step.classList.add('active');
        }
    });
    
    // Update form display
    stepForms.forEach((form, index) => {
        form.classList.remove('active');
        if (index === stepIndex) {
            form.classList.add('active');
        }
    });
    
    // Update button text
    if (btnNext) {
        btnNext.textContent = stepIndex === steps.length - 1 ? 'Kirim Pendaftaran' : 'Lanjut';
    }
    
    // Update button states
    if (btnPrev) {
        btnPrev.disabled = stepIndex === 0;
    }
    
    // Scroll to top of form
    registrationForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function pp_validateStepForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!pp_validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Teacher Modal
function pp_initTeacherModal() {
    const teacherCards = document.querySelectorAll('.pp-teacher-card');
    const modal = document.createElement('div');
    modal.className = 'pp-teacher-modal';
    modal.innerHTML = `
        <div class="pp-modal-content">
            <span class="pp-modal-close">&times;</span>
            <div class="pp-modal-body"></div>
        </div>
    `;
    document.body.appendChild(modal);
    
    teacherCards.forEach(card => {
        card.addEventListener('click', function() {
            const name = this.querySelector('.pp-teacher-name').textContent;
            const subject = this.querySelector('.pp-teacher-subject').textContent;
            const bio = this.querySelector('.pp-teacher-bio').textContent;
            const imgSrc = this.querySelector('img').src;
            
            modal.querySelector('.pp-modal-body').innerHTML = `
                <div class="pp-modal-teacher">
                    <div class="pp-modal-img">
                        <img src="${imgSrc}" alt="${name}">
                    </div>
                    <div class="pp-modal-info">
                        <h2>${name}</h2>
                        <h3>${subject}</h3>
                        <p>${bio}</p>
                        <div class="pp-modal-details">
                            <p><strong>Pendidikan:</strong> S1 Pendidikan Agama Islam - Universitas Islam Negeri</p>
                            <p><strong>Pengalaman:</strong> 10+ tahun mengajar di pesantren</p>
                            <p><strong>Keahlian:</strong> Tahfiz Al-Qur'an, Fiqh, Bahasa Arab</p>
                        </div>
                    </div>
                </div>
            `;
            
            modal.style.display = 'flex';
        });
    });
    
    // Close modal
    modal.querySelector('.pp-modal-close').addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .pp-teacher-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            align-items: center;
            justify-content: center;
            padding: 2rem;
        }
        .pp-modal-content {
            background-color: white;
            border-radius: 12px;
            max-width: 800px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            animation: pp-modalFadeIn 0.3s ease;
        }
        .pp-modal-close {
            position: absolute;
            top: 1rem;
            right: 1.5rem;
            font-size: 2rem;
            color: var(--pp-navy);
            cursor: pointer;
            z-index: 10001;
        }
        .pp-modal-body {
            padding: 3rem;
        }
        .pp-modal-teacher {
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 2rem;
        }
        .pp-modal-img {
            border-radius: 12px;
            overflow: hidden;
        }
        .pp-modal-img img {
            width: 100%;
            height: auto;
            display: block;
        }
        .pp-modal-info h2 {
            color: var(--pp-navy);
            margin-bottom: 0.5rem;
        }
        .pp-modal-info h3 {
            color: var(--pp-gold);
            margin-bottom: 1.5rem;
        }
        .pp-modal-info p {
            color: var(--pp-dark-gray);
            line-height: 1.6;
            margin-bottom: 1.5rem;
        }
        .pp-modal-details p {
            margin-bottom: 0.5rem;
        }
        @keyframes pp-modalFadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
            .pp-modal-teacher {
                grid-template-columns: 1fr;
            }
            .pp-modal-body {
                padding: 2rem;
            }
        }
    `;
    document.head.appendChild(style);
}

// Image Gallery
function pp_initImageGallery() {
    const galleryContainers = document.querySelectorAll('.pp-gallery');
    
    galleryContainers.forEach(container => {
        const images = container.querySelectorAll('img');
        const lightbox = document.createElement('div');
        lightbox.className = 'pp-lightbox';
        lightbox.innerHTML = `
            <span class="pp-lightbox-close">&times;</span>
            <span class="pp-lightbox-prev">&#10094;</span>
            <span class="pp-lightbox-next">&#10095;</span>
            <div class="pp-lightbox-content">
                <img src="" alt="">
            </div>
        `;
        document.body.appendChild(lightbox);
        
        let currentImageIndex = 0;
        
        images.forEach((img, index) => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', function() {
                currentImageIndex = index;
                pp_updateLightbox();
                lightbox.style.display = 'flex';
            });
        });
        
        // Lightbox controls
        lightbox.querySelector('.pp-lightbox-close').addEventListener('click', function() {
            lightbox.style.display = 'none';
        });
        
        lightbox.querySelector('.pp-lightbox-prev').addEventListener('click', function() {
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            pp_updateLightbox();
        });
        
        lightbox.querySelector('.pp-lightbox-next').addEventListener('click', function() {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            pp_updateLightbox();
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (lightbox.style.display === 'flex') {
                if (e.key === 'Escape') {
                    lightbox.style.display = 'none';
                } else if (e.key === 'ArrowLeft') {
                    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
                    pp_updateLightbox();
                } else if (e.key === 'ArrowRight') {
                    currentImageIndex = (currentImageIndex + 1) % images.length;
                    pp_updateLightbox();
                }
            }
        });
        
        function pp_updateLightbox() {
            const lightboxImg = lightbox.querySelector('img');
            lightboxImg.src = images[currentImageIndex].src;
            lightboxImg.alt = images[currentImageIndex].alt;
        }
    });
    
    // Add lightbox styles
    const style = document.createElement('style');
    style.textContent = `
        .pp-lightbox {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.9);
            z-index: 10000;
            align-items: center;
            justify-content: center;
        }
        .pp-lightbox-close {
            position: absolute;
            top: 1rem;
            right: 1.5rem;
            font-size: 2.5rem;
            color: white;
            cursor: pointer;
            z-index: 10001;
        }
        .pp-lightbox-prev,
        .pp-lightbox-next {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            font-size: 3rem;
            color: white;
            cursor: pointer;
            padding: 1rem;
            user-select: none;
        }
        .pp-lightbox-prev {
            left: 1rem;
        }
        .pp-lightbox-next {
            right: 1rem;
        }
        .pp-lightbox-content {
            max-width: 90%;
            max-height: 90%;
        }
        .pp-lightbox-content img {
            width: 100%;
            height: auto;
            max-height: 80vh;
            object-fit: contain;
        }
    `;
    document.head.appendChild(style);
}

// Counter Animation
function pp_initCounters() {
    const counters = document.querySelectorAll('.pp-counter');
    
    if (counters.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const suffix = counter.getAttribute('data-suffix') || '';
                
                if (!counter.classList.contains('animated')) {
                    counter.classList.add('animated');
                    pp_animateCounter(counter, target, suffix);
                }
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function pp_animateCounter(element, target, suffix = '') {
    const duration = 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, 16);
}

// Accordion
function pp_initAccordion() {
    const accordionHeaders = document.querySelectorAll('.pp-accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const accordionItem = this.parentElement;
            const accordionContent = this.nextElementSibling;
            
            // Toggle active class
            accordionItem.classList.toggle('active');
            
            // Toggle content display
            if (accordionItem.classList.contains('active')) {
                accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
            } else {
                accordionContent.style.maxHeight = '0';
            }
            
            // Close other accordion items
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== this) {
                    const otherItem = otherHeader.parentElement;
                    const otherContent = otherHeader.nextElementSibling;
                    
                    otherItem.classList.remove('active');
                    otherContent.style.maxHeight = '0';
                }
            });
        });
    });
    
    // Add accordion styles
    const style = document.createElement('style');
    style.textContent = `
        .pp-accordion-item {
            margin-bottom: 1rem;
            border: 1px solid var(--pp-gray);
            border-radius: 8px;
            overflow: hidden;
        }
        .pp-accordion-header {
            padding: 1.5rem;
            background-color: var(--pp-light-gray);
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 600;
            color: var(--pp-navy);
        }
        .pp-accordion-header:hover {
            background-color: var(--pp-gray);
        }
        .pp-accordion-header i {
            transition: transform 0.3s ease;
        }
        .pp-accordion-item.active .pp-accordion-header i {
            transform: rotate(180deg);
        }
        .pp-accordion-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
        }
        .pp-accordion-body {
            padding: 1.5rem;
            color: var(--pp-dark-gray);
            line-height: 1.6;
        }
    `;
    document.head.appendChild(style);
}