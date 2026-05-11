<script lang="ts">
  import { onMount } from 'svelte'

  const year = new Date().getFullYear()
  let commit = $state<string | null>(null)
  let views = $state<number | null>(null)

  function scheduleLowPriorityTask(task: () => void, timeout = 1200): () => void {
    const requestIdle = window.requestIdleCallback?.bind(window)
    const cancelIdle = window.cancelIdleCallback?.bind(window)

    if (requestIdle && cancelIdle) {
      const handle = requestIdle(() => task(), { timeout })
      return () => cancelIdle(handle)
    }

    const handle = window.setTimeout(task, timeout)
    return () => window.clearTimeout(handle)
  }

  onMount(() => {
    const cached = localStorage.getItem('last-commit')
    if (cached) commit = cached

    const cancelCommitFetch = scheduleLowPriorityTask(() => {
      void (async () => {
        try {
          const res = await fetch('/api/github?path=' + encodeURIComponent('/repos/zsoltfrks/zsoltfrks.xyz/commits?per_page=1'))
          if (!res.ok) throw new Error()
          const [latest] = await res.json() as Array<{ sha?: string }>
          const hash = latest?.sha?.slice(0, 7) ?? null
          if (hash) {
            commit = hash
            localStorage.setItem('last-commit', hash)
          }
        } catch {
          if (!commit) commit = null
        }
      })()
    })

    const cancelViewsFetch = scheduleLowPriorityTask(() => {
      void (async () => {
        try {
          const res = await fetch('https://abacus.jasoncameron.dev/hit/zsoltfrks.xyz/views')
          if (res.ok) {
            const data = await res.json() as { value?: number }
            views = data.value ?? null
          }
        } catch {}
      })()
    }, 2200)

    return () => {
      cancelCommitFetch()
      cancelViewsFetch()
    }
  })
</script>

<div class="mx-auto mb-6 max-w-5xl px-6">
<footer class="rounded-lg border border-white/10 bg-[#0d0d0d] px-6 py-4 font-mono text-xs text-white/75">
  <div class="flex items-center justify-between gap-4">

    <!-- left: copyright + status (status hidden on mobile) -->
    <div class="flex items-center gap-3">
      <span>Zsolt Farkas © {year}</span>
    </div>

    <!-- right -->
    <div class="flex items-center gap-3">
      <!-- mobile: status dot + views -->
      <span class="relative inline-flex h-1.5 w-1.5 sm:hidden" aria-hidden="true">
        <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/40"></span>
        <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500/70"></span>
      </span>

      <!-- desktop: commit hash -->
      <a
        href="https://github.com/zsoltfrks/zsoltfrks.xyz/commit/{commit}"
        target="_blank"
        rel="noopener noreferrer"
        class="hidden items-center gap-1.5 text-white/60 transition-colors hover:text-white sm:flex"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M9 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0m3-9v6m0 6v6"/>
        </svg>
        {commit ?? '—'}
      </a>
      <span class="hidden text-white/40 sm:block" aria-hidden="true">·</span>

      <!-- views (always shown) -->
      <span>
        <span class="text-white/70">{views ?? '—'}</span>
        <span class="text-white/50"> views</span>
      </span>
    </div>

  </div>
</footer>
</div>
