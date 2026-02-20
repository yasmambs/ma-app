// assets/js/animations.js - Premium Motion System

// Register GSAP plugins (gunakan CDN)
// <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
// <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>

const PremiumAnimations = {
    init() {
        this.heroAnimation();
        this.scrollAnimations();
        this.microInteractions();
        this.countdownAnimation();
    },

    // Hero entrance - Cinematic reveal
    heroAnimation() {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.from(".hero h1", {
            y: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)"
        })
        .from(".hero-subtitle", {
            y: 30,
            opacity: 0,
            duration: 0.8
        }, "-=0.6")
        .from(".countdown-item", {
            scale: 0,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.7)"
        }, "-=0.4")
        .from(".hero-cta .btn", {
            y: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.1
        }, "-=0.3")
        .from(".card-3d", {
            rotateY: 90,
            opacity: 0,
            duration: 1.2,
            ease: "power4.out"
        }, "-=1");
    },

    // Scroll-triggered animations
    scrollAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        // Section headers
        gsap.utils.toArray(".section-header").forEach(header => {
            gsap.from(header, {
                scrollTrigger: {
                    trigger: header,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                },
                y: 50,
                opacity: 0,
                duration: 0.8
            });
        });

        // Cards stagger
        gsap.utils.toArray(".card-grid").forEach(grid => {
            gsap.from(grid.children, {
                scrollTrigger: {
                    trigger: grid,
                    start: "top 75%"
                },
                y: 60,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: "power3.out"
            });
        });

        // Parallax shapes
        gsap.to(".shape-1", {
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: 1
            },
            y: 200,
            rotation: 45
        });
    },

    // Micro-interactions
    microInteractions() {
        // Magnetic buttons
        document.querySelectorAll(".btn-primary").forEach(btn => {
            btn.addEventListener("mousemove", (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                gsap.to(btn, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.3,
                    ease: "power2.out"
                });
            });

            btn.addEventListener("mouseleave", () => {
                gsap.to(btn, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: "elastic.out(1, 0.3)"
                });
            });
        });

        // Card tilt effect
        document.querySelectorAll(".card-3d").forEach(card => {
            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;

                gsap.to(card, {
                    rotateY: x * 20,
                    rotateX: -y * 20,
                    duration: 0.5,
                    ease: "power2.out"
                });
            });

            card.addEventListener("mouseleave", () => {
                gsap.to(card, {
                    rotateY: 0,
                    rotateX: 0,
                    duration: 0.8,
                    ease: "elastic.out(1, 0.5)"
                });
            });
        });
    },

    // Animated countdown
    countdownAnimation() {
        const flipNumber = (element, newValue) => {
            const current = element.textContent;
            if (current === newValue) return;

            gsap.timeline()
                .to(element, {
                    y: -20,
                    opacity: 0,
                    duration: 0.2
                })
                .set(element, { textContent: newValue, y: 20 })
                .to(element, {
                    y: 0,
                    opacity: 1,
                    duration: 0.3,
                    ease: "back.out(1.7)"
                });
        };

        // Update setiap detik dengan animasi
        setInterval(() => {
            // Logic countdown di sini
            // flipNumber(document.querySelector("#days"), newDays);
        }, 1000);
    }
};

// Init saat DOM ready
document.addEventListener("DOMContentLoaded", () => {
    if (typeof gsap !== "undefined") {
        PremiumAnimations.init();
    }
});
