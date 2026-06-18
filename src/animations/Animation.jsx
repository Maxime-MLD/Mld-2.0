import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/*
  Animation.jsx — POINT UNIQUE de toutes les animations du site.
  Monté une seule fois dans Layout.astro via <Animation client:load />.

  Règles d'architecture :
  - Aucune classe Tailwind / HTML ici : uniquement de la logique d'animation.
  - On cible les éléments via leurs attributs data-anim (ex. [data-anim="hero-title"]).
  - FALLBACK SEO : tant que ce JS ne s'exécute pas, les éléments restent VISIBLES.
    On ajoute la classe `js-anim` sur <html> au tout début ; c'est elle qui
    applique opacity:0 (voir global.css). Si le JS échoue, rien n'est masqué.
  - On respecte prefers-reduced-motion (pas d'animation si l'utilisateur le demande).
*/

export default function Animation() {
  useEffect(() => {
    // Accessibilité : on n'anime pas si l'utilisateur préfère moins de mouvement.
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    // Active le masquage initial UNIQUEMENT maintenant que le JS tourne.
    document.documentElement.classList.add('js-anim');

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Helper : révèle un élément masqué par js-anim (fade + slide discret).
      const reveal = (selector, vars = {}) => {
        const el = gsap.utils.toArray(selector);
        if (!el.length) return;
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            stagger: 0.08,
            ...vars,
          }
        );
      };

      // eslint-disable-next-line no-unused-vars
      const scrollReveal = (selector, vars = {}) =>
        reveal(selector, {
          scrollTrigger: { trigger: selector, start: 'top 85%' },
          ...vars,
        });

      // === NAVBAR ===
      // Apparition douce du header au chargement (slide depuis le haut).
      gsap.fromTo(
        '[data-anim="navbar"]',
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }
      );

      // === HERO ===
      // Cascade au chargement (pas de scroll : visible d'emblée).
      gsap
        .timeline({ defaults: { ease: 'power2.out', duration: 0.8 } })
        .fromTo('[data-anim="hero-eyebrow"]', { opacity: 0, y: 16 }, { opacity: 1, y: 0 })
        .fromTo('[data-anim="hero-title"]', { opacity: 0, y: 24 }, { opacity: 1, y: 0 }, '-=0.55')
        .fromTo('[data-anim="hero-subtitle"]', { opacity: 0, y: 24 }, { opacity: 1, y: 0 }, '-=0.55')
        .fromTo('[data-anim="hero-cta"]', { opacity: 0, y: 24 }, { opacity: 1, y: 0 }, '-=0.55')
        .fromTo('[data-anim="hero-visual"]', { opacity: 0, y: 32, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 1 }, '-=0.7');

      // Fond de points du hero : dérive lente (transform, GPU) + légère pulsation.
      // Peu coûteux (une seule couche), boucle infinie. Désactivé si reduce-motion
      // (retour anticipé en haut du useEffect) → points statiques visibles.
      const heroDots = document.querySelector('#hero-dots');
      if (heroDots) {
        // Dérive d'une tuile (26px) puis reset : seamless car le motif se répète.
        gsap.to(heroDots, { y: 26, duration: 9, ease: 'none', repeat: -1 });
      }

      // === CHIFFRES-CLÉS (trust bar) ===
      // Apparition des indicateurs + effet compteur (numérique et alphabétique).
      const keyfacts = document.querySelector('[data-keyfacts]');
      if (keyfacts) {
        scrollReveal('[data-anim="stat-item"]', {
          stagger: 0.1,
          scrollTrigger: { trigger: keyfacts, start: 'top 85%' },
        });

        ScrollTrigger.create({
          trigger: keyfacts,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            // Compteurs numériques : 0 → valeur finale.
            keyfacts.querySelectorAll('[data-count]').forEach((el) => {
              const to = parseInt(el.dataset.to, 10);
              const obj = { v: 0 };
              gsap.to(obj, {
                v: to,
                duration: 1.4,
                ease: 'power2.out',
                onUpdate: () => {
                  el.textContent = Math.round(obj.v);
                },
              });
            });
            // Compteurs alphabétiques : A↕Z (down = Z→A, up = A→Z).
            keyfacts.querySelectorAll('[data-alpha]').forEach((el) => {
              const toIdx = el.dataset.to.charCodeAt(0) - 65;
              const fromIdx = el.dataset.dir === 'down' ? 25 : 0;
              const obj = { i: fromIdx };
              gsap.to(obj, {
                i: toIdx,
                duration: 1.4,
                ease: 'power2.out',
                onUpdate: () => {
                  el.textContent = String.fromCharCode(65 + Math.round(obj.i));
                },
              });
            });
          },
        });
      }

      // === STATS / PROBLÈME ===
      scrollReveal('[data-anim="stats-eyebrow"]');
      scrollReveal('[data-anim="stats-title"]');
      scrollReveal('[data-anim="stats-subtitle"]');
      scrollReveal('[data-anim="stats-item"]', { stagger: 0.12 });
      scrollReveal('[data-anim="stats-legend"]');

      // === SERVICES ===
      scrollReveal('[data-anim="services-eyebrow"]');
      scrollReveal('[data-anim="services-title"]');
      scrollReveal('[data-anim="services-subtitle"]');
      // Blocs alternés : image + texte révélés ensemble quand le bloc entre dans le viewport.
      gsap.utils.toArray('[data-service-block]').forEach((block) => {
        const media = block.querySelector('[data-anim="service-media"]');
        const text = block.querySelector('[data-anim="service-text"]');
        gsap.fromTo(
          [media, text].filter(Boolean),
          { opacity: 0, y: 32 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            stagger: 0.12,
            scrollTrigger: { trigger: block, start: 'top 80%' },
          }
        );
      });

      scrollReveal('[data-anim="services-cta"]');

      // === À PROPOS ===
      scrollReveal('[data-anim="about-photo"]', { duration: 1 });
      scrollReveal('[data-anim="about-eyebrow"]');
      scrollReveal('[data-anim="about-title"]');
      scrollReveal('[data-anim="about-text"]');
      scrollReveal('[data-anim="about-value"]', { stagger: 0.1 });
      scrollReveal('[data-anim="about-cta"]');

      // === RÉALISATIONS ===
      scrollReveal('[data-anim="real-eyebrow"]');
      scrollReveal('[data-anim="real-title"]');
      scrollReveal('[data-anim="real-subtitle"]');
      scrollReveal('[data-anim="real-card"]', { stagger: 0.1 });

      // === TÉMOIGNAGES === (en pause — section remplacée par PROCESS)
      // scrollReveal('[data-anim="testi-eyebrow"]');
      // scrollReveal('[data-anim="testi-title"]');
      // scrollReveal('[data-anim="testi-card"]', { stagger: 0.12 });

      // === PROCESS ===
      scrollReveal('[data-anim="process-eyebrow"]');
      scrollReveal('[data-anim="process-title"]');

      // Déclencheur commun à la timeline.
      const processTrigger = { trigger: '[data-anim="process-step"]', start: 'top 80%' };

      // La ligne se trace progressivement, puis la flèche apparaît au bout.
      // Le double scale (X + Y depuis 0) fonctionne pour les deux orientations
      // (horizontale dès lg, verticale en dessous) sans dépendre du breakpoint.
      // Fallback : la ligne est masquée par js-anim puis révélée ici ; le rail
      // de fond, lui, reste visible même sans JS.
      gsap
        .timeline({ scrollTrigger: processTrigger })
        .fromTo(
          '[data-anim="process-line"]',
          { opacity: 1, scaleX: 0, scaleY: 0 },
          { scaleX: 1, scaleY: 1, duration: 1.1, ease: 'power2.out' }
        )
        .fromTo(
          '[data-anim="process-arrow"]',
          { opacity: 0 },
          { opacity: 1, duration: 0.4 },
          '-=0.1'
        );

      // Les étapes apparaissent une par une (gauche→droite sur desktop).
      gsap.fromTo(
        '[data-anim="process-step"]',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.18,
          scrollTrigger: processTrigger,
        }
      );

      scrollReveal('[data-anim="process-cta"]');

      // === FAQ ===
      scrollReveal('[data-anim="faq-eyebrow"]');
      scrollReveal('[data-anim="faq-title"]');
      scrollReveal('[data-anim="faq-item"]', { stagger: 0.08 });

      // === CTA FINAL / CONTACT ===
      scrollReveal('[data-anim="cta-box"]', { y: 32 });
      scrollReveal('[data-anim="contact-intro"]', { stagger: 0.1 });
      scrollReveal('[data-anim="contact-info"]');
      scrollReveal('[data-anim="contact-form"]');

      // === FOOTER ===
      scrollReveal('[data-anim="footer"]', { duration: 0.6 });

      // Recalcule les positions une fois tout en place.
      ScrollTrigger.refresh();
    });

    return () => ctx.revert(); // nettoyage complet au démontage
  }, []);

  return null; // ce composant ne rend aucun DOM
}
