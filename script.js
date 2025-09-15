// 3D Tilt Effect for Portfolio Items
function initTiltEffect() {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    tiltElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / centerY * -15;
            const rotateY = (x - centerX) / centerX * 15;
            
            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Navbar scroll effect with 3D transform
function initNavbarEffects() {
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
            navbar.style.transform = `translateY(${Math.min(scrollY * 0.02, 2)}px) rotateX(${Math.min(scrollY * 0.01, 1)}deg)`;
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.transform = 'translateY(0px) rotateX(0deg)';
        }
    });
}

// Enhanced fade in animation on scroll with 3D effects
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -80px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Add stagger effect for grid items
                if (entry.target.classList.contains('services-grid') || 
                    entry.target.classList.contains('portfolio-grid') ||
                    entry.target.classList.contains('stats-grid')) {
                    
                    const items = entry.target.children;
                    Array.from(items).forEach((item, index) => {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateY(0) rotateX(0deg)';
                        }, index * 150);
                    });
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// Parallax effect for hero section
function initParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const heroContent = document.querySelector('.hero-content');
        const floatingElements = document.querySelectorAll('.float-element');
        
        if (hero && scrolled <= hero.offsetHeight) {
            const rate = scrolled * -0.5;
            const rate2 = scrolled * -0.3;
            
            heroContent.style.transform = `translate3d(0, ${rate2}px, 0) rotateX(${scrolled * 0.02}deg)`;
            
            floatingElements.forEach((element, index) => {
                const speed = 0.2 + (index * 0.1);
                element.style.transform = `translate3d(0, ${scrolled * speed}px, 0) rotate(${scrolled * 0.1}deg)`;
            });
        }
    });
}

// Form submission with enhanced 3D feedback
function initFormHandling() {
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('.btn-submit');
        const originalContent = submitBtn.innerHTML;
        
        // Add loading state with 3D effect
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.style.transform = 'scale(0.95) rotateX(15deg)';
        submitBtn.disabled = true;
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        if (!data.nombre || !data.email || !data.servicio) {
            showFormError('Por favor completa todos los campos obligatorios.');
            resetSubmitButton(submitBtn, originalContent);
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showFormError('Por favor ingresa un email válido.');
            resetSubmitButton(submitBtn, originalContent);
            return;
        }

        // Date validation if provided
        if (data.fecha) {
            const selectedDate = new Date(data.fecha);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                showFormError('La fecha del evento debe ser futura.');
                resetSubmitButton(submitBtn, originalContent);
                return;
            }
        }
        
        // Simulate form submission delay
        setTimeout(() => {
            // Store appointment data
            const appointments = JSON.parse(sessionStorage.getItem('appointments') || '[]');
            const newAppointment = {
                ...data,
                id: Date.now(),
                timestamp: new Date().toISOString(),
                status: 'pendiente'
            };
            appointments.push(newAppointment);
            sessionStorage.setItem('appointments', JSON.stringify(appointments));
            
            // Show success modal
            showSuccessModal();
            
            // Reset form
            this.reset();
            resetSubmitButton(submitBtn, originalContent);
            
            console.log('Cotización solicitada:', newAppointment);
        }, 1500);
    });
}

