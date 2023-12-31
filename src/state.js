import { createStore } from 'vuex'

export default createStore({
    state () {
        return {
            modals: {
                challengeModal: {
                    visible: false,
                    challenge: {},
                },
            },
            oauthProviders: [],
            forms: [],
            start_time: null,
            end_time: null,
            websockets: false,
            connected: null,
            categories: [],
            challenges: {},
            user: null,
            team: null,
            toastIdCounter: 0,
            toasts: {},
            teams: {},
            scoreboard: [],
            scoreboardLoading: false,
            scoreboardLoaded: false,
            scoreboardFrozen: false,
            scoreboardFreezeTime: null,
            announcements: {},
            announcementReadTime: new Date(),
            watsupReturned: false,
            archived: false,
            dynamicScoringJS: '',
            dynamicScoringArray: [],
        }
    },
    mutations: {
        showModal (state, modalId) {
            state.modals[modalId].visible = true
        },
        hideModal (state, modalId) {
            state.modals[modalId].visible = false
        },
        setModalChallenge (state, challenge) {
            state.modals.challengeModal.challenge = challenge
        },
        processChallenge (state, challenge) {
            if (!(challenge.id in state.challenges)) {
                state.challenges[challenge.id] = challenge
                state.challenges[challenge.id].unlocks = null

                if (challenge.unlocked_by !== null && challenge.unlocked_by in state.challenges) {
                    state.challenges[challenge.unlocked_by].unlocks = challenge.id
                }

                // FIXME bad code since it makes processChallenge run in O(n) (loading all challenges is O(n^2/2)), but n is usually low enough that it shouldn't be an issue for the time being. nevertheless, this needs fixing at some point
                for (var challengeId in state.challenges) {
                    if (state.challenges[challengeId].unlocked_by === challenge.id) {
                        state.challenges[challenge.id].unlocks = challengeId
                    }
                }
            } else {
                Object.assign(state.challenges[challenge.id], challenge)
            }
        },
        rebuildCategories (state) {
            const categories = {}
            for (const i in state.challenges) {
                const category = state.challenges[i].categories[0]
                if (!(category in categories)) {
                    categories[category] = Infinity
                }

                categories[category] = Math.min(categories[category], state.challenges[i].order)
            }

            state.categories = Object.keys(categories).sort((a, b) => categories[a] - categories[b])
        },
        processConfig (state, config) {
            if (!config) return
            state.start_time = new Date(config.start_time * 1000)
            state.end_time = new Date(config.end_time * 1000)
            state.oauthProviders = config.oauth
            state.forms = config.forms
            state.archived = config.archived
            state.websockets = config.websockets
            state.dynamicScoringJS = config.dynamic_scoring_js
            state.dynamicScoringArray = config.dynamic_scoring_array

            // force websockets off if archived
            if (config.archived) {
                state.websockets = false
            }
        },
        updateUser (state, user) {
            state.user = user
        },
        updateUserTeam (state, team) {
            if (team === null) {
                state.team = null
                return
            }
            if (state.team === null) state.team = {}
            Object.assign(state.team, team)
            if (state.forms.edit_team && team) {
                for (const field in state.forms.edit_team.fields) {
                    if (state.forms.edit_team.fields[field].name === 'affiliation') {
                        state.forms.edit_team.fields[field].initial = team.affiliation
                    }
                    if (state.forms.edit_team.fields[field].name === 'website') {
                        state.forms.edit_team.fields[field].initial = team.website
                    }
                }
            }
        },
        createToast (state, toast) {
            const id = state.toastIdCounter++

            if (!toast.time) toast.time = 5000

            switch (toast.type) {
            case 'error':
                toast.style = {
                    'background-color': '#c95f5f',
                }
                break
            case 'success':
                toast.style = {
                    'background-color': '#6cc957',
                }
                break
            }

            state.toasts[id] = {
                ...toast,
                id: id,
                fadeout: false,
            }

            setTimeout(() => {
                this.commit('hideToast', id)
            }, toast.time)
        },
        hideToast (state, id) {
            state.toasts[id].fadeout = true
        },
        deleteToast (state, id) {
            delete state.toasts[id]
        },
        logout (state) {
            // TODO remove private team data like unlocked challenges
            // TODO sign out of websocket somehow
            state.user = null
            state.team = null
        },
        setScoreboardLoading (state, bool) {
            state.scoreboardLoading = bool
        },
        setScoreboardLoaded (state, bool) {
            state.scoreboardLoaded = bool
        },
        insertScoreboard (state, scoreboard) {
            for (const index in scoreboard) {
                state.teams[scoreboard[index].id] = scoreboard[index]
                state.scoreboard[index] = scoreboard[index].id
            }
        },
        sortScoreboard (state) {
            state.scoreboard.sort((a, b) => {
                const teama = state.teams[a]
                const teamb = state.teams[b]
                if (teama.score !== teamb.score) {
                    return teamb.score - teama.score
                }
                if (teama.tiebreaker !== teamb.tiebreaker) {
                    return teama.tiebreaker - teamb.tiebreaker
                }
                return teama.id - teamb.id
            })
        },
        freezeScoreboard (state, time) {
            state.scoreboardFrozen = true
            state.scoreboardFreezeTime = new Date(time * 1000)
        },
        unfreezeScoreboard (state) {
            state.scoreboardFrozen = false
            state.scoreboardFreezeTime = null
        },
        processAnnouncement (state, announcement) {
            state.announcements[announcement.id] = announcement
            state.announcements[announcement.id].time = new Date(announcement.time * 1000)
        },
        readAnnouncements (state) {
            const time = Date.now()
            window.localStorage.setItem('announcementReadTime', time)
            state.announcementReadTime = new Date(time)
        },
        setAnnouncementReadTime (state, time) {
            state.announcementReadTime = time
        },
        setConnected (state, connected) {
            state.connected = connected
        },
        updateTeam (state, team) {
            if (!state.scoreboard.includes(team.id)) {
                state.scoreboard.push(team.id)
            }
            if (state.team && team.id === state.team.id) {
                // FIXME copy pasted from updateUserTeam, should probably move this into a separate function
                Object.assign(state.team, team)
                if (state.forms.edit_team && team) {
                    for (const field in state.forms.edit_team.fields) {
                        if (state.forms.edit_team.fields[field].name === 'affiliation') {
                            state.forms.edit_team.fields[field].initial = team.affiliation
                        }
                        if (state.forms.edit_team.fields[field].name === 'website') {
                            state.forms.edit_team.fields[field].initial = team.website
                        }
                    }
                }
            }
            state.teams[team.id] = team
        },
        watsupReturned (state) {
            state.watsupReturned = true
        },
        processDynamicSolve (state, payload) {
            console.log(payload)
            const oldSolvedTeams = Object.values(state.teams).filter((t) => { return Object.keys(t.solves).includes(payload.challenge.id.toString()) && t.id !== payload.team.id })
            const oldSolves = oldSolvedTeams.length
            oldSolvedTeams.forEach(t => {
                state.teams[t.id].score += -state.dynamicScoringArray[Math.min(oldSolves, state.dynamicScoringArray.length - 1)] + state.dynamicScoringArray[Math.min(oldSolves + 1, state.dynamicScoringArray.length - 1)]
            })
            state.teams[payload.team.id].score += state.dynamicScoringArray[Math.min(oldSolves + 1, state.dynamicScoringArray.length - 1)]
        },
    },
    getters: {
        orderedAnnouncements (state) {
            return Object.values(state.announcements).sort((a, b) => { return b.time - a.time })
        },
        challScore (state) {
            return (id) => {
                if (state.challenges[id].score === null) {
                    return state.dynamicScoringArray[Math.min(state.challenges[id].solves, state.dynamicScoringArray.length - 1)]
                }
                return state.challenges[id].score
            }
        },
    },
})
