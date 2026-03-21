<script>
  import { onMount } from 'svelte'
  import 'leaflet/dist/leaflet.css'

  const year = new Date().getFullYear()
  let commit = $state(null)

  onMount(async () => {
    try {
      const res = await fetch('/api/github?path=' + encodeURIComponent('/repos/zsoltfrks/zsoltfrks.xyz/commits?per_page=1'))
      if (!res.ok) throw new Error()
      const [latest] = await res.json()
      commit = latest?.sha?.slice(0, 7) ?? null
    } catch { commit = null }
  })

  const links = [
    { label: 'email',     href: 'mailto:hello@zsoltfrks.xyz',           display: 'hello@zsoltfrks.xyz' },
    { label: 'github',    href: 'https://github.com/zsoltfrks',          display: 'github.com/zsoltfrks' },
    { label: 'linkedin',  href: 'https://linkedin.com/in/zsoltfrks',     display: 'linkedin.com/in/zsoltfrks' },
    { label: 'instagram', href: 'https://instagram.com/zsoltfrks',       display: 'instagram.com/zsoltfrks' },
  ]

  let mapEl = $state(null)
  let localTime = $state('')

  onMount(() => {
    const tick = () => {
      localTime = new Date().toLocaleTimeString('en-GB', {
        timeZone: 'Europe/Budapest',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  })

  onMount(async () => {
    const L = (await import('leaflet')).default
    const map = L.map(mapEl, {
      center: [46.253, 20.1414],
      zoom: 13,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: true,
    })
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map)
  })
</script>

<section id="contact" class="py-24">
  <div class="mx-auto max-w-5xl px-6">

    <div class="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">

      <!-- Left: contact content -->
      <div>
        <h2 class="mb-8 text-4xl font-bold tracking-tight text-white/85">Reach out.</h2>

        <p class="mb-10 text-sm leading-relaxed text-white/55">
          Open to freelance work, collaborations, and ideas.
          Drop me a line and I will reply to you asap. <span class="text-white/85">:)</span>
        </p>

        <ul class="space-y-4 font-mono text-sm">
          {#each links as link}
            <li>
              <a
                href={link.href}
                target={link.label !== 'email' ? '_blank' : undefined}
                rel="noopener noreferrer"
                class="group flex items-baseline gap-3 text-white/35 transition-colors hover:text-white"
              >
                <span class="shrink-0 text-white/20 transition-colors group-hover:text-white/50">→</span>
                <span class="w-20 shrink-0 text-white/30">{link.label}</span>
                <span class="text-white/20">·</span>
                <span class="transition-colors">{link.display}</span>
              </a>
            </li>
          {/each}
        </ul>
      </div>

      <!-- Right: map -->
      <div class="flex flex-col">

        <!-- Map card -->
        <div class="flex flex-1 flex-col overflow-hidden rounded-lg border border-white/8 bg-white/[0.04] backdrop-blur-md">
          <div class="flex items-center justify-between border-b border-white/[0.06] bg-black/30 px-4 py-3">
            <span class="font-mono text-xs text-white/35">Szeged, Hungary</span>
            <span class="font-mono text-[10px] text-white/20">{localTime}</span>
          </div>
          <div bind:this={mapEl} class="min-h-44 flex-1 w-full"></div>
        </div>

      </div>
    </div>

  </div>
</section>

<!-- footer -->
<footer class="mx-auto mb-6 w-full max-w-5xl rounded-lg border border-white/10 bg-[#0a0a0a] px-6 py-4 font-mono text-xs text-white/50">
  <div class="flex items-center justify-between gap-4">

    <!-- left: copyright + status -->
    <div class="flex items-center gap-3">
      <span>© {year} Zsolt Farkas</span>
      <span class="text-white/20">·</span>
      <div class="flex items-center gap-2">
        <span class="relative inline-flex h-1.5 w-1.5">
          <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/40"></span>
          <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500/70"></span>
        </span>
        <span>all systems operational</span>
      </div>
    </div>

    <!-- right: commit hash + view source -->
    <div class="flex items-center gap-4">
      <span class="flex items-center gap-1.5 text-white/35">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="12" cy="12" r="4"/>
          <line x1="2" y1="12" x2="8" y2="12"/>
          <line x1="16" y1="12" x2="22" y2="12"/>
        </svg>
        {commit ?? '—'}
      </span>
      <span class="text-white/20">·</span>
      <a
        href="https://github.com/zsoltfrks/zsoltfrks.xyz"
        target="_blank"
        rel="noopener noreferrer"
        class="transition-colors hover:text-white"
      >
        view src on github
      </a>
    </div>

  </div>
</footer>