function showFormError(message) {
    // Create temporary error display with 3D effect
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #e74c3c, #c0392b);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(231, 76, 60, 0.3);
        transform: translateX(400px) rotateY(45deg);
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        z-index: 3000;
        font-weight: 500;
    `;
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    // Animate in
    setTimeout(() => {
        errorDiv.style.transform = 'translateX(0px) rotateY(0deg)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        errorDiv.style.transform = 'translateX(400px) rotateY(-45deg)';
        setTimeout(() => {
            document.body.removeChild(errorDiv);
        }, 400);
    }, 3000);
}

function resetSubmitButton(button, originalContent) {
    button.innerHTML = originalContent;
    button.style.transform = 'scale(1) rotateX(0deg)';
    button.disabled = false;
}

function showSuccessModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'block';
    
    // Add entrance animation
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.transform = 'translate(-50%, -50%) rotateX(90deg) scale(0.5)';
    modalContent.style.opacity = '0';
    
    setTimeout(() => {
        modalContent.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        modalContent.style.transform = 'translate(-50%, -50%) rotateX(0deg) scale(1)';
        modalContent.style.opacity = '1';
    }, 100);
}

// Modal functionality with enhanced 3D effects
function initModalHandling() {
    const modal = document.getElementById('successModal');
    const closeBtn = document.querySelector('.close');

    closeBtn.addEventListener('click', function() {
        closeModal();
    });

    window.addEventListener('click', function(e) {
        if (e.target === modal || e.target.classList.contains('modal-backdrop')) {
            closeModal();
        }
    });

    function closeModal() {
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.transform = 'translate(-50%, -50%) rotateX(-90deg) scale(0.5)';
        modalContent.style.opacity = '0';
        
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// Enhanced portfolio hover effects with 3D transforms
function initPortfolioEffects() {
    document.querySelectorAll('.portfolio-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
            
            // Add subtle shake animation
            this.style.animation = 'portfolioHover 0.6s ease-out';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
            this.style.animation = '';
        });
    });
    
    // Add CSS animation for portfolio hover
    const style = document.createElement('style');
    style.textContent = `
        @keyframes portfolioHover {
            0%, 100% { transform: rotateY(0deg) rotateX(0deg); }
            25% { transform: rotateY(5deg) rotateX(2deg); }
            50% { transform: rotateY(10deg) rotateX(5deg); }
            75% { transform: rotateY(5deg) rotateX(2deg); }
        }
    `;
    document.head.appendChild(style);
}

// Animate stats numbers with 3D effect
function animateNumber(element, target) {
    let current = 0;
    const increment = target / 100;
    const duration = 2000;
    const stepTime = duration / 100;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        let displayValue;
        if (target.toString().includes('%')) {
            displayValue = Math.floor(current) + '%';
        } else if (target.toString().includes('+')) {
            displayValue = Math.floor(current) + '+';
        } else if (target.toString().includes('h')) {
            displayValue = Math.floor(current) + 'h';
        } else {
            displayValue = Math.floor(current);
        }
        
        element.textContent = displayValue;
        
        // Add 3D pulse effect during animation
        const progress = current / target;
        const scale = 1 + (Math.sin(progress * Math.PI * 4) * 0.1);
        element.style.transform = `translateZ(20px) scale(${scale})`;
    }, stepTime);
}

// Enhanced stats animation observer
function initStatsAnimation() {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statsNumbers = entry.target.querySelectorAll('.stat-number');
                statsNumbers.forEach((stat, index) => {
                    setTimeout(() => {
                        const text = stat.textContent;
                        let target = parseInt(text);
                        
                        if (text.includes('%')) {
                            target = parseInt(text.replace('%', ''));
                        } else if (text.includes('+')) {
                            target = parseInt(text.replace('+', ''));
                        } else if (text.includes('h')) {
                            target = parseInt(text.replace('h', ''));
                        }
                        
                        // Reset to 0 before animating
                        stat.textContent = '0';
                        animateNumber(stat, target);
                        
                        // Add entrance effect to stat item
                        const statItem = stat.closest('.stat-item');
                        if (statItem) {
                            statItem.style.transform = 'translateY(50px) rotateX(15deg)';
                            statItem.style.opacity = '0';
                            
                            setTimeout(() => {
                                statItem.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                                statItem.style.transform = 'translateY(0px) rotateX(0deg)';
                                statItem.style.opacity = '1';
                            }, 100);
                        }
                    }, index * 200);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    document.querySelectorAll('.stats-grid').forEach(stats => {
        statsObserver.observe(stats);
    });
}

// Enhanced service cards with 3D interactions
function initServiceInteractions() {
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.service-icon');
            const glow = this.querySelector('.service-glow');
            
            // Add magnetic effect
            icon.style.transform = 'translateZ(40px) rotateY(180deg) scale(1.1)';
            glow.style.opacity = '1';
            
            // Add floating particles effect
            createFloatingParticles(this);
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.service-icon');
            const glow = this.querySelector('.service-glow');
            
            icon.style.transform = 'translateZ(20px) rotateY(0deg) scale(1)';
            glow.style.opacity = '0';
            
            // Remove particles
            this.querySelectorAll('.floating-particle').forEach(particle => {
                particle.remove();
            });
        });
        
        // Add click ripple effect
        card.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                left: ${x}px;
                top: ${y}px;
                width: 0;
                height: 0;
                border-radius: 50%;
                background: rgba(212, 175, 55, 0.3);
                transform: translate(-50%, -50%);
                animation: ripple 0.8s ease-out;
                pointer-events: none;
                z-index: 10;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 800);
        });
    });
    
    // Add ripple animation
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                width: 200px;
                height: 200px;
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
}

function createFloatingParticles(container) {
    const colors = ['rgba(212, 175, 55, 0.6)', 'rgba(244, 208, 63, 0.4)', 'rgba(255, 255, 255, 0.3)'];
    
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 6 + 2}px;
            height: ${Math.random() * 6 + 2}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: floatParticle ${Math.random() * 3 + 2}s ease-in-out infinite;
            pointer-events: none;
            z-index: 5;
        `;
        
        container.appendChild(particle);
    }
    
    // Add particle animation if not already added
    if (!document.querySelector('#particle-animation')) {
        const particleStyle = document.createElement('style');
        particleStyle.id = 'particle-animation';
        particleStyle.textContent = `
            @keyframes floatParticle {
                0%, 100% { 
                    transform: translateY(0px) translateX(0px) rotateZ(0deg); 
                    opacity: 1; 
                }
                25% { 
                    transform: translateY(-20px) translateX(10px) rotateZ(90deg); 
                    opacity: 0.7; 
                }
                50% { 
                    transform: translateY(-40px) translateX(-5px) rotateZ(180deg); 
                    opacity: 0.4; 
                }
                75% { 
                    transform: translateY(-20px) translateX(-10px) rotateZ(270deg); 
                    opacity: 0.7; 
                }
            }
        `;
        document.head.appendChild(particleStyle);
    }
}

