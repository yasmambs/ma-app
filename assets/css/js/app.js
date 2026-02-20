// SPMB 2026-2027 - Main Application

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initCountdown();
    initStats();
    initAnimations();
});

// Mobile Navigation
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Animate hamburger
            const spans = navToggle.querySelectorAll('span');
            navToggle.classList.toggle('active');
            
            if (navToggle.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    }
    
    // Close menu on link click
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// Countdown Timer
function initCountdown() {
    // Target: 15 Juni 2026, 00:00:00
    const targetDate = new Date('2026-06-15T00:00:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;
        
        if (distance < 0) {
            document.getElementById('countdown').innerHTML = 
                '<div class="countdown-finished">Pendaftaran Dibuka!</div>';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Stats Counter Animation
function initStats() {
    const stats = {
        totalPendaftar: 1250,
        totalSekolah: 45,
        kuotaTersedia: 3500
    };
    
    function animateValue(id, end, duration = 2000) {
        const obj = document.getElementById(id);
        if (!obj) return;
        
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            obj.innerHTML = Math.floor(easeOutQuart * end).toLocaleString('id-ID');
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
    
    // Trigger animation when in viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateValue('totalPendaftar', stats.totalPendaftar);
                animateValue('totalSekolah', stats.totalSekolah);
                animateValue('kuotaTersedia', stats.kuotaTersedia);
                observer.disconnect();
            }
        });
    });
    
    const statsSection = document.querySelector('.stats-grid');
    if (statsSection) observer.observe(statsSection);
}

// Scroll Animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Animate sections
    document.querySelectorAll('.info-card, .jalur-card, .stat-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Utility Functions
const SPMB = {
    // Format tanggal ke Indonesia
    formatDate: (dateString) => {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    },
    
    // Format nomor dengan titik
    formatNumber: (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    },
    
    // Generate nomor pendaftaran
    generateNoDaftar: () => {
        const prefix = 'SPMB';
        const year = '26';
        const random = Math.floor(1000 + Math.random() * 9000);
        return `${prefix}${year}${random}`;
    },
    
    // Validasi NIK
    validateNIK: (nik) => {
        return /^\d{16}$/.test(nik);
    },
    
    // Validasi email
    validateEmail: (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    
    // Toast notification
    toast: (message, type = 'info') => {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },
    
    // Local Storage helpers
    storage: {
        set: (key, value) => {
            localStorage.setItem(`spmb_${key}`, JSON.stringify(value));
        },
        get: (key) => {
            const item = localStorage.getItem(`spmb_${key}`);
            return item ? JSON.parse(item) : null;
        },
        remove: (key) => {
            localStorage.removeItem(`spmb_${key}`);
        }
    }
};

// Export untuk global access
window.SPMB = SPMB;
