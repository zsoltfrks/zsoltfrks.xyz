<script lang="ts">
  import { onMount } from 'svelte'

  let { animating = $bindable(false), typingStartDelayMs = 400 }: { animating?: boolean; typingStartDelayMs?: number } = $props()

  // --- typing animation ---
  const ROLE = 'Full-Stack Software Engineer'
  let typed = $state('')
  let typingDone = $state(false)

  // --- location glitch ---
  const LOCATIONS = ['46.2530°N, 20.1414°E', 'Szeged, Hungary']
  const LOCATION_DWELL_MS = [3500, 5000]
  const GLITCH_CHARS = '!@#$%^&*[]{}|<>0123456789ABCDEFabcdef~`'
  let locationIdx = 0
  let locationDisplay = $state(LOCATIONS[0])
  let locationTimerId: ReturnType<typeof setTimeout> | null = null
  let glitchIntervalId: ReturnType<typeof setInterval> | null = null

  function glitchTo(target: string) {
    if (glitchIntervalId) {
      clearInterval(glitchIntervalId)
    }
    const FRAMES = 10
    const MS = 40
    let frame = 0
    glitchIntervalId = setInterval(() => {
      frame++
      if (frame < FRAMES) {
        const progress = frame / FRAMES
        locationDisplay = target
          .split('')
          .map(char =>
            char === ' ' || char === ','
              ? char
              : Math.random() < progress
                ? char
                : GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
          )
          .join('')
      } else {
        if (glitchIntervalId) {
          clearInterval(glitchIntervalId)
        }
        glitchIntervalId = null
        locationDisplay = target
      }
    }, MS)
  }

  function scheduleNextGlitch(delay: number) {
    locationTimerId = setTimeout(() => {
      locationIdx = (locationIdx + 1) % LOCATIONS.length
      glitchTo(LOCATIONS[locationIdx])
      scheduleNextGlitch(LOCATION_DWELL_MS[locationIdx])
    }, delay)
  }

  // --- grim reveal ---
  let grimVisible = $state(false)

  function showGrim(): void {
    grimVisible = true
  }

  function hideGrim(): void {
    grimVisible = false
  }

  function toggleAnimation(): void {
    animating = !animating
  }

  onMount(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const typingTimerIds: number[] = []

    if (prefersReduced) {
      typed = ROLE
      typingDone = true
    } else {
      ROLE.split('').forEach((char, i) => {
        typingTimerIds.push(window.setTimeout(() => {
          typed += char
          if (i === ROLE.length - 1) typingDone = true
        }, typingStartDelayMs + i * 65))
      })

      scheduleNextGlitch(LOCATION_DWELL_MS[locationIdx])
    }

    return () => {
      typingTimerIds.forEach((id) => clearTimeout(id))
      if (locationTimerId) clearTimeout(locationTimerId)
      if (glitchIntervalId) clearInterval(glitchIntervalId)
    }
  })
</script>

<section
  id="hero"
  class="min-h-screen flex items-center justify-center"
