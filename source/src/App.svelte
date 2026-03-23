<script>
  import { onMount } from 'svelte'
  import Navbar from './lib/components/Navbar.svelte'
  import Hero from './lib/components/Hero.svelte'

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

{#await import('./lib/components/MatrixBackground.svelte') then { default: MatrixBackground }}
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
    {#await import('./lib/components/Projects.svelte') then { default: Projects }}
      <Projects />
    {/await}
    {#await import('./lib/components/Experience.svelte') then { default: Experience }}
      <Experience />
    {/await}
    {#await import('./lib/components/Contact.svelte') then { default: Contact }}
      <Contact />
    {/await}
  {/if}
</main>
