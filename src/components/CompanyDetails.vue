<template>
  <div v-if="details">{{ details.Name }}</div>
</template>

<script>
export default {
  data () {
    return {
      loaded: false,
      details: null
    }
  },
  props: {
    stock: Object
  },
  methods: {
    fetchDetails () {
      this.loaded = false
      let hostname = window.location.hostname
      let detailsAPI = `http://${hostname}/backend/fundamentals/general/${this.$props.stock.Code}.${this.$props.stock.Exchange}`
      try{
        fetch(detailsAPI)
        .then(response => response.json())
        .then(data =>{
          this.details = data
          this.loaded = true
        })
      }catch(e){
        console.log(e)
      }
    }
  },
  mounted () {
    this.fetchDetails()
  }
}
</script>