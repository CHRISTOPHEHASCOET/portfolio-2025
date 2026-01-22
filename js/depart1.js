// ==========================================================================
// 1. DONNÉES DES VOLS (À PERSONNALISER)
// ==========================================================================
const flights = [
  { vol: "GPB01", destination: "COOK N WQ9", embarquement: "09:00", porte: "A4", observations: "TERMINE" },
  { vol: "CAM02", destination: "CAMI COURSES EXPRESS", embarquement: "10:10", porte: "B2", observations: "LIVRE" },
  { vol: "FKM04", destination: "GO 2 IMA 00", embarquement: "11:20", porte: "C1", observations: "EN PREP" },
  { vol: "JSX07", destination: "REACT EXPRESS", embarquement: "12:30", porte: "A7", observations: "EN VOL" },
];

// ==========================================================================
// 2. GÉNÉRATION DU TABLEAU AVEC SPLIT-FLAP
// ==========================================================================
function generateFlightRows() {
  const tbody = document.getElementById('board-body');
  tbody.innerHTML = ''; // Nettoie le contenu existant

  flights.forEach((flight, rowIndex) => {
    const row = document.createElement('tr');
    row.className = 'departure-row';

    // Cellule VOL
    const volCell = document.createElement('td');
    volCell.setAttribute('data-label', 'VOL');
    const volWord = document.createElement('span');
    volWord.className = 'word';
    flight.vol.split('').forEach((char, i) => {
      const flap = document.createElement('span');
      flap.className = 'flap';
      flap.textContent = char;
      flap.style.setProperty('--delay', `${rowIndex * 0.2 + i * 0.05}s`);
      volWord.appendChild(flap);
    });
    volCell.appendChild(volWord);
    row.appendChild(volCell);

    // Cellule DESTINATION
    const destCell = document.createElement('td');
    destCell.setAttribute('data-label', 'DESTINATION');
    const destWord = document.createElement('span');
    destWord.className = 'word';
    flight.destination.split('').forEach((char, i) => {
      const flap = document.createElement('span');
      flap.className = 'flap';
      flap.textContent = char;
      flap.style.setProperty('--delay', `${rowIndex * 0.2 + i * 0.05 + 0.1}s`);
      destWord.appendChild(flap);
    });
    destCell.appendChild(destWord);
    row.appendChild(destCell);

    // Cellule EMBARQUEMENT
    const timeCell = document.createElement('td');
    timeCell.setAttribute('data-label', 'EMBARQUEMENT');
    timeCell.textContent = flight.embarquement;
    row.appendChild(timeCell);

    // Cellule PORTE
    const gateCell = document.createElement('td');
    gateCell.setAttribute('data-label', 'PORTE');
    gateCell.className = 'gate';
    gateCell.textContent = flight.porte;
    row.appendChild(gateCell);

    // Cellule OBSERVATIONS
    const obsCell = document.createElement('td');
    obsCell.setAttribute('data-label', 'OBSRVATIONS');
    const obsWord = document.createElement('span');
    obsWord.className = 'word';
    flight.observations.split('').forEach((char, i) => {
      const flap = document.createElement('span');
      flap.className = 'flap';
      flap.textContent = char;
      flap.style.setProperty('--delay', `${rowIndex * 0.2 + i * 0.05 + 0.2}s`);
      obsWord.appendChild(flap);
    });
    obsCell.appendChild(obsWord);
    row.appendChild(obsCell);

    tbody.appendChild(row);
  });
}

// ==========================================================================
// 3. ANIMATION SPLIT-FLAP
// ==========================================================================
function animateSplitFlap() {
  document.querySelectorAll('.flap').forEach(flap => {
    gsap.set(flap, { opacity: 0, rotationX: 90 });
    gsap.to(flap, {
      opacity: 1,
      rotationX: 0,
      duration: 0.3,
      delay: parseFloat(flap.style.getPropertyValue('--delay')),
      ease: "back.out(1.7)"
    });
  });
}

// ==========================================================================
// 4. ANIMATION DE L'AVION
// ==========================================================================
function setupPlaneAnimation() {
  const airplane = document.getElementById('plane');

  // Suivi de souris
  document.addEventListener('mousemove', (e) => {
    gsap.to(airplane, {
      x: e.clientX - 15,
      y: e.clientY - 15,
      duration: 0.3,
      ease: "power2.out"
    });
  });

  // Pointage vers les portes
  document.querySelectorAll('.gate').forEach(gate => {
    gate.addEventListener('mouseenter', () => {
      const gatePosition = gate.getBoundingClientRect();
      gsap.to(airplane, {
        x: gatePosition.left + gatePosition.width / 2 - 15,
        y: gatePosition.top + gatePosition.height / 2 - 15,
        duration: 0.5,
        ease: "power2.inOut"
      });
    });
  });
}

// ==========================================================================
// 5. EFFET SCAN (LIGNE QUI DÉFILE)
// ==========================================================================
function setupScanEffect() {
  const scanLine = document.createElement('div');
  scanLine.className = 'scan-line';
  document.querySelector('.board').prepend(scanLine);

  gsap.to('.scan-line', {
    y: '100%',
    duration: 5,
    repeat: -1,
    ease: 'linear'
  });
}

// ==========================================================================
// 6. HORLOGE TEMPS RÉEL (CORRIGÉE)
// ==========================================================================
function updateClock() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  document.querySelector('.board-clock span:last-child').textContent = `${hours}:${minutes}:${seconds}`;
}

// ==========================================================================
// 7. ANIMATION DES PORTES (EXISTANTE)
// ==========================================================================
function setupDoorAnimation() {
  // Ton code existant pour l'animation des portes
  gsap.to(".door.left", {
    x: "-100%",
    duration: 1.5,
    ease: "power2.inOut"
  });
  gsap.to(".door.right", {
    x: "100%",
    duration: 1.5,
    ease: "power2.inOut"
  });
}

// ==========================================================================
// 8. INITIALISATION AU CHARGEMENT
// ==========================================================================
window.addEventListener('DOMContentLoaded', () => {
  generateFlightRows();      // Génère le tableau
  animateSplitFlap();        // Anime les lettres
  setupPlaneAnimation();     // Anime l'avion
  setupScanEffect();         // Ajoute l'effet scan
  setupDoorAnimation();      // Anime les portes
  setInterval(updateClock, 1000); // Met à jour l'horloge
  updateClock();             // Affiche l'heure immédiatement
});
