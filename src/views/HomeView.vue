<template>
  <div class="logo-container">
    <div class="logo">
      <img src="@/assets/logo.png" alt="">
      <h1>37C3 Potluck CTF</h1>
    </div>
  </div>
  <ClockTimeline />
  <div class="button-container">
    <router-link
      v-if="!$store.state.archived"
      :to="{ name: 'signin' }"
    >
      <button class="button">
        Register!
      </button>
    </router-link>
  </div>
  <div class="content">
    <div>
      <h3>Description</h3>
      <p>
        I am proud to invite you to the first Potluck CTF event. This is a Jeopardy style competition where the participating teams also bring the challenges. Scores are obtained both by solving challenges from the other teams as well as from the challenge(s) your team has submitted.
      </p>
      <p>
        The event will take place during 37C3 in Hamburg but is run online and open for everyone to participate.
      </p>
      <p>
        Read more about the event, detailed rules and prizes on <a href="https://potluckctf.com">the event website</a>.
      </p>
      <h3>Prizes</h3>
      <ul>
        <li>1st: Trophy + Three Binary Ninja personal licenses</li>
        <li>2nd: Trophy + One Binary Ninja personal license</li>
        <li>3rd: Trophy + One Binary Ninja personal license</li>
      </ul>
      <h3>Discord</h3>
      <p>
        We have a <a href="https://discord.gg/sAxTsvgReQ">Discord server for the event</a> where you can ask questions if there are problems or chat with other particiants. Note, you are not allowed to ask for hints for any challenge.
      </p>
    </div>
    <div>
      <h3>Rules</h3>
      <p>The rules for this CTF are slightly different to normal CTFs. Below are the most important ones. Read the <a href="https://potluckctf.com/#rules">full rules</a> on the Potluck CTF website</p>
      <ul>
        <li>There are two competition classes: potluck and open</li>
        <li>The competition uses dynamic scoring for all challenges</li>
        <li>The flag format is “potluck{}” unless otherwise stated in the challenge description</li>
        <li>The competition lasts for 24 hours from 2023-12-28 18:00 to 2023-12-29 18:00 (UTC)</li>
        <li>Attacks against the scoreboard or other infrastructure is forbidden</li>
        <li>Sharing flags or solutions between teams is forbidden</li>
        <li>Official announcements during the competition will be posted on the scoreboard and on the competition Discord server</li>
        <li>Any questions during the competition can be made through the ticket system on the competition Discord server</li>
      </ul>
    </div>
  </div>
  <h3>Sponsors</h3>
  <div class="sponsorcontainer">
    <div style="text-align: center;">
      <a href="https://www.google.com">
        <img
          class="sponsor"
          src="@/assets/sponsors/google.svg"
          alt="Google"
        >
      </a>
      <p style="text-align: center">
        Infra sponsored by <a href="https://goo.gle/ctfsponsorship">goo.gle/ctfsponsorship</a>
      </p>
    </div>
    <a href="https://binary.ninja">
      <img
        class="sponsor"
        src="@/assets/sponsors/binaryninja.png"
        alt="Binary Ninja"
      >
    </a>
  </div>
</template>

<script>
import ClockTimeline from '@/components/ClockTimeline.vue'

export default {
    name: 'HomeView',
    components: {
        ClockTimeline,
    },
}
</script>

<style lang="scss" scoped>
.logo-container {
  display: flex;
  .logo {
    margin-left: auto;
    margin-right: auto;
    position: relative;
    text-align: center;
    max-width: 50rem;

    img {
      max-width: 50rem;
    }

    /*span {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 2rem;
      // background-color: rgba(0, 44, 54, 0.4);
      padding: 0 1rem;
      word-wrap: normal;
    }*/
  }
}

h1,
h3 {
  text-align: center;
}

p {
  padding: 0 10px 0 10px;
}

.button-container {
  margin-top: 2rem;
  text-align: center;
}

.button {
  padding: 0.6rem 1rem;
  font-size: 2rem;
  color: #fff4c7;
}

.content {
  display: grid;
  grid-template-columns: 50% 50%;
  padding-top: 3rem;
}

.centeredcontent {
  width: 50%;
  margin: 0 auto;
}

.mainsponsorcontainer {
  text-align: center;
}

.mainsponsor {
  max-width: 100%;
  max-height: 250px;
  padding-bottom: 1rem;
}

.sponsorcontainer {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.sponsor {
  max-width: 90%;
  max-height: 100px;
  margin: 1rem 1rem;
}

@media only screen and (max-width: 990px) {
  .content {
    display: block;
  }

  .centeredcontent {
    width: auto;
  }
}
</style>
