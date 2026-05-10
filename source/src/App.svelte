<script>
  import { onMount, tick } from 'svelte'
  import { fade, fly } from 'svelte/transition'
  import Navbar from './lib/components/Navbar.svelte'

  const matrixP = import('./lib/components/MatrixBackground.svelte')
  const footerP     = import('./lib/components/Footer.svelte')
  let aboutP

  const initialPath = window.location.pathname
  let heroP = $state(initialPath === '/about' ? null : import('./lib/components/Hero.svelte'))
  let projectsP = $state(initialPath === '/about' ? null : import('./lib/components/Projects.svelte'))
  let experienceP = $state(initialPath === '/about' ? null : import('./lib/components/Experience.svelte'))
  let contactP = $state(initialPath === '/about' ? null : import('./lib/components/Contact.svelte'))
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  let animating = $state(!prefersReducedMotion)
  let heroTypingDelayMs = $state(400)
  let currentPath = $state(initialPath)
  let renderedPath = $state(initialPath)
  let routeVisible = $state(true)
  const isAboutPage = $derived(renderedPath === '/about')
  const routeFadeMs = $derived(prefersReducedMotion ? 0 : 460)
  let navigationId = 0

  function preloadAbout() {
    aboutP ??= import('./lib/components/About.svelte')
    return aboutP
  }

  function preloadHome() {
    heroP ??= import('./lib/components/Hero.svelte')
    projectsP ??= import('./lib/components/Projects.svelte')
    experienceP ??= import('./lib/components/Experience.svelte')
    contactP ??= import('./lib/components/Contact.svelte')
  }

  function syncScrollWithLocation(url, { preserveHash = false } = {}) {
    if (preserveHash && url.hash) {
      document.getElementById(url.hash.slice(1))?.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start'
      })
      return
    }

    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }

  function waitForRouteTransition() {
    return new Promise((resolve) => {
      window.setTimeout(resolve, routeFadeMs)
    })
  }

  async function transitionToPath(nextUrl, { pathChanged } = {}) {
    const navId = ++navigationId
    const shouldResetTopAfterEnter = !nextUrl.hash && nextUrl.pathname === '/about'

    if (nextUrl.pathname !== '/about') {
      preloadHome()
    }

    heroTypingDelayMs = pathChanged && nextUrl.pathname === '/' ? 620 : 400

    currentPath = nextUrl.pathname

    if (!pathChanged) {
      await tick()

      if (nextUrl.hash) {
        syncScrollWithLocation(nextUrl, { preserveHash: true })
      } else {
        syncScrollWithLocation(nextUrl)
      }

      return
    }

    routeVisible = false
    await waitForRouteTransition()

    if (navId !== navigationId) return

    renderedPath = nextUrl.pathname
    await tick()

    if (!shouldResetTopAfterEnter) {
      syncScrollWithLocation(nextUrl)
    }

    routeVisible = true
    await tick()

    if (navId !== navigationId) return

    if (shouldResetTopAfterEnter) {
      syncScrollWithLocation(nextUrl)
    }

    if (navId !== navigationId || !nextUrl.hash) return

    await waitForRouteTransition()

    if (navId !== navigationId) return

    syncScrollWithLocation(nextUrl, { preserveHash: true })
  }

  async function navigateTo(href, { replace = false } = {}) {
    const nextUrl = new URL(href, window.location.origin)

    if (nextUrl.origin !== window.location.origin) return

    const currentUrl = new URL(window.location.href)
    const nextLocation = `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`
    const currentLocation = `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`

    if (nextLocation === currentLocation) return

    window.history[replace ? 'replaceState' : 'pushState']({}, '', nextLocation)

    const pathChanged = currentUrl.pathname !== nextUrl.pathname

    await transitionToPath(nextUrl, { pathChanged })
  }

  function handleWindowClick(event) {
    if (event.defaultPrevented || event.button !== 0) return
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

    const link = event.target.closest('a[href]')
    if (!link) return
    if (link.target && link.target !== '_self') return
    if (link.hasAttribute('download')) return

    const nextUrl = new URL(link.href, window.location.href)
    const isInternalRoute = nextUrl.origin === window.location.origin

    if (!isInternalRoute) return

    event.preventDefault()
    navigateTo(nextUrl.href)
  }

  onMount(() => {
    currentPath = window.location.pathname
    renderedPath = window.location.pathname
    const previousScrollRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'

    const handlePopState = async () => {
      const nextUrl = new URL(window.location.href)
      const pathChanged = currentPath !== nextUrl.pathname

      await transitionToPath(nextUrl, { pathChanged })
    }

    window.addEventListener('popstate', handlePopState)
    return () => {
      window.history.scrollRestoration = previousScrollRestoration
      window.removeEventListener('popstate', handlePopState)
    }
  })
</script>

<svelte:window onclick={handleWindowClick} />

{#await matrixP then { default: MatrixBackground }}
  <MatrixBackground {animating} />
{/await}

<Navbar {currentPath} onPreloadAbout={preloadAbout} />

<main>
  {#if routeVisible}
    <div out:fade|global={{ duration: routeFadeMs }}>
      {#if isAboutPage}
        {#await preloadAbout() then { default: About }}
          <About standalone />
        {/await}
      {:else}
        <div in:fly|global={{ y: prefersReducedMotion ? 0 : 8, duration: routeFadeMs, opacity: 0 }}>
          {#await heroP then { default: Hero }}
            <Hero bind:animating typingStartDelayMs={heroTypingDelayMs} />
          {/await}
          {#await projectsP then { default: Projects }}
            <Projects />
          {/await}
          {#await experienceP then { default: Experience }}
            <Experience />
          {/await}
          {#await contactP then { default: Contact }}
            <Contact />
          {/await}
        </div>
      {/if}
    </div>
  {/if}
</main>
{#await footerP then { default: Footer }}
  <Footer />
{/await}
