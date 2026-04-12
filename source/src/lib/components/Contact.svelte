<script>
  import { onMount } from 'svelte'

  const links = [
    {
      label: 'email',
      href: 'mailto:hello@zsoltfrks.xyz',
      display: 'hello@zsoltfrks.xyz',
      icon: '<path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"/><path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"/>',
    },
    {
      label: 'github',
      href: 'https://github.com/zsoltfrks',
      display: 'github.com/zsoltfrks',
      icon: '<path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.107-.776.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.604-.015 2.896-.015 3.286 0 .322.216.694.825.576C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>',
    },
    {
      label: 'linkedin',
      href: 'https://linkedin.com/in/zsoltfrks',
      display: '/in/zsoltfrks',
      icon: '<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>',
    },
    {
      label: 'instagram',
      href: 'https://instagram.com/zsoltfrks',
      display: 'zsoltfrks',
      icon: '<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>',
    },
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
          Drop me a line and I will reply to you asap. <span class="text-white/95">:)</span>
        </p>

        <ul class="grid grid-cols-1 gap-2 font-mono sm:grid-cols-2 sm:gap-3">
          {#each links as link}
            <li class="flex">
              <a
                href={link.href}
                target={link.label !== 'email' ? '_blank' : undefined}
                rel="noopener noreferrer"
                class="group flex h-full w-full items-center gap-3 py-2.5 transition-colors"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" class="shrink-0 text-white/55 transition-colors group-hover:text-white/90" aria-hidden="true">
                  {@html link.icon}
                </svg>
                <span class="text-sm">
                  <span class="text-white/55 transition-colors group-hover:text-white/90">{link.display}</span>
                </span>
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
