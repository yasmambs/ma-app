// assets/js/skeleton.js

const SkeletonLoader = {
    create(type = "card") {
        const templates = {
            card: `
                <div class="skeleton-card">
                    <div class="skeleton skeleton-header"></div>
                    <div class="skeleton skeleton-body">
                        <div class="skeleton-text"></div>
                        <div class="skeleton-text"></div>
                        <div class="skeleton-text short"></div>
                    </div>
                </div>
            `,
            table: `
                <tr class="skeleton-row">
                    <td><div class="skeleton" style="height: 20px;"></div></td>
                    <td><div class="skeleton" style="height: 20px; width: 80%;"></div></td>
                    <td><div class="skeleton" style="height: 20px; width: 60%;"></div></td>
                </tr>
            `,
            stats: `
                <div class="skeleton-stat">
                    <div class="skeleton" style="height: 48px; width: 48px; border-radius: 12px;"></div>
                    <div class="skeleton" style="height: 32px; width: 100px; margin-top: 12px;"></div>
                </div>
            `
        };
        
        const wrapper = document.createElement("div");
        wrapper.innerHTML = templates[type];
        wrapper.className = "skeleton-wrapper";
        return wrapper;
    },

    show(container, type = "card", count = 3) {
        container.innerHTML = "";
        for (let i = 0; i < count; i++) {
            container.appendChild(this.create(type));
        }
    },

    hide(container, realContent) {
        gsap.to(container.querySelectorAll(".skeleton-wrapper"), {
            opacity: 0,
            y: -10,
            stagger: 0.05,
            duration: 0.3,
            onComplete: () => {
                container.innerHTML = realContent;
                gsap.from(container.children, {
                    opacity: 0,
                    y: 10,
                    stagger: 0.05,
                    duration: 0.4
                });
            }
        });
    }
};
