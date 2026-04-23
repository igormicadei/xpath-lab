<template>
  <RouterLink
    :to="unlocked ? `/missao/${mission.id}` : '#'"
    :class="['mission-card', { 'mission-card--locked': !unlocked, 'mission-card--complete': complete }]"
    :style="{ '--mission-color': mission.color }"
    :aria-disabled="!unlocked"
  >
    <!-- Complete badge -->
    <span v-if="complete" class="mission-card__complete-badge" aria-label="Missão concluída">✓</span>
    <!-- Lock icon -->
    <span v-else-if="!unlocked" class="mission-card__lock" aria-label="Missão bloqueada">🔒</span>

    <span class="mission-card__icon">{{ mission.icon }}</span>

    <div class="mission-card__header">
      <span class="mission-card__number">Missão {{ mission.id }}</span>
    </div>

    <h3 class="mission-card__title">{{ mission.title }}</h3>
    <p class="mission-card__subtitle">{{ mission.subtitle }}</p>

    <div class="mission-card__footer">
      <span :class="['mission-card__difficulty', `mission-card__difficulty--${mission.difficulty}`]">
        {{ difficultyLabel }}
      </span>
      <span class="mission-card__xp">⚡ {{ mission.xp }} XP</span>
    </div>
  </RouterLink>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  mission: { type: Object, required: true },
  unlocked: { type: Boolean, default: false },
  complete: { type: Boolean, default: false }
})

const difficultyLabel = computed(() => {
  const map = {
    iniciante: 'Iniciante',
    intermediario: 'Intermediário',
    avancado: 'Avançado',
    elite: 'Elite'
  }
  return map[props.mission.difficulty] || props.mission.difficulty
})
</script>
