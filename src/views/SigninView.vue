<template>
  <h1>Sign in</h1>
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
</template>

<script>
import OauthButton from '@/components/OauthButton.vue'

export default {
    components: {
        OauthButton,
    },
    mounted () {
        if (this.$store.state.user) {
            this.$router.replace({ name: 'profile' })
        }
    },
}
</script>

<style scoped>
h1 {
  text-align: center;
}

.sso-area {
  text-align: center;
}

.sso-container {
  display: inline-block;
}
</style>
