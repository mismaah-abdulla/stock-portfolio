<template>
  <v-app>
    <Drawer></Drawer>
    <v-content>
      <router-view :key="$route.fullPath"/>
    </v-content>
  </v-app>
</template>
<script>
import Drawer from './components/Drawer'
export default {
  name: 'App',
  components: {
    Drawer
  }
}
</script>