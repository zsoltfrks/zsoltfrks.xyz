<script>
  import { onMount } from 'svelte'
  import { projects } from '../data/projects.js'

  const GITHUB_USER = 'zsoltfrks'

  let recentCommits = $state([])
  let loading = $state(true)
  let error = $state(false)

  const CACHE_KEY = 'gh-recent-commits'
  const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  const gh = (path) => fetch(`/api/github?path=${encodeURIComponent(path)}`)

  onMount(async () => {
    // Show cached data instantly on repeat visits
    try {
      const raw = localStorage.getItem(CACHE_KEY)
      if (raw) {
        const { ts, data } = JSON.parse(raw)
        recentCommits = data
        loading = false
        if (Date.now() - ts < CACHE_TTL) return // still fresh — skip network
      }
    } catch { /* ignore corrupt cache */ }

    try {
      const searchRes = await gh(`/search/commits?q=author:${GITHUB_USER}+is:public&sort=author-date&order=desc&per_page=7`)
      if (!searchRes.ok) throw new Error()
      const { items } = await searchRes.json()

      const fresh = await Promise.all(
        items.map(async (item) => {
          const repo = item.repository.name
          try {
            const statsRes = await gh(`/repos/${GITHUB_USER}/${repo}/commits/${item.sha}`)
            const statsData = statsRes.ok ? await statsRes.json() : {}
            return {
              sha: item.sha,
              repo,
              message: item.commit.message.split('\n')[0],
              additions: statsData.stats?.additions ?? null,
              deletions: statsData.stats?.deletions ?? null,
            }
          } catch {
            return { sha: item.sha, repo, message: item.commit.message.split('\n')[0], additions: null, deletions: null }
          }
        })
      )

      recentCommits = fresh
      localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: fresh }))
    } catch {
      if (recentCommits.length === 0) error = true
    } finally {
      loading = false
    }
  })
</script>

<section id="projects" class="py-24">
  <div class="mx-auto max-w-5xl px-6">

    <!-- section header -->
    <div class="mb-8 flex items-baseline justify-between">
      <h2 class="text-xl font-bold text-white/80">Featured Projects</h2>
      <a
        href="https://github.com/{GITHUB_USER}"
        target="_blank"
        rel="noopener noreferrer"
        class="font-mono text-xs text-white/50 transition-colors hover:text-white"
      >
        view all ↗
      </a>
    </div>

    <!-- cards grid -->
    <div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each projects as project}
        <svelte:element
          this={project.github ? 'a' : 'article'}
          href={project.github || undefined}
          target={project.github ? '_blank' : undefined}
          rel={project.github ? 'noopener noreferrer' : undefined}
          class="group flex min-h-64 flex-col overflow-hidden rounded-lg border border-white/8 bg-[#0d0d0d] backdrop-blur-md transition-colors hover:border-white/15"
        >

          <!-- window chrome -->
          <div class="flex items-center border-b border-white/6 bg-black/30 px-4 py-3">
            <p class="font-mono text-xs text-white/60">
              {project.github ? '[ open source ]' : '[ closed source ]'}
            </p>
          </div>

          <!-- card body -->
          <div class="flex flex-1 flex-col p-4">
            <div class="mb-3 flex items-start justify-between gap-2">
              <h3 class="font-bold text-white/90">{project.title}</h3>
              {#if project.live}
                <button
                  onclick={(e) => { e.stopPropagation(); e.preventDefault(); window.open(project.live, '_blank', 'noopener,noreferrer') }}
                  aria-label="Visit live site"
                  class="shrink-0 text-white/50 transition-colors hover:text-white"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </button>
              {/if}
            </div>

            <p class="mb-4 flex-1 text-xs leading-relaxed text-white/65">{project.description}</p>

            <div class="flex items-center gap-2">
              <svg class="shrink-0 text-white/80" width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M12.5 8L10.46 10L9.75 12.76L7 12L4.25 12.76L3.54 10L1.5 8L3.54 6L4.25 3.24L7 4L9.75 3.24L10.46 6ZM7 6A2 2 0 1 0 7 10A2 2 0 1 0 7 6ZM20.5 15L18.77 16.6L18.25 18.9L16 18.2L13.75 18.9L13.23 16.6L11.5 15L13.23 13.4L13.75 11.1L16 11.8L18.25 11.1L18.77 13.4ZM16 13.2A1.8 1.8 0 1 0 16 16.8A1.8 1.8 0 1 0 16 13.2Z"/></svg>
              <div class="flex flex-wrap gap-1.5">
                {#each project.tags as tag}
                  <span class="rounded border border-white/8 bg-[#0d0d0d] px-2 py-0.5 font-mono text-[10px] text-white/75">
                    {tag}
                  </span>
                {/each}
              </div>
            </div>
          </div>

        </svelte:element>
      {/each}
    </div>

    <!-- recent commits panel -->
    <div class="overflow-hidden rounded-lg border border-white/8 bg-[#0d0d0d] backdrop-blur-md">

      <!-- panel header -->
      <div class="flex items-center justify-between border-b border-white/6 bg-black/30 px-4 py-3">
        <span class="font-mono text-xs text-white/60">Recent Commits</span>
        <span class="flex items-center gap-1.5 font-mono text-xs text-emerald-500">
          <span class="relative inline-flex h-1.5 w-1.5" aria-hidden="true">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/40"></span>
            <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500/70"></span>
          </span>
          
        </span>
      </div>

      <!-- commit rows -->
      <ul class="pt-2.5 pb-2.5">
        {#if loading}
          {#each { length: 7 } as _}
            <li class="flex items-center justify-between gap-4 px-4 py-3">
              <div class="h-2.5 w-2/3 animate-pulse rounded bg-white/5"></div>
              <div class="h-2.5 w-14 animate-pulse rounded bg-white/5"></div>
            </li>
          {/each}
        {:else if error || recentCommits.length === 0}
          <li class="px-4 py-4 font-mono text-xs text-white/50">
            {error ? '// could not reach github api' : '// no recent commits found'}
          </li>
        {:else}
          {#each recentCommits as commit}
            <li class="flex items-center justify-between gap-4 px-4 py-1.5 transition-colors hover:bg-white/2">
              <a
                href="https://github.com/{GITHUB_USER}/{commit.repo}/commit/{commit.sha}"
                target="_blank"
                rel="noopener noreferrer"
                class="min-w-0 truncate font-mono text-xs text-white/60 transition-colors hover:text-white/80"
              >
                <span class="text-white/90">{commit.repo}</span>
                <span class="text-white/30" aria-hidden="true">: </span>
                <span class="text-white/65">{commit.message}</span>
              </a>
              {#if commit.additions !== null}
                <span class="shrink-0 font-mono text-xs">
                  <span class="text-emerald-500/80">+{commit.additions}</span>
                  <span class="text-white/30" aria-hidden="true"> / </span>
                  <span class="text-red-400/80">-{commit.deletions}</span>
                </span>
              {/if}
            </li>
          {/each}
        {/if}
      </ul>
    </div>

  </div>
</section>
