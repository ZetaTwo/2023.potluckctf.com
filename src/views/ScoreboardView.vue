<template>
  <h1>scoreboard</h1>
  <AlertMessage
    v-if="$store.state.scoreboardFrozen"
    :content="`Scoreboard frozen! Flags submitted after ${freezeFormat} are not shown on the scoreboard.`"
    type="message"
  />
  <template v-if="$store.state.scoreboardFrozen && $store.state.user && $store.state.user.permissions.includes('core.force_unfrozen_scoreboard')">
    <button class="button view-unfrozen" @click="viewUnfrozen">
      View unfrozen scoreboard (Does not unfreeze the scoreboard, might load for a while. Click again to refresh.)
    </button>
  </template>
  <div class="scoreboard-choice">
    <button
      class="button"
      :class="{current: scoreboardChoice === 0}"
      @click="gotoScoreboard(0)"
    >
      Potluck Class
    </button>
    <button
      class="button"
      :class="{current: scoreboardChoice === 1}"
      @click="gotoScoreboard(1)"
    >
      Open Class
    </button>
    <button
      class="button"
      :class="{current: scoreboardChoice === 2}"
      @click="gotoScoreboard(2)"
    >
      Everyone
    </button>
  </div>
  <button
    v-if="$store.state.team && teamPage !== -1"
    class="button goto-team"
    @click="gotoTeam()"
  >
    Go to my team
  </button>
  <div class="top-container" :style="marginStyle">
    <div class="grid-container-container">
      <div
        ref="grid-container"
        class="grid-container"
        :style="gridStyle"
      >
        <!-- <span :style="dividerStyle">---------- Kvalgräns ----------</span> -->
        <span class="table-margin">Rank</span>
        <span class="table-margin">Team</span>
        <span class="table-margin">Score</span>
        <div
          v-for="challenge in challenges"
          :key="challenge.id"
          class="challenge-title"
          @click="openChallenge(challenge.id)"
        >
          <span class="hover">{{ challenge.title }}</span>
          <span v-if="!challenge.top_solved_teams.length" class="material-icons">flag</span>
        </div>
        <template v-for="(team, index) in teams" :key="team.id">
          <template v-if="page * teamsPerPage + index+1 != 1">
            <span class="table-margin">
              {{ page * teamsPerPage + index+1 }}
            </span>
          </template>
          <template v-else>
            <span class="material-icons table-margin">emoji_events</span>
          </template>
          <span
            :ref="`team-${team.id}`"
            class="table-margin team-name hover"
            @click="openTeam(team.id)"
          >{{ team.name }}</span>
          <span class="table-margin">{{ team.score }}</span>
          <span
            v-for="challenge in challenges"
            :key="challenge.id"
            class="material-icons"
            :title="`${team.name} - ${challenge.title}`"
            :class="{unsolved: !(challenge.id in team.solves)}"
          >flag</span>
          <!-- <template v-if="index === 9">
                            <span></span>
                            <span>---------- Kvalgräns ----------</span>
                            <span></span>
                            <span v-for="_ in challenges" :key="_.id"></span>
                        </template> -->
        </template>
      </div>
      <span v-if="!$store.state.scoreboardLoaded" class="table-margin">Loading...</span>
    </div>
    <div v-if="!loadAll && allTeams.length > teamsPerPage" class="pagination">
      <template v-if="page >= 3">
        <button class="button" @click="gotoPage(0)">
          1
        </button>
        <span>...</span>
        <button class="button" @click="gotoPage(page-1)">
          {{ page }}
        </button>
      </template>
      <template v-else>
        <button
          v-for="p in page"
          :key="p"
          class="button"
          @click="gotoPage(p-1)"
        >
          {{ p }}
        </button>
      </template>

      <button class="button current" @click="gotoPage(page)">
        {{ page+1 }}
      </button>

      <template v-if="pageCount - page >= 4">
        <button class="button" @click="gotoPage(page+1)">
          {{ page+2 }}
        </button>
        <span>...</span>
        <button class="button" @click="gotoPage(pageCount-1)">
          {{ pageCount }}
        </button>
      </template>
      <template v-else>
        <button
          v-for="p in pagesLeft"
          :key="p"
          class="button"
          @click="gotoPage(p-1)"
        >
          {{ p }}
        </button>
      </template>

      <br>
      <span>Goto page</span>
      <input
        v-model="pageSelector"
        type="number"
        min="1"
        :max="pageCount"
        @keyup.enter="gotoPage()"
      >
      <br>
      <button class="button" @click="loadAll = true">
        Load all teams
      </button>
    </div>
  </div>
  <span
    id="width-test"
    ref="width-test"
    class="challenge-title"
  />
</template>

<script>
import { nextTick } from 'vue'
import AlertMessage from '@/components/AlertMessage.vue'
import networking from '@/networking.js'
import router from '@/router.js'
import { dateToISO } from '@/utilityFunctions.js'

