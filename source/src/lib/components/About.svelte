<script lang="ts">
  import { fade } from 'svelte/transition'

  let { standalone = false }: { standalone?: boolean } = $props()
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  let imageError = $state(false)
  let imageLoaded = $state(false)
  let lunaImageError = $state<boolean[]>([false, false, false])
  let lunaImageLoaded = $state<boolean[]>([false, false, false])
  let lightboxIdx = $state<number | null>(null)
  let techStackOpen = $state(false)

  const profileImage = {
    src: '/images/profile-800.webp',
    srcset: '/images/profile-480.webp 480w, /images/profile-800.webp 800w',
    width: 960,
    height: 1280,
  }

  const lunaPhotos = [
    {
      preview: '/images/luna-800-1.webp',
      previewSrcset: '/images/luna-480-1.webp 480w, /images/luna-800-1.webp 800w',
      full: '/images/luna-1.webp',
      width: 960,
      height: 1280
    },
    {
      preview: '/images/luna-800-2.webp',
      previewSrcset: '/images/luna-480-2.webp 480w, /images/luna-800-2.webp 800w',
      full: '/images/luna-2.webp',
      width: 960,
      height: 1280
    },
    {
      preview: '/images/luna-800-3.webp',
      previewSrcset: '/images/luna-480-3.webp 480w, /images/luna-800-3.webp 800w',
      full: '/images/luna-3.webp',
      width: 960,
      height: 1280
    }
  ]

  const techStack = [
    { category: 'Languages',      items: ['Lua', 'HLSL', 'Python', 'Java', 'TypeScript', 'JavaScript'] },
    { category: 'Frontend',       items: ['Svelte', 'React', 'Next.js', 'Tailwind CSS', 'HTML', 'CSS'] },
    { category: 'Backend',        items: ['Node.js', 'Spring Boot'] },
    { category: 'Databases',      items: ['PostgreSQL', 'MySQL'] },
    { category: 'Cloud & DevOps', items: ['Microsoft Azure', 'Docker'] },
    { category: 'Tools & Misc',   items: ['Git', 'Jira', 'Figma', 'Adobe Photoshop'] }
  ]

  const sectionClass = $derived(standalone ? 'pb-20 pt-28' : 'py-24')
  const aboutFadeMs = $derived(prefersReducedMotion ? 0 : standalone ? 420 : 220)

  function markProfileImageLoaded(): void {
    imageLoaded = true
  }

  function markProfileImageFailed(): void {
    imageError = true
  }

  function markLunaImageLoaded(index: number): void {
    lunaImageLoaded[index] = true
  }

  function markLunaImageFailed(index: number): void {
    lunaImageError[index] = true
  }

  function getPhotoIndex(target: EventTarget | null): number | null {
    if (!(target instanceof HTMLElement)) return null

    const rawIndex = target.dataset.photoIndex
    if (rawIndex === undefined) return null

    const index = Number(rawIndex)
    return Number.isInteger(index) ? index : null
  }

  function handleLunaImageLoad(event: Event): void {
    const index = getPhotoIndex(event.currentTarget)
    if (index === null) return

    markLunaImageLoaded(index)
  }

  function handleLunaImageError(event: Event): void {
    const index = getPhotoIndex(event.currentTarget)
    if (index === null) return

    markLunaImageFailed(index)
  }

  function openLightbox(index: number): void {
    lightboxIdx = index
  }

  function handleLightboxThumbnailClick(event: MouseEvent): void {
    const index = getPhotoIndex(event.currentTarget)
    if (index === null) return

    openLightbox(index)
  }

  function closeLightbox(): void {
    lightboxIdx = null
  }

  function openTechStack(): void {
    techStackOpen = true
  }

  function closeTechStack(): void {
    techStackOpen = false
  }

  function stopEventPropagation(event: Event): void {
    event.stopPropagation()
  }

  function moveLightbox(event: MouseEvent, step: number): void {
    event.stopPropagation()

    if (lightboxIdx === null) return

    lightboxIdx = (lightboxIdx + step + lunaPhotos.length) % lunaPhotos.length
  }

  function handleDismissOnEscape(event: KeyboardEvent, dismiss: () => void): void {
    if (event.key === 'Escape') {
      dismiss()
    }
  }

  function handleLightboxEscape(event: KeyboardEvent): void {
    handleDismissOnEscape(event, closeLightbox)
  }

  function handleTechStackEscape(event: KeyboardEvent): void {
    handleDismissOnEscape(event, closeTechStack)
  }

  function handleWindowKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Escape') return

    closeLightbox()
    closeTechStack()
  }

  function showPreviousLightboxImage(event: MouseEvent): void {
    moveLightbox(event, -1)
  }

  function showNextLightboxImage(event: MouseEvent): void {
    moveLightbox(event, 1)
  }
