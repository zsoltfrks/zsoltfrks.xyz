<script lang="ts">
  import type { ExperienceItem } from '../data/experience'

  let {
    job,
    openPopover,
    onopen,
    onclose,
  }: {
    job: ExperienceItem
    openPopover: string | null
    onopen: (key: string) => void
    onclose: () => void
  } = $props()

  function openCompanyPopover(): void {
    onopen(job.company)
  }
</script>

<div class="mb-4 flex flex-col gap-0.5 text-sm text-white/50 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
  {#if job.about}
    <div class="relative">
      <button
        class="cursor-pointer text-white/65 transition-colors hover:text-white/80"
        onmouseenter={openCompanyPopover}
        onmouseleave={onclose}
      >
        {job.company}
      </button>

      <!-- popover -->
      <div
        role="tooltip"
        class="absolute bottom-full left-0 z-30 mb-2 w-72 overflow-hidden rounded-lg border border-white/8 bg-[#141414] shadow-2xl transition-all duration-200 {openPopover === job.company ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-1 opacity-0'}"
        onmouseenter={openCompanyPopover}
        onmouseleave={onclose}
      >
        <!-- chrome header -->
        <div class="flex items-center gap-3 border-b border-white/6 bg-black/30 px-4 py-3">
          <div class="min-w-0">
            <p class="truncate text-sm font-bold text-white/85">{job.company}</p>
            <p class="truncate font-mono text-xs text-white/70">{job.role}</p>
          </div>
        </div>

        <!-- body -->
        <div class="p-4">
          <p class="mb-3 whitespace-pre-line text-xs leading-relaxed text-white/70">{job.about}</p>
          {#if job.website}
            <a
              href={job.website}
              target="_blank"
              rel="noopener noreferrer"
              class="font-mono text-xs text-white/70 transition-colors hover:text-white/80"
            >[ visit website  ]</a>
          {:else}
            <span class="font-mono text-xs text-red-400/70">[ closed source ]</span>
          {/if}
        </div>
      </div>
    </div>
  {:else}
    <span class="text-white/65">{job.company}</span>
  {/if}
  {#if job.location}<span class="shrink-0 font-mono text-xs text-white/75">{job.location}</span>{/if}
</div>
