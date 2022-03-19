<template>
  <!--<Tutorial />-->
  <div>
    <div v-if="isSignedIn">
      <button type="button" @click="logout()">Logout</button>
      Hello {{ userName }}. You can use this video list search by channel id or name.
      <div>
        <input v-model="searchQuery" placeholder="channel id or name">
        <button type="button" @click="channelSearch()">Channel Search</button>
      </div>
      <p>Search keyword is: {{ searchQuery }}</p>
      <p>{{ concatChannelResult }}</p>
      <div>
        Result channelId paste here => <input v-model="searchVideoChannel" placeholder="channel id">
        <button type="button" @click="videoSearch()">Video Search</button>
      </div>
      <p>Listup video by channel: {{ searchVideoChannel }}</p>
      <p>{{ videoList }}</p>
    </div>
    <button
      v-if="!isSignedIn"
      type="button"
      :disabled="isSignedIn === null"
      @click="login()"
    >
      Login
    </button>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  data() {
    return {
      signedIn: null, // (1) Track authenticated state
      searchQuery: null,
      resultSearchChannelName: null,
      resultSearchChannelId: null,
      searchVideoChannel: null,
      resultSearchVideoList: null,
    }
  },
  computed: {
    userName() {
      // (4) Display authenticated user name
      const user = this.$gapi.getUserData()
      if (user) {
        return user.firstName
      }
      return 'Nobody'
    },
    isSignedIn() {
      return this.signedIn
    },
    concatChannelResult() {
      return JSON.stringify(this.resultSearchChannelName) + JSON.stringify(this.resultSearchChannelId)
    },
    videoList() {
      if (!this.searchVideoChannel && !this.resultSearchVideoList) {
        return "waiting...";
      }
      return JSON.stringify(this.resultSearchVideoList)
    },
  },
  created() {
    // (2) Subscribe to authentication status changes
    this.$gapi.listenUserSignIn((isSignedIn) => {
      this.signedIn = isSignedIn
    })

    this.$gapi.getGapiClient().then((gapi) => {
        gapi.client.load('youtube', 'v3')
    })
  },
  methods: {
    // (3) Expose $gapi methods
    login() {
      this.$gapi.listenUserSignIn((isSignedIn) => {
        this.signedIn = isSignedIn
      })
      this.$gapi.login()
    },
    logout() {
      this.$gapi.logout()
      // revoke all scope
      this.$gapi.getAuthInstance().then((auth) => {
        auth.disconnect()
      })
      this.signedIn = false
    },
    channelSearch() {
      this.$gapi.getGapiClient().then((gapi) => {
        const requestQ = gapi.client.youtube.search.list({
          q: this.searchQuery,
          part: 'snippet',
          maxResults: 50,
          type: 'channel',
        })
        requestQ.then((response) => {
          console.log(response);
          this.resultSearchChannelName = response.result
        }, (err) => {
          console.log(err);
          this.resultSearchChannelName = null
          // test code
          this.$gapi.grant()
        })
        const requestChId = gapi.client.youtube.search.list({
          channelId: this.searchQuery,
          part: 'snippet',
          maxResults: 50,
          type: 'channel',
        })
        requestChId.then((response) => {
          console.log(response);
          this.resultSearchChannelId = response.result
        }, (err) => {
          console.log(err);
          this.resultSearchChannelId = null
        })
      })
    },
    videoSearch() {
      this.$gapi.getGapiClient().then((gapi) => {
        const requestVideo = gapi.client.youtube.search.list({
          channelId: this.searchVideoChannel,
          part: 'snippet',
          maxResults: 50,
          type: 'video',
        })
        requestVideo.then((response) => {
          console.log(response);
          this.resultSearchVideoList = response.result
        }, (err) => {
          console.log(err);
          this.resultSearchVideoList = null
        })
      })
    }
  }
}
</script>
