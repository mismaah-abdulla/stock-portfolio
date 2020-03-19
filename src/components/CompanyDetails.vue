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
    <v-row v-else >
      <v-col class="flex-grow-0 flex-shrink-1 py-0">
        <v-list >
          <v-list-item>
            <v-list-item-avatar v-if="details.LogoURL">
              <v-img :src="logoURL"></v-img>
            </v-list-item-avatar>
            <v-list-item-avatar v-else color="teal">
              <span class="white--text title">{{getInitials(details.Name)}}</span>
            </v-list-item-avatar>
            <v-list-item-content class="py-0">
              <v-list-item-title>
                <span class="title">{{details.Code}} </span><span>  {{details.Name}}</span>
              </v-list-item-title>
              <v-list-item-subtitle v-if="details.Exchange" >Exchange: {{ details.Exchange }}</v-list-item-subtitle>
              <v-list-item-subtitle v-else >Exchange: n/a </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
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