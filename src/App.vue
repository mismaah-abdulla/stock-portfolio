<template>
  <v-app>
    <Login @loggedIn="loggedIn = true" v-if="!loggedIn"/>
    <Drawer v-if="(this.$route.name != 'Register') && (this.$route.name != 'Login')" :drawer="drawer"></Drawer>
    <v-content v-if="loggedIn">
      <router-view :key="$route.fullPath" @drawer="drawer = !drawer"/>
    </v-content>
  </v-app>
</template>
<script>
import Drawer from './components/Drawer'
import Login from './views/Login'
export default {
  name: 'App',
  components: {
    Drawer,
    Login
  },
  data: () => ({
    loggedIn: false,
    drawer: null
  })
}
</script>