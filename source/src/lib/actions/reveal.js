export function reveal(node, options = {}) {
  const {
    threshold = 0.18,
    rootMargin = "0px 0px -10% 0px",
    once = true,
  } = options;

  if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
    node.classList.add("is-revealed");
    return {
      destroy() {},
    };
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry) return;

      if (entry.isIntersecting) {
        node.classList.add("is-revealed");

        if (once) {
          observer.disconnect();
        }
        return;
      }

      if (!once) {
        node.classList.remove("is-revealed");
      }
    },
    { threshold, rootMargin },
  );

  observer.observe(node);

  return {
    destroy() {
      observer.disconnect();
    },
  };
}
