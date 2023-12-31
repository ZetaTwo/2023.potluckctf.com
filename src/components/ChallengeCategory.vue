<template>
  <!-- <div class="category-header">
    <span>{{ name }}</span>
  </div> -->
  <h5>{{ name }}</h5>
  <div class="challenge-container">
    <ChallengeInfo
      v-for="challenge in getChallenges()"
      :key="challenge.id"
      :challenge="challenge"
    />
    <ChallengeChain
      v-for="challenge in getChains()"
      :key="challenge.id"
      :challenge="challenge"
    />
  </div>
</template>

<script>
// TODO fun idea: make an algorithm that packs the challenges in as few rows as possible (now that challenge order was added, maybe only do this if the order is the same for all)
import ChallengeInfo from '@/components/ChallengeInfo.vue'
import ChallengeChain from '@/components/ChallengeChain.vue'
export default {
    components: {
        ChallengeInfo,
        ChallengeChain,
    },
    props: ['name'],
    methods: {
        getChallenges () {
            return Object.values(this.$store.state.challenges).filter(c => c.categories[0] === this.name && c.unlocked_by === null && c.unlocks == null).sort((a, b) => a.order - b.order)
        },
        getChains () {
            return Object.values(this.$store.state.challenges).filter(c => c.categories[0] === this.name && c.unlocked_by === null && c.unlocks != null).sort((a, b) => a.order - b.order)
        },
    },
}
</script>

<style scoped>
.challenge-container {
  display: flex;
  flex-wrap: wrap;
}
h5 {
  margin-bottom: 0;
}
</style>
