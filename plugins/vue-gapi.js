import Vue from 'vue'
import VueGapi from 'vue-gapi'

export default function ({ $config }) {
  const gapiOption = {
    clientId: $config.googleClientId,
    scope: 'https://www.googleapis.com/auth/youtube',
  }
  Vue.use(VueGapi, gapiOption)
}