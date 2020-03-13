<template>
  <div>
    <v-row v-if="!loaded" class="pt-5" justify="center">
      <v-progress-circular
        :size="50"
        :width="5"
        color="grey"
        indeterminate
      ></v-progress-circular>
    </v-row>
    <v-row v-else>
      <v-spacer></v-spacer>
      <v-col>
        <v-list>
          <v-list-item>
            <v-list-item-avatar v-if="details.LogoURL">
              <v-img :src="logoURL"></v-img>
            </v-list-item-avatar>
            <v-list-item-content class="py-0">
              <v-list-item-title class="title" v-text="details.Code"></v-list-item-title>
              
              <v-list-item-subtitle v-if="details.Exchange" >Exchange: {{ details.Exchange }}</v-list-item-subtitle>
              <v-list-item-subtitle v-else >Exchange: n/a </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
      <v-col>
        <v-list>
          <v-list-item>
            <v-list-item-content class="py-0">
              <v-list-item-title class="title" v-text="details.Name"></v-list-item-title>
              <v-list-item-subtitle v-if="details.Sector"> Sector: {{ details.Sector }} </v-list-item-subtitle>
              <v-list-item-subtitle v-else> Sector: n/a </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>
      <v-spacer></v-spacer> 
    </v-row>
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
        .then(response => {
          if (response.status == 204) throw new Error(response.status)
          else return response.json()
        })
        .then(data =>{
          this.details = data
          if(this.details.LogoURL) this.logoURL =`https://eodhistoricaldata.com/${this.details.LogoURL}`
          this.loaded = true
        })
        .catch(e => {
          console.log("Response status: "+e)
          this.details = {
            Code: this.$props.stock.Code,
            Name: this.$props.stock.Name
          }
          this.logoURL = null
          this.loaded = true
        })
      }catch(error){
        console.log(error)
      }
    }
  },
  mounted () {
    this.fetchDetails()
  }
}
</script>