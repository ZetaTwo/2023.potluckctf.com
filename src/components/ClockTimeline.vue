<template>
  <div v-if="$store.state.start_time !== null && $store.state.end_time !== null">
    <h4 v-if="message !== ''">
      {{ message }}
    </h4>
    <div v-if="!ended" class="countdown-box">
      <div class="countdown">
        <div class="digits">
          {{ daysLeft }}
        </div>
        <div class="digits">
          {{ hoursLeft }}
        </div>
        <div class="digits">
          {{ minutesLeft }}
        </div>
        <div class="digits">
          {{ secondsLeft }}
        </div>
        <label>Days</label>
        <label>Hours</label>
        <label>Minutes</label>
        <label>Seconds</label>
      </div>
    </div>
    <div v-if="running" class="progress">
      <div
        class="progress-bar"
        :style="{width: progress.toString() + '%'}"
      />
    </div>
    <div class="date-box" :style="{justifyContent: running ? 'space-between' : 'center'}">
      <div>{{ dateToISO($store.state.start_time) }}</div>
      <div v-if="!running">
        -
      </div>
      <div>{{ dateToISO($store.state.end_time) }}</div>
    </div>
  </div>
</template>

<script>
import { dateToISO } from '@/utilityFunctions.js'

export default {
    data () {
        return {
            daysLeft: 0,
            hoursLeft: 0,
            minutesLeft: 0,
            secondsLeft: 0,
            progress: 0,
            message: '',
            running: false,
            ended: false,
        }
    },
    mounted () {
        this.timerCount()
        this.interval = setInterval(() => { this.timerCount() }, 1000)
    },
    methods: {
        timerCount () {
            const startTime = this.$store.state.start_time
            const endTime = this.$store.state.end_time
            if (startTime === null || endTime === null) {
                return
            }

            const now = Date.now()
            this.running = startTime <= now && now <= endTime
            this.ended = now > endTime

            this.progress = Math.min(100, 100 * (now - startTime) / (endTime - startTime))

            let diffSeconds = (endTime - now) / 1000
            this.message = 'Time left:'
            if (now < startTime) {
                diffSeconds = (startTime - now) / 1000
                this.message = 'Time until start:'
            } else if (now > endTime) {
                this.message = 'The CTF is over!'
            } else if (this.progress >= 90) {
                this.message = 'The end is near...'
            }

            this.daysLeft = Math.max(0, Math.floor(diffSeconds / (60 * 60 * 24)))
            this.hoursLeft = Math.max(0, Math.floor((diffSeconds / (60 * 60)) % 24))
            this.minutesLeft = Math.max(0, Math.floor((diffSeconds / 60) % 60))
            this.secondsLeft = Math.max(0, Math.floor(diffSeconds % 60))
        },
        dateToISO,
    },
}
</script>

<style lang="scss" scoped>
h4 {
    text-align: center;
    padding-top: 1rem;
}
.countdown-box {
    display: flex;
    justify-content: center;
}
.countdown {
  display: grid;
  grid-template-columns: auto auto auto auto;
  text-align: center;
  .digits {
      font-weight: bolder;
      font-size: 40px;
      min-width: 5rem;
  }
  label {
      color: #000a;
  }
}
.progress {
    flex: 1 0 auto;
    height: 1rem;
    background-color: #002c36;
    border-radius: 25px;
    margin-top: 1rem;
}
.progress-bar {
    background-color: #ffe1a1;
    height: 100%;
    border-radius: inherit;
}
.date-box {
    display: flex;
    padding-top: 0.5rem;
    > div {
        margin: 0 5px 0 5px;
    }
}
</style>
