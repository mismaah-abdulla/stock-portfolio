<template>
  <div>
    <v-row v-if="!loaded" class="pt-5 pl-5">
      <v-progress-circular
        :size="50"
        :width="5"
        color="grey"
        indeterminate
      ></v-progress-circular>
    </v-row>
    <v-row v-else class="pt-0 mt-0">
      <v-col cols="12" class="pt-0 mt-0">
        <v-list class="py-0 my-0">
          <v-list-item class="py-0 my-0">
            <v-list-item-avatar v-if="details.LogoURL">
              <v-img :src="logoURL" contain></v-img>
            </v-list-item-avatar>
            <v-list-item-avatar v-else color="teal">
              <span class="white--text title">{{getInitials(details.Name)}}</span>
            </v-list-item-avatar>
            <v-list-item-content class="py-0">
              <v-list-item-title>
                <span class="title">{{details.Code}} </span><span>  {{details.Name}}</span>
              </v-list-item-title>
              <v-list-item-subtitle><span v-if="details.Country">{{details.Country}}</span><span v-if="details.Sector && details.Country"> | </span><span v-if="details.Sector">{{details.Sector}}</span></v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn color="primary" small rounded icon v-on="on"><v-icon>visibility</v-icon></v-btn>
                </template>
                <span>Add to watchlist</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn color="primary" small rounded icon v-on="on"><v-icon>sync_alt</v-icon></v-btn>
                </template>
                <span>Trade</span>
              </v-tooltip>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-list-item-subtitle>
                <span class="font-weight-light pl-3">Return</span><span class="font-weight-bold pr-3"> 10% </span>
                <span class="font-weight-light">Volatility</span><span class="font-weight-bold pr-3"> 30% </span>
                <span class="font-weight-light">Sharpe</span><span class="font-weight-bold"> 15.5%</span>
                <v-spacer></v-spacer>
              </v-list-item-subtitle>
      </v-col>
      
    </v-row>
    <v-divider v-if="loaded"></v-divider>
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
      let detailsAPI = `http://${hostname}:5000/general/${this.$props.stock.Code}.${this.$props.stock.Exchange}`
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
    },
    getInitials(name){
      let names = name.split(' '),
      initials = names[0].substring(0, 1).toUpperCase()
      if(names.length > 1) initials += names[1].substring(0,1).toUpperCase()
      return initials
    }
  },
  mounted () {
    this.fetchDetails()
  }
}
</script>