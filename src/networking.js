import store from '@/state.js'
import router from '@/router.js'

const md5 = require('md5')
let cooldown = 5000
let ws
const currentConfigVersion = '1'

// disables the "websocket disconnected" toast caused by the websocket closing before the page unloads when refreshing or clicking a link
window.onbeforeunload = function () {
    ws.onclose = function () {}
    ws.close()
}

async function request (method, path, data) {
    const request = {
        method,
        credentials: 'same-origin',
    }

    if (method === 'POST' || method === 'PATCH') {
        const headers = { 'Content-Type': 'application/json' }
        const name = 'csrftoken='
        const decodedCookie = decodeURIComponent(document.cookie)
        const ca = decodedCookie.split(';')
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i]
            while (c.charAt(0) === ' ') {
                c = c.substring(1)
            }
            if (c.indexOf(name) === 0) {
                headers['X-CSRFToken'] = c.substring(name.length, c.length)
            }
        }

        request.body = JSON.stringify(data)
        request.headers = headers
    }

    const r = await fetch(path, request)

    return r
}

async function updateConfig () {
    const r = (await request('GET', '/api/config'))

    const data = await r.text()
    const parsed = JSON.parse(data)

    // if websocket was not enabled but its supposed to be, init websocket
    // TODO disconnect websocket in the opposite case
    let config = null
    try {
        config = JSON.parse(localStorage.getItem('config'))
    } catch {}
    if ((!config || !config.websocket) && parsed.websocket) {
        await initWebsocket()
    }

    localStorage.setItem('config', data)
    localStorage.setItem('configVersion', currentConfigVersion)
    store.commit('processConfig', parsed)

    return parsed
}

async function watsup () {
    const r = await request('GET', '/api/watsup')
    let data = {}
    try {
        data = await r.json()
    } catch {}

    if (r.status === 200) {
        // process data
        data.challenges.forEach(c => {
            store.commit('processChallenge', c)
        })
        store.commit('rebuildCategories')
        data.announcements.forEach(a => {
            store.commit('processAnnouncement', a)
        })
        store.commit('updateUser', data.user)
        store.commit('updateUserTeam', data.team)
        if (data.scoreboard_frozen) {
            store.commit('freezeScoreboard', data.scoreboard_freeze_time)
        }
        store.commit('watsupReturned')

        // update config if outdated
        const configstr = localStorage.getItem('config')
        if (md5(configstr) !== data.config_hash) {
            await updateConfig()
        }
    } else {
        if (store.config.websockets) {
            ws.close() // very hacky solution, kills the websocket when watsup fails so websocket reconnects and redoes watsup, putting a bit of unnecesary strain on the backend. go ahead an implement something better if you want, i couldn't be bothered
        } else {
            store.commit('createToast', {
                type: 'error',
                title: `Backend could not be reached: ${r.status}`,
                body: 'The page may contain outdated information and some content may not load. Reload the page to try again.',
                time: 100000000000,
            })
        }
    }
}

