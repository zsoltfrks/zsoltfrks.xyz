<script>
  import { onMount } from 'svelte'
  import Navbar from './lib/components/Navbar.svelte'
  import Hero from './lib/components/Hero.svelte'
  import About from './lib/components/About.svelte'
  import Projects from './lib/components/Projects.svelte'
  import Experience from './lib/components/Experience.svelte'
  import Contact from './lib/components/Contact.svelte'
  import MatrixBackground from './lib/components/MatrixBackground.svelte'

  let animating = $state(true)
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

<MatrixBackground {animating} />

<Navbar {currentPath} />

<main>
  {#if isAboutPage}
    <About standalone />
  {:else}
    <Hero bind:animating />
    <Projects />
    <Experience />
    <Contact />
  {/if}
</main>
