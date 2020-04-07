<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      app
    >
      <v-list dense>
        <v-list-item link v-for="item in drawerItems" :key="item.title" :to="item.link">
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
        app
        color=primary
        dark
      >
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
        <v-toolbar-title>{{ this.$route.name }}</v-toolbar-title>
        <v-spacer/>
        <v-autocomplete
          spellcheck="false"
          v-model="model"
          :items="items"
          :loading="isLoading"
          :search-input.sync="search"
          :filter="customFilter"
          color="white"
          hide-no-data
          hide-selected
          clearable
          placeholder="Search markets"
          prepend-icon="search"
          return-object
          dense
          v-on:input="goToMarkets()"
        >
          <template v-slot:item="{ item }">
            <v-list-item-avatar v-if="item.LogoURL">
              <v-img :src=item.LogoURL></v-img>
            </v-list-item-avatar>
            <v-list-item-avatar v-else color="teal">
              <span class="white--text title">{{getInitials(item.Name)}}</span>
            </v-list-item-avatar>
            <v-list>
                <v-list-item-title class="justify-center">{{item.Code}}</v-list-item-title>
                <v-list-item-subtitle>{{item.Name}}</v-list-item-subtitle>
                <v-list-item-subtitle>{{item.Exchange}}</v-list-item-subtitle>
            </v-list>
          </template>
        </v-autocomplete>
    </v-app-bar>
  </div>
</template>

<script>
  export default {
    name: 'Drawer',
    data: () => ({
      drawer: null,
      drawerItems: [
      {title: "Portfolio", icon: "recent_actors", link: '/'},
      // {title: "Markets", icon: "show_chart", link: '/markets'},
      {title: "Watchlist", icon: "list", link: '/watchlist'},
      {title: "News Feed", icon: "dynamic_feed", link: '/newsfeed'}
      ],
      search: null,
      model: null,
      isLoading: false,
      symbolsExchangesNames: [],
      logos: []
    }),
    props: {
      source: String,
    },
    computed: {
      items () {
        return this.symbolsExchangesNames
      }
    },
    methods: {
      fetchData() {
        if (this.isLoading && this.model) return
        if (this.search == "" || this.search == ".") return
        this.isLoading = true
        this.symbolsExchangesNames = []
        let hostname = window.location.hostname
        fetch(`http://${hostname}:5000/search/${this.search}`)
          .then(res => {
            if(res.ok) return res.json()
            })
          .then(res => {
            for(let i of res){
              this.symbolsExchangesNames.push({
                Code: i.Code,
                Exchange: i.Exchange,
                Name: i.Name,
                LogoURL: i.LogoURL
              })
            }
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => (this.isLoading = false))
      },
    fetchDebounced() {
      clearTimeout(this._timerId)
      this._timerId = setTimeout(() => {
        this.fetchData()
      }, 200)
    },
    customFilter(){
      return true
    },
    goToMarkets(){
      if (this.model){
        this.$router.push({name: 'Markets', params: {code: this.model.Code, exchange: this.model.Exchange}})
        this.symbolsExchangesNames = []
        this.search = null
      }
    },
    getInitials(name){
      let names = name.split(' '),
      initials = names[0].substring(0, 1).toUpperCase()
      if(names.length > 1) initials += names[1].substring(0,1).toUpperCase()
      return initials
    },
  },
  watch: {
    search (val) {
      if(this.model && val == this.model.Name) return
      this.fetchDebounced()
    },
  }
} 
</script>