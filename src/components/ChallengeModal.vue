<template>
  <ModalDialog
    id="challengeModal"
    @modal-close="closeModal()"
  >
    <div class="modal-contents">
      <h2>{{ challenge.title }}</h2>
      <span
        id="close"
        class="material-icons"
        @click="closeModal()"
      >close</span>
      <ul class="categories">
        <li
          v-for="category in challenge.categories"
          :key="category"
        >
          {{ category }}
        </li>
      </ul>
      <h5>
        <div
          class="item"
          :title="`${$store.getters.challScore(challenge.id)} points`"
        >
          <span>{{ $store.getters.challScore(challenge.id) }}</span>
          <span class="material-icons">control_point_duplicate</span>
        </div>
        <div
          class="item"
          :title="`${challenge.solves} solves`"
        >
          <span>{{ challenge.solves }}</span>
          <span class="material-icons">published_with_changes</span>
        </div>
      </h5>
      <div class="content">
        <div>
          <p v-html="challenge.description" /> <!-- eslint-disable-line vue/no-v-html -->
        </div>
        <div>
          <div
            class="align"
            title="Authors"
          >
            <span class="material-icons">group</span>
            <span class="material-icons">edit</span>
            <span
              v-for="author in challenge.authors"
              :key="author"
              class="author"
            >{{ author }}</span>
          </div>
          <template v-if="files">
            <div
              v-for="file in files"
              :key="file.url"
              class="align"
              title="File"
            >
              <span class="material-icons">folder</span>
              <a
                :href="file.url"
                target="_blank"
              >{{ file.name }}</a>
            </div>
          </template>
          <template v-if="challenge.services">
            <div
              v-for="service in challenge.services"
              :key="service.user_display"
              class="align"
              title="Service"
            >
              <span class="material-icons">router</span>
              <a
                v-if="service.hyperlink"
                :href="service.user_display"
                target="_blank"
              >{{ service.user_display }}</a>
              <code v-else>{{ service.user_display }}</code>
            </div>
          </template>
          <div
            v-if="challenge.top_solved_teams.length"
            class="first-teams"
          >
            <p>First teams:</p>
            <span
              v-for="(team, index) in challenge.top_solved_teams"
              :key="team"
              :title="teamTooltip(team)"
            ><span>{{ index+1 }}.</span> {{ team.name }}</span>
          </div>
        </div>
      </div>
      <template v-if="!$store.state.archived">
        <div
          v-if="!$store.state.user"
          class="input-replacer disabled"
        >
          <span>Log in to submit flags</span>
        </div>
        <div
          v-else-if="!$store.state.team"
          class="input-replacer disabled"
        >
          <span>Create or join a team to submit flags</span>
        </div>
        <div
          v-else-if="challenge.id in $store.state.team.solves"
          class="input-replacer solved"
        >
          <span>Solved!</span>
        </div>
        <input
          v-else
          v-model="flag"
          class="textbox"
          type="text"
          placeholder="Enter flag here..."
          @keyup.enter="submitFlag"
        >
      </template>
    </div>
  </ModalDialog>
</template>

<script>
import { mapState } from 'vuex'
import ModalDialog from '@/components/ModalDialog.vue'
import networking from '@/networking.js'
import { dateToISO } from '@/utilityFunctions.js'

