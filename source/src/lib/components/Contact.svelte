<script lang="ts">
  import { onMount } from 'svelte'
  import { reveal } from '../actions/reveal'

  type ContactLink = {
    label: string
    href: string
    display: string
    icon: string
  }

  const links: ContactLink[] = [
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
      label: 'discord',
      href: 'https://discord.com/users/127052399566258176',
      display: 'zsoltfrks',
      icon: '<path d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.1.1 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.1 16.1 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02M8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12m6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12\"/>',
    },
  ]

  let localTime = $state('')
  let mapEl = $state<HTMLDivElement | null>(null)
  let mapContainerEl = $state<HTMLDivElement | null>(null)
  let mapReady = $state(false)

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

  onMount(() => {
    let cleanup = () => {}
    const target = mapContainerEl
    if (!target) return

    let cancelled = false
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return

      observer.disconnect()

      void (async () => {
        const mapTarget = mapEl
        if (!mapTarget || cancelled) return

        const [{ default: L }] = await Promise.all([
          import('leaflet'),
          import('leaflet/dist/leaflet.css'),
        ])

        if (cancelled) return

        delete (L.Icon.Default.prototype as { _getIconUrl?: string })._getIconUrl
        L.Icon.Default.mergeOptions({
          iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
          iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
          shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
        })

        const map = L.map(mapTarget, { zoomControl: false, attributionControl: false })
          .setView([46.253, 20.1414], 13)

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          subdomains: 'abcd',
          maxZoom: 12,
        }).addTo(map)

        mapReady = true
        cleanup = () => map.remove()
      })()
    }, { rootMargin: '240px 0px' })

    observer.observe(target)

    return () => {
      cancelled = true
      observer.disconnect()
      cleanup()
    }
  })
</script>

<section id="contact" class="py-24">
  <div class="mx-auto max-w-5xl px-6">

    <div class="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">

      <!-- Left: contact content -->
      <div use:reveal class="reveal-on-scroll flex flex-col" style="--reveal-delay: 60ms">
        <h2 class="mb-8 text-4xl font-bold tracking-tight text-white/80">Contact</h2>

        <p class="mb-10 text-sm leading-relaxed text-white/75">
          Open to freelance or full-time work, collaborations, and ideas. <br><br>
          Drop me a line and I will reply to you asap. <span class="text-white/95">:)</span>
        </p>

        <ul class="grid grid-cols-1 gap-2 font-mono sm:grid-cols-2 sm:gap-3">
          {#each links as link, index}
            <li class="flex">
              <a
                href={link.href}
                target={link.label !== 'email' ? '_blank' : undefined}
                rel="noopener noreferrer"
                class="contact-link group flex h-full w-full items-center gap-3 py-2.5 transition-colors"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" class="shrink-0 text-white/55 transition-colors group-hover:text-white/90" aria-hidden="true">
                  {@html link.icon}
                </svg>
                <span class="text-sm">
                  <span class="text-white/75 transition-colors group-hover:text-white">{link.display}</span>
                </span>
              </a>
            </li>
          {/each}
        </ul>
      </div>

      <!-- Right: location card -->
      <div use:reveal bind:this={mapContainerEl} class="reveal-on-scroll flex flex-col" style="--reveal-delay: 120ms">
        <div class="location-card flex flex-1 flex-col overflow-hidden rounded-lg border border-white/8 bg-white/4 backdrop-blur-md">

          <!-- chrome header -->
          <div class="flex items-center justify-between border-b border-white/6 bg-black/30 px-4 py-3">
            <span class="font-mono text-xs text-white/75">Szeged, Hungary</span>
            <span class="font-mono text-xs text-white/75">{localTime}</span>
          </div>

          <!-- map -->
          <div class="relative min-h-44 flex-1 w-full">
            <div bind:this={mapEl} class="absolute inset-0"></div>
            {#if !mapReady}
              <div class="absolute inset-0 flex items-center justify-center bg-[#0d0d0d]/35 font-mono text-xs text-white/45">
                Map loads on approach
              </div>
            {/if}
          </div>

        </div>
      </div>
    </div>

  </div>
</section>

<style>
  .contact-link {
    transition: color 0.22s ease;
  }

  .location-card {
    transition: none;
  }

  @media (prefers-reduced-motion: reduce) {
    .contact-link,
    .location-card {
      transition: none;
      opacity: 1;
    }
  }
</style>
