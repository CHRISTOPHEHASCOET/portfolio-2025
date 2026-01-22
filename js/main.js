document.addEventListener('DOMContentLoaded', function() {
    // Initialiser GSAP
    gsap.registerPlugin(ScrollTrigger);

    // Animations de la navbar
    gsap.from(".logo", {
        opacity: 0,
        y: -30,
        duration: 0.8,
        ease: "back.out(1.7)"
    });

    gsap.from(".profile-btn", {
        opacity: 0,
        y: -20,
        duration: 0.8,
        delay: 0.4,
        ease: "back.out(1.7)",
        stagger: 0.1
    });

    // Animation du hero
    if (document.querySelector('.hero')) {
        gsap.from(".hero h1", {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: "back.out(1.7)"
        });

        gsap.from(".hero .subtitle", {
            opacity: 0,
            y: 30,
            duration: 1,
            delay: 0.3,
            ease: "back.out(1.7)"
        });

        gsap.from(".hero-tags span", {
            opacity: 0,
            y: 20,
            duration: 0.8,
            stagger: 0.1,
            delay: 0.6,
            ease: "back.out(1.7)"
        });
    }

    // Animations des sections
    gsap.utils.toArray(".section").forEach(section => {
        gsap.from(section, {
            opacity: 0,
            y: 50,
            duration: 1,
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none none"
            }
        });
    });

    // Effets de survol
    const hoverElements = document.querySelectorAll('.btn, .formation-card, .highlight-card');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            gsap.to(el, {
                scale: 1.02,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        el.addEventListener('mouseleave', () => {
            gsap.to(el, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
});

 const cahiersData = {
            cahier1: {
                title: "Application Mobile E-commerce",
                type: "E-commerce",
                pages: "25",
                budget: "30K€",
                context: "Création d'une application mobile de vente en ligne pour un client dans le secteur de la mode...",
                features: ["Interface utilisateur intuitive", "Panier intelligent", "Paiement sécurisé"],
                tech: ["React Native", "Node.js", "MongoDB"]
            },
            cahier2: {
                title: "Plateforme B2B Marketplace",
                type: "Marketplace",
                pages: "38",
                budget: "50K€",
                context: "Développement d'une plateforme B2B pour connecter grossistes et détaillants...",
                features: ["Gestion multi-utilisateurs", "Catalogue produits avancé", "Paiement sécurisé"],
                tech: ["React", "Node.js", "PostgreSQL"]
            },
            cahier3: {
                title: "Dashboard Analytics RH",
                type: "Analytics",
                pages: "42",
                budget: "25K€",
                context: "Création d'un tableau de bord RH pour un groupe de 5000 employés...",
                features: ["Indicateurs KPI personnalisables", "Reporting automatisé", "Intégration API SIRH"],
                tech: ["React", "D3.js", "Python"]
            }
        };

        // Fonctions pour la modale
        window.openModal = function(id) {
            const data = cahiersData[id];
            document.getElementById('modal-title').textContent = data.title;
            document.getElementById('modal-type').textContent = data.type;
            document.getElementById('modal-pages').textContent = data.pages;
            document.getElementById('modal-budget').textContent = data.budget;
            document.getElementById('modal-context').textContent = data.context;
            const featuresList = document.getElementById('modal-features');
            featuresList.innerHTML = data.features.map(feature => `<li>${feature}</li>`).join('');
            const techList = document.getElementById('modal-tech');
            techList.innerHTML = data.tech.map(tech => `<li>${tech}</li>`).join('');
            document.getElementById('cahier-modal').style.display = 'block';
            document.body.style.overflow = 'hidden';
        };

        window.closeModal = function() {
            document.getElementById('cahier-modal').style.display = 'none';
            document.body.style.overflow = 'auto';
        };



