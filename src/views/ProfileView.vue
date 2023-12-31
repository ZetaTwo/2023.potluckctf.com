<template>
  <h1>Profile</h1>
  <template v-if="signedIn">
    <div class="content">
      <div>
        <h3>Team</h3>
        <template v-if="!$store.state.team">
          <h5>Create Team</h5>
          <RemoteForm
            :form="createForm || $store.state.forms.create_team"
            button-text="Create team"
            @submit="createTeam"
          />
          <h5>Join Team</h5>
          <RemoteForm
            :form="joinForm || $store.state.forms.join_team"
            button-text="Join Team"
            @submit="joinTeam"
          />
        </template>
        <template v-else>
          <h4>{{ $store.state.team.name }}</h4>
          <h5
            v-if="$store.state.team.eligible"
            class="eligible"
          >
            Potluck Class
          </h5>
          <h5
            v-else
            class="eligible"
          >
            Open Class
          </h5>
          <RemoteForm
            :form="editForm || $store.state.forms.edit_team"
            button-text="Edit team"
            @submit="editTeam"
          />
          <h5>Join token</h5>
          <div class="token-container">
            <div>Hover to show token</div>
            <code>{{ $store.state.team.join_token }}</code>
          </div>
          <p>Give this out to people who should join your team.</p>
        </template>
      </div>
      <div>
        <h3>Link account</h3>
        <div class="sso-area">
          <div class="sso-container">
            <template
              v-for="provider in $store.state.oauthProviders"
              :key="provider"
            >
              <OauthButton
                v-if="provider"
                :provider="provider"
              />
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="center">
      <button
        class="button signout-button"
        @click="signOut"
      >
        Sign Out
      </button>
    </div>
  </template>
  <div
    v-else
    class="center"
  >
    <h3>Not logged in</h3>
  </div>
</template>

<script>
import OauthButton from '@/components/OauthButton.vue'
import RemoteForm from '@/components/RemoteForm.vue'
import networking from '@/networking.js'

export default {
    components: {
        OauthButton,
        RemoteForm,
    },
    data () {
        return {
            createForm: null,
            joinForm: null,
            editForm: null,
        }
    },
    computed: {
        signedIn () {
            return !!this.$store.state.user
        },
    },
    methods: {
        async createTeam (event) {
            const r = await networking.request('POST', '/api/team', event)
            if (r.status !== 200) {
                this.$store.commit('createToast', {
                    type: 'error',
                    title: `Backend could not be reached: ${r.status}`,
                    body: 'Please try again.',
                })
                return
            }
            const data = await r.json()
            this.createForm = data.form
            if (data.success) {
                this.$store.commit('updateUserTeam', data.team)
                this.$store.commit('createToast', {
                    type: 'success',
                    title: 'Team successfully created!',
                })
            }
        },
        async joinTeam (event) {
            const r = await networking.request('POST', '/api/team/join', event)
            if (r.status !== 200) {
                this.$store.commit('createToast', {
                    type: 'error',
                    title: `Backend could not be reached: ${r.status}`,
                    body: 'Please try again.',
                })
                return
            }
            const data = await r.json()
            this.joinForm = data.form
            if (data.success) {
                this.$store.commit('updateUserTeam', data.team)
                for (const challenge in data.challenges) {
                    this.$store.commit('processChallenge', data.challenges[challenge])
                }
                this.$store.commit('createToast', {
                    type: 'success',
                    title: `Successfully joined team ${data.team.name}!`,
                })
            }
        },
        async editTeam (event) {
            const r = await networking.request('PATCH', '/api/team', event)
            if (r.status !== 200) {
                this.$store.commit('createToast', {
                    type: 'error',
                    title: `Backend could not be reached: ${r.status}`,
                    body: 'Please try again.',
                })
                return
            }
            const data = await r.json()
            this.editForm = data.form
            if (data.success) {
                this.$store.commit('updateUserTeam', data.team)
                this.$store.commit('createToast', {
                    type: 'success',
                    title: 'Team successfully updated!',
                })
            }
        },
        async signOut () {
            const r = await networking.request('POST', '/api/logout')
            if (r.status !== 200) {
                this.$store.commit('createToast', {
                    type: 'error',
                    title: `Backend could not be reached: ${r.status}`,
                    body: 'Please try again.',
                })
                return
            }
            const data = await r.json()
            if (data.success) {
                this.$store.commit('logout')
                this.$router.replace({ name: 'home' })
                this.$store.commit('createToast', {
                    type: 'success',
                    title: 'Signed out',
                })
            }
        },
    },
}
</script>

<style lang="scss" scoped>
* {
    text-align: center;
}

p {
    margin: 0;
}

.eligible {
    color: #ffffff
}

.token-container {
    position: relative;
    display: inline-block;

    div {
        position: absolute;
        left: 0;
        width: 100%;
        text-align: center;
        background-color: #000000;
        border-radius: $standard-border-radius;
    }

    &:hover {
        div {
            display: none;
        }
    }
}

.content {
    display: grid;
    grid-template-columns: 50% 50%;
    padding-top: 3rem;
}

@media only screen and (max-width: 990px) {
    .content {
        display: block;
    }
}

.sso-area {
  text-align: center;
}

.sso-container {
  display: inline-block;
}

.signout-button {
    margin-top: 1rem;
}
</style>
