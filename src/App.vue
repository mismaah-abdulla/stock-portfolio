<template>
  <v-app>
    <Drawer></Drawer>
    <v-content>
      <v-container fluid>
        <GChart></GChart>
        
      </v-container>
    </v-content>
    <Footer></Footer>
  </v-app>
</template>

<script>
import Footer from './components/Footer'
import Drawer from './components/Drawer'
// import Chart from './components/Chart'
import GChart from './components/GChart'

export default {
  name: 'App',
  components: {
    Footer,
    Drawer,
    GChart,
  },
}
</script>
