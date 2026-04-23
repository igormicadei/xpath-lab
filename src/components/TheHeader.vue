<template>
  <header class="lab-header">
    <RouterLink to="/" class="lab-header__brand">
      <span>&lt;</span>xpath<span>/&gt;</span>
      &nbsp;Lab
    </RouterLink>

    <nav class="lab-header__nav">
      <RouterLink to="/" class="lab-header__nav-link" active-class="active" exact>
        Missões
      </RouterLink>
      <RouterLink to="/playground" class="lab-header__nav-link" active-class="active">
        Playground
      </RouterLink>
    </nav>

    <div class="lab-header__xp">
      <span class="lab-header__xp-icon">⚡</span>
      {{ store.totalXP }} XP
    </div>
  </header>
</template>

<script setup>
import { useProgressStore } from '../stores/progressStore.js'
const store = useProgressStore()
</script>
