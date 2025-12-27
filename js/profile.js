  gsap.registerPlugin(ScrollTrigger);

        // Transition d'entrée
        window.addEventListener("load", () => {
            const tlIntro = gsap.timeline();

            tlIntro
                .to(".transition-bar-fill", {
                    width: "100%",
                    duration: 1.2,
                    ease: "power1.out"
                })
                .to(".page-transition", {
                    opacity: 0,
                    duration: 0.5,
                    ease: "power2.out",
                    onComplete: () => {
                        const pt = document.querySelector(".page-transition");
                        if (pt) pt.style.display = "none";
                    }
                })
                .from(".hero", {
                    opacity: 0,
                    y: 30,
                    duration: 0.8,
                    ease: "power3.out"
                }, "-=0.2");
        });

        // Apparition des panels
        gsap.utils.toArray(".panel").forEach(panel => {
            gsap.from(panel, {
                opacity: 0,
                y: 30,
                duration: 0.7,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: panel,
                    start: "top 80%"
                }
            });
        });

        // Radar sweep (animation en continu)
        gsap.to(".radar-sweep", {
            rotation: 360,
            duration: 6,
            repeat: -1,
            ease: "none",
            transformOrigin: "50% 50%"
        });

        // Animation avion + escales du plan de vol
        const flightTimelineEl = document.querySelector(".flight-timeline");
        if (flightTimelineEl) {
            gsap.fromTo(".plane-icon",
                { top: "0%" },
                {
                    top: "100%",
                    ease: "none",
                    scrollTrigger: {
                        trigger: flightTimelineEl,
                        start: "top center",
                        end: "bottom bottom",
                        scrub: true
                    }
                }
            );

            gsap.utils.toArray(".flight-item").forEach((item, i) => {
                gsap.from(item, {
                    opacity: 0,
                    x: 40,
                    duration: 0.6,
                    delay: i * 0.05,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: item,
                        start: "top 85%"
                    }
                });
            });
        }

        // Animation cartes de Parcours & Certifications (effet boarding pass)
        gsap.utils.toArray(".training-card").forEach((card, i) => {
            gsap.from(card, {
                opacity: 0,
                y: 40,
                rotation: i % 2 === 0 ? -2 : 2,
                duration: 0.6,
                delay: i * 0.08,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 90%"
                }
            });
        });

        // Animation stats + compteur
        gsap.utils.toArray(".stat-card").forEach((card, i) => {
            const valueEl = card.querySelector(".stat-value");
            const target = Number(valueEl.dataset.value || valueEl.textContent.replace(/\D/g, "")) || 0;

            // Init à 0 pour le compteur (sauf le "+")
            valueEl.textContent = "0";

            let obj = { val: 0 };
            gsap.to(card, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 90%",
                    onEnter: () => {
                        gsap.to(obj, {
                            val: target,
                            duration: 1.2,
                            ease: "power1.out",
                            onUpdate: () => {
                                const v = Math.floor(obj.val);
                                valueEl.textContent = i === 3 ? v + "+" : v;
                            }
                        });
                    }
                }
            });
        });

        // CTA : entrée + effet "pulse" une fois visible
        gsap.from(".cta-panel", {
            opacity: 0,
            y: 50,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".cta-panel",
                start: "top 80%",
                onEnter: () => {
                    gsap.to(".cta-panel", {
                        boxShadow: "0 0 25px rgba(255,59,59,0.5)",
                        duration: 1.5,
                        yoyo: true,
                        repeat: -1,
                        ease: "sine.inOut"
                    });
                }
            }
        });

        // HORLOGE TEMPS RÉEL
// =========================================================

const updateRealtimeClock = () => {
  const clockElement = document.getElementById("realtime-clock");
  if (!clockElement) return;
  const now = new Date();
  const hours = String(now.getUTCHours()).padStart(2, "0");
  const minutes = String(now.getUTCMinutes()).padStart(2, "0");
  const seconds = String(now.getUTCSeconds()).padStart(2, "0");
  clockElement.textContent = `${hours}:${minutes}:${seconds}`;
};

