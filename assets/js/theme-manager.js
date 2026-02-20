// SPMB 2026-2027 - Advanced Theme Manager with GSAP

const ThemeManager = {
    currentTheme: 'light',
    systemPreference: 'light',
    
    // Color palettes
    themes: {
        light: {
            '--bg-primary': '#ffffff',
            '--bg-secondary': '#f8fafc',
            '--bg-tertiary': '#f1f5f9',
            '--text-primary': '#0f172a',
            '--text-secondary': '#334155',
            '--text-tertiary': '#64748b',
            '--card-bg': '#ffffff',
            '--card-border': '#e2e8f0',
            '--shadow-color': '0, 0, 0',
            '--glass-bg': 'rgba(255, 255, 255, 0.8)',
            '--glass-border': 'rgba(255, 255, 255, 0.3)',
            '--hero-gradient': 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)',
            '--navbar-bg': 'rgba(255, 255, 255, 0.9)'
        },
        dark: {
            '--bg-primary': '#0f172a',
            '--bg-secondary': '#1e293b',
            '--bg-tertiary': '#334155',
            '--text-primary': '#f8fafc',
            '--text-secondary': '#cbd5e1',
            '--text-tertiary': '#94a3b8',
            '--card-bg': '#1e293b',
            '--card-border': '#334155',
            '--shadow-color': '0, 0, 0',
            '--glass-bg': 'rgba(15, 23, 42, 0.8)',
            '--glass-border': 'rgba(255, 255, 255, 0.1)',
            '--hero-gradient': 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%)',
            '--navbar-bg': 'rgba(15, 23, 42, 0.9)'
        }
    },
    
    init() {
        this.detectSystemPreference();
        this.loadSavedTheme();
        this.createToggleButton();
        this.applyTheme(this.currentTheme, false);
    },
    
    detectSystemPreference() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        this.systemPreference = mediaQuery.matches ? 'dark' : 'light';
        
        mediaQuery.addEventListener('change', (e) => {
            this.systemPreference = e.matches ? 'dark' : 'light';
            if (!localStorage.getItem('spmb-theme')) {
                this.setTheme(this.systemPreference);
            }
        });
    },
    
    loadSavedTheme() {
        const saved = localStorage.getItem('spmb-theme');
        this.currentTheme = saved || this.systemPreference;
    },
    
    setTheme(theme, animate = true) {
        if (this.currentTheme === theme) return;
        
        const oldTheme = this.currentTheme;
        this.currentTheme = theme;
        
        if (animate && typeof gsap !== 'undefined') {
            this.animateThemeTransition(oldTheme, theme);
        } else {
            this.applyTheme(theme, false);
        }
        
        localStorage.setItem('spmb-theme', theme);
        
        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { 
                isDark: theme === 'dark',
                oldTheme: oldTheme,
                newTheme: theme 
            }
        }));
    },
    
    toggle() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme, true);
    },
    
    applyTheme(theme, animate) {
        const root = document.documentElement;
        const colors = this.themes[theme];
        
        Object.entries(colors).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });
        
        root.setAttribute('data-theme', theme);
        
        // Update meta theme-color
        const metaTheme = document.querySelector('meta[name="theme-color"]');
        if (metaTheme) {
            metaTheme.setAttribute('content', theme === 'dark' ? '#0f172a' : '#ffffff');
        }
    },
    
    animateThemeTransition(from, to) {
        const tl = gsap.timeline();
        
        // 1. Flash transition overlay
        const overlay = document.createElement('div');
        overlay.className = 'theme-transition-overlay';
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: ${to === 'dark' ? '#0f172a' : '#ffffff'};
            z-index: 9999;
            pointer-events: none;
            opacity: 0;
        `;
        document.body.appendChild(overlay);
        
        // 2. Animate overlay
        tl.to(overlay, {
            opacity: 0.3,
            duration: 0.2,
            ease: "power2.out"
        })
        .call(() => this.applyTheme(to, true))
        .to(overlay, {
            opacity: 0,
            duration: 0.4,
            ease: "power2.in",
            onComplete: () => overlay.remove()
        });
        
        // 3. Animate specific elements
        this.animateCards(tl, to);
        this.animateText(tl, to);
        this.animateNavbar(tl, to);
    },
    
    animateCards(timeline, theme) {
        const cards = document.querySelectorAll('.card, .info-card, .jalur-card, .stat-card');
        
        timeline.fromTo(cards, 
            {
                y: 0,
                scale: 1
            },
            {
                y: theme === 'dark' ? -10 : 10,
                scale: 0.98,
                duration: 0.2,
                stagger: 0.02,
                ease: "power2.out",
                yoyo: true,
                repeat: 1
            },
            "-=0.3"
        );
    },
    
    animateText(timeline, theme) {
        const headings = document.querySelectorAll('h1, h2, h3');
        
        timeline.fromTo(headings,
            { opacity: 0.8 },
            { 
                opacity: 1, 
                duration: 0.3,
                stagger: 0.05,
                ease: "power2.out" 
            },
            "-=0.4"
        );
    },
    
    animateNavbar(timeline, theme) {
        const navbar = document.querySelector('.navbar');
        
        timeline.to(navbar, {
            backgroundColor: theme === 'dark' ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            duration: 0.3,
            ease: "power2.out"
        }, "-=0.5");
    },
    
    createToggleButton() {
        // Check if button already exists
        if (document.getElementById('theme-toggle')) return;
        
        const button = document.createElement('button');
        button.id = 'theme-toggle';
        button.className = 'theme-toggle';
        button.setAttribute('aria-label', 'Toggle dark mode');
        
        button.innerHTML = `
            <span class="theme-icon theme-icon-light">☀️</span>
            <span class="theme-icon theme-icon-dark">🌙</span>
            <span class="theme-ripple"></span>
        `;
        
        // Apply initial state
        this.updateToggleIcon(button);
        
        button.addEventListener('click', () => {
            // GSAP click animation
            gsap.to(button, {
                scale: 0.9,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut",
                onComplete: () => this.toggle()
            });
        });
        
        document.body.appendChild(button);
        
        // Listen for theme changes
        window.addEventListener('themeChanged', () => {
            this.updateToggleIcon(button);
        });
    },
    
    updateToggleIcon(button) {
        const isDark = this.currentTheme === 'dark';
        const lightIcon = button.querySelector('.theme-icon-light');
        const darkIcon = button.querySelector('.theme-icon-dark');
        
        if (typeof gsap !== 'undefined') {
            // Animate icon switch
            gsap.to(isDark ? lightIcon : darkIcon, {
                rotation: -90,
                scale: 0,
                opacity: 0,
                duration: 0.3,
                ease: "back.in(1.7)"
            });
            
            gsap.fromTo(isDark ? darkIcon : lightIcon,
                { rotation: 90, scale: 0, opacity: 0 },
                { 
                    rotation: 0, 
                    scale: 1, 
                    opacity: 1, 
                    duration: 0.3, 
                    delay: 0.15,
                    ease: "back.out(1.7)"
                }
            );
        } else {
            lightIcon.style.display = isDark ? 'none' : 'block';
 'block';
            darkIcon.style.display = isDark ? 'block' : 'none';
        }
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
});

// Export
window.ThemeManager = ThemeManager;
