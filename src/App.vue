<template>
  <v-app>
    <Drawer></Drawer>
    <v-content>
      <router-view/>
    </v-content>
    <Footer></Footer>
  </v-app>
</template>
<script>
import Footer from './components/Footer'
import Drawer from './components/Drawer'
export default {
  name: 'App',
  components: {
    Footer,
    Drawer
  }
}
</script>