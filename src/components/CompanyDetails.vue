<template>
  <div>
    <v-row v-if="!loaded" class="pt-5 pl-5" justify="left">
      <v-progress-circular
        :size="50"
        :width="5"
        color="grey"
        indeterminate
      ></v-progress-circular>
    </v-row>
    <div v-if="details">
      <v-list>
        <v-list-item>
          <v-list-item-avatar v-if="details.LogoURL">
            <v-img :src="logoURL"></v-img>
          </v-list-item-avatar>
          <v-list-item-content class="py-0">
            <v-list-item-title class="title" v-text="details.Code"></v-list-item-title>
            <v-list-item-subtitle v-text="details.Name"></v-list-item-subtitle>
            <v-list-item-subtitle>Exchange: {{ details.Exchange }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loaded: false,
      details: null,
      logoURL: null
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
          if(this.details.LogoURL) this.logoURL =`https://eodhistoricaldata.com/${this.details.LogoURL}`
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