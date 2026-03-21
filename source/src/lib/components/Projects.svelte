<script>
  import { onMount } from 'svelte'
  import { projects } from '../data/projects.js'

  const GITHUB_USER = 'zsoltfrks'

  let recentCommits = $state([])
  let loading = $state(true)
  let error = $state(false)

  const gh = (path) => fetch(`/api/github?path=${encodeURIComponent(path)}`)

  onMount(async () => {
    try {
      const eventsRes = await gh(`/users/${GITHUB_USER}/events?per_page=50`)
      if (!eventsRes.ok) throw new Error()
      const events = await eventsRes.json()

      const flat = events
        .filter(e => e.type === 'PushEvent' && e.public)
        .flatMap(e =>
          e.payload.commits.map(c => ({
            sha: c.sha,
            repo: e.repo.name.replace(`${GITHUB_USER}/`, ''),
            message: c.message.split('\n')[0],
            date: e.created_at,
          }))
        )
        .slice(0, 7)

      recentCommits = await Promise.all(
        flat.map(async (commit) => {
          try {
            const statsRes = await gh(`/repos/${GITHUB_USER}/${commit.repo}/commits/${commit.sha}`)
            const statsData = statsRes.ok ? await statsRes.json() : {}
            return {
              ...commit,
              additions: statsData.stats?.additions ?? null,
              deletions: statsData.stats?.deletions ?? null,
            }
          } catch {
            return { ...commit, additions: null, deletions: null }
          }
        })
      )
    } catch {
      error = true
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
        class="font-mono text-xs text-white/25 transition-colors hover:text-white"
      >
        view all ↗
      </a>
    </div>

    <!-- cards grid -->
    <div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each projects as project}
        <article class="group flex min-h-64 flex-col overflow-hidden rounded-lg border border-white/8 bg-white/[0.04] backdrop-blur-md transition-colors hover:border-white/15">

          <!-- window chrome -->
          <div class="flex items-center justify-between border-b border-white/[0.06] bg-black/30 px-4 py-3">
            <p class="font-mono text-xs {project.github ? 'text-white/35' : 'text-white/20'}">
              {project.github ? '[ open source ]' : '[ closed source ]'}
            </p>
            {#if project.github}
              <a href={project.github} target="_blank" rel="noopener noreferrer" class="text-white/25 transition-colors hover:text-white" title="GitHub">
                <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.107-.776.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.604-.015 2.896-.015 3.286 0 .322.216.694.825.576C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/></svg>
              </a>
            {/if}
          </div>

          <!-- card body -->
          <div class="flex flex-1 flex-col p-4">
            <div class="mb-3 flex items-start justify-between gap-2">
              <h3 class="font-bold text-white/85">{project.title}</h3>
              {#if project.live}
                <a href={project.live} target="_blank" rel="noopener noreferrer" class="shrink-0 text-white/25 transition-colors hover:text-white" title="Live site">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </a>
              {/if}
            </div>

            <p class="mb-4 flex-1 text-xs leading-relaxed text-white/40">{project.description}</p>

            <div class="flex items-center gap-2">
              <svg class="shrink-0 text-white/50" width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path fill-rule="evenodd" d="M12.5 8L10.46 10L9.75 12.76L7 12L4.25 12.76L3.54 10L1.5 8L3.54 6L4.25 3.24L7 4L9.75 3.24L10.46 6ZM7 6A2 2 0 1 0 7 10A2 2 0 1 0 7 6ZM20.5 15L18.77 16.6L18.25 18.9L16 18.2L13.75 18.9L13.23 16.6L11.5 15L13.23 13.4L13.75 11.1L16 11.8L18.25 11.1L18.77 13.4ZM16 13.2A1.8 1.8 0 1 0 16 16.8A1.8 1.8 0 1 0 16 13.2Z"/></svg>
              <div class="flex flex-wrap gap-1.5">
                {#each project.tags as tag}
                  <span class="rounded border border-white/8 bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-white/35">
                    {tag}
                  </span>
                {/each}
              </div>
            </div>
          </div>

        </article>
      {/each}
    </div>

    <!-- recent commits panel -->
    <div class="overflow-hidden rounded-lg border border-white/8 bg-white/[0.04] backdrop-blur-md">

      <!-- panel header -->
      <div class="flex items-center justify-between border-b border-white/[0.06] bg-black/30 px-4 py-3">
        <span class="font-mono text-xs text-white/50">Recent Commits</span>
        <span class="flex items-center gap-1.5 font-mono text-xs text-emerald-500/70">
          <span class="relative inline-flex h-1.5 w-1.5">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/40"></span>
            <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500/70"></span>
          </span>
          live
        </span>
      </div>

      <!-- commit rows -->
      <ul class="pt-2.5">
        {#if loading}
          {#each { length: 7 } as _}
            <li class="flex items-center justify-between gap-4 px-4 py-3">
              <div class="h-2.5 w-2/3 animate-pulse rounded bg-white/[0.05]"></div>
              <div class="h-2.5 w-14 animate-pulse rounded bg-white/[0.05]"></div>
            </li>
          {/each}
        {:else if error || recentCommits.length === 0}
          <li class="px-4 py-4 font-mono text-xs text-white/20">
            {error ? '// could not reach github api' : '// no recent commits found'}
          </li>
        {:else}
          {#each recentCommits as commit}
            <li class="flex items-center justify-between gap-4 px-4 py-1.5 transition-colors hover:bg-white/[0.02]">
              <a
                href="https://github.com/{GITHUB_USER}/{commit.repo}/commit/{commit.sha}"
                target="_blank"
                rel="noopener noreferrer"
                class="min-w-0 truncate font-mono text-xs text-white/40 transition-colors hover:text-white/70"
              >
                <span class="text-white/55">{commit.repo}</span>
                <span class="text-white/20">: </span>
                {commit.message}
              </a>
              {#if commit.additions !== null}
                <span class="shrink-0 font-mono text-xs">
                  <span class="text-[#66BB6A]">+{commit.additions}</span>
                  <span class="text-white/15"> / </span>
                  <span class="text-[#EF5350]">-{commit.deletions}</span>
                </span>
              {/if}
            </li>
          {/each}
        {/if}
      </ul>

      <!-- panel footer -->
      <div class="flex justify-start px-4 py-2.5">
        <a
          href="https://github.com/{GITHUB_USER}"
          target="_blank"
          rel="noopener noreferrer"
          class="font-mono text-xs text-white/20 transition-colors hover:text-white/60"
        >
          View on GitHub ↗
        </a>
      </div>

    </div>

  </div>
</section>
