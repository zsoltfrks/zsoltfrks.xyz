<script lang="ts">
  import { onMount } from 'svelte'

  type Particle = {
    x: number
    y: number
    char: string
    opacity: number
    speed: number
    timer: number
    interval: number
  }

  let { animating }: { animating: boolean } = $props()

  let canvas: HTMLCanvasElement
  let ctx: CanvasRenderingContext2D | null = null
  let rafId: number | null = null
  let lastTime = 0
  let ro: ResizeObserver | null = null
  let canvasW = 0
  let canvasH = 0

  const CHARS = '0123456789!@#$%^&*()[]{}|<>?/\\~`ABCDEFabcdef'
  const FONT_SIZE = 13
  const CHAR_COUNT = 120

  let particles: Particle[] = []

  function initParticles(w: number, h: number) {
    particles = Array.from({ length: CHAR_COUNT }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      char: CHARS[Math.floor(Math.random() * CHARS.length)],
      opacity: Math.random() * 0.07 + 0.02,
      speed: Math.random() * 0.4 + 0.15,
      timer: Math.floor(Math.random() * 80),
      interval: Math.floor(Math.random() * 80) + 40,
    }))
  }

  function resize(w: number, h: number) {
    canvas.width = w
    canvas.height = h
    canvasW = w
    canvasH = h
    if (!ctx) return
    ctx.font = `${FONT_SIZE}px 'JetBrains Mono', monospace`
    ctx.fillStyle = '#ffffff'
    initParticles(w, h)
  }

  function loop(timestamp: number) {
    // stop the loop when animation is disabled — $effect will restart it
    if (!animating || !ctx) {
      rafId = null
      return
    }

    const delta = lastTime ? Math.min((timestamp - lastTime) / 16.667, 3) : 1
    lastTime = timestamp

    ctx.clearRect(0, 0, canvasW, canvasH)

    for (const p of particles) {
      ctx.globalAlpha = p.opacity
      ctx.fillText(p.char, p.x, p.y)

      p.y += p.speed * delta
      p.timer += delta
      if (p.timer >= p.interval) {
        p.char = CHARS[Math.floor(Math.random() * CHARS.length)]
        p.timer = 0
      }
      if (p.y > canvasH + FONT_SIZE) {
        p.y = -FONT_SIZE
        p.x = Math.random() * canvasW
      }
    }

    ctx.globalAlpha = 1
    rafId = requestAnimationFrame(loop)
  }

  // restart the loop when animating flips back on after being stopped
  $effect(() => {
    if (animating && !rafId && ctx) {
      document.fonts.ready.then(() => {
        if (animating && !rafId) {
          lastTime = 0
          rafId = requestAnimationFrame(loop)
        }
      })
    }
  })

  onMount(() => {
    ctx = canvas.getContext('2d')
    if (!ctx) {
      return
    }
    ctx.font = `${FONT_SIZE}px 'JetBrains Mono', monospace`
    ctx.fillStyle = '#ffffff'

    ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect
      resize(width, height)
    })
    ro.observe(document.documentElement)

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')

    function onMotionChange(e: MediaQueryListEvent) {
      if (e.matches) {
        if (rafId) cancelAnimationFrame(rafId)
        rafId = null
      } else if (animating && !rafId) {
        lastTime = 0
        rafId = requestAnimationFrame(loop)
      }
    }
    mq.addEventListener('change', onMotionChange)

    document.fonts.ready.then(() => {
      if (!mq.matches && animating) {
        rafId = requestAnimationFrame(loop)
      }
    })

    return () => {
      ro?.disconnect()
      mq.removeEventListener('change', onMotionChange)
      if (rafId) cancelAnimationFrame(rafId)
    }
  })
</script>

<canvas
  bind:this={canvas}
  class="pointer-events-none fixed inset-0 -z-10 transition-opacity duration-700 {animating ? 'opacity-100' : 'opacity-0'}"
  aria-hidden="true"
></canvas>

<style>
  @media (prefers-reduced-motion: reduce) {
    canvas { display: none; }
  }
</style>
