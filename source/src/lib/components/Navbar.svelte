<script>
  let { currentPath = '/' } = $props()
  let menuOpen = $state(false)

  const pageLinks = [
    { label: 'about', href: '/about' },
  ]

  const sectionLinks = [
    { label: 'experience', href: '/#experience' },
    { label: 'projects', href: '/#projects' },
    { label: 'contact', href: '/#contact' },
  ]

  function closeMenu() {
    menuOpen = false
  }
</script>

<header class="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-sm">
  <nav class="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 md:grid md:grid-cols-[1fr_auto_1fr]">

    <!-- logo -->
    <a href="/" class="text-sm text-white/50 transition-colors hover:text-white">
      ~/zsoltfrks.xyz
    </a>

    <!-- desktop links (centered in middle column) -->
    <ul class="hidden md:flex items-center gap-8">
      {#each pageLinks as link}
        <li>
          <a
            href={link.href}
            class="text-sm transition-colors hover:text-white {currentPath === link.href ? 'text-white' : 'text-white/50'}"
          >
            {link.label}
          </a>
        </li>
      {/each}
      <li aria-hidden="true" class="h-3 w-px bg-white/[0.15]"></li>
      {#each sectionLinks as link}
        <li>
          <a
            href={link.href}
            class="text-sm transition-colors hover:text-white {currentPath === link.href ? 'text-white' : 'text-white/50'}"
          >
            {link.label}
          </a>
        </li>
      {/each}
    </ul>

    <!-- right column: social icons (desktop) + burger -->
    <div class="flex items-center justify-end gap-5">
      <a
        href="https://github.com/zsoltfrks"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
        class="text-white/50 transition-colors hover:text-white"
      >
        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.107-.776.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.604-.015 2.896-.015 3.286 0 .322.216.694.825.576C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
        </svg>
      </a>
      <a
        href="https://linkedin.com/in/zsoltfrks"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
        class="text-white/50 transition-colors hover:text-white"
      >
        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      </a>

      <!-- mobile burger -->
      <button
        class="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
        onclick={() => menuOpen = !menuOpen}
        aria-label="Toggle menu"
      >
        <span class="block h-px w-5 bg-white/50 transition-all {menuOpen ? 'rotate-45 translate-y-[7px]' : ''}"></span>
        <span class="block h-px w-5 bg-white/50 transition-all {menuOpen ? 'opacity-0' : ''}"></span>
        <span class="block h-px w-5 bg-white/50 transition-all {menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}"></span>
      </button>
    </div>
  </nav>

  <!-- mobile menu -->
  {#if menuOpen}
    <div class="md:hidden border-t border-white/[0.06] bg-[#0a0a0a]">
      <ul class="flex flex-col px-6 py-5 gap-5">
        {#each pageLinks as link}
          <li>
            <a
              href={link.href}
              onclick={closeMenu}
              class="block text-sm text-white/50 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          </li>
        {/each}
        <li aria-hidden="true" class="border-t border-white/[0.08]"></li>
        {#each sectionLinks as link}
          <li>
            <a
              href={link.href}
              onclick={closeMenu}
              class="block text-sm text-white/50 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          </li>
        {/each}
      </ul>
    </div>
  {/if}
</header>