</script>

<svelte:window onkeydown={handleWindowKeydown} />

<section id="about" class={sectionClass} in:fade={{ duration: aboutFadeMs }}>
  <div class="mx-auto max-w-5xl px-6">

    <nav aria-label="breadcrumb" class="mb-10 font-mono text-sm">
      <ol class="flex items-center gap-2">
        <li>
          <a href="/" class="text-white/60 transition-colors hover:text-white/70">Home</a>
        </li>
        <li class="text-white/50" aria-hidden="true">/</li>
        <li class="text-white/75" aria-current="page">About</li>
      </ol>
    </nav>

    <div class="grid grid-cols-1 gap-10 lg:grid-cols-[320px_1fr] lg:gap-14">
      <div class="flex flex-col gap-4">
        <div class="relative overflow-hidden rounded-lg border border-white/10 bg-white/4 shadow-sm">
          {#if !imageError}
            <div class="skeleton absolute inset-0 transition-opacity duration-500 {imageLoaded ? 'opacity-0' : 'opacity-100'}"></div>
            <img
              src={profileImage.src}
              srcset={profileImage.srcset}
              alt="Zsolt Farkas"
              width={profileImage.width}
              height={profileImage.height}
              sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, calc(100vw - 3rem)"
              decoding="async"
              fetchpriority="high"
              class="aspect-4/5 h-full w-full object-cover transition-opacity duration-500 {imageLoaded ? 'opacity-100' : 'opacity-0'}"
              onload={markProfileImageLoaded}
              onerror={markProfileImageFailed}
            />
            <div class="pointer-events-none absolute inset-0" style="background: radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.55) 100%)"></div>
          {:else}
            <div class="flex aspect-4/5 items-center justify-center">
              <span class="font-mono text-4xl font-bold text-white/10">ZF</span>
            </div>
          {/if}
        </div>
      </div>

      <div class="text-sm flex flex-col leading-relaxed text-white/75 md:pr-6">
        <div id="about-content" class="space-y-5">
        <p>
          Hi! I&apos;m <span class="text-white">Zsolt Farkas</span>, a 24-year-old <span class="text-white">Computer Science BSc student</span> from <span class="text-white">Szeged, Hungary</span>. 
          I’m passionate about technology and enjoy learning new skills to keep advancing.
        </p>

        <p> 
          I consider <span class="text-white">Lua</span> and <span class="text-white">Python</span> as my main strengths. <button class="text-white underline cursor-pointer" onclick={openTechStack}>See full tech stack</button>
        </p>

        <p>
          Outside of software, I like to spend time studying different topics and taking walks with my dog, <span class="text-white">Luna</span>.
        </p>

        <p>
          I have been a gamer since I was young, and I have a special fondness for <span class="text-white">World of Warcraft</span>, <span class="text-white">Counter-Strike</span> and <span class="text-white">Grand Theft Auto</span>.
        </p>

        <p>
          Currently reading <a href="https://www.oreilly.com/library/view/designing-data-intensive-applications/9781098119058/" target="_blank" rel="noopener noreferrer" class="text-white underline">Designing Data-Intensive Applications</a> by Martin Kleppmann and Chris Riccomini
        </p>

        <p style="font-style: italic">
          Always learning, always tinkering.
        </p>

        </div>

        <!-- social links -->
        <div class="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-sm text-white/75 sm:mt-8 sm:gap-x-0 lg:mt-auto">
          <a href="https://github.com/zsoltfrks" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 transition-colors hover:text-white">
            <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.107-.776.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.604-.015 2.896-.015 3.286 0 .322.216.694.825.576C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/></svg>
            GitHub
          </a>
          <span class="flex items-center gap-2">
            <span class="mx-3 hidden text-white/20 sm:block" aria-hidden="true">|</span>
            <a href="https://linkedin.com/in/zsoltfrks" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 transition-colors hover:text-white">
              <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LinkedIn
            </a>
          </span>
          <span class="flex items-center gap-2">
            <span class="mx-3 hidden text-white/20 sm:block" aria-hidden="true">|</span>
            <a href="https://instagram.com/zsoltfrks" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 transition-colors hover:text-white">
              <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              Instagram
            </a>
          </span>
          <span class="flex items-center gap-2">
            <span class="mx-3 hidden text-white/20 sm:block" aria-hidden="true">|</span>
            <a href="mailto:hello@zsoltfrks.xyz" class="flex items-center gap-2 transition-colors hover:text-white">
              <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              hello@zsoltfrks.xyz
            </a>
          </span>
        </div>
      </div>
    </div>

    <div class="mt-16">
      <h2 class="mb-6 text-xl font-bold">
        <span class="text-white/75">My partner in crime, </span><span class="text-white/90">&nbsp;Luna</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" class="inline-block align-middle text-white/90" aria-hidden="true"><path fill="currentColor" d="M21.24 5.69c-.25-1.01-.56-1.82-.9-2.41C19.72 2.22 19 2 18.51 2c-.96 0-2.83 2.06-3.79 3.53c-1.83-.47-3.58-.47-5.41 0C8.35 4.06 6.48 2 5.52 2c-.49 0-1.21.22-1.83 1.28c-.35.59-.65 1.4-.9 2.41c-.25.98-.43 2.1-.56 3.32c-.19 1.85-.2 4.07-.2 4.5c0 5.4 3.64 8.5 10 8.5s10-3.1 10-8.5c0-.43 0-2.65-.2-4.5c-.13-1.22-.32-2.34-.56-3.32ZM4.97 9.77c.2-3.03.95-4.55.95-4.55l1.61 2.15a7.5 7.5 0 0 0-2.57 2.4ZM7 11c0-.55.45-1 1-1s1 .45 1 1s-.45 1-1 1s-1-.45-1-1m7 7c-.36 0-.7-.1-1-.28V18c0 .55-.45 1-1 1s-1-.45-1-1v-.28c-.3.18-.64.28-1 .28c-.53 0-1.04-.21-1.41-.59l.71-.71c.38.38 1.04.38 1.41 0a1 1 0 0 0 .29-.71c0-.1-.03-.19-.06-.28c-.85-.46-1.44-1.42-1.44-2.39c0-.74 1.12-1.33 2.5-1.33s2.5.6 2.5 1.33c0 .97-.59 1.93-1.44 2.39c-.03.09-.06.18-.06.28c0 .27.1.52.29.71c.38.38 1.04.38 1.41 0l.71.71c-.38.38-.88.59-1.41.59m2-6c-.55 0-1-.45-1-1s.45-1 1-1s1 .45 1 1s-.45 1-1 1m.47-4.62l1.61-2.15s.76 1.52.95 4.55a7.5 7.5 0 0 0-2.57-2.4Z"/></svg>
      </h2>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        {#each lunaPhotos as photo, idx}
          <button
            data-photo-index={idx}
            class="group relative overflow-hidden rounded-lg border border-white/10 bg-white/4 text-left"
            onclick={handleLightboxThumbnailClick}
          >
            {#if !lunaImageError[idx]}
              <div class="skeleton absolute inset-0 transition-opacity duration-500 {lunaImageLoaded[idx] ? 'opacity-0' : 'opacity-100'}"></div>
              <img
                data-photo-index={idx}
                src={photo.preview}
                srcset={photo.previewSrcset}
                alt={`Luna photo ${idx + 1}`}
                width={photo.width}
                height={photo.height}
                loading="lazy"
                decoding="async"
                fetchpriority="low"
                sizes="(min-width: 768px) 31vw, calc(100vw - 3rem)"
                class="aspect-4/3 w-full object-cover transition-all duration-500 group-hover:scale-[1.03] {lunaImageLoaded[idx] ? 'opacity-100' : 'opacity-0'}"
                onload={handleLunaImageLoad}
                onerror={handleLunaImageError}
              />
              <!-- vignette effektus -->
              <div class="pointer-events-none absolute inset-0" style="background: radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.60) 100%)"></div>

              <!-- hover overlay -->
              <div class="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/30">
                <span class="rounded border border-white/20 bg-black/60 px-2.5 py-1 font-mono text-[11px] text-white/75 backdrop-blur-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  expand ↗
                </span>
              </div>
            {:else}
              <div class="flex aspect-4/3 items-center justify-center text-sm text-white/75">
                Luna · Photo {idx + 1}
              </div>
            {/if}
          </button>
        {/each}
      </div>
    </div>
  </div>
</section>

<!-- lightbox -->
{#if lightboxIdx !== null}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md"
    role="button"
    tabindex="-1"
    onclick={closeLightbox}
    onkeydown={handleLightboxEscape}
  >
    <div
      class="relative flex max-h-[92vh] max-w-[92vw] flex-col overflow-hidden rounded-lg border border-white/10 bg-[#0a0a0a] shadow-2xl"
      role="presentation"
      onclick={stopEventPropagation}
    >
      <!-- chrome header -->
      <div class="flex items-center justify-between border-b border-white/6 bg-black/40 px-4 py-2.5">
        <span class="font-mono text-xs text-white/75">Luna · {lightboxIdx + 1} / {lunaPhotos.length}</span>
        <button
          class="font-mono text-xs text-white/75 transition-colors hover:text-white"
          onclick={closeLightbox}
        >[ x ]</button>
      </div>

      <!-- image -->
      <img
        src={lunaPhotos[lightboxIdx].full}
        alt={`Luna photo ${lightboxIdx + 1}`}
        class="block max-h-[80vh] max-w-[92vw] object-contain"
      />

      <!-- prev / next -->
      <button
        class="absolute left-3 top-1/2 -translate-y-1/2 rounded border border-white/10 bg-black/60 px-2.5 py-1.5 font-mono text-xs text-white/50 backdrop-blur-sm transition-colors hover:text-white"
        onclick={showPreviousLightboxImage}
      >←</button>
      <button
        class="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-white/10 bg-black/60 px-2.5 py-1.5 font-mono text-xs text-white/50 backdrop-blur-sm transition-colors hover:text-white"
        onclick={showNextLightboxImage}
      >→</button>
    </div>
  </div>
{/if}

<!-- tech stack modal -->
{#if techStackOpen}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md"
    role="button"
    tabindex="-1"
    onclick={closeTechStack}
    onkeydown={handleTechStackEscape}
  >
    <div
      class="relative flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-lg border border-white/10 bg-[#0a0a0a] shadow-2xl mx-4"
      role="presentation"
      onclick={stopEventPropagation}
    >
      <!-- chrome header -->
      <div class="flex items-center justify-between border-b border-white/6 bg-black/40 px-4 py-2.5">
        <span class="font-mono text-xs text-white/75">TECH STACK</span>
        <button
          class="font-mono text-xs text-white/75 transition-colors hover:text-white"
          onclick={closeTechStack}
        >[ x ]</button>
      </div>

      <!-- content -->
      <div class="overflow-y-auto p-6 space-y-6">
        {#each techStack as group}
          <div>
            <p class="mb-3 font-mono text-[12px] uppercase tracking-widest text-white/75">{group.category}</p>
            <div class="flex flex-wrap gap-2">
              {#each group.items as item}
                <span class="rounded border border-white/10 bg-white/4 px-3 py-1.5 font-mono text-xs text-white/75">
                  {item}
                </span>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
{/if}

<style>
  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position:  200% 0; }
  }
  .skeleton {
    background: linear-gradient(
      90deg,
      rgba(255,255,255,0.03) 0%,
      rgba(255,255,255,0.07) 50%,
      rgba(255,255,255,0.03) 100%
    );
    background-size: 200% 100%;
    animation: shimmer 1.8s ease-in-out infinite;
  }
  
  /* decrease font size on mobile view */
  @media (max-width: 640px) {
    .about-content {
      font-size: 0.175rem; /* 14px */
    }
  }
</style>
