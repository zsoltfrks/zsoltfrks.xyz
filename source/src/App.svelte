<script>
  import { onMount } from 'svelte'
  import Navbar from './lib/components/Navbar.svelte'
  import Hero from './lib/components/Hero.svelte'

  const matrixP     = import('./lib/components/MatrixBackground.svelte')
  const projectsP   = import('./lib/components/Projects.svelte')
  const experienceP = import('./lib/components/Experience.svelte')
  const contactP    = import('./lib/components/Contact.svelte')
  const footerP     = import('./lib/components/Footer.svelte')

  let animating = $state(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  let currentPath = $state('/')
  const isAboutPage = $derived(currentPath === '/about')

  onMount(() => {
    currentPath = window.location.pathname

    const handlePopState = () => {
      currentPath = window.location.pathname
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  })
</script>

{#await matrixP then { default: MatrixBackground }}
  <MatrixBackground {animating} />
{/await}

<Navbar {currentPath} />

<main>
  {#if isAboutPage}
    {#await import('./lib/components/About.svelte') then { default: About }}
      <About standalone />
    {/await}
  {:else}
    <Hero bind:animating />
    {#await projectsP then { default: Projects }}
      <Projects />
    {/await}
    {#await experienceP then { default: Experience }}
      <Experience />
    {/await}
    {#await contactP then { default: Contact }}
      <Contact />
    {/await}
  {/if}
</main>
{#await footerP then { default: Footer }}
  <Footer />
{/await}
