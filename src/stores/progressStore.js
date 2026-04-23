import { defineStore } from "pinia";
import { ref, computed } from "vue";

const STORAGE_KEY = "xpath-lab-progress";

function save(challenges, xp) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ completedChallenges: [...challenges], totalXP: xp }),
  );
}

export const useProgressStore = defineStore("progress", () => {
  const completedChallenges = ref(new Set());
  const totalXP = ref(0);

  // Hydrate from localStorage
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const data = JSON.parse(saved);
      completedChallenges.value = new Set(data.completedChallenges || []);
      totalXP.value = data.totalXP || 0;
    } catch {
      // ignore corrupted data
    }
  }

  function completeChallenge(challengeId, xpReward) {
    if (!completedChallenges.value.has(challengeId)) {
      completedChallenges.value.add(challengeId);
      totalXP.value += xpReward;
      save(completedChallenges.value, totalXP.value);
    }
  }

  function isChallengeComplete(challengeId) {
    return completedChallenges.value.has(challengeId);
  }

  function isMissionUnlocked(missionId) {
    if (missionId === 1) return true;
    return completedChallenges.value.has(`mission-${missionId - 1}`);
  }

  function isMissionComplete(missionId) {
    return completedChallenges.value.has(`mission-${missionId}`);
  }

  const completedCount = computed(() => {
    return [...completedChallenges.value].filter((id) =>
      id.startsWith("mission-"),
    ).length;
  });

  function resetProgress() {
    completedChallenges.value = new Set();
    totalXP.value = 0;
    save(completedChallenges.value, totalXP.value);
  }

  return {
    completedChallenges,
    totalXP,
    completedCount,
    completeChallenge,
    isChallengeComplete,
    isMissionUnlocked,
    isMissionComplete,
    resetProgress,
  };
});
