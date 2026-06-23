import { useEffect } from 'react';

// Révèle les [data-reveal] au scroll (ajoute .is-visible). À appeler dans le layout.
export default function useScrollReveal(selector = '[data-reveal]') {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      document.querySelectorAll(selector).forEach((el) => el.classList.add('is-visible'));
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    const seen = new WeakSet();
    const observe = () => document.querySelectorAll(selector).forEach((el) => {
      if (!seen.has(el)) { seen.add(el); io.observe(el); }
    });
    observe();
    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, [selector]);
}
