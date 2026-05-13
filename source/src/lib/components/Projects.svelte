<script lang="ts">
  import { onMount } from 'svelte'
  import { projects } from '../data/projects'
  import { reveal } from '../actions/reveal'

  type RecentCommit = {
    sha: string
    repo: string
    message: string
    additions: number | null
    deletions: number | null
  }

  type SearchCommitItem = {
    sha: string
    commit: { message: string }
    repository: { name: string }
  }

  type SearchCommitResponse = {
    items: SearchCommitItem[]
  }

  type CommitStatsResponse = {
    stats?: {
      additions?: number
      deletions?: number
    }
  }

  type CachedCommits = {
    ts: number
    data: RecentCommit[]
  }

  const GITHUB_USER = 'zsoltfrks'

  let recentCommits = $state<RecentCommit[]>([])
  let loading = $state(true)
  let error = $state(false)
  let commitsPanelEl = $state<HTMLDivElement | null>(null)
  let commitsRequested = false

  const CACHE_KEY = 'gh-recent-commits'
  const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  const gh = (path: string) => fetch(`/api/github?path=${encodeURIComponent(path)}`)

  function openLiveProject(event: MouseEvent, url: string | undefined): void {
    if (!url) return

    event.stopPropagation()
    event.preventDefault()
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  function handleLiveProjectClick(event: MouseEvent): void {
    const button = event.currentTarget

    if (!(button instanceof HTMLButtonElement)) return

    openLiveProject(event, button.dataset.liveUrl)
  }

  function scheduleLowPriorityTask(task: () => void, timeout = 800): () => void {
    const requestIdle = window.requestIdleCallback?.bind(window)
    const cancelIdle = window.cancelIdleCallback?.bind(window)

    if (requestIdle && cancelIdle) {
      const handle = requestIdle(() => task(), { timeout })
      return () => cancelIdle(handle)
    }

    const handle = window.setTimeout(task, timeout)
    return () => window.clearTimeout(handle)
  }

  async function loadRecentCommits(): Promise<void> {
    if (commitsRequested) return
    commitsRequested = true

    // Show cached data instantly on repeat visits once the panel is relevant
    try {
      const raw = localStorage.getItem(CACHE_KEY)
      if (raw) {
        const { ts, data } = JSON.parse(raw) as CachedCommits
        recentCommits = data
        loading = false
        if (Date.now() - ts < CACHE_TTL) return
      }
    } catch {}

    try {
      const searchRes = await gh(`/search/commits?q=author:${GITHUB_USER}+is:public&sort=author-date&order=desc&per_page=7`)
      if (!searchRes.ok) throw new Error()
      const { items } = await searchRes.json() as SearchCommitResponse

      const fresh = await Promise.all(
        items.map(async (item): Promise<RecentCommit> => {
          const repo = item.repository.name
          try {
            const statsRes = await gh(`/repos/${GITHUB_USER}/${repo}/commits/${item.sha}`)
            const statsData = statsRes.ok ? await statsRes.json() as CommitStatsResponse : {}
            return {
              sha: item.sha,
              repo,
              message: item.commit.message.split('\n')[0],
              additions: statsData.stats?.additions ?? null,
              deletions: statsData.stats?.deletions ?? null,
            }
          } catch {
            return {
              sha: item.sha,
              repo,
              message: item.commit.message.split('\n')[0],
              additions: null,
              deletions: null,
            }
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
  }

  onMount(() => {
    const panel = commitsPanelEl
    if (!panel) return

    let cancelScheduledLoad = () => {}
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return

      observer.disconnect()
      cancelScheduledLoad = scheduleLowPriorityTask(() => {
        void loadRecentCommits()
      })
    }, { rootMargin: '240px 0px' })

    observer.observe(panel)

    return () => {
      observer.disconnect()
      cancelScheduledLoad()
    }
  })
</script>

<section id="projects" class="py-24">
  <div class="mx-auto max-w-5xl px-6">

    <!-- section header -->
    <div class="mb-10 flex items-baseline justify-between">
      <h2 use:reveal style="--reveal-delay: 85ms" class="reveal-on-scroll text-xl font-bold text-white/80">Projects</h2>
    </div>

    <!-- cards grid -->
    <div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each projects as project, index}
        <svelte:element
          this={project.github ? 'a' : 'article'}
          href={project.github || undefined}
          target={project.github ? '_blank' : undefined}
          rel={project.github ? 'noopener noreferrer' : undefined}
          use:reveal
          style={`--reveal-delay: ${index * 85}ms`}
          class="project-card reveal-on-scroll group flex min-h-64 flex-col overflow-hidden rounded-lg border border-white/10 bg-[#0d0d0d]"
        >

          <!-- window chrome -->
          <div class="flex items-center border-b border-white/10 bg-[#0d0d0d] px-4 py-3">
            <p class="font-mono text-xs text-white/75">
              {project.github ? '[ open source ]' : '[ closed source ]'}
            </p>
          </div>

          <!-- card body -->
          <div use:reveal style={`--reveal-delay: ${index * 85}ms`} class="reveal-on-scroll project-card__body flex flex-1 flex-col bg-[#111111] p-4 gap-4">
            <div class="mb-3 flex items-start justify-between gap-2">
              <h3 class="project-card__title font-bold text-white/90">{project.title}</h3>
              {#if project.live}
                <button
                  data-live-url={project.live}
                  onclick={handleLiveProjectClick}
                  aria-label="Visit live site"
                  class="project-card__icon shrink-0 text-white/70 transition-colors hover:text-white"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </button>
              {/if}
            </div>

            <p class="flex-1 text-xs leading-relaxed text-white/75">{project.description}</p>

            <div class="flex flex-col gap-2 mt-3">
              <div class="flex flex-wrap gap-1.5">
                {#each project.tags as tag}
                  <span class="rounded border border-white/8 bg-[#111111] px-2 py-0.5 font-mono text-xs text-white/80">
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
    <div use:reveal style="--reveal-delay: 85ms" bind:this={commitsPanelEl} class="reveal-on-scroll overflow-hidden rounded-lg border border-white/10 bg-[#0d0d0d]">

      <!-- panel header -->
      <div class="flex items-center justify-between border-b border-white/10 bg-[#0d0d0d] px-4 py-3">
        <span class="font-mono text-xs text-white/75">Recent Commits</span>
        <span class="flex items-center gap-1.5 font-mono text-xs text-emerald-500">
          <span class="relative inline-flex h-1.5 w-1.5" aria-hidden="true">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/40"></span>
            <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500/70"></span>
          </span>
          
        </span>
      </div>

      <!-- commit rows -->
      <ul class="bg-[#111111] pt-2.5 pb-2.5">
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

<style>
  .project-card {
    transition: border-color 0.26s ease;
  }

  .project-card:hover {
    border-color: rgba(255, 255, 255, 0.16);
  }

  @media (prefers-reduced-motion: reduce) {
    .project-card {
      transition: none;
    }
  }
</style>
