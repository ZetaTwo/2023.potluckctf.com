<template>
  <h1>Announcements</h1>
  <template
    v-for="announcement in $store.getters.orderedAnnouncements"
    :key="announcement"
  >
    <h3>{{ announcement.title }}</h3>
    <p class="description" v-html="announcement.description" /> <!-- eslint-disable-line vue/no-v-html -->
    <p class="time">
      {{ dateToISO(announcement.time) }}
    </p>
  </template>
  <p v-if="!$store.getters.orderedAnnouncements.length">
    No announcements yet
  </p>
</template>

<script>
// TODO i was lazy making this announcement view, maybe make something more interesting like the notifications popup from watevrctf
import { dateToISO } from '@/utilityFunctions.js'

export default {
    mounted () {
        this.$store.commit('readAnnouncements')
        Notification.requestPermission()
    },
    methods: {
        dateToISO,
    },
}
</script>

<style lang="scss" scoped>
h3 {
    margin-bottom: 0;
    line-height: 1;
}
p {
    margin: 0;
}

.time {
    margin-bottom: 2rem;
}

.description {
    margin-bottom: 0.2rem;
    white-space: pre-wrap;
}
</style>
