import { createRouter, createWebHashHistory } from 'vue-router'
import homeview from '@/views/HomeView.vue'
import challengesview from '@/views/ChallengesView.vue'
import teamsview from '@/views/TeamsView.vue'
import scoreboardview from '@/views/ScoreboardView.vue'
import signinview from '@/views/SigninView.vue'
import registerview from '@/views/RegisterView.vue'
import profileview from '@/views/ProfileView.vue'
import announcementsview from '@/views/AnnouncementsView.vue'
import notfoundview from '@/views/NotFoundView.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: homeview,
        publicName: 'Home',
    },
    {
        path: '/challenges',
        name: 'challenges',
        component: challengesview,
        publicName: 'Challenges',
    },
    {
        path: '/challenges/:id',
        name: 'challenge',
        component: challengesview,
    },
    {
        path: '/scoreboard',
        name: 'scoreboard',
        component: scoreboardview,
        publicName: 'Scoreboard',
    },
    {
        path: '/teams/:id',
        name: 'team',
        component: teamsview,
    },
    {
        path: '/signin',
        name: 'signin',
        component: signinview,
    },
    {
        path: '/register',
        name: 'register',
        component: registerview,
    },
    {
        path: '/profile',
        name: 'profile',
        component: profileview,
    },
    {
        path: '/announcements',
        name: 'announcements',
        component: announcementsview,
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'notfound',
        component: notfoundview,
    },
    {
        path: '/admin',
        name: 'admin',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "adminview" */ '@/views/AdminView.vue'),
    },
]

const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes,
})

export default router
