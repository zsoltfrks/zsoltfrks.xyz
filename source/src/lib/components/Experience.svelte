<script lang="ts">
  import { experience, type ExperienceItem } from '../data/experience'
  import CompanyPopover from './CompanyPopover.svelte'
  import Lightbox, { type LightboxPhoto } from './Lightbox.svelte'
  import { reveal } from '../actions/reveal'

  const fullTime  = experience.filter(j => j.type === 'full-time')
  const freelance = experience.filter(j => j.type === 'projects')

  let openPopover = $state<string | null>(null)
  let closeTimer: ReturnType<typeof setTimeout> | null = null

  let screenshotJob = $state<ExperienceItem | null>(null)
  let screenshotIdx = $state<number | null>(null)

  const screenshotPhotos = $derived<LightboxPhoto[]>(
    screenshotJob?.screenshots?.map(shot => ({ full: shot.src, label: shot.label })) ?? []
  )

  function openPop(key: string) {
    if (closeTimer) clearTimeout(closeTimer)
    openPopover = key
  }

  function closePop() {
    closeTimer = setTimeout(() => openPopover = null, 150)
  }

  function openScreenshot(job: ExperienceItem, index: number) {
    screenshotJob = job
    screenshotIdx = index
  }
</script>

<section id="experience" class="py-24">
  <div class="mx-auto max-w-5xl px-6">

    <!-- section header -->
    <div class="mb-10 flex items-baseline justify-between">
      <h2 use:reveal class="reveal-on-scroll text-xl font-bold text-white/80">Experience</h2>
    </div>

    <div class="space-y-12">

      <!-- full-time -->
      {#if fullTime.length}
        <div>
          <p use:reveal class="reveal-on-scroll mb-6 font-mono text-xs uppercase tracking-widest text-white/80">Full-Time</p>

          <ol class="timeline timeline-reveal relative ml-1 space-y-10">
            {#each fullTime as job, index}
              <li
                use:reveal
                style={`--reveal-delay: ${index * 85}ms`}
                class="timeline-item reveal-on-scroll relative ml-8"
              >
                <!-- timeline dot -->
                <span use:reveal style={`--reveal-delay: ${index * 85}ms`} class="reveal-on-scroll absolute -left-8 z-10 mt-1.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full border border-white/30 bg-[#0a0a0a]" aria-hidden="true"></span>

                <!-- role + period -->
                <div class="mb-1 flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                  <h3 class="font-bold text-white/90">{job.role}</h3>
                  <time class="shrink-0 font-mono text-xs text-white/75">{job.period}</time>
                </div>

                <!-- company + location + popover -->
                <CompanyPopover {job} {openPopover} onopen={openPop} onclose={closePop} />

                <!-- bullets -->
                <ul class="mt-6 mb-6 space-y-2.5">
                  {#each job.bullets as bullet}
                    <li class="flex items-start gap-2 text-sm leading-relaxed text-white/75">
                      <span class="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/75"></span>
                      {bullet}
                    </li>
                  {/each}
                </ul>

                <!-- tech tags -->
                {#if job.tech?.length}
                  <div class="mb-2 flex flex-wrap items-center gap-1.5">
                    <span class="font-mono text-xs text-white/75">TECH:</span>
                    {#each job.tech as tag}
                      <span class="backdrop-blur-md rounded border border-white/8 bg-[#0d0d0d] px-2 py-0.5 font-mono text-xs text-white/80">{tag}</span>
                    {/each}
                  </div>
                {/if}

                <!-- skills tags -->
                {#if job.skills?.length}
                  <div class="flex flex-wrap items-center gap-1.5">
                    <span class="font-mono text-xs text-white/75">SKILLS:</span>
                    {#each job.skills as skill}
                      <span class="backdrop-blur-md rounded border border-white/8 bg-[#0d0d0d] px-2 py-0.5 font-mono text-xs text-white/80">{skill}</span>
                    {/each}
                  </div>
                {/if}

                <!-- screenshots -->
                {#if job.screenshots?.length}
                  <div class="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <span class="font-mono text-xs text-white/75">SCREENSHOTS:</span>
                    {#each job.screenshots as shot, shotIndex}
                      <button
                        class="cursor-pointer font-mono text-xs text-white/60 transition-colors hover:text-white"
                        aria-label={`Open screenshot: ${shot.label}`}
                        onclick={() => openScreenshot(job, shotIndex)}
                      >{shot.label}</button>
                    {/each}
                  </div>
                {/if}
              </li>
            {/each}
          </ol>
        </div>
      {/if}

      <!-- freelance -->
      {#if freelance.length}
        <div>
          <p use:reveal class="reveal-on-scroll mb-6 font-mono text-xs uppercase tracking-widest text-white/80">PROJECT</p>

          <ol class="timeline timeline-reveal relative ml-1 space-y-10">
            {#each freelance as job, index}
              <li
                use:reveal
                style={`--reveal-delay: ${index * 85}ms`}
                class="timeline-item reveal-on-scroll relative ml-8"
              >
                <span use:reveal style={`--reveal-delay: ${index * 85}ms`} class="reveal-on-scroll absolute -left-8 z-10 mt-1.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full border border-white/30 bg-[#0a0a0a]" aria-hidden="true"></span>

                <!-- role + period -->
                <div class="mb-1 flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                  <h3 class="font-bold text-white/90">{job.role}</h3>
                  <time class="shrink-0 font-mono text-xs text-white/75">{job.period}</time>
                </div>

                <!-- company + location + popover -->
                <CompanyPopover {job} {openPopover} onopen={openPop} onclose={closePop} />

                <ul class="mt-6 mb-6 space-y-2.5">
                  {#each job.bullets as bullet}
                    <li class="flex items-start gap-2 text-sm leading-relaxed text-white/75">
                      <span class="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/75"></span>
                      {bullet}
                    </li>
                  {/each}
                </ul>

                {#if job.tech?.length}
                  <div class="mb-2 flex flex-wrap items-center gap-1.5">
                    <span class="font-mono text-xs text-white/75">TECH:</span>
                    {#each job.tech as tag}
                      <span class="backdrop-blur-md rounded border border-white/8 bg-[#0d0d0d] px-2 py-0.5 font-mono text-xs text-white/80">{tag}</span>
                    {/each}
                  </div>
                {/if}

                {#if job.skills?.length}
                  <div class="flex flex-wrap items-center gap-1.5">
                    <span class="font-mono text-xs text-white/75">SKILLS:</span>
                    {#each job.skills as skill}
                      <span class="backdrop-blur-md rounded border border-white/8 bg-[#0d0d0d] px-2 py-0.5 font-mono text-xs text-white/80">{skill}</span>
                    {/each}
                  </div>
                {/if}

                <!-- screenshots 
                {#if job.screenshots?.length}
                  <div class="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                    <span class="font-mono text-xs text-white/75">SCREENSHOTS:</span>
                    {#each job.screenshots as shot, shotIndex}
                      <button
                        class="cursor-pointer font-mono text-xs text-white/80 transition-colors hover:text-white"
                        aria-label={`Open screenshot: ${shot.label}`}
                        onclick={() => openScreenshot(job, shotIndex)}
                      >{shot.label}</button>
                    {/each}
                  </div>
                {/if}-->
              </li>
            {/each}
          </ol>
        </div>
      {/if}

    </div>
  </div>
</section>

<!-- screenshot lightbox -->
<Lightbox
  photos={screenshotPhotos}
  label={screenshotJob?.company ?? ''}
  bind:index={screenshotIdx}
/>

<style>
  .timeline::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.6875rem; /* mt-1.5 (0.375rem) + half of h-2.5 (0.3125rem) */
    bottom: 0;
    width: 1px;
    background-color: rgba(255, 255, 255, 0.3);
  }

  .timeline-reveal::before {
    opacity: 0.35;
    transform: scaleY(0.4);
    transform-origin: top;
    transition:
      opacity 0.55s ease,
      transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .timeline-reveal:has(.timeline-item:global(.is-revealed))::before {
    opacity: 1;
    transform: scaleY(1);
  }

  @media (prefers-reduced-motion: reduce) {
    .timeline-reveal::before,
    .timeline-item {
      transition: none;
      transform: none;
      opacity: 1;
    }
  }
</style>
