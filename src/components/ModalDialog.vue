<template>
  <div
    v-if="$store.state.modals[id].visible"
    class="modal"
  >
    <div
      class="modal-mask"
      @click="$emit('modal-close')"
    />
    <div class="modal-content-wrapper">
      <div
        :id="id"
        class="modal-contents"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
    props: ['id'],
    emits: ['modal-close'],
}
</script>

<style lang="scss" scoped>
.modal-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #0008;
    z-index: 100;
}
.modal-content-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 200;
    display: flex;
    pointer-events: none;
    padding: 1rem;
}
.modal-contents {
    background-color: #fff4c7;
    margin: auto;
    z-index: 1000;
    padding: 1rem;
    border-radius: $standard-border-radius;
    pointer-events: auto;
    color: #000;
}

#challengeModal {
    width: 100%;
    max-width: 1110px;
    min-height: 70%;
    max-height: 100%;
    height: 100%;
}
</style>
