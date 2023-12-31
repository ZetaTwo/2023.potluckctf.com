<template>
  <div
    class="challenge"
    :class="{solved: solved, locked: challenge.status > 0, outsidelist: outsidelist}"
    :title="tooltip"
  >
    <div @click="openModal()">
      <span class="title">{{ challenge.status === 2 ? "???" : challenge.title }}</span>
      <ul class="categories">
        <li v-for="category in challenge.categories" :key="category">
          {{ category }}
        </li>
      </ul>
      <span class="solves" :title="`This challenge has been sloved by ${challenge.solves} teams`">{{ challenge.solves }}</span>
      <span class="score" :title="`This challenge gives ${$store.getters.challScore(challenge.id)} points to each team that solves it`">{{ $store.getters.challScore(challenge.id) }}</span>
    </div>
  </div>
</template>

<script>
import router from '@/router.js'

export default {
    props: ['challenge', 'outsidelist'],
    computed: {
        solved () {
            return this.$store.state.team && this.challenge.id in this.$store.state.team.solves
        },
        tooltip () {
            switch (this.challenge.status) {
            case 1:
                return 'This challenge is locked. Solve the previous challenge to unlock it.'
            case 2:
                return 'This challenge has not been published yet. It will be published at some point during the competition.'
            default:
                return ''
            }
        },
    },
    methods: {
        openModal () {
            if (this.challenge.status) return
            if (this.outsidelist) return
            router.push({ name: 'challenge', params: { id: this.challenge.id } })
        },
    },
}
</script>

<style lang="scss" scoped>
.challenge {
    height: $challenge-height;
    min-width: $challenge-min-width;
    background-color: $challenge-color;
    border-color: $challenge-color;
    margin: $challenge-spacing/2 $challenge-spacing $challenge-spacing/2 0;
    padding: 0.7rem;
    flex-wrap: wrap;
    color: $font-challenge-color;
    border-radius: $standard-border-radius;
    font-weight: 600;
    position: relative; // not required here, but for chain arrows
    cursor: pointer;

    div {
        position: relative;
        height: 100%;
        width: 100%;
    }
}
.title {
    font-size: 1.4rem;
}
.solves {
    position: absolute;
    bottom: 0;
    left: 0;
    color: $dark-transparent-background;
}
.score {
    position: absolute;
    bottom: 0;
    right: 0;
    font-size: 3rem;
    line-height: 1;
}
.categories {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;

    li {
        background-color: $dark-transparent-background;
        padding: 0rem 0.2rem;
        border-radius: 0.3rem;
        font-size: 1rem;
        margin-right: 0.2rem;
    }
}

.solved {
    background-color: #c0dead;
    border-color: #c0dead;
}

.locked {
    background-color: #888;
    border-color: #888;
    cursor: default;
}

.outsidelist {
    background-color: $challenge-color;
    border-color: $challenge-color;
    cursor: default;
}
</style>
