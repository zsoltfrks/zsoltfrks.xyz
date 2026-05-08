<script>
  import { experience } from '../data/experience.js'
  import CompanyPopover from './CompanyPopover.svelte'

  const fullTime  = experience.filter(j => j.type === 'full-time')
  const freelance = experience.filter(j => j.type === 'projects')

  let openPopover = $state(null)
  let closeTimer = null

  function openPop(key) {
    clearTimeout(closeTimer)
    openPopover = key
  }

  function closePop() {
    closeTimer = setTimeout(() => openPopover = null, 150)
  }
</script>

<section id="experience" class="py-24">
  <div class="mx-auto max-w-5xl px-6">

    <!-- section header -->
    <div class="mb-12 flex items-baseline justify-between">
      <h2 class="text-xl font-bold text-white/80">Experience</h2>
    </div>

    <div class="space-y-12">

      <!-- full-time -->
      {#if fullTime.length}
        <div>
          <p class="mb-6 font-mono text-xs uppercase tracking-widest text-white/80">Full-Time</p>

          <ol class="timeline relative ml-1 space-y-10">
            {#each fullTime as job}
              <li class="ml-8">
                <!-- timeline dot -->
                <span class="absolute left-0 mt-1.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full border border-white/30 bg-[#0a0a0a]" aria-hidden="true"></span>

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
                      <span class="backdrop-blur-md rounded border border-white/8 bg-[#0d0d0d] px-2 py-0.5 font-mono text-xs text-white/75">{tag}</span>
                    {/each}
                  </div>
                {/if}

                <!-- skills tags -->
                {#if job.skills?.length}
                  <div class="flex flex-wrap items-center gap-1.5">
                    <span class="font-mono text-xs text-white/75">SKILLS:</span>
                    {#each job.skills as skill}
                      <span class="backdrop-blur-md rounded border border-white/8 bg-[#0d0d0d] px-2 py-0.5 font-mono text-xs text-white/75">{skill}</span>
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
          <p class="mb-6 font-mono text-xs uppercase tracking-widest text-white/80">PROJECT</p>

          <ol class="timeline relative ml-1 space-y-10">
            {#each freelance as job}
              <li class="ml-8">
                <span class="absolute left-0 mt-1.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full border border-white/30 bg-[#0a0a0a]" aria-hidden="true"></span>

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
                      <span class="backdrop-blur-md rounded border border-white/8 bg-[#0d0d0d] px-2 py-0.5 font-mono text-xs text-white/75">{tag}</span>
                    {/each}
                  </div>
                {/if}

                {#if job.skills?.length}
                  <div class="flex flex-wrap items-center gap-1.5">
                    <span class="font-mono text-xs text-white/75">SKILLS:</span>
                    {#each job.skills as skill}
                      <span class="backdrop-blur-md rounded border border-white/8 bg-[#0d0d0d] px-2 py-0.5 font-mono text-xs text-white/75">{skill}</span>
                    {/each}
                  </div>
                {/if}
              </li>
            {/each}
          </ol>
        </div>
      {/if}

    </div>
  </div>
</section>

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
</style>
