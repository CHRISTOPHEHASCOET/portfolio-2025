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

// =========================================================
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
//       // Clignotement du numéro de porte entre rouge et jaune
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