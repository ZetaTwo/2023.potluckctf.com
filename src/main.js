import { createApp } from 'vue'
import router from '@/router.js'
import App from '@/App.vue'
import networking from '@/networking.js'
import store from '@/state.js'

createApp(App).use(store).use(router).mount('#app')

networking.init()

// init announcement lastread
const lastRead = window.localStorage.getItem('announcementReadTime')
if (lastRead === null) {
    window.localStorage.setItem('announcementReadTime', Date.now())
    store.commit('readAnnouncements')
} else {
    store.commit('setAnnouncementReadTime', lastRead)
}
