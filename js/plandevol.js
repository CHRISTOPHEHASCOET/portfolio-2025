 gsap.registerPlugin(ScrollTrigger);

        // 1. Apparition des Panels généraux
        gsap.utils.toArray('.cockpit-panel, .cta-panel').forEach(panel => {
            gsap.from(panel, {
                scrollTrigger: { trigger: panel, start: "top 85%" },
                opacity: 0, y: 30, duration: 0.8, ease: "power2.out"
            });
        });

        // 2. ANIMATION DES CARTES D'EXPÉRIENCE (Blocs distincts)
        gsap.utils.toArray('.timeline-stop').forEach((stop, i) => {
            gsap.to(stop, {
                scrollTrigger: {
                    trigger: stop,
                    start: "top 85%", // Commence quand le haut de la carte est à 85% de l'écran
                },
                opacity: 1,
                x: 0,
                duration: 0.6,
                ease: "power2.out"
            });
        });

        // 3. AVION : SUIVI + ROTATION 180°
        const plane = document.querySelector('.flight-plane');
        const container = document.querySelector('.timeline-container');

        if (plane && container) {
            ScrollTrigger.create({
                trigger: container,
                start: 'top 100px',
                end: 'bottom bottom',
                onUpdate: (self) => {
                    // Position Verticale
                    const maxTop = container.offsetHeight - 50;
                    gsap.to(plane, {
                        top: self.progress * maxTop,
                        duration: 0.1,
                        ease: 'none'
                    });

                    // Rotation selon la direction (1=descend, -1=monte)
                    if (self.direction === 1) {
                        gsap.to(plane, { rotation: 180, duration: 0.4 }); // Pointe vers le bas
                    } else if (self.direction === -1) {
                        gsap.to(plane, { rotation: 0, duration: 0.4 }); // Pointe vers le haut
                    }
                }
            });
        }
    