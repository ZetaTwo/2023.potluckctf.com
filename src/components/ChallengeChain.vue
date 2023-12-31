<template>
  <div class="chain-container">
    <ChallengeInfo
      v-for="chall in getChallenges()"
      :key="chall.id"
      :challenge="chall"
    />
  </div>
</template>

<script>
import ChallengeInfo from '@/components/ChallengeInfo.vue'
export default {
    components: {
        ChallengeInfo,
    },
    props: ['challenge'],
    methods: {
        getChallenges () {
            let c = this.challenge
            const challenges = [c]
            while (c.unlocks) {
                c = this.$store.state.challenges[c.unlocks]
                challenges.push(c)
            }
            return challenges
        },
    },
}
</script>

<style lang="scss" scoped>
.chain-container {
    display: flex;
    flex-wrap: wrap;

    .challenge:after {
        content: "";
        height: 0;
        width: 0;
        border-top: $challenge-height/2 solid transparent;
        border-bottom: $challenge-height/2 solid transparent;
        border-left: $challenge-chain-arrow-depth solid;
        border-left-color: inherit;
        position: absolute;
        top: 0;
        left: 100%;
    }

    .challenge:before {
        content: "";
        height: 0;
        width: 0;
        border-top: $challenge-height/2 solid;
        border-top-color: inherit;
        border-bottom: $challenge-height/2 solid;
        border-bottom-color: inherit;
        border-left: $challenge-chain-arrow-depth solid transparent;
        position: absolute;
        top: 0;
        right: 100%;
    }

    .challenge {
        border-radius: 0;
        margin-right: $challenge-chain-arrow-depth + $challenge-chain-spacing;
    }

    .challenge:first-child {
        border-top-left-radius: $standard-border-radius;
        border-bottom-left-radius: $standard-border-radius;
        min-width: $challenge-min-width + ($challenge-spacing - ($challenge-chain-arrow-depth + $challenge-chain-spacing))/2;
    }

    .challenge:first-child:before {
        content: none;
    }

    .challenge:last-child {
        border-top-right-radius: $standard-border-radius;
        border-bottom-right-radius: $standard-border-radius;
        min-width: $challenge-min-width + ($challenge-spacing - ($challenge-chain-arrow-depth + $challenge-chain-spacing))/2;
    }

    .challenge:last-child:after {
        content: none;
    }
}
</style>
