<template>
  <h1>Register</h1>
  <RemoteForm
    :form="form || $store.state.forms.register"
    @submit="register"
  />
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
            form: null,
        }
    },
    methods: {
        async register (event) {
            const r = await networking.request('POST', '/api/register', event)
            if (r.status !== 200) {
                this.$store.commit('createToast', {
                    type: 'error',
                    title: `Backend could not be reached: ${r.status}`,
                    body: 'Please try again.',
                })
                return
            }
            const data = await r.json()
            this.form = data.form
            if (data.success) {
                this.$store.commit('updateUser', data.user)
                this.$router.replace({ name: 'profile' })
                this.$store.commit('createToast', {
                    type: 'success',
                    title: 'Account successfully created!',
                })
            }
        },
    },
}
</script>

<style scoped>
</style>
