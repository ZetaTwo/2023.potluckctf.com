<template>
  <NavBar />
  <AlertMessage
    v-if="$route.query.error"
    :content="$route.query.error"
    type="error"
  />
  <div :class="{ourcontainer: $route.name !== 'scoreboard'}">
    <router-view />
  </div>
  <ChallengeModal id="challengeModal">
    test contents
  </ChallengeModal>
  <ToastMessages />
</template>

<script>
import ChallengeModal from '@/components/ChallengeModal.vue'
import NavBar from '@/components/NavBar.vue'
import AlertMessage from '@/components/AlertMessage.vue'
import ToastMessages from '@/components/ToastMessages.vue'
export default {
    components: {
        ChallengeModal,
        NavBar,
        AlertMessage,
        ToastMessages,
    },
}
</script>

<style scoped>
@import "styles/custom.scss";

.ourcontainer {
  margin: 1rem auto 0;
  max-width: 1110px;
  padding: 0 1rem;
}
</style>
