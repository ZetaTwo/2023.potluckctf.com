<template>
  <h1>{{ teamName }}</h1>
  <template v-if="team">
    <h5>
      <div
        class="item"
        :title="`${team.score} points`"
      >
        <span>{{ team.score }}</span>
        <span class="material-icons">control_point_duplicate</span>
      </div>
      <div
        class="item"
        :title="`${Object.keys(team.solves).length} solves`"
      >
        <span>{{ Object.keys(team.solves).length }}</span>
        <span class="material-icons">published_with_changes</span>
      </div>
    </h5>
    <h5 v-if="team.eligible">
      Potluck Class
    </h5>
    <h5 v-else>
      Open Class
    </h5>
    <h5 v-if="team.website">
      <a :href="team.website">{{ team.website }}</a>
    </h5>
    <div class="members">
      <div
        v-for="member in team.members"
        :key="member.username"
        class="member"
      >
        <span class="username">{{ member.username }}</span>
      </div>
    </div>
    <h2 v-if="Object.keys(solves).length">
      Solves
    </h2>
    <div class="solves">
      <ChallengeInfo
        v-for="challenge in solves"
        :key="challenge.id"
        :challenge="challenge"
        outsidelist="true"
      />
    </div>
  </template>
</template>

<script>
import ChallengeInfo from '@/components/ChallengeInfo.vue'
import networking from '@/networking.js'

export default {
    components: { ChallengeInfo },
    computed: {
        team () {
            if (!Object.keys(this.$store.state.teams).length) return undefined
            const team = this.$store.state.teams[this.$route.params.id]
            if (!team) return null
            return team
        },
        teamName () {
            if (this.team === undefined) return 'Loading...' // FIXME returns loading when nobody has registered yet
            if (this.team === null) return 'Team not found'
            return this.team.name
        },
        solves () {
            return Object.keys(this.team.solves).filter(id => { return id in this.$store.state.challenges }).map(id => { return this.$store.state.challenges[id] })
        },
    },
    mounted () {
        networking.ensureScoreboard()
    },
}
</script>

<style lang="scss" scoped>
h1 {
    text-align: center;
}

.item {
    margin: 0 0.5rem;
    span {
        vertical-align: middle;
        margin-right: 0.5rem;
    }
}

h5 {
    color: white;
    display: flex;
    justify-content: center;
}

.material-icons {
    color:#ffaa6f;
}

.members {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
}

.member {
    // display: block;
    margin: 1rem;
    border-radius: $standard-border-radius;
    background-color: #ffaa6f;
    padding: 0.7rem;

    .username {
        font-size: 1.2em;
        text-align: center;
    }

    .hidden {
        opacity: 0.5;
    }

    span {
        display: block;
    }
}

.solves {
  display: flex;
  flex-wrap: wrap;
}
</style>
