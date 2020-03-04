<template>
  <v-app>
    <Drawer></Drawer>

    
    <Footer></Footer>
  </v-app>
</template>

<script>
// import HelloWorld from './components/HelloWorld';
import Footer from './components/Footer'
import Drawer from './components/Drawer'

export default {
  name: 'Stock Portfolio',
  components: {
    Footer,
    Drawer
  },
  // data: () => ({
  //   drawer: null,
  // }),
  
};
</script>
