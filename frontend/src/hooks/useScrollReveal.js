import { useEffect } from 'react';

/**
 * Révèle en douceur les éléments portant l'attribut [data-reveal] quand ils
 * entrent dans le viewport (fade + slide géré en CSS via la classe .is-visible).
 *
 * - Respecte prefers-reduced-motion (affiche tout immédiatement).
 * - Fallback : si IntersectionObserver est absent, tout est révélé.
 * - À appeler une fois dans une page (ex. HomePage) ; observe aussi les
 *   éléments montés après coup (carrousel chargé en async).
 */
export default function useScrollReveal(selector = '[data-reveal]') {
  useEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const revealAll = () =>
      document
        .querySelectorAll(selector)
        .forEach((el) => el.classList.add('is-visible'));

    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealAll();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    const observed = new WeakSet();
    const observeAll = () => {
      document.querySelectorAll(selector).forEach((el) => {
        if (!observed.has(el)) {
          observed.add(el);
          io.observe(el);
        }
      });
    };

    observeAll();

    // Réobserve quand de nouveaux éléments apparaissent (ex. cartes async).
    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [selector]);
}
