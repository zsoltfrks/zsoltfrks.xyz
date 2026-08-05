<script lang="ts">
  import { reveal } from '../actions/reveal'

  const courses = [
    'Software Engineering',
    'System Architecture',
    'Computer Science',
    'Project Management'
  ]

  const thesis = {
    title: 'Automated maintenance of GitLab repositories based on size and activity',
    tech: ['Python', 'Flask', 'FastAPI', 'REST API', 'Docker'],
  }
</script>

<section id="studies" class="py-24">
  <div use:reveal style={`--reveal-delay: 85ms`} class="reveal-on-scroll mx-auto max-w-5xl px-6">
    <div class="mb-10 flex items-baseline justify-between">
      <h2 class="text-xl font-bold text-white/80">Studies</h2>
    </div>

    <div class="space-y-6">
      <div>
        <div class="mb-1 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
          <h3 class="font-bold text-white/95">
            University of Szeged, <span class="text-white/95">Computer Science BSc</span>
          </h3>

          <span class="shrink-0 font-mono text-xs text-white/75">
            2022 - 2027
          </span>
        </div>

        <!-- thesis -->
        <div class="mt-6">
          <p class="text-sm leading-relaxed text-white/75">
            <span class="font-mono text-xs text-white/75">THESIS:</span>
            <span class="text-white/90">{thesis.title}</span>
          </p>

          <div class="mt-2 flex flex-wrap items-center gap-1.5">
            <span class="font-mono text-xs text-white/75">TECH:</span>
            {#each thesis.tech as tech}
              <span class="backdrop-blur-md rounded border border-white/8 bg-[#0d0d0d] px-2 py-0.5 font-mono text-xs text-white/75">
                {tech}
              </span>
            {/each}
          </div>
        </div>
      </div>

      <!-- TODO: add coursera certs here.
       
      <div class="flex flex-wrap items-center gap-1.5">
        <span class="font-mono text-xs text-white/75">COURSES:</span>
        {#each courses as course}
          <span class="backdrop-blur-md rounded border border-white/8 bg-[#0d0d0d] px-2 py-0.5 font-mono text-xs text-white/75">
            {course}
          </span>
        {/each}
      </div>
       -->
    </div>
  </div>
</section>