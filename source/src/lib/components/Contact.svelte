<script>
  import { onMount } from 'svelte'
  import Footer from './Footer.svelte'

  const links = [
    { label: 'email',     href: 'mailto:hello@zsoltfrks.xyz',           display: 'hello@zsoltfrks.xyz' },
    { label: 'github',    href: 'https://github.com/zsoltfrks',          display: 'github.com/zsoltfrks' },
    { label: 'linkedin',  href: 'https://linkedin.com/in/zsoltfrks',     display: 'linkedin.com/in/zsoltfrks' },
    { label: 'instagram', href: 'https://instagram.com/zsoltfrks',       display: 'instagram.com/zsoltfrks' },
  ]

  let localTime = $state('')
  let mapEl = $state(null)

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
    const [{ default: L }] = await Promise.all([
      import('leaflet'),
      import('leaflet/dist/leaflet.css'),
    ])

    // Fix Leaflet default icon paths broken by Vite bundling
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
      iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
      shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
    })

    const map = L.map(mapEl, { zoomControl: false, attributionControl: false })
      .setView([46.253, 20.1414], 13)

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 12,
    }).addTo(map)

    return () => map.remove()
  })
</script>

<section id="contact" class="py-24">
  <div class="mx-auto max-w-5xl px-6">

    <div class="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">

      <!-- Left: contact content -->
      <div>
        <h2 class="mb-8 text-4xl font-bold tracking-tight text-white/85">Contact</h2>

        <p class="mb-10 text-sm leading-relaxed text-white/65">
          Open to freelance or full-time work, collaborations, and ideas.
          Drop me a line and I will reply to you asap. <span class="text-white/85">:)</span>
        </p>

        <ul class="space-y-4 font-mono text-sm">
          {#each links as link}
            <li>
              <a
                href={link.href}
                target={link.label !== 'email' ? '_blank' : undefined}
                rel="noopener noreferrer"
                class="group flex items-baseline gap-3 text-white/50 transition-colors hover:text-white"
              >
                <span class="shrink-0 text-white/20 transition-colors group-hover:text-white/53" aria-hidden="true">→</span>
                <span class="w-20 shrink-0 text-white/50">{link.label}</span>
                <span class="text-white/40" aria-hidden="true">·</span>
                <span class="transition-colors">{link.display}</span>
              </a>
            </li>
          {/each}
        </ul>
      </div>

      <!-- Right: location card -->
      <div class="flex flex-col">
        <div class="flex flex-1 flex-col overflow-hidden rounded-lg border border-white/8 bg-white/4 backdrop-blur-md">

          <!-- chrome header -->
          <div class="flex items-center justify-between border-b border-white/6 bg-black/30 px-4 py-3">
            <span class="font-mono text-xs text-white/65">Szeged, Hungary</span>
            <span class="font-mono text-xs text-white/65">{localTime}</span>
          </div>

          <!-- map -->
          <div bind:this={mapEl} class="min-h-44 flex-1 w-full"></div>

        </div>
      </div>
    </div>

  </div>
</section>

<Footer />