// Animation d'entrée façon "distributeur de billets"
window.addEventListener("load", () => {
  gsap.fromTo(
    ".ticket",
    { opacity: 0, x: -120, rotationZ: -2 },
    {
      opacity: 1,
      x: 0,
      rotationZ: 0,
      duration: 0.9,
      ease: "power3.out",
      stagger: 0.25
    }
  );
});



// =========================================================
// ANIMATION DE L'AVION DANS LA NAVIGATION
// =========================================================
const initPlaneNavAnimation = () => {
  const plane = document.getElementById("plane");
  const navContainer = document.getElementById("nav-container");
  if (!plane || !navContainer || !window.gsap) return;

  // Animation au repos de l'avion
  let idleTween = gsap.to(plane, {
    x: 10,
    duration: 2.5,
    yoyo: true,
    repeat: -1,
    ease: "sine.inOut",
  });

  // Création du sillage
  const createTrail = () => {
    const trail = document.createElement("span");
    trail.className = "trail";
    navContainer.appendChild(trail);
    const rect = plane.getBoundingClientRect();
    const parent = navContainer.getBoundingClientRect();
    gsap.set(trail, {
      left: rect.left - parent.left + 10,
      top: rect.top - parent.top + 10,
    });
    gsap.to(trail, {
      opacity: 0,
      scale: 3,
      x: -15,
      duration: 0.6,
      onComplete: () => trail.remove(),
    });
  };

  let trailInt;

  // Interaction sur les liens de navigation
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("mouseenter", () => {
      const lRect = link.getBoundingClientRect();
      const pRect = navContainer.getBoundingClientRect();
      const targetX = lRect.left - pRect.left + lRect.width / 2 - 10;
      idleTween.pause();
      trailInt = setInterval(createTrail, 40);
      gsap.to(plane, {
        left: targetX,
        rotation: 15,
        scale: 1.4,
        duration: 0.5,
        ease: "power2.out",
        onComplete: () => gsap.to(plane, { rotation: 0, duration: 0.2 }),
      });
      gsap.to(link, { opacity: 0.5, repeat: -1, yoyo: true, duration: 0.15 });
    });

    link.addEventListener("mouseleave", () => {
      clearInterval(trailInt);
      gsap.killTweensOf(link);
      gsap.to(link, { opacity: 1, duration: 0.2 });
    });
  });

  // Retour de l'avion à sa position initiale
  navContainer.addEventListener("mouseleave", () => {
    clearInterval(trailInt);
    gsap.to(plane, {
      left: 140, // Position ajustée pour ne pas cacher les boutons
      scale: 1,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => idleTween.restart(),
    });
  });
};

// =========================================================
// MICRO-INTERACTIONS : CLIGNOTEMENT DES NUMÉROS DE PORTE
// =========================================================
// const initGateInteractions = () => {
//   const navLinks = document.querySelectorAll(".nav-link");
//   if (!navLinks.length) return;

//   navLinks.forEach((link) => {
//     let blinkInterval;
//     const gateNumber = link.querySelector(".gate-number");
//     if (!gateNumber) return;

//     link.addEventListener("mouseenter", () => {
//       blinkInterval = setInterval(() => {
//         gateNumber.style.color = gateNumber.style.color === "#ff3b3b" ? "#facc15" : "#ff3b3b";
//       }, 500);
//     });

//     link.addEventListener("mouseleave", () => {
//       clearInterval(blinkInterval);
//       gateNumber.style.color = "#ff3b3b";
//     });
//   });
// };

// =========================================================
// INITIALISATION GLOBALE
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
  updateRealtimeClock();
  setInterval(updateRealtimeClock, 1000);
  initPlaneNavAnimation();

});

window.addEventListener("load", () => {
  animateDoorsAndBoard();
});
