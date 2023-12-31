<template>
  <div class="ourcontainer alertcontainer">
    <div class="alert" :class="{error: type==='error', message: type==='message'}">
      <p>{{ content }}</p>
    </div>
  </div>
</template>

<script>
export default {
    props: ['content', 'type'],
}
</script>

<style lang="scss" scoped>
.alert {
    border-radius: $standard-border-radius;
    max-width: 50%;
    text-align: center;
    // border: 1px, solid, rgb(255, 125, 125);
}

.error {
    color:  #ffffff;
    background-color: #c76161;
}

.message {
    color:  #ffffff;
    background-color: #61aac7;
}

p {
    margin: 1rem 1rem;
    word-wrap: break-word;
}

.alertcontainer {
    display: flex;
    justify-content: center;
}
</style>
