// assets/js/theme.js

const ThemeManager = {
    init() {
        this.loadTheme();
        this.createToggle();
        this.watchSystem();
    },

    loadTheme() {
        const saved = localStorage.getItem("spmb-theme");
        const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        
        if (saved === "dark" || (!saved && systemDark)) {
            document.documentElement.classList.add("dark");
        }
    },

    toggle() {
        const isDark = document.documentElement.classList.toggle("dark");
        localStorage.setItem("spmb-theme", isDark ? "dark" : "light");
        
        // Animate transition
        document.body.style.transition = "background-color 0.5s ease";
    },

    createToggle() {
        const btn = document.createElement("button");
        btn.className = "theme-toggle";
        btn.innerHTML = `
            <span class="theme-icon-light">☀️</span>
            <span class="theme-icon-dark">🌙</span>
        `;
        btn.onclick = () => this.toggle();
        document.body.appendChild(btn);
    },

    watchSystem() {
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e => {
            if (!localStorage.getItem("spmb-theme")) {
                document.documentElement.classList.toggle("dark", e.matches);
            }
        });
    }
};
