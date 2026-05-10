<script>
  import { reveal } from '../actions/reveal.js'

  const studyHighlights = [
    {
      text: 'Specializing in backend engineering and system design, I focus on creating scalable and maintainable distributed systems.'
    }
  ]

  const focusAreas = [
    'Software Engineering',
    'System Architecture',
    'Computer Science',
    'Project Management'
  ]

</script>

<section id="studies" class="py-24">
  <div class="mx-auto max-w-5xl px-6">
    <div class="mb-12 flex items-baseline justify-between">
      <h2 class="text-xl font-bold text-white/80">Studies</h2>
    </div>

    <div
      use:reveal
      class="reveal-on-scroll space-y-6"
    >
      <div class="space-y-3">
        <div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
          <h3 class="font-bold text-white/95">
            University of Szeged, <span class="text-white/95">Computer Science BSc</span>
          </h3>

          <span class="shrink-0 font-mono text-xs text-white/75">
            Graduation: June, 2027
          </span>
        </div>
      </div>

      <ul class="space-y-2.5">
        {#each studyHighlights as highlight}
          <li class="flex items-start gap-2 text-sm leading-relaxed text-white/75">
            <span class="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-white/75"></span>
            <span>
              {highlight.text}
            </span>
          </li>
        {/each}
      </ul>

      <div class="flex flex-wrap items-center gap-1.5">
        <span class="font-mono text-xs text-white/75">FOCUS:</span>
        {#each focusAreas as area}
          <span class="backdrop-blur-md rounded border border-white/8 bg-[#0d0d0d] px-2 py-0.5 font-mono text-xs text-white/75">
            {area}
          </span>
        {/each}
      </div>
    </div>
  </div>
</section>