export default {
    components: { AlertMessage },
    data () {
        return {
            marginStyle: { 'margin-top': '0' },
            page: 0,
            teamsPerPage: 50,
            pageSelector: 1,
            loadAll: false,
            scoreboardChoice: 0,
        }
    },
    computed: {
        challenges () {
            return Object.values(this.$store.state.challenges).filter((c) => { return c.status !== 2 }).sort((a, b) => a.order - b.order)
        },
        allTeams () {
            if (!this.$store.state.scoreboardLoaded) return []
            const teams = this.$store.state.scoreboard.map(i => { return this.$store.state.teams[i] })
            if (this.scoreboardChoice === 0) {
                return teams.filter(t => { return t.eligible })
            } else if (this.scoreboardChoice === 1) {
                return teams.filter(t => { return !t.eligible })
            }
            return teams
        },
        teams () {
            if (this.loadAll) {
                return this.allTeams
            }
            return this.allTeams.slice(this.page * this.teamsPerPage, (this.page + 1) * this.teamsPerPage)
        },
        pageCount () {
            return Math.max(1, Math.ceil(this.allTeams.length / this.teamsPerPage))
        },
        pagesLeft () {
            return Array(this.pageCount - (this.page + 1)).fill().map((_, idx) => this.page + 1 + idx + 1)
        },
        teamPage () {
            return Math.floor(this.allTeams.findIndex(t => t.id === this.$store.state.team.id) / this.teamsPerPage)
        },
        gridStyle () {
            return {
                'grid-template-columns': 'min-content min-content min-content' + ((this.challenges.length) ? ` repeat(${this.challenges.length}, 2rem)` : ''),
            }
        },
        // dividerStyle () {
        //     const dividerank = 10

        //     // FIXME check if this works when loading all, it probably doesnt
        //     if (this.scoreboardChoice !== 0 || this.allTeams.length <= dividerank || this.page !== Math.floor(dividerank / this.teamsPerPage)) {
        //         return {
        //             display: 'none',
        //         }
        //     }

        //     return {
        //         'grid-column': `1 / ${this.challenges.length + 4}`,
        //         'grid-row': dividerank % this.teamsPerPage + 2,
        //     }
        // },
        freezeFormat () {
            if (!this.$store.state.scoreboardFreezeTime) return '????-??-?? ??:??'
            return dateToISO(this.$store.state.scoreboardFreezeTime).split(':').splice(0, 2).join(':')
        },
    },
    watch: {
        challenges () {
            this.recalculateMargin()
        },
    },
    mounted () {
        this.recalculateMargin()
        if (this.$store.state.websockets) {
            networking.ensureScoreboard()
        } else {
            networking.reloadScoreboard()
        }
    },
    methods: {
        recalculateMargin () {
            const height = Math.max(...this.challenges.map(c => {
                this.$refs['width-test'].innerHTML = c.title // bad practice, hopefully vue won't notice
                const width = this.$refs['width-test'].clientWidth
                this.$refs['width-test'].innerHTML = ''
                return Math.sqrt(width ** 2 / 2)
            }))
            this.marginStyle = { 'margin-top': `${height}px` }
        },
        gotoPage (page) {
            if (page === undefined) {
                this.page = this.pageSelector - 1
                return
            }
            this.page = page
        },
        gotoScoreboard (scoreboard) {
            this.scoreboardChoice = scoreboard
            this.page = 0
        },
        async gotoTeam () {
            this.gotoPage(this.teamPage)
            await nextTick()
            this.$refs[`team-${this.$store.state.team.id}`].scrollIntoView({ behavior: 'smooth', block: 'center' })
        },
        openChallenge (id) {
            if (this.$store.state.challenges[id].status) return
            router.push({ name: 'challenge', params: { id } })
        },
        openTeam (id) {
            router.push({ name: 'team', params: { id } })
        },
        viewUnfrozen () {
            networking.reloadScoreboard(true)
        },
    },
}
</script>

<style lang="scss" scoped>
h1 {
    margin: 1rem auto 0;
    padding: 0 1rem;
}

.view-unfrozen {
    margin: 1rem 1rem 0 1rem;
}

.scoreboard-choice {
    margin: 1rem;

    button {
        border-radius: 0;
    }
    :first-child {
        border-radius: 0.2rem 0 0 0.2rem;
    }
    :last-child {
        border-radius: 0 0.2rem 0.2rem 0;
    }
}

.goto-team {
    margin: 0rem 1rem 1rem 1rem;
}

.top-container {
    text-align: center;
    padding-left: 1rem;
}

.grid-container-container {
    display: inline-block;
}

.grid-container {
    display: grid;
    margin-bottom: 1rem;
}

.challenge-title {
    white-space: nowrap;
    transform: rotate(-45deg) translate(0.6em, 0);

     .material-icons {
         vertical-align: middle;
     }
}

.hover {
    cursor: pointer;
}

.hover:hover {
    color: #a0a0a0;
}

.team-name {
    white-space: nowrap;
}

.table-margin {
    margin-right: 1rem;
}

.unsolved {
    opacity: 0.2;
}

.pagination {
    margin-bottom: 1rem;

    .button {
        margin: 0 0.2rem;
    }
    span {
        margin: 0 0.2rem;
    }
    input {
        width: 3rem;
        margin: 1rem 0.5rem;
    }
}

.current {
    background-color: #ed8a53;
    cursor: default;
}

#width-test {
    position: absolute;
    visibility: hidden;
    height: auto;
    width: auto;
}
</style>
