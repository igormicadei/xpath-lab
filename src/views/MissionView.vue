<template>
  <main v-if="mission" class="mission-view">
    <!-- Back breadcrumb -->
    <div class="mission-view__back">
      <RouterLink to="/" style="color: #6f6f6f; font-size: 13px; text-decoration: none;">
        ← Voltar às Missões
      </RouterLink>
    </div>

    <!-- Mission Header -->
    <div class="mission-view__header" :data-icon="mission.icon">
      <div class="mission-view__mission-number">Missão {{ mission.id }} de {{ totalMissions }}</div>
      <h1 class="mission-view__title">{{ mission.title }}</h1>
      <p class="mission-view__subtitle">{{ mission.subtitle }}</p>

      <div class="mission-view__badges">
        <span :class="['mission-card__difficulty', `mission-card__difficulty--${mission.difficulty}`]">
          {{ difficultyLabel }}
        </span>
        <span class="mission-view__xp-badge">
          ⚡ {{ mission.xp }} XP
        </span>
        <span v-if="isMissionComplete" style="font-size: 12px; color: #24a148; background: rgba(36,161,72,0.1); padding: 4px 10px; border-radius: 10px; border: 1px solid rgba(36,161,72,0.3);">
          ✓ Concluída
        </span>
      </div>
    </div>

    <!-- Sections -->
    <template v-for="(section, index) in mission.sections" :key="index">

      <!-- Intro -->
      <div v-if="section.type === 'intro'" class="section-block">
        <div class="section-block__content" v-html="section.content"></div>
      </div>

      <!-- Concept Group -->
      <div v-else-if="section.type === 'concept-group'" class="section-block">
        <h2 class="section-block__title">{{ section.title }}</h2>
        <div v-if="section.content" class="section-block__content" style="margin-bottom: 16px;" v-html="section.content"></div>
        <div v-for="concept in section.concepts" :key="concept.operator"
          class="concept-block"
          :style="{ '--concept-color': concept.color }"
        >
          <div class="concept-block__operator">{{ concept.operator }}</div>
          <div class="concept-block__name">{{ concept.name }}</div>
          <div class="concept-block__text" v-html="concept.text"></div>
        </div>
      </div>

      <!-- Tip -->
      <div v-else-if="section.type === 'tip'" class="section-block" style="padding: 16px 32px;">
        <div class="tip-block">
          <p class="tip-block__text" v-html="section.content"></p>
        </div>
      </div>

      <!-- Interactive section -->
      <div v-else-if="section.type === 'interactive'" class="section-block">
        <h2 class="section-block__title">{{ section.title }}</h2>
        <div v-if="section.description" class="section-block__content" style="margin-bottom: 20px;" v-html="section.description"></div>
        <XPathTester
          :html="section.html"
          :examples="section.examples"
          :default-x-path="section.defaultXPath || ''"
          :challenge-mode="false"
        />
      </div>

      <!-- Challenge section -->
      <div v-else-if="section.type === 'challenge'" class="challenge-section">
        <div class="challenge-section__header">
          <div class="challenge-section__eyebrow">
            <span>🔥</span> Desafio Final
          </div>
          <h2 class="challenge-section__title">{{ section.title }}</h2>
          <p class="challenge-section__description" v-html="section.description"></p>
        </div>

        <XPathTester
          :html="section.html"
          :examples="[]"
          :default-x-path="''"
          :challenge-mode="true"
          :solutions="section.solutions"
          :hint="section.hint"
          :success-message="section.successMessage"
          :xp-reward="mission.xp"
          :already-complete="isMissionComplete"
          @challenge-complete="onChallengeComplete"
        />
      </div>

    </template>

    <!-- Inspector tip (inline) -->
    <div class="inspector-tip" style="margin: 24px 32px;">
      <div class="inspector-tip__title">🔬 Inspecione o HTML do Preview</div>
      <div class="inspector-tip__content">
        <p>Na aba <strong>Preview</strong> do testador, clique com o botão direito em qualquer elemento → <strong>Inspecionar</strong>.<br>
        No DevTools: <strong>Elements</strong> → clique direito no nó → <strong>Copy → Copy XPath</strong>.<br>
        Cole o XPath no campo acima para ver como ele funciona e então <strong>refine-o</strong> para deixá-lo mais estável.</p>
      </div>
    </div>

    <!-- Navigation -->
    <div style="display: flex; justify-content: space-between; padding: 24px 32px; border-top: 1px solid #262626;">
      <RouterLink
        v-if="prevMission"
        :to="`/missao/${prevMission.id}`"
        style="color: #6f6f6f; font-size: 14px; text-decoration: none;"
      >
        ← Missão {{ prevMission.id }}: {{ prevMission.title }}
      </RouterLink>
      <span v-else></span>

      <RouterLink
        v-if="nextMission && (isMissionComplete || store.isMissionUnlocked(nextMission.id))"
        :to="`/missao/${nextMission.id}`"
        style="color: #78a9ff; font-size: 14px; text-decoration: none; font-weight: 600;"
      >
        Missão {{ nextMission.id }}: {{ nextMission.title }} →
      </RouterLink>
      <span v-else-if="nextMission" style="font-size: 13px; color: #525252;">
        🔒 Complete o desafio para desbloquear a próxima missão
      </span>
    </div>

    <!-- Completion overlay -->
    <Transition name="fade">
      <div v-if="showCompletionBanner" style="position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: #1a3a2a; border: 1px solid #24a148; border-radius: 8px; padding: 16px 24px; display: flex; align-items: center; gap: 16px; z-index: 1000; box-shadow: 0 8px 32px rgba(0,0,0,0.5);">
        <span style="font-size: 32px;">🏆</span>
        <div>
          <div style="font-size: 16px; font-weight: 700; color: #42be65;">Missão Concluída!</div>
          <div style="font-size: 13px; color: #c6c6c6;">+{{ mission.xp }} XP ganhos</div>
        </div>
        <button @click="showCompletionBanner = false" style="background: none; border: none; color: #525252; cursor: pointer; font-size: 18px; padding: 0 0 0 8px;">×</button>
      </div>
    </Transition>
  </main>

  <div v-else style="padding: 64px 32px; text-align: center; color: #525252;">
    Missão não encontrada. <RouterLink to="/">Voltar ao início</RouterLink>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import XPathTester from '../components/XPathTester.vue'
import missions from '../data/missions.js'
import { useProgressStore } from '../stores/progressStore.js'

const route = useRoute()
const store = useProgressStore()

const missionId = computed(() => parseInt(route.params.id))
const mission = computed(() => missions.find(m => m.id === missionId.value))
const totalMissions = missions.length

const prevMission = computed(() => missions.find(m => m.id === missionId.value - 1))
const nextMission = computed(() => missions.find(m => m.id === missionId.value + 1))
const isMissionComplete = computed(() => store.isMissionComplete(missionId.value))

const difficultyLabel = computed(() => {
  const map = {
    iniciante: 'Iniciante',
    intermediario: 'Intermediário',
    avancado: 'Avançado',
    elite: 'Elite'
  }
  return map[mission.value?.difficulty] || ''
})

const showCompletionBanner = ref(false)

function onChallengeComplete() {
  if (!isMissionComplete.value) {
    store.completeChallenge(`mission-${missionId.value}`, mission.value.xp)
    showCompletionBanner.value = true
    setTimeout(() => { showCompletionBanner.value = false }, 5000)
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s, transform 0.3s; }
.fade-enter-from { opacity: 0; transform: translateX(-50%) translateY(20px); }
.fade-leave-to { opacity: 0; transform: translateX(-50%) translateY(20px); }
</style>
