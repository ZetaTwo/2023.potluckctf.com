<template>
  <template v-if="$store.state.user && $store.state.user.permissions.length">
    <h1>Admin</h1>
    <p>I hope the only thing you want to do is to post an announcement, because that's the only feature currently supported. :P</p>
    <RemoteForm
      :form="announceForm || $store.state.forms.announce"
      button-text="Announce"
      @submit="announce"
    />
  </template>
  <template v-else>
    <h1>Admin</h1>
    <h2>Nice try</h2>
  </template>
</template>

<script>
import RemoteForm from '@/components/RemoteForm.vue'
import networking from '@/networking.js'

export default {
    components: {
        RemoteForm,
    },
    data () {
        return {
            announceForm: null,
        }
    },
    methods: {
        async announce (event) {
            const r = await networking.request('POST', '/api/admin/announcement', event)
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
                this.$store.commit('processAnnouncement', data.announcement)
                this.$store.commit('createToast', {
                    type: 'success',
                    title: 'Announcement successfully sent!',
                })
            }
        },
    },
}
</script>

<style lang="scss" scoped>
</style>