async function handleMessage (event) {
    const message = JSON.parse(event.data)
    switch (message.type) {
    case 'flag':
        // update challenge
        // update dynamic scores
        // update team
        // sort scoreboard

        store.commit('processChallenge', message.challenge)
        // dynamic scoring needs to be processed before updating the team to not mess up the solving teams score
        if (message.challenge.score === null && store.state.scoreboardLoaded) {
            store.commit('processDynamicSolve', message)
            if (message.team.eligible) {
                const authorScoringArray = [0, 491, 481, 470, 458, 446, 432, 418, 403, 387, 370, 354, 337, 320, 303, 287, 271, 255, 240, 226, 213, 200, 189, 178, 169, 160, 152, 145, 138, 133, 127, 123, 119, 115, 112, 109, 107, 105, 103, 101, 100]
                const oldPotluckSolves = Object.values(store.state.teams).filter((t) => { return Object.keys(t.solves).includes(message.challenge.id.toString()) && t.eligible }).length
                const challToTeamMapping = {
                    '3b4da23d-9396-4cbf-bea6-ccb1bb9f4ffb': 284,
                    'a5596915-06fa-440b-9e92-b49f57388226': 3,
                    '13b16fa2-7bf1-4a5a-89eb-de39e9f2e208': 142,
                    '30685573-4bc4-4f1b-9c77-62cf10d36a9f': 19,
                    'e5e51a2d-3f3d-4dc1-8462-052f51cc1bcb': 142,
                    '60d5a50f-cc50-4fb6-b655-0aef503c5e4c': 181,
                    '5cb35e8a-f51d-45fc-8d96-28327eb023f4': 32,
                    'bd60ce32-ddee-49c8-9c6b-614fac4b39fd': 119,
                    '3e102849-a63d-4b32-8955-4391e70536f5': 3,
                    '9bcbb397-d90d-4604-97e2-51f1531d933c': 81,
                    'cc6f0250-c368-4216-ad2e-6ef2bc610227': 85,
                    '678a6e02-8148-4b86-8589-e90c5d2056f7': 241,
                    'b178d797-6ab5-44d6-b7c6-e71c030224e9': 284,
                    '061b78c9-f533-46d0-b98c-3864d2599d11': 104,
                    '4ec37fc7-5b4b-47a2-a402-c45e93b89fc5': 156,
                    'a3825a06-39b2-4fb3-a09a-c665834ee93a': 139,
                    '39f21525-ea8e-44aa-ad3d-1dff28f4abaa': 6,
                    'e075708d-7e0b-4971-a31f-ee09213c9774': 2,
                    '5a9192de-a1e8-4230-b690-55a1489cac18': 142,
                    'e6b01e6a-e6b1-4f18-9a0f-4ed1fe0124aa': 140,
                    '88aaf274-b2e7-42cb-a042-d5831ccee6a4': 0,
                    '61e2f7fb-013d-4c73-9bb2-2671e551c085': 1,
                    '8a57d58f-546f-4c62-8488-41153944260b': 128,
                    '7cf2ba10-4291-4831-873b-a70f3a2d7312': 0,
                    '1a0fd2a5-7954-4d5d-8ec7-66dab1f64ef6': 309,
                    'ba85abb9-1889-47dd-9221-7e339eec3e08': 288,
                    '5c64d69b-40f7-40cb-90e3-c3049d7ca6ff': 0,
                    '45659934-2b80-4945-8604-d021c147f0d7': 138,
                    '58d9e684-266e-4fbd-8dcb-24575b205f0b': 138,
                }
                const teamId = challToTeamMapping[message.challenge.challenge_id]
                if (teamId) {
                    const author = store.state.teams[teamId]
                    author.score += -authorScoringArray[oldPotluckSolves] + authorScoringArray[oldPotluckSolves + 1]
                    console.log(authorScoringArray)
                    console.log(oldPotluckSolves)
                    console.log(teamId)
                    console.log(author)
                    store.commit('updateTeam', author)
                }
            }
        }

        // if scoreboard is frozen make sure to not update the team instance on the scoreboard, updateUserTeam doesn't do that
        if (!store.state.scoreboardFrozen || (store.state.team && message.team.id !== store.state.team.id)) {
            store.commit('updateTeam', message.team)
        } else {
            store.commit('updateUserTeam', message.team)
        }

        store.commit('sortScoreboard')
        break
    case 'challenge':
        for (const i in message.challenges) {
            store.commit('processChallenge', message.challenges[i])
        }
        store.commit('rebuildCategories')
        break
    case 'rating':
        // TODO ratings
        break
    case 'announcement':
        store.commit('processAnnouncement', message.announcement)
        {
            const n = new Notification(message.announcement.title, {
                body: message.announcement.description,
                renotify: true,
            })// TODO set icon to favicon
            n.onclick = function () {
                router.replace({ name: 'announcements' })
            }
            document.addEventListener('visibilitychange', function () {
                if (document.visibilityState === 'visible') {
                    n.close()
                }
            })
        }
        break
    case 'update_team':
        store.commit('updateTeam', message.team)
        break
    case 'freeze':
        store.commit('freezeScoreboard', message.time)
        break
    case 'unfreeze':
        store.commit('unfreezeScoreboard')
        store.commit('insertScoreboard', message.scoreboard)
        break
    default:
        console.error('unknown message type recieved', message)
    }
}

async function initWebsocket () {
    const protocol = (location.protocol === 'https:') ? 'wss://' : 'ws://'
    const host = location.hostname
    const port = (location.port) ? `:${location.port}` : ''

    ws = new WebSocket(`${protocol}${host}${port}/ws/main`)

    ws.onopen = function (event) {
        if (store.state.connected === false) {
            store.commit('createToast', {
                type: 'success',
                title: 'Websocket connected',
            })
        }
        store.commit('setConnected', true)
        cooldown = 5000
        watsup()
    }
    ws.onclose = function (event) {
        store.commit('setConnected', false)
        store.commit('createToast', {
            type: 'error',
            title: 'Websocket disconnected',
            body: `Attempting to reconnect in ${cooldown / 1000}s`,
            time: cooldown,
        })
        setTimeout(initWebsocket, cooldown)
        cooldown = Math.min(60000, cooldown * 2)
    }
    ws.onmessage = handleMessage
}

async function init () {
    const configstr = localStorage.getItem('config')

    let config
    // attempt to fetch config
    try {
        config = JSON.parse(configstr)
        store.commit('processConfig', config)
    } catch { // if config is invalid json, fetch a new config
        config = await updateConfig()
    }

    const configVersion = localStorage.getItem('configVersion')
    // if a new frontend was pushed incompatible with older configs, fetch a new config
    if (configVersion !== currentConfigVersion) {
        config = await updateConfig()
    }

    if (store.state.websockets) {
        await initWebsocket()
    } else {
        await watsup()
    }
}

async function ensureScoreboard (forceUnfrozen) {
    if (store.state.scoreboardLoading) return
    store.commit('setScoreboardLoading', true)
    const r = await request('GET', forceUnfrozen ? '/api/scoreboard?force_unfrozen=1' : '/api/scoreboard')
    if (r.status === 200) {
        store.commit('insertScoreboard', await r.json())
        store.commit('setScoreboardLoaded', true)
        if (forceUnfrozen) {
            store.commit('createToast', {
                type: 'success',
                title: 'Loaded unfrozen scoreboard',
            })
        }
    } else {
        store.commit('createToast', {
            type: 'error',
            title: `Scoreboard could not be loaded: ${r.status}`,
            body: 'Reload the page to attempt to load the scoreboard again.',
            time: 20000,
        })
    }
}

async function reloadScoreboard (forceUnfrozen) {
    store.commit('setScoreboardLoading', false)
    await ensureScoreboard(forceUnfrozen)
}

export default {
    request, init, ensureScoreboard, reloadScoreboard,
}