export default {
    components: {
        ModalDialog,
    },
    data: function () {
        return {
            flag: '',
        }
    },
    computed: {
        files () {
            const files = []
            this.challenge.file_urls.forEach(f => {
                const parts = f.split('/')
                files.push({
                    url: f,
                    name: parts[parts.length - 1],
                })
            })
            return files
        },
        ...mapState({
            challenge: state => state.modals.challengeModal.challenge,
        }),
    },
    watch: {
        '$store.state.modals.challengeModal.visible' (current) {
            if (current) {
                this.flag = ''
            }
        },
    },
    methods: {
        async submitFlag () {
            if (!this.flag) return
            const r = await networking.request('POST', '/api/submit_flag', {
                challenge_id: this.challenge.id,
                flag: this.flag,
            })
            if (r.status !== 200) {
                this.$store.commit('createToast', {
                    type: 'error',
                    title: `Backend could not be reached: ${r.status}`,
                    body: 'Please try again.',
                })
                return
            }
            const data = await r.json()
            if (!data.success) {
                const messages = []
                for (const field in data.errors) {
                    for (const error in data.errors[field]) {
                        if (field === '__all__') {
                            messages.push(data.errors[field][error].message)
                        } else {
                            messages.push(field + ': ' + data.errors[field][error].message)
                        }
                    }
                }
                this.$store.commit('createToast', {
                    type: 'error',
                    title: messages.join('\n\n'),
                })
                return
            }
            if (!data.correct) {
                this.$store.commit('createToast', {
                    type: 'error',
                    title: 'Incorrect flag',
                })
                return
            }
            this.$store.commit('createToast', {
                type: 'success',
                title: 'Challenge solved!',
            })
            if (data.next_challenge) {
                this.$store.commit('processChallenge', data.next_challenge)
            }
            this.$store.commit('updateUserTeam', data.team)
        },
        closeModal () {
            this.$router.push({ name: 'challenges' })
        },
        teamTooltip (team) {
            return 'Solved at ' + dateToISO(new Date(team.time * 1000))
        },
    },
}
</script>

<style lang="scss" scoped>
.modal-contents {
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
}

h2 {
    margin-bottom: 0;
    font-weight: bold;
    text-align: center;
}

#close {
    position: absolute;
    right: 0;
    top: 0;
    cursor: pointer;
}

h5 {
    color: #ed8a53;
}

.material-icons {
    color:#ffaa6f;
}

.categories {
    list-style: none;
    margin: 0.2rem 0;
    padding: 0;
    display: flex;
    justify-content: center;
    font-weight: bold;

    li {
        background-color: $dark-transparent-background;
        padding: 0rem 0.2rem;
        border-radius: 0.3rem;
        font-size: 1rem;
        margin-right: 0.2rem;
    }
}

h5 {
    display: flex;
    justify-content: center;
}

.item {
    margin: 0 0.5rem;
    span {
        vertical-align: middle;
        margin-right: 0.5rem;
    }
}

.content {
    display: grid;
    grid-template-columns: 50% 50%;
    margin-top: 1rem;
    overflow: auto;
    height: 100%;
    > div {
        margin-left: 0.5rem;
        margin-right: 0.5rem;
    }
    > div:first-child {
        margin-left: 0;
    }
    > div:last-child {
        margin-right: 0;
    }
}

@media only screen and (max-width: 990px) {
    .content {
        display: block;
        > div {
            margin: 0;
        }
    }
}

p {
    margin: 0;
    margin-bottom: 1rem;
    white-space: pre-wrap;
}

.align {
    span {
        vertical-align: middle;
    }
    .material-icons {
        margin-right: 0.25rem
    }
}

.author {
    font-weight: bold;
}

.author:after {
    content: ", ";
}

.author:last-child:after {
    content: none;
}

.first-teams {
    margin-top: 1rem;

    p {
        margin: 0;
        font-weight: bold;
    }

    > span {
        display: block;

        > span {
            color: #ffaa6f;
        }
    }
}

.input-replacer {
    height: 2.5rem;
    margin-top: 1rem;
    border-radius: 0.2rem;
    border-width: 0;
    font-weight: bold;
    font-size: 1.2rem;
    position: relative;

    span {
        position: absolute;
        top: 50%;
        transform: translate(0, -50%);
        text-align: center;
        width: 100%;
    }
}

.disabled {
    background-color: #636363;
}

.solved {
    background-color: #c0dead;
}

input {
    height: 2.5rem;
    margin-top: 1rem;
    padding-left: 0.5rem;
}
</style>
