<template>
  <v-app>
    <Drawer v-if="(this.$route.name != 'Register') && (this.$route.name != 'Login') && (this.$route.name != 'Profile')" :drawer="drawer" :key="`${$route.fullPath}${updateDrawer}`" @updateDrawer="updateDrawer++"></Drawer>
    <v-content>
      <router-view :key="`${$route.fullPath}${updateDrawer}`" @drawer="drawer = !drawer" @updateDrawer="updateDrawer++"/>
    </v-content>
  </v-app>
</template>
<script>
import Drawer from './components/Drawer'

export default {
  name: 'App',
  components: {
    Drawer,
  },
  data: () => ({
    drawer: null,
    updateDrawer: 1
  })
}
</script>