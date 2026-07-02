<script lang="ts">
  import { onMount, tick } from 'svelte'
  import { fade, fly } from 'svelte/transition'
  import Navbar from './lib/components/Navbar.svelte'
  import Hero from './lib/components/Hero.svelte'

  const ABOUT_PATH = '/about'
  const HOME_PATH = '/'
  const DEFAULT_HERO_TYPING_DELAY_MS = 400
  const HOME_NAVIGATION_TYPING_DELAY_MS = 620

  type ScrollSyncOptions = {
    preserveHash?: boolean
  }

  type RouteTransitionOptions = {
    pathChanged?: boolean
  }

  type NavigateOptions = {
    replace?: boolean
  }

  const loadMatrixBackground = () => import('./lib/components/MatrixBackground.svelte')
  const loadFooter = () => import('./lib/components/Footer.svelte')
  const loadAbout = () => import('./lib/components/About.svelte')
  const loadProjects = () => import('./lib/components/Projects.svelte')
  const loadExperience = () => import('./lib/components/Experience.svelte')
  const loadStudies = () => import('./lib/components/Studies.svelte')
  const loadContact = () => import('./lib/components/Contact.svelte')

  const matrixP = loadMatrixBackground()
  const footerP = loadFooter()
  const initialPath = window.location.pathname
  const startsOnAboutPage = initialPath === ABOUT_PATH
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  let aboutP: ReturnType<typeof loadAbout> | undefined
  let projectsP = $state(startsOnAboutPage ? null : loadProjects())
  let experienceP = $state(startsOnAboutPage ? null : loadExperience())
  let studiesP = $state(startsOnAboutPage ? null : loadStudies())
  let contactP = $state(startsOnAboutPage ? null : loadContact())
  let animating = $state(!prefersReducedMotion)
  let heroTypingDelayMs = $state(DEFAULT_HERO_TYPING_DELAY_MS)
  let currentPath = $state(initialPath)
  let renderedPath = $state(initialPath)
  let routeVisible = $state(true)
  const isAboutPage = $derived(renderedPath === ABOUT_PATH)
  const routeFadeMs = $derived(prefersReducedMotion ? 0 : 460)
  let navigationId = 0

  function isAboutPath(pathname: string): boolean {
    return pathname === ABOUT_PATH
  }

  function isHomePath(pathname: string): boolean {
    return pathname === HOME_PATH
  }

  function isInternalUrl(url: URL): boolean {
    return url.origin === window.location.origin
  }

  function getCurrentUrl(): URL {
    return new URL(window.location.href)
  }

  function getLocationKey(url: URL): string {
    return `${url.pathname}${url.search}${url.hash}`
  }

  function shouldResetTopAfterEnter(url: URL): boolean {
    return !url.hash && isAboutPath(url.pathname)
  }

  function shouldDelayHeroTyping(pathChanged: boolean, pathname: string): boolean {
    return pathChanged && isHomePath(pathname)
  }

  function isActiveNavigation(navigationToken: number): boolean {
    return navigationToken === navigationId
  }

  function resetScrollPosition() {
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }

  function scrollToHash(hash: string) {
    document.getElementById(hash.slice(1))?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start'
    })
  }

  function wait(durationMs: number): Promise<void> {
    return new Promise((resolve) => {
      window.setTimeout(resolve, durationMs)
    })
  }

  function preloadAbout() {
    aboutP ??= loadAbout()
    return aboutP
  }

  function preloadHome() {
    projectsP ??= loadProjects()
    experienceP ??= loadExperience()
    studiesP ??= loadStudies()
    contactP ??= loadContact()
  }

  function preloadComponentsForPath(pathname: string) {
    if (!isAboutPath(pathname)) {
      preloadHome()
    }
  }

  function updateHeroTypingDelay(pathChanged: boolean, pathname: string) {
    heroTypingDelayMs = shouldDelayHeroTyping(pathChanged, pathname)
      ? HOME_NAVIGATION_TYPING_DELAY_MS
      : DEFAULT_HERO_TYPING_DELAY_MS
  }

  function syncScrollWithLocation(url: URL, { preserveHash = false }: ScrollSyncOptions = {}) {
    if (preserveHash && url.hash) {
      scrollToHash(url.hash)
      return
    }

    resetScrollPosition()
  }

  function waitForRouteTransition(): Promise<void> {
    return wait(routeFadeMs)
  }

  async function transitionToPath(nextUrl: URL, { pathChanged = false }: RouteTransitionOptions = {}) {
    const navigationToken = ++navigationId
    const resetTopAfterEnter = shouldResetTopAfterEnter(nextUrl)

    preloadComponentsForPath(nextUrl.pathname)
    updateHeroTypingDelay(pathChanged, nextUrl.pathname)

    currentPath = nextUrl.pathname

    if (!pathChanged) {
      await tick()

      syncScrollWithLocation(nextUrl, { preserveHash: Boolean(nextUrl.hash) })

      return
    }

    routeVisible = false
    await waitForRouteTransition()

    if (!isActiveNavigation(navigationToken)) return

    renderedPath = nextUrl.pathname
    await tick()

    if (!resetTopAfterEnter) {
      syncScrollWithLocation(nextUrl)
    }

    routeVisible = true
    await tick()

    if (!isActiveNavigation(navigationToken)) return

    if (resetTopAfterEnter) {
      syncScrollWithLocation(nextUrl)
    }

    if (!isActiveNavigation(navigationToken) || !nextUrl.hash) return

    await waitForRouteTransition()

    if (!isActiveNavigation(navigationToken)) return

    syncScrollWithLocation(nextUrl, { preserveHash: true })
  }

  async function navigateTo(href: string, { replace = false }: NavigateOptions = {}) {
    const nextUrl = new URL(href, window.location.origin)

    if (!isInternalUrl(nextUrl)) return

    const currentUrl = getCurrentUrl()
    const nextLocation = getLocationKey(nextUrl)
    const currentLocation = getLocationKey(currentUrl)

    if (nextLocation === currentLocation) return

    const historyMethod = replace ? 'replaceState' : 'pushState'
    window.history[historyMethod]({}, '', nextLocation)

    const pathChanged = currentUrl.pathname !== nextUrl.pathname

    await transitionToPath(nextUrl, { pathChanged })
  }

  function resolveNavigationLink(event: MouseEvent): HTMLAnchorElement | null {
    if (event.defaultPrevented || event.button !== 0) return null
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null

    const target = event.target
    if (!(target instanceof Element)) return null

    const link = target.closest('a[href]')
    if (!(link instanceof HTMLAnchorElement)) return null
    if (link.target && link.target !== '_self') return null
    if (link.hasAttribute('download')) return null

    return link
  }

  function handleWindowClick(event: MouseEvent) {
    const link = resolveNavigationLink(event)
    if (!link) return

    const nextUrl = new URL(link.href, window.location.href)

    if (!isInternalUrl(nextUrl)) return

    event.preventDefault()
    void navigateTo(nextUrl.href)
  }

  onMount(() => {
    currentPath = window.location.pathname
    renderedPath = window.location.pathname
    const previousScrollRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'

    const handlePopState = async (): Promise<void> => {
      const nextUrl = getCurrentUrl()
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

<main class="min-h-screen">
  {#if routeVisible}
    <div out:fade|global={{ duration: routeFadeMs }}>
      {#if isAboutPage}
        {#await preloadAbout() then { default: About }}
          <About standalone />
        {/await}
      {:else}
        <div in:fly|global={{ y: prefersReducedMotion ? 0 : 8, duration: routeFadeMs, opacity: 0 }}>
          <Hero bind:animating typingStartDelayMs={heroTypingDelayMs} />
          {#if projectsP}
            {#await projectsP then { default: Projects }}
              <Projects />
            {/await}
          {/if}
          {#if experienceP}
            {#await experienceP then { default: Experience }}
              <Experience />
            {/await}
          {/if}
          {#if studiesP}
            {#await studiesP then { default: Studies }}
              <Studies />
            {/await}
          {/if}
          {#if contactP}
            {#await contactP then { default: Contact }}
              <Contact />
            {/await}
          {/if}
        </div>
      {/if}
    </div>
  {/if}
</main>
{#await footerP then { default: Footer }}
  <Footer />
{/await}
