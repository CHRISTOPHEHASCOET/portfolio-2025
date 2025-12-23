 // =========================================================
    // DONNÉES DU TABLEAU
    // =========================================================

    const entries = [
      // Vol principal
      { vol: "CH2025", dest: "PORTFOLIO PILOTE WEB", time: "NOW", gate: "A01", obs: "EMBARQUEMENT" },
      // Projets développeur
      { vol: "BKI01", dest: "SITE BOOKI RESA VOYAGE", time: "09:30", gate: "C03", obs: "PROJET DEV" },
      { vol: "OMF02", dest: "SITE OHMYFOOD MENUS", time: "10:45", gate: "C03", obs: "PROJET DEV" },
      { vol: "PAN03", dest: "LA PANTHERE REFONTE SEO", time: "11:30", gate: "C03", obs: "PROJET DEV" },
      // Cahiers des charges / études de cas
      { vol: "CWC01", dest: "COOK'N WAY PLATS MAISON", time: "12:15", gate: "D04", obs: "CAHIER" },
      { vol: "CAM02", dest: "CAMI COURSES EXPRESS", time: "13:00", gate: "D04", obs: "CAHIER" },
      { vol: "FKM03", dest: "FKM MOBILITE INCLUSIVE", time: "13:45", gate: "D04", obs: "CAHIER" },
      // Langages / niveau
      { vol: "SKL01", dest: "HTML & CSS ", time: "ALL", gate: "E05", obs: "COMPETENCES" },
      { vol: "SKL02", dest: "JAVASCRIPT", time: "ALL", gate: "E05", obs: "APPRENTISSAGE" },
      { vol: "SKL03", dest: "REACT PHP TS SASS", time: "ALL", gate: "E05", obs: "APPRENTISSAGE" },
    ];

    // Configuration des colonnes : CORRIGÉE POUR LA COLONNE PORTE
    const SLOTS = {
      vol: 6,
      dest: 24, // Augmenté pour les titres longs
      time: 5,
      gate: 4,
      obs: 15
    };
    const CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:'";

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

    // =========================================================
    // FONCTIONS DU TABLEAU SPLIT-FLAP
    // =========================================================

    const createWord = (text, count, extraClass) => {
      const str = (text || "").toUpperCase().padEnd(count, " ");
      const span = document.createElement("span");
      span.className = `word ${extraClass}`;
      for (let i = 0; i < count; i++) {
        const flap = document.createElement("span");
        flap.className = "flap";
        flap.dataset.char = str[i];
        flap.textContent = " ";
        span.appendChild(flap);
      }
      return span;
    };

    // MODIFIÉ : Ajout des attributs data-* pour le CSS mobile
    const buildBoard = () => {
      const tbody = document.getElementById("board-body");
      if (!tbody) return;

      const fragment = document.createDocumentFragment();

      entries.forEach((item) => {
        const row = document.createElement("tr");

        const createCell = (key, className) => {
          const td = document.createElement("td");
          td.appendChild(createWord(item[key], SLOTS[key], className));
          return td;
        };

        row.appendChild(createCell("vol", "c-vol"));
        row.appendChild(createCell("dest", "c-dest"));
        row.appendChild(createCell("time", "c-time"));
        row.appendChild(createCell("gate", "c-gate"));
        row.appendChild(createCell("obs", "c-obs"));

        fragment.appendChild(row);
      });

      tbody.appendChild(fragment);
    };

    // =========================================================
    // ANIMATION DU SPLIT-FLAP
    // =========================================================

    // J'anime UN clapet (une lettre) - CORRIGÉ
    const animateSingleFlap = (flap) => {
      const targetChar = flap.dataset.char || " ";
      const flips = 4 + Math.floor(Math.random() * 4); // Moins de flips pour éviter les bugs
      let currentFlip = 0;

      // On réinitialise le clapet avant animation
      gsap.set(flap, { rotationX: 0, textContent: " " });

      gsap.to(flap, {
        rotationX: -90,
        duration: 0.06,
        ease: "power2.in",
        yoyo: true,
        repeat: flips,
        onRepeat: () => {
          currentFlip++;
          // On affiche un caractère aléatoire QUE si on n'est pas à la dernière animation
          if (currentFlip < flips) {
            const randIndex = Math.floor(Math.random() * CHARS.length);
            flap.textContent = CHARS[randIndex];
          } else {
            // Dernière étape : on affiche le texte cible
            flap.textContent = targetChar;
          }
        },
        onComplete: () => {
          gsap.set(flap, { rotationX: 0 });
        }
      });
    };

    const animateBoardFlaps = () => {
      // On ne lance l'animation lourde que si on est sur un écran assez grand
      if (window.innerWidth <= 768 || !window.gsap) return;

      const flaps = document.querySelectorAll(".flap");
      flaps.forEach((flap, index) => {
        const delay = index * 0.05;
        gsap.delayedCall(delay, () => animateSingleFlap(flap));
      });
    };

    // =========================================================
    // ANIMATION DE LA PORTE + DÉCLENCHEMENT
    // =========================================================

    const animateDoorsAndBoard = () => {
      if (!window.gsap) {
        const overlay = document.querySelector(".doors-overlay");
        if (overlay) overlay.style.display = "none";
        animateBoardFlaps();
        return;
      }

      const tl = gsap.timeline();
      tl.call(animateBoardFlaps, null, 0.1)
        .to(".door.left", { x: "-100%", duration: 1.3, ease: "power4.inOut" }, 0)
        .to(".door.right", { x: "100%", duration: 1.3, ease: "power4.inOut" }, 0)
        .to(
          ".doors-overlay",
          { opacity: 0, duration: 0.6, ease: "power2.out" },
          1.0
        )
        .set(".doors-overlay", { display: "none", visibility: "hidden" }); // Ajout de visibility:hidden
    };


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
    const initGateInteractions = () => {
      const navLinks = document.querySelectorAll(".nav-link");
      if (!navLinks.length) return;

      navLinks.forEach((link) => {
        let blinkInterval;
        const gateNumber = link.querySelector(".gate-number");
        if (!gateNumber) return;

        link.addEventListener("mouseenter", () => {
          // Clignotement du numéro de porte entre rouge et jaune
          blinkInterval = setInterval(() => {
            gateNumber.style.color = gateNumber.style.color === "#ff3b3b" ? "#facc15" : "#ff3b3b";
          }, 500);
        });

        link.addEventListener("mouseleave", () => {
          clearInterval(blinkInterval);
          gateNumber.style.color = "#ff3b3b";
        });
      });
    };

    // =========================================================
    // INITIALISATION GLOBALE
    // =========================================================

    document.addEventListener("DOMContentLoaded", () => {
      updateRealtimeClock();
      setInterval(updateRealtimeClock, 1000);
      buildBoard();
      initPlaneNavAnimation();
      initGateInteractions();
    });

    window.addEventListener("load", () => {
      animateDoorsAndBoard();
    });