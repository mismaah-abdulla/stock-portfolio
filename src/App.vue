<template>
  <v-app>
    <Drawer></Drawer>
    <v-content>
      <v-container fluid>
        <Search></Search>
        
      </v-container>
    </v-content>
    <Footer></Footer>
  </v-app>
</template>

<script>
import Footer from './components/Footer'
import Drawer from './components/Drawer'
import Search from './components/Search'

export default {
  name: 'App',
  components: {
    Footer,
    Drawer,
    Search,
  },
}
</script>
