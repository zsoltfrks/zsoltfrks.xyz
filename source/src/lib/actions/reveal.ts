type RevealOptions = {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
};

type RevealActionReturn = {
  destroy(): void;
};

type NormalizedRevealOptions = Required<RevealOptions>;

const REVEALED_CLASS = "is-revealed";

const DEFAULT_REVEAL_OPTIONS: NormalizedRevealOptions = {
  threshold: 0.18,
  rootMargin: "0px 0px -10% 0px",
  once: true,
};

function normalizeRevealOptions(
  options: RevealOptions = {},
): NormalizedRevealOptions {
  return {
    ...DEFAULT_REVEAL_OPTIONS,
    ...options,
  };
}

function revealNode(node: HTMLElement): void {
  node.classList.add(REVEALED_CLASS);
}

function hideNode(node: HTMLElement): void {
  node.classList.remove(REVEALED_CLASS);
}

function supportsIntersectionObserver(): boolean {
  return typeof window !== "undefined" && "IntersectionObserver" in window;
}

function createIntersectionHandler(
  node: HTMLElement,
  options: NormalizedRevealOptions,
  disconnect: () => void,
): IntersectionObserverCallback {
  return ([entry]) => {
    if (!entry) {
      return;
    }

    if (entry.isIntersecting) {
      revealNode(node);

      if (options.once) {
        disconnect();
      }

      return;
    }

    if (!options.once) {
      hideNode(node);
    }
  };
}

export function reveal(
  node: HTMLElement,
  options: RevealOptions = {},
): RevealActionReturn {
  const normalizedOptions = normalizeRevealOptions(options);

  if (!supportsIntersectionObserver()) {
    revealNode(node);
    return {
      destroy() {},
    };
  }

  let observer: IntersectionObserver | undefined;

  observer = new IntersectionObserver(
    createIntersectionHandler(node, normalizedOptions, () => {
      observer?.disconnect();
    }),
    {
      threshold: normalizedOptions.threshold,
      rootMargin: normalizedOptions.rootMargin,
    },
  );

  observer.observe(node);

  return {
    destroy() {
      observer.disconnect();
    },
  };
}
