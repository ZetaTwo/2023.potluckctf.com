<template>
  <h1>challenges</h1>
  <ChallengeCategory
    v-for="category in categories"
    :key="category"
    :name="category"
  />
  <p v-if="$store.state.watsupReturned && !$store.state.categories.length">
    CTF hasn't started yet!
  </p>
</template>

<script>
import ChallengeCategory from '@/components/ChallengeCategory.vue'
export default {
    components: {
        ChallengeCategory,
    },
    computed: {
        categories () {
            return this.$store.state.categories
        },
    },
    watch: {
        $route (to, from) {
            if (to.name === 'challenge' || to.name === 'challenges') this.navigate(to.params.id)
        },
        '$store.state.challenges': { // This probably gets called too often and creates unnecessary overhead because its a deep watch, but idk
            handler () {
                if (!this.$store.state.modals.challengeModal.visible && this.$route.params.id) {
                    this.navigate(this.$route.params.id)
                }
            },
            deep: true,
        },
    },
    mounted () {
        this.navigate(this.$route.params.id)
    },
    methods: {
        navigate (id) {
            if (id !== undefined && id in this.$store.state.challenges) {
                this.$store.commit('setModalChallenge', this.$store.state.challenges[id])
                this.$store.commit('showModal', 'challengeModal')
            } else {
                this.$store.commit('hideModal', 'challengeModal')
            }
        },
    },
}
</script>
