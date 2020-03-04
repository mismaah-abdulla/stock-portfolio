<template>
  <v-app>
    <Drawer></Drawer>
    <v-content>
      <v-container fluid>

      </v-container>
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
  },
  // data: () => ({
  //   drawer: null,
  // }),
}
</script>