// Mouse cursor 3D effect
function initCursorEffect() {
    const cursor = document.createElement('div');
    cursor.id = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(212, 175, 55, 0.8), rgba(212, 175, 55, 0.2));
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease-out;
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.5);
    `;
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        cursor.style.opacity = '1';
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
    });
    
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
    });
    
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
    });
    
    // Enhanced cursor for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .portfolio-item, .service-card, .nav-link');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(2)';
            cursor.style.background = 'radial-gradient(circle, rgba(212, 175, 55, 0.4), rgba(212, 175, 55, 0.1))';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.background = 'radial-gradient(circle, rgba(212, 175, 55, 0.8), rgba(212, 175, 55, 0.2))';
        });
    });
}

// Initialize loading animations for portfolio items
function initPortfolioLoading() {
    document.querySelectorAll('.portfolio-image').forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px) rotateX(15deg) scale(0.9)';
        item.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0px) rotateX(0deg) scale(1)';
        }, index * 100 + 500);
    });
}

// Performance optimized scroll handler
function initOptimizedScrollEffects() {
    let ticking = false;
    
    function updateScrollEffects() {
        const scrollY = window.pageYOffset;
        
        // Update navbar
        const navbar = document.querySelector('.navbar');
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update hero parallax
        const hero = document.querySelector('.hero');
        if (hero && scrollY <= hero.offsetHeight) {
            const heroContent = document.querySelector('.hero-content');
            const rate = scrollY * -0.3;
            heroContent.style.transform = `translate3d(0, ${rate}px, 0)`;
        }
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// Main initialization function
function init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeAll);
    } else {
        initializeAll();
    }
}

function initializeAll() {
    console.log('Initializing 3D Photography Website...');
    
    try {
        initTiltEffect();
        initSmoothScrolling();
        initNavbarEffects();
        initScrollAnimations();
        initParallaxEffect();
        initFormHandling();
        initModalHandling();
        initPortfolioEffects();
        initStatsAnimation();
        initServiceInteractions();
        initCursorEffect();
        initPortfolioLoading();
        initOptimizedScrollEffects();
        
        console.log('3D Photography Website initialized successfully!');
        
        // Add a subtle entrance animation to the whole page
        document.body.style.opacity = '0';
        document.body.style.transform = 'scale(0.98)';
        document.body.style.transition = 'all 0.8s ease-out';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
            document.body.style.transform = 'scale(1)';
        }, 100);
        
    } catch (error) {
        console.error('Error initializing website:', error);
    }
}

// Start initialization
init();

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Pause animations when page is not visible
        document.querySelectorAll('.float-element, .floating-particle').forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    } else {
        // Resume animations when page becomes visible
        document.querySelectorAll('.float-element, .floating-particle').forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }
});

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('successModal');
        if (modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    }
});

// Prevent right-click on images (optional protection)
document.querySelectorAll('.portfolio-image').forEach(img => {
    img.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        
        // Show a subtle notification
        const notification = document.createElement('div');
        notification.textContent = 'Imagen protegida';
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            font-size: 0.9rem;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.style.opacity = '1', 10);
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 1500);
    });
});