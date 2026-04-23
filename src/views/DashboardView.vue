<template>
  <main>
    <!-- Hero section -->
    <div class="dashboard__hero">
      <div class="dashboard__hero-tag">// XPath Lab — Training Environment</div>
      <h1 class="dashboard__hero-title">
        Domine o <strong>XPath</strong><br>por missões
      </h1>
      <p class="dashboard__hero-subtitle">
        Complete as missões em ordem, teste XPaths em tempo real e desenvolva habilidades de automação web.
      </p>

      <div class="dashboard__progress-row">
        <div class="dashboard__stat">
          <span class="dashboard__stat-value">{{ store.completedCount }}/{{ missions.length }}</span>
          <span class="dashboard__stat-label">Missões concluídas</span>
        </div>
        <div class="dashboard__stat">
          <span class="dashboard__stat-value">{{ store.totalXP }}</span>
          <span class="dashboard__stat-label">XP Total</span>
        </div>
        <div class="dashboard__stat">
          <span class="dashboard__stat-value">{{ progressPct }}%</span>
          <span class="dashboard__stat-label">Progresso</span>
        </div>
      </div>

      <div v-if="store.completedCount > 0" style="margin-top: 16px;">
        <div style="height: 4px; background: #393939; border-radius: 2px; max-width: 360px;">
          <div :style="{ width: progressPct + '%', background: '#0f62fe', height: '100%', borderRadius: '2px', transition: 'width 0.4s ease' }"></div>
        </div>
      </div>
    </div>

    <!-- Mission grid -->
    <div class="dashboard__grid">
      <MissionCard
        v-for="m in missions"
        :key="m.id"
        :mission="m"
        :unlocked="store.isMissionUnlocked(m.id)"
        :complete="store.isMissionComplete(m.id)"
      />
    </div>

    <!-- Playground CTA -->
    <div class="dashboard__playground-cta">
      <div class="dashboard__cta-text">
        <h3>🛝 Playground Livre</h3>
        <p>Cole qualquer HTML e teste XPaths sem limites. Perfeito para validar seletores do seu projeto.</p>
      </div>
      <RouterLink
        to="/playground"
        style="padding: 10px 20px; background: #393939; color: #f4f4f4; text-decoration: none; border-radius: 4px; font-size: 14px; font-weight: 600; white-space: nowrap;"
      >
        Abrir Playground →
      </RouterLink>
    </div>

    <!-- Inspector tip -->
    <div class="inspector-tip" style="margin: 0 32px 32px;">
      <div class="inspector-tip__title">🔬 Como usar as ferramentas do navegador</div>
      <div class="inspector-tip__content">
        <p>Em qualquer Preview da página, você pode inspecionar os elementos diretamente:</p>
        <ol>
          <li>Pressione <kbd>F12</kbd> para abrir o DevTools, ou clique com o <strong>botão direito</strong> em qualquer elemento do preview e escolha <strong>Inspecionar</strong>.</li>
          <li>Na aba <strong>Elements</strong>, clique com o botão direito em qualquer nó HTML → <strong>Copy → Copy XPath</strong> ou <strong>Copy full XPath</strong>.</li>
          <li>Cole o XPath copiado no campo de teste para ver como ele funciona (e então melhorá-lo!).</li>
          <li>Use o campo de busca do DevTools (<kbd>Ctrl+F</kbd> na aba Elements) para testar um XPath e ver os resultados destacados.</li>
        </ol>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import MissionCard from '../components/MissionCard.vue'
import missions from '../data/missions.js'
import { useProgressStore } from '../stores/progressStore.js'

const store = useProgressStore()
const progressPct = computed(() => Math.round((store.completedCount / missions.length) * 100))
</script>
