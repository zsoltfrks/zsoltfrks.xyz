<script module lang="ts">
  export type LightboxPhoto = {
    full: string
    fullSrcset?: string
    sizes?: string
    /** Per-photo header/alt label; falls back to the component's `label` prop */
    label?: string
  }
</script>

<script lang="ts">
  import { fade } from 'svelte/transition'

  let {
    photos,
    label,
    index = $bindable(null),
  }: {
    photos: LightboxPhoto[]
    label: string
    index?: number | null
  } = $props()

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const modalFadeMs = prefersReducedMotion ? 0 : 180
  const imageSwapMs = prefersReducedMotion ? 0 : 120

  function close(): void {
    index = null
  }

  function stopEventPropagation(event: Event): void {
    event.stopPropagation()
  }

  function move(event: MouseEvent, step: number): void {
    event.stopPropagation()

    if (index === null) return

    index = (index + step + photos.length) % photos.length
  }

  function showPrevious(event: MouseEvent): void {
    move(event, -1)
  }

  function showNext(event: MouseEvent): void {
    move(event, 1)
  }

  function handleEscape(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      close()
    }
  }

  function handleWindowKeydown(event: KeyboardEvent): void {
    if (index !== null) {
      handleEscape(event)
    }
  }
</script>

<svelte:window onkeydown={handleWindowKeydown} />

{#if index !== null}
  <div
    transition:fade={{ duration: modalFadeMs }}
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md"
    role="button"
    tabindex="-1"
    onclick={close}
    onkeydown={handleEscape}
  >
    <div
      class="relative flex max-h-[92vh] max-w-[92vw] flex-col overflow-hidden rounded-lg border border-white/10 bg-[#0a0a0a] shadow-2xl"
      role="presentation"
      onclick={stopEventPropagation}
    >
      <!-- chrome header -->
      <div class="flex items-center justify-between border-b border-white/6 bg-black/40 px-4 py-2.5">
        <span class="font-mono text-xs text-white/75">{photos[index].label ?? label} · {index + 1} / {photos.length}</span>
        <button
          class="font-mono text-xs text-white/75 transition-colors hover:text-white"
          onclick={close}
        >[ x ]</button>
      </div>

      <!-- image -->
      {#key index}
        <img
          in:fade={{ duration: imageSwapMs }}
          src={photos[index].full}
          srcset={photos[index].fullSrcset}
          sizes={photos[index].sizes ?? '(max-width: 640px) 92vw, 800px'}
          alt={photos[index].label ?? `${label} photo ${index + 1}`}
          decoding="async"
          class="block max-h-[80vh] max-w-[92vw] object-contain"
        />
      {/key}

      <!-- prev / next -->
      {#if photos.length > 1}
        <button
          class="absolute left-3 top-1/2 -translate-y-1/2 rounded border border-white/10 bg-black/60 px-2.5 py-1.5 font-mono text-xs text-white/50 backdrop-blur-sm transition-colors hover:text-white"
          onclick={showPrevious}
        >←</button>
        <button
          class="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-white/10 bg-black/60 px-2.5 py-1.5 font-mono text-xs text-white/50 backdrop-blur-sm transition-colors hover:text-white"
          onclick={showNext}
        >→</button>
      {/if}
    </div>
  </div>
{/if}
