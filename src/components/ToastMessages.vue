<template>
  <div class="toast-container-container">
    <div
      v-for="toast in $store.state.toasts"
      :key="toast"
      class="toast-container"
    >
      <div
        class="toast"
        :class="{fadeout: toast.fadeout}"
        :style="toast.style"
        @animationend="handleAnim($event, toast.id)"
      >
        <b>{{ toast.title }}</b>
        <p>{{ toast.body }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    methods: {
        handleAnim (event, id) {
            if (event.animationName.startsWith('fadeout')) {
                this.$store.commit('deleteToast', id)
            }
        },
    },
}
</script>

<style lang="scss" scoped>
// TODO set up some better animations than just fade in and out, for example currently the whole list jumps up when a new toast appears

.toast-container-container {
    right: 0;
    margin-right: 3rem;
    bottom: 0;
    position: fixed;
    z-index: 300;
}

.toast-container {
    text-align: right;
}

.toast {
    display: inline-block;
    margin-bottom: 2rem;
    padding: 1rem;
    text-align: center;
    border-radius: $standard-border-radius;

    b {
        font-size: 1.1em;
        white-space: pre-wrap;
    }

    p {
        margin: 0;
        text-align: left;
        white-space: pre-wrap;
    }
  animation: fadein 0.5s;
}

.toast.fadeout {
    animation: fadeout 0.5s;
}

@keyframes fadein {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes fadeout {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
}
</style>