>
  <div class="max-w-xl w-full px-6 text-left">

      <!-- greeting + name -->
      <h1 class="mb-1 text-2xl leading-snug text-white/80 sm:text-4xl">
        Hey! I'm&nbsp;<span class="name-flicker inline-flex font-bold text-white">
          Zs<span
            class="o-letter"
            role="button"
            tabindex="0"
            onmouseenter={showGrim}
            onmouseleave={hideGrim}
            onfocus={showGrim}
            onblur={hideGrim}
          >o</span>lt&nbsp;<span class="grim-wrapper"><span class="grim-text" class:grim-open={grimVisible}>'grim'&nbsp;</span></span><span class="farkas" class:grim-open={grimVisible}>Farkas</span>
        </span>
      </h1>

      <!-- role with typing animation -->
      <p class="mb-8 text-xl text-white/80">
        {typed}<span class={typingDone ? 'cursor-done' : 'cursor-blink'}>_</span>
      </p>

      <!-- bio TODO: test different font sizes for better readability -->
      <p class="mb-8 text-sm leading-relaxed text-white/75">
        Computer Science BSc student passionate about <span class="text-white/97">full-stack development</span>, with an interest in 
        <span class="text-white/97">video game development</span>.
      </p>
      
      <!-- tagline -->
      <p class="mb-8 text-sm text-white/75 italic">Always learning, always tinkering.</p>

      <!-- location glitch -->
      <p class="mb-6 font-mono text-sm text-white/75">{locationDisplay}</p>

      <!-- TODO: Rework this so its not just a huge wall of text smh -->
      <!-- links row 
      <div class="flex flex-wrap items-center justify-start gap-x-4 gap-y-3 sm:gap-x-0 text-[13px] text-white/50">
        <a
          href="https://github.com/zsoltfrks"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-1.5 transition-colors hover:text-white"
        >
          <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.107-.776.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.604-.015 2.896-.015 3.286 0 .322.216.694.825.576C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/></svg>
          GitHub
        </a>

        <span class="mx-3 hidden text-white/15 sm:block" aria-hidden="true">|</span>

        <a
          href="https://linkedin.com/in/zsoltfrks"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-1.5 transition-colors hover:text-white"
        >
          <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          LinkedIn
        </a>

        <span class="mx-3 hidden text-white/15 sm:block" aria-hidden="true">|</span>

        <button
          onclick={toggleAnimation}
          class="transition-colors hover:text-white"
        >
          Animation: {animating ? 'on' : 'off'}
        </button>

        <span class="mx-3 hidden text-white/15 sm:block" aria-hidden="true">|</span>

        <a href="/about" class="transition-colors hover:text-white">
          Learn more about me →
        </a>
      </div>-->

  </div>
</section>

<style>
  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }
  .cursor-blink { animation: blink 0.7s step-end infinite; }
  .cursor-done  { opacity: 0; }

  @keyframes flicker {
    0%    { opacity: 1; }
    4.8%  { opacity: 1; }
    5%    { opacity: 0.08; }
    5.2%  { opacity: 1; }
    5.4%  { opacity: 0.4; }
    5.6%  { opacity: 1; }
    29.8% { opacity: 1; }
    30%   { opacity: 0.2; }
    30.3% { opacity: 1; }
    64.6% { opacity: 1; }
    65%   { opacity: 0.04; }
    65.2% { opacity: 1; }
    65.5% { opacity: 0.12; }
    65.6% { opacity: 1; }
    65.9% { opacity: 0.04; }
    66.1% { opacity: 1; }
    87.8% { opacity: 1; }
    88.1% { opacity: 0.18; }
    88.4% { opacity: 1; }
    100%  { opacity: 1; }
  }
  .name-flicker {
    filter: drop-shadow(0 0 5px rgba(255,255,255,0.2)) drop-shadow(0 0 14px rgba(255,255,255,0.07));
  }

  /* ── Dimmed "o" ───────────────────────────────── */
  .o-letter {
    color: rgb(165, 161, 161);
    cursor: pointer;
    transition: color 0.15s ease;
    animation: flicker 8s ease-in-out infinite;
  }
  .o-letter:hover {
    color: rgb(255, 255, 255);
    transition: color 0.15s ease;
    animation-play-state: paused;
  }

  .grim-wrapper {
    position: relative;
    width: 0;
  }
  .grim-text {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.25s ease;
  }
  .grim-text.grim-open {
    opacity: 1;
  }
  .farkas {
    transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  .farkas.grim-open {
    transform: translateX(7ch);
  }

  @media (prefers-reduced-motion: reduce) {
    .cursor-blink { animation: none; }
    .o-letter { animation: none; }
  }

  @media (hover: none) {
    .o-letter {
      color: rgb(255, 255, 255);
      animation: none;
      cursor: default;
    }

    @media (pointer: coarse) {
      .o-letter {
        pointer-events: none;
      }
    }
  }
</style>
