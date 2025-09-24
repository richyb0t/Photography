const hamburger = document.querySelector(".hamburger");
        const navMenu = document.querySelector(".nav-menu");
        const navbar = document.querySelector(".navbar");
        const navLinks = document.querySelectorAll(".nav-link");

        // Toggle menú hamburguesa
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
            
            // Prevenir scroll cuando el menú está abierto
            document.body.style.overflow = navMenu.classList.contains("active") ? "hidden" : "";
        });

        // Cerrar menú al hacer click en un enlace
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                hamburger.classList.remove("active");
                navMenu.classList.remove("active");
                document.body.style.overflow = "";
            });
        });

        // Cerrar menú al hacer click fuera de él
        document.addEventListener("click", (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove("active");
                navMenu.classList.remove("active");
                document.body.style.overflow = "";
            }
        });

        // Efecto de scroll en navbar
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
        });

        // Prevenir zoom en iOS al hacer doble tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function (event) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        
// 3D Tilt Effect for Portfolio Items
function initTiltEffect() {
    const tiltElements = document.querySelectorAll('[data-tilt]');
    
    tiltElements.forEach(element => {
        const inner = element.querySelector('.portfolio-inner');
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / centerY * -10;
            const rotateY = (x - centerX) / centerX * 10;
            
            inner.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(12px)`;
        });
        
        element.addEventListener('mouseleave', () => {
            inner.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)';
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
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
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

// Animaciones profesionales específicas por sección
class SectionAnimations {
    constructor() {
        this.observers = new Map();
        this.animationQueues = new Map();
        this.init();
    }

    init() {
        this.setupSectionObservers();
        this.addCustomStyles();
    }

    // Configurar observadores para cada sección
    setupSectionObservers() {
        const sections = {
            '#portafolio': this.animatePortfolioSection.bind(this),
            '.stats-section': this.animateStatsSection.bind(this),
            '#servicios': this.animateServicesSection.bind(this),
            '#contacto': this.animateContactSection.bind(this)
        };

        Object.entries(sections).forEach(([selector, animationFunc]) => {
            const element = document.querySelector(selector);
            if (element) {
                const observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                animationFunc(entry.target);
                                observer.unobserve(entry.target);
                            }
                        });
                    },
                    {
                        threshold: 0.2,
                        rootMargin: '-50px 0px'
                    }
                );
                observer.observe(element);
                this.observers.set(selector, observer);
            }
        });
    }

    // 1. Animación de Portfolio - Efecto Masonería Flotante
    animatePortfolioSection(section) {
        const header = section.querySelector('.section-header');
        const portfolioItems = section.querySelectorAll('.portfolio-item');

        // Animar header con efecto typewriter
        this.animateTypewriter(header.querySelector('.section-title'));
        
        setTimeout(() => {
            header.querySelector('.section-subtitle').style.opacity = '1';
            header.querySelector('.section-subtitle').style.transform = 'translateY(0) rotateX(0deg)';
        }, 1000);

        // Efecto masonería flotante para portfolio items
        portfolioItems.forEach((item, index) => {
            // Posición inicial desde diferentes direcciones
            const directions = [
                'translateX(-100px) translateY(-50px) rotateY(-45deg)',
                'translateX(100px) translateY(-30px) rotateY(45deg)',
                'translateY(100px) rotateX(45deg)',
                'translateX(-80px) translateY(80px) rotateZ(-15deg)',
                'translateX(80px) translateY(-80px) rotateZ(15deg)'
            ];

            item.style.opacity = '0';
            item.style.transform = directions[index % directions.length] + ' scale(0.7)';

            setTimeout(() => {
                item.style.transition = `all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)`;
                item.style.opacity = '1';
                item.style.transform = 'translateX(0) translateY(0) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1)';
                
                // Efecto de rebote final
                setTimeout(() => {
                    item.style.transform = 'scale(1.05)';
                    setTimeout(() => {
                        item.style.transform = 'scale(1)';
                    }, 150);
                }, 300);

            }, index * 150 + 500);
        });

        // Agregar efecto de partículas flotantes
        this.addFloatingParticles(section, 'portfolio');
    }

    // 2. Animación de Stats - Contador Digital con Hologramas
    animateStatsSection(section) {
        const statItems = section.querySelectorAll('.stat-item');
        
        statItems.forEach((item, index) => {
            // Efecto de materialización holográfica
            item.style.opacity = '0';
            item.style.transform = 'translateY(100px) rotateX(90deg) scale(0.5)';
            
            setTimeout(() => {
                item.style.transition = 'all 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0px) rotateX(0deg) scale(1)';

                // Efecto de brillo en el borde
                this.addGlowEffect(item);

                // Animación del contador con efecto digital
                const numberElement = item.querySelector('.stat-number');
                const originalText = numberElement.textContent;
                
                setTimeout(() => {
                    this.animateDigitalCounter(numberElement, originalText);
                }, 300);

            }, index * 200 + 300);
        });

        // Efecto de ondas expansivas
        this.createWaveEffect(section);
    }

    // 3. Animación de Servicios - Cards Giratorias con Morfismo
    animateServicesSection(section) {
        const header = section.querySelector('.section-header');
        const serviceCards = section.querySelectorAll('.service-card');

        // Header con efecto de enfoque
        this.animateFocusEffect(header);

        serviceCards.forEach((card, index) => {
            // Efecto flip 3D desde diferentes ejes
            const rotations = [
                'rotateY(-180deg)',
                'rotateX(-180deg)',
                'rotateY(180deg)'
            ];

            card.style.opacity = '0';
            card.style.transform = `${rotations[index % rotations.length]} scale(0.8)`;
            card.style.transformOrigin = 'center center';

            setTimeout(() => {
                card.style.transition = 'all 1.2s cubic-bezier(0.23, 1, 0.320, 1)';
                card.style.opacity = '1';
                card.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1)';

                // Efecto de morfismo en hover
                this.addMorphismEffect(card);

                // Animación del icono con rotación orbital
                const icon = card.querySelector('.service-icon');
                setTimeout(() => {
                    this.addOrbitalRotation(icon);
                }, 600);

            }, index * 300 + 400);
        });

        // Efecto de campo de fuerza
        this.createForceField(section);
    }

    // 4. Animación de Contacto - Construcción Arquitectónica
    animateContactSection(section) {
        const header = section.querySelector('.section-header');
        const contactInfo = section.querySelector('.contact-info');
        const contactForm = section.querySelector('.contact-form');

        // Header con efecto de construcción
        this.animateArchitecturalBuild(header);

        // Información de contacto - Efecto de ensamblaje
        setTimeout(() => {
            const contactItems = contactInfo.querySelectorAll('.contact-item');
            contactItems.forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateX(-200px) rotateY(-90deg)';
                
                setTimeout(() => {
                    item.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0px) rotateY(0deg)';
                    
                    // Efecto de pulso en el icono
                    this.addPulseEffect(item.querySelector('.contact-icon'));
                }, index * 150);
            });

            // Redes sociales con efecto cascada
            const socialLinks = contactInfo.querySelectorAll('.social-link');
            setTimeout(() => {
                socialLinks.forEach((link, index) => {
                    link.style.opacity = '0';
                    link.style.transform = 'scale(0) rotateZ(180deg)';
                    
                    setTimeout(() => {
                        link.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                        link.style.opacity = '1';
                        link.style.transform = 'scale(1) rotateZ(0deg)';
                    }, index * 100);
                });
            }, 800);

        }, 500);

        // Formulario - Efecto de construcción modular
        setTimeout(() => {
            const formGroups = contactForm.querySelectorAll('.form-group');
            const submitBtn = contactForm.querySelector('.btn-submit');

            formGroups.forEach((group, index) => {
                group.style.opacity = '0';
                group.style.transform = 'translateX(100px) rotateX(45deg)';
                
                setTimeout(() => {
                    group.style.transition = 'all 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    group.style.opacity = '1';
                    group.style.transform = 'translateX(0px) rotateX(0deg)';
                    
                    // Efecto focus mejorado para inputs
                    this.enhanceFormInputs(group);
                }, index * 100);
            });

            // Botón submit con efecto final espectacular
            setTimeout(() => {
                submitBtn.style.opacity = '0';
                submitBtn.style.transform = 'scale(0.5) rotateZ(-180deg)';
                
                setTimeout(() => {
                    submitBtn.style.transition = 'all 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                    submitBtn.style.opacity = '1';
                    submitBtn.style.transform = 'scale(1) rotateZ(0deg)';
                    
                    // Efecto de brillo permanente
                    this.addShimmerEffect(submitBtn);
                }, 200);
            }, formGroups.length * 100 + 300);

        }, 800);
    }

    // Efectos auxiliares especializados
    animateTypewriter(element) {
        const text = element.textContent;
        element.textContent = '';
        element.style.borderRight = '2px solid var(--accent-color)';
        
        let index = 0;
        const timer = setInterval(() => {
            element.textContent += text[index];
            index++;
            
            if (index >= text.length) {
                clearInterval(timer);
                setTimeout(() => {
                    element.style.borderRight = 'none';
                }, 500);
            }
        }, 100);
    }

    animateDigitalCounter(element, targetText) {
        const targetNumber = parseInt(targetText);
        const isPercentage = targetText.includes('%');
        const isPlus = targetText.includes('+');
        const isHours = targetText.includes('h');
        
        let current = 0;
        const increment = Math.ceil(targetNumber / 50);
        
        element.style.fontFamily = 'monospace';
        element.style.background = 'linear-gradient(45deg, var(--accent-color), #f4d03f)';
        element.style.webkitBackgroundClip = 'text';
        element.style.webkitTextFillColor = 'transparent';
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= targetNumber) {
                current = targetNumber;
                clearInterval(timer);
            }
            
            let displayText = current.toString();
            if (isPercentage) displayText += '%';
            if (isPlus) displayText += '+';
            if (isHours) displayText += 'h';
            
            element.textContent = displayText;
            
            // Efecto de glitch ocasional
            if (Math.random() > 0.9) {
                element.style.transform = `translateX(${Math.random() * 4 - 2}px)`;
                setTimeout(() => {
                    element.style.transform = 'translateZ(20px)';
                }, 50);
            }
        }, 50);
    }

    addGlowEffect(element) {
        element.style.boxShadow = `
            0 0 20px rgba(212, 175, 55, 0.3),
            0 0 40px rgba(212, 175, 55, 0.2),
            0 0 60px rgba(212, 175, 55, 0.1),
            inset 0 0 20px rgba(212, 175, 55, 0.1)
        `;
        
        // Pulso de brillo
        setInterval(() => {
            element.style.boxShadow = `
                0 0 30px rgba(212, 175, 55, 0.5),
                0 0 60px rgba(212, 175, 55, 0.3),
                0 0 90px rgba(212, 175, 55, 0.2),
                inset 0 0 30px rgba(212, 175, 55, 0.15)
            `;
            
            setTimeout(() => {
                element.style.boxShadow = `
                    0 0 20px rgba(212, 175, 55, 0.3),
                    0 0 40px rgba(212, 175, 55, 0.2),
                    0 0 60px rgba(212, 175, 55, 0.1),
                    inset 0 0 20px rgba(212, 175, 55, 0.1)
                `;
            }, 1000);
        }, 3000);
    }

    addMorphismEffect(card) {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'perspective(1000px) rotateY(10deg) rotateX(5deg) scale(1.05)';
            card.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 100%)';
            card.style.backdropFilter = 'blur(20px) saturate(200%)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)';
            card.style.background = 'var(--white)';
            card.style.backdropFilter = 'none';
        });
    }

    addOrbitalRotation(icon) {
        icon.style.animation = 'orbit 4s linear infinite';
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes orbit {
                0% { transform: translateZ(20px) rotateZ(0deg); }
                25% { transform: translateZ(30px) rotateZ(90deg) scale(1.1); }
                50% { transform: translateZ(20px) rotateZ(180deg); }
                75% { transform: translateZ(30px) rotateZ(270deg) scale(1.1); }
                100% { transform: translateZ(20px) rotateZ(360deg); }
            }
        `;
        if (!document.querySelector('#orbit-animation')) {
            style.id = 'orbit-animation';
            document.head.appendChild(style);
        }
    }

    addFloatingParticles(section, type) {
        const colors = type === 'portfolio' ? 
            ['rgba(212, 175, 55, 0.4)', 'rgba(244, 208, 63, 0.3)'] :
            ['rgba(255, 255, 255, 0.2)', 'rgba(212, 175, 55, 0.2)'];
        
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 8 + 3}px;
                height: ${Math.random() * 8 + 3}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: floatComplex ${Math.random() * 10 + 5}s ease-in-out infinite;
                pointer-events: none;
                z-index: 1;
            `;
            
            section.style.position = 'relative';
            section.appendChild(particle);
        }
    }

    createWaveEffect(section) {
        const wave = document.createElement('div');
        wave.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border: 2px solid rgba(212, 175, 55, 0.3);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: expandWave 3s ease-out infinite;
            pointer-events: none;
            z-index: 0;
        `;
        
        section.style.position = 'relative';
        section.appendChild(wave);
    }

    addShimmerEffect(element) {
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        
        const shimmer = document.createElement('div');
        shimmer.style.cssText = `
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
            animation: shimmer 3s ease-in-out infinite;
            pointer-events: none;
        `;
        
        element.appendChild(shimmer);
    }

    // Estilos CSS adicionales para las animaciones
    addCustomStyles() {
        const styles = `
            @keyframes floatComplex {
                0%, 100% { 
                    transform: translateY(0px) translateX(0px) rotateZ(0deg) scale(1);
                    opacity: 1;
                }
                25% { 
                    transform: translateY(-30px) translateX(20px) rotateZ(90deg) scale(1.2);
                    opacity: 0.7;
                }
                50% { 
                    transform: translateY(-60px) translateX(-10px) rotateZ(180deg) scale(0.8);
                    opacity: 0.4;
                }
                75% { 
                    transform: translateY(-30px) translateX(-25px) rotateZ(270deg) scale(1.1);
                    opacity: 0.6;
                }
            }

            @keyframes expandWave {
                0% {
                    width: 0;
                    height: 0;
                    opacity: 1;
                }
                50% {
                    width: 300px;
                    height: 300px;
                    opacity: 0.5;
                }
                100% {
                    width: 600px;
                    height: 600px;
                    opacity: 0;
                }
            }

            @keyframes shimmer {
                0% { left: -100%; }
                50% { left: 100%; }
                100% { left: 100%; }
            }

            .section-header .section-subtitle {
                opacity: 0;
                transform: translateY(30px) rotateX(15deg);
                transition: all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }

            .form-group {
                position: relative;
                overflow: hidden;
            }

            .form-control:focus {
                transform: translateY(-2px) translateZ(5px);
                box-shadow: 
                    0 0 0 4px rgba(212, 175, 55, 0.1), 
                    0 10px 30px rgba(0, 0, 0, 0.15),
                    0 0 20px rgba(212, 175, 55, 0.2);
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    // Métodos auxiliares adicionales
    animateFocusEffect(header) {
        header.style.filter = 'blur(20px)';
        header.style.opacity = '0';
        header.style.transform = 'scale(1.2)';
        
        setTimeout(() => {
            header.style.transition = 'all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            header.style.filter = 'blur(0px)';
            header.style.opacity = '1';
            header.style.transform = 'scale(1)';
        }, 200);
    }

    animateArchitecturalBuild(header) {
        const title = header.querySelector('.section-title');
        const subtitle = header.querySelector('.section-subtitle');
        
        // Efecto de construcción línea por línea
        title.style.clipPath = 'polygon(0 0, 0 0, 0 100%, 0 100%)';
        subtitle.style.clipPath = 'polygon(0 0, 0 0, 0 100%, 0 100%)';
        
        setTimeout(() => {
            title.style.transition = 'clip-path 1s ease-out';
            title.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
            
            setTimeout(() => {
                subtitle.style.transition = 'clip-path 0.8s ease-out';
                subtitle.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0 100%)';
            }, 500);
        }, 300);
    }

    addPulseEffect(element) {
        setInterval(() => {
            element.style.transform = 'translateZ(15px) scale(1.2)';
            element.style.boxShadow = '0 10px 25px rgba(212, 175, 55, 0.4)';
            
            setTimeout(() => {
                element.style.transform = 'translateZ(15px) scale(1)';
                element.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            }, 300);
        }, 2000);
    }

    enhanceFormInputs(group) {
        const input = group.querySelector('.form-control');
        if (input) {
            input.addEventListener('focus', () => {
                group.style.transform = 'perspective(500px) rotateX(-5deg) translateZ(10px)';
                input.style.borderColor = 'var(--accent-color)';
                input.style.boxShadow = '0 0 20px rgba(212, 175, 55, 0.3)';
            });
            
            input.addEventListener('blur', () => {
                group.style.transform = 'perspective(500px) rotateX(0deg) translateZ(0px)';
            });
        }
    }

    createForceField(section) {
        const fieldLines = [];
        
        for (let i = 0; i < 8; i++) {
            const line = document.createElement('div');
            line.style.cssText = `
                position: absolute;
                width: 2px;
                height: 100px;
                background: linear-gradient(to bottom, transparent, rgba(212, 175, 55, 0.3), transparent);
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: forceField ${Math.random() * 4 + 2}s ease-in-out infinite alternate;
                pointer-events: none;
                z-index: 0;
                transform-origin: center;
            `;
            
            fieldLines.push(line);
            section.appendChild(line);
        }

        // Agregar animación de campo de fuerza
        const forceFieldStyle = document.createElement('style');
        forceFieldStyle.textContent = `
            @keyframes forceField {
                0% { 
                    transform: scaleY(0.5) rotateZ(0deg);
                    opacity: 0.3;
                }
                100% { 
                    transform: scaleY(1.5) rotateZ(360deg);
                    opacity: 0.8;
                }
            }
        `;
        document.head.appendChild(forceFieldStyle);
    }
}

// Integrar con el sistema existente
function initAdvancedSectionAnimations() {
    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new SectionAnimations();
        });
    } else {
        new SectionAnimations();
    }
}

// Inicializar las animaciones avanzadas
initAdvancedSectionAnimations();

// Agregar al sistema de inicialización existente
if (typeof initializeAll === 'function') {
    const originalInit = initializeAll;
    initializeAll = function() {
        originalInit();
        new SectionAnimations();
    };
}