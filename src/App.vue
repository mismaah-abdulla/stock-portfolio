<template>
  <v-app>
    <Drawer></Drawer>
    <router-view/>
    <Footer></Footer>
  </v-app>
</template>
<script>
import Footer from './components/Footer'
import Drawer from './components/Drawer'
export default {
  name: 'App',
}
</script>