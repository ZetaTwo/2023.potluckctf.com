<template>
  <div
    :style="style"
    :class="{ linked: linked }"
    @click="redirect"
  >
    <img v-if="provider.button_image" :src="provider.button_image">
    <span>{{ provider.button_text + ((linked) ? " linked" : "") }}</span>
  </div>
</template>

<script>
export default {
    props: ['provider'],
    computed: {
        style () {
            return {
                backgroundColor: (this.linked) ? '#696969' : this.provider.button_color,
                color: (this.linked) ? '#ffffff' : this.provider.button_text_color,
            }
        },
        linked () {
            if (this.$store.state.user) {
                for (const i in this.$store.state.user.oauth_providers) {
                    if (this.provider.name === this.$store.state.user.oauth_providers[i]) {
                        return true
                    }
                }
            }
            return false
        },
    },
    methods: {
        redirect () {
            if (!this.linked) {
                location.href = `/oauth_redirect?provider=${encodeURIComponent(this.provider.name)}`
            }
        },
    },
}
</script>

<style lang="scss" scoped>
div {
    padding: .7rem 1rem;
    border-radius: 0.3rem;
    margin-bottom: 1rem;
    user-select: none;
    cursor: pointer;

    .linked {
        cursor: default;
    }
}
img {
    height: 2rem;
    margin-right: 1rem;
}
</style>
