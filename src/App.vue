<template>
  <v-app>
    <Drawer v-if="(this.$route.name != 'Register') && (this.$route.name != 'Login')" :drawer="drawer"></Drawer>
    <v-content>
      <router-view :key="$route.fullPath" @drawer="drawer = !drawer"/>
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
    drawer: null
  })
}
</script>