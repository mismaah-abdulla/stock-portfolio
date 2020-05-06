<template>
  <div>
    <v-navigation-drawer 
      v-model="drawerMain"
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
        <div class="pa-2">
          <v-btn block color="white" @click="logout()">Logout</v-btn>
        </div>
      </v-list>

    </v-navigation-drawer>
    <v-app-bar v-if="this.$route.name != 'Watchlist'"
        app
        elevation="1"
        color=white
      >
      <v-row v-if="!searchExpand">
        <v-app-bar-nav-icon @click.stop="drawerMain = !drawerMain" />
        <v-col cols=2 class="px-1 py-0" v-if="this.$route.name == 'Markets' && this.stock">
          <v-avatar v-if="logoURL" size=40 tile ><img :src="logoURL"></v-avatar>
          <v-avatar v-else color="teal" size=40>
            <span class="white--text title">{{getInitials(stock.name)}}</span>
          </v-avatar>
        </v-col>
        <v-col v-if="this.$route.name == 'Markets' && stock" cols=6 class="pl-2 py-0">
          <v-row>
            <span class="font-weight-bold" style="font-size:15px">{{stock.name}} </span>  
          </v-row>
          <v-row>
            <span class="caption" style="font-size:10px">{{stock.code}}.{{stock.exchange}}</span>  
          </v-row>          
        </v-col>
        <v-toolbar-title v-else class="pt-2">{{ this.$route.name }}</v-toolbar-title>
        <v-spacer/>
        <v-btn icon class=px-4 v-if="this.$route.name == 'Markets'">
          <v-icon >mdi-eye-plus</v-icon>
        </v-btn>
        <v-btn icon class=px-4 v-if="this.$route.name == 'Markets'">
          <v-icon >mdi-pencil-box-multiple</v-icon>
        </v-btn>
        <v-btn icon><v-icon>mdi-facebook-messenger</v-icon></v-btn>
        <v-btn  @click="searchBtn()" icon><v-icon>search</v-icon></v-btn>
      </v-row>
      <v-scroll-x-reverse-transition hide-on-leave>
      <v-row v-show="searchExpand">
        <v-col :cols="12">
          <v-autocomplete
            autofocus
            ref="autocomplete"
            class="pt-3"
            spellcheck="false"
            v-model="model"
            :items="items"
            :loading="isLoading"
            :search-input.sync="search"
            placeholder="Search markets"
            no-filter
            hide-no-data
            hide-selected
            clearable
            prepend-icon="search"
            return-object
            dense
            @blur="searchExpand = false"
            @input="goToMarkets();"
          >
            <template v-slot:item="{ item }">
              <v-list-item-avatar v-if="item.LogoURL" tile>
                <v-img :src=item.LogoURL contain></v-img>
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
        </v-col>
      </v-row>
      </v-scroll-x-reverse-transition>
    </v-app-bar>
  </div>
</template>

<script>
  export default {
    name: 'Drawer',
    data: () => ({
      drawerMain: null,
      drawerItems: [
      {title: "Portfolio", icon: "recent_actors", link: '/'},
      {title: "Markets", icon: "trending_up", link: '/markets'},
      {title: "Watchlist", icon: "list", link: '/watchlist'},
      {title: "News Feed", icon: "dynamic_feed", link: '/newsfeed'},
      {title: "Profile", icon: "mdi-account-multiple", link: '/profile'}
      ],
      search: null,
      searchExpand: false,
      model: null,
      isLoading: false,
      symbolsExchangesNames: [],
      stock: null,
      logoURL: null,
      update: 1,
    }),
    props: {
      source: String,
      drawer: Boolean
    },
    computed: {
      items () {
        return this.symbolsExchangesNames
      },
    },
    methods: {
      logout() {
        this.$store.dispatch('auth/logout').then(
          () => {
            this.$router.push('/login');
          },
          error => {
            console.log(error);
          }
        )
      },
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
    goToMarkets(){
      if (this.model){
        this.$refs.autocomplete.blur()
        localStorage.code = this.model.Code
        localStorage.exchange = this.model.Exchange
        localStorage.name = this.model.Name
        if (this.model.LogoURL) {
          localStorage.logoURL = this.model.LogoURL
        }
        else {
          if (localStorage.logoURL) localStorage.removeItem('logoURL')
        }
        if(this.$route.name == 'Markets') this.$emit(`updateDrawer`)
        else this.$router.push({name: 'Markets'})
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
    searchBtn(){
      this.$refs.autocomplete.focus()
      this.searchExpand = true
    },
  },
  watch: {
    search (val) {
      if(this.model && val == this.model.Name) return
      this.fetchDebounced()
    },
    drawer: function(){
      this.drawerMain = !this.drawerMain
    },
  },
  mounted () {
    if (localStorage.code) {
      this.stock = {
        name: localStorage.name,
        code: localStorage.code,
        exchange: localStorage.exchange
      }
      localStorage.logoURL ? this.logoURL = localStorage.logoURL : null
    }
  }
} 
</script>