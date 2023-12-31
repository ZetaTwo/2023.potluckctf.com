<template>
  <nav>
    <input v-model="checked" type="checkbox">
    <img src="@/assets/hamburger.svg">
    <ul>
      <li
        v-for="route in mainRoutes()"
        :key="route.path"
        :to="route"
      >
        <router-link :to="route">
          <span @click="uncheck">
            {{ route.publicName }}
          </span>
        </router-link>
      </li>
      <li v-if="$store.state.user && $store.state.user.permissions.length">
        <router-link :to="{name: 'admin'}">
          <span @click="uncheck">
            Admin
          </span>
        </router-link>
      </li>
      <li v-if="$store.state.user && $store.state.user.superuser">
        <a href="/django_admin">
          <span>
            Django Admin
          </span>
        </a>
      </li>
    </ul>
    <div class="spacer" />
    <ul>
      <li v-if="$store.state.websockets && !$store.state.archived">
        <span
          class="material-icons websocket"
          :class="{disconnected: !$store.state.connected}"
          :title="$store.state.connected ? 'Websocket connected! All content on the page is up to date, no need to refresh' : 'Websocket disconnected. Attempting to reconnect periodically...'"
        >{{ $store.state.connected ? "power" : "power_off" }}</span>
      </li>
      <li>
        <router-link :to="{ name: 'announcements'}">
          <span class="material-icons" :class="{unread}">{{ unread ? "notifications_active" : "notifications_none" }}</span>
        </router-link>
      </li>
    </ul>
    <ul v-if="!$store.state.archived">
      <li>
        <router-link v-if="!$store.state.user" :to="{ name: 'signin'}">
          <span @click="uncheck">
            Sign in
          </span>
        </router-link>
        <router-link v-else :to="{ name: 'profile'}">
          <span @click="uncheck">
            {{ $store.state.user.username }}
          </span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
// TODO add a clock in the navbar like for watevrctf

export default {
    data () {
        return { checked: false }
    },
    computed: {
        unread () {
            if (!this.$store.getters.orderedAnnouncements.length) return false
            return this.$store.state.announcementReadTime < this.$store.getters.orderedAnnouncements[0].time
        },
    },
    methods: {
        mainRoutes () {
            return this.$router.options.routes.filter((r) => {
                return r.publicName
            })
        },
        uncheck () {
            this.checked = false
        },
    },
}
</script>

<style lang="scss" scoped>
.router-link-active {
    color: #ffffff;
}

.material-icons {
    color:#ffffff;
    cursor: pointer;
}

.websocket {
    cursor: default;
}

.disconnected {
    color: red;
}

.unread {
    color: red;
    animation: blink 1s linear infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

nav {
    display: flex;
    position: sticky;
    top: 0;
    z-index: 100;
    height: 3.5rem;
    align-items: center;
    background-color: #c0dead;
    > ul {
        display: flex;
        margin: 0;
        padding: 0;
        > li {
            list-style: none;
            padding: 8px 16px 8px 16px;
            .material-icons {
                vertical-align: middle;
            }
            > a {
                color: #ed8a53;
            }
            > a:hover {
                text-decoration: none;
            }
        }
    }
    > .spacer {
        flex: 1 0 auto;
    }
    > input {
        display: none;
    }
    > img {
        display: none;
    }
}

@media only screen and (max-width: 990px) {
    nav {
        flex-direction: column;
        align-items: flex-start;
        height: auto;
        > ul {
            display: none;
            flex-direction: column;
        }
        > .spacer {
            display: none;
        }
        > input {
            display: block;
            cursor: pointer;
            opacity: 0;
            z-index: 1001;
            width: 32px;
            height: 32px;
            margin: 8px 16px 8px 16px;
        }
        > img {
            display: block;
            position: absolute;
            top: 8px;
            left: 16px;
        }
        > input:checked ~ ul {
            display: flex;
        }
    }
}
</style>
