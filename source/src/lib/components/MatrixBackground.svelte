<script>
  import { onMount } from 'svelte'

  let { animating } = $props()

  let canvas

  const CHARS = '0123456789!@#$%^&*()[]{}|<>?/\\~`ABCDEFabcdef'
  const FONT_SIZE = 13
  const CHAR_COUNT = 120

  /** @type {{ x: number, y: number, char: string, opacity: number, speed: number, timer: number, interval: number }[]} */
  let particles = []

  function initParticles(w, h) {
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

  function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    initParticles(canvas.width, canvas.height)
  }

  let rafId
  let lastTime = 0
  let ctx

  function loop(timestamp) {
    // claude: normalize to 60 fps equivalent; cap at 3× to absorb tab-backgrounding stalls
    const delta = lastTime ? Math.min((timestamp - lastTime) / 16.667, 3) : 1
    lastTime = timestamp

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.font = `${FONT_SIZE}px 'JetBrains Mono', monospace`

    for (const p of particles) {
      ctx.globalAlpha = p.opacity
      ctx.fillStyle = '#ffffff'
      ctx.fillText(p.char, p.x, p.y)

      if (animating) {
        p.y += p.speed * delta
        p.timer += delta
        if (p.timer >= p.interval) {
          p.char = CHARS[Math.floor(Math.random() * CHARS.length)]
          p.timer = 0
        }
        if (p.y > canvas.height + FONT_SIZE) {
          p.y = -FONT_SIZE
          p.x = Math.random() * canvas.width
        }
      }
    }

    ctx.globalAlpha = 1
    rafId = requestAnimationFrame(loop)
  }

  onMount(() => {
    ctx = canvas.getContext('2d')
    resize()
    window.addEventListener('resize', resize)

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')

    if (!mq.matches) {
      rafId = requestAnimationFrame(loop)
    }

    function onMotionChange(e) {
      if (e.matches) {
        cancelAnimationFrame(rafId)
      } else {
        lastTime = 0
        rafId = requestAnimationFrame(loop)
      }
    }

    mq.addEventListener('change', onMotionChange)

    return () => {
      window.removeEventListener('resize', resize)
      mq.removeEventListener('change', onMotionChange)
      cancelAnimationFrame(rafId)
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
