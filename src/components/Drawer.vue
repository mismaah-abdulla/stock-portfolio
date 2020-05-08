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
      <v-row v-if="!searchExpand" align=center>
        <v-col cols=2 class="px-1 py-0" v-if="this.$route.name == 'Markets' && this.stock">
          <v-avatar v-if="logoURL" size=40 tile @click.stop="drawerMain = !drawerMain" class="avatar"><img :src="logoURL"></v-avatar>
          <v-avatar v-else color="teal" size=40 @click.stop="drawerMain = !drawerMain" class="avatar">
            <span class="white--text title">{{getInitials(stock.name)}}</span>
          </v-avatar>
        </v-col>
        <v-col v-if="this.$route.name == 'Markets' && stock" cols=6 class="pl-2 py-0">
          <v-row>
            <span class="body-2 font-weight-bold" >{{stock.name}} </span>  
          </v-row>
          <v-row>
            <span class="caption" >{{stock.code}}.{{stock.exchange}}</span>  
          </v-row>          
        </v-col>
        <v-toolbar-title v-else class="pt-2">{{ this.$route.name }}</v-toolbar-title>
        <v-spacer/>
        <v-btn @click="opensheet" icon small class=mx-1 v-if="this.$route.name == 'Markets'">
          <v-icon >mdi-eye-plus</v-icon>
        </v-btn>
        <v-btn icon small class=mx-1 v-if="this.$route.name == 'Markets'">
          <v-icon >mdi-pencil-box-multiple</v-icon>
        </v-btn>
        <v-btn class=mx-1 small @click="searchBtn()" icon><v-icon>search</v-icon></v-btn>
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
    <v-bottom-sheet v-model="sheet">
      <v-list>
        <v-subheader class="pl-5 title justify-center">Add to Watchlist</v-subheader>
        <v-list-item
          v-for="(watchlist,index) in listofWatchlist"
          :key="index"
          @click="addWatchlist(watchlist)"
        >
          <v-list-item-title>{{ watchlist.watchlist_name }}</v-list-item-title>
          <v-icon v-if='watchlist.symbol_in_list==true' class="pl-3 pr-0" color="green" small>mdi-check</v-icon>
          <!-- <v-icon v-else class="pl-3 pr-0" color="grey lighten-1" small>mdi-check</v-icon> -->

        </v-list-item>
      </v-list>
    </v-bottom-sheet>

    <v-snackbar
      v-model="snackbar"
      :timeout="2000"
    >
      {{ snackbar_text }}
  </v-snackbar>
  </div>
</template>

<script>
  import store from '../store'
  import authHeader from '../services/auth-header'
  import { getId } from '../utils'

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
      sheet:false,
      listofWatchlist:[],
      user_id:'',
      snackbar:false,
      snackbar_text:'',
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
      
      fetchWatchlist_func () {
        this.watchlistLoaded = false
        let hostname = window.location.hostname
        let watchlist_listAPI = `http://${hostname}:5000/market/${this.stock.code}.${this.stock.exchange}/${this.user_id}`
        try
        {
          fetch(watchlist_listAPI,{method: "get",headers: authHeader()})
          .then(response =>{return response.json()})
          .then(data =>{
          if (data.authenticated == false) {
              store.dispatch('auth/logout').then(
                () => {
                  alert("Session Expired. Please login again.")
                  this.$router.push('/login');
                },
                error => {
                  console.log(error);
                }
              )
          } 
          else {
            this.listofWatchlist=[]
            if(data.length>0){
              for(var i=0;i<data.length;i++){
                this.listofWatchlist.push(data[i])
              }
            }
          }
          
          })
          .catch(e => {
          console.log("Response status: "+e)
          })
        }
        catch(error)
        {
          this.assignNull()
          console.log(error)
        }
      },

      opensheet(){
        this.fetchWatchlist_func () 
        this.sheet=true
      },

      addWatchlist(watchlist){
        if(watchlist.symbol_in_list){ //Remove
          this.deletesecurity(watchlist.watchlist_name)
          this.snackbar_text=this.stock.code+"."+this.stock.exchange+" removed from watchlist"
        }
        else{ //Add
          this.addsecurity(watchlist.watchlist_name)
          this.snackbar_text=this.stock.code+"."+this.stock.exchange+" added to watchlist"
        }
        this.snackbar=true
        watchlist.symbol_in_list=!watchlist.symbol_in_list
      },

      addsecurity(selected_watchlist){
        var action = 'Add'
        let hostname = window.location.hostname
        let addsecurityAPI = `http://${hostname}:5000/add_del_security/${this.user_id}/${selected_watchlist}/${this.stock.code}.${this.stock.exchange}/${action}`
        try
        {
          fetch(addsecurityAPI,{method: "get",headers: authHeader()})
          .then(response =>{return response.json()})
          .then(data =>{

          if (data.authenticated == false) {
              store.dispatch('auth/logout').then(
                () => {
                  alert("Session Expired. Please login again.")
                  this.$router.push('/login');
                },
                error => {
                  console.log(error);
                }
              )
          } else {
            console.log("Status: "+data)
          } 
          })
          .catch(e => {
          console.log("Response status: "+e)
          })
        }
        catch(error)
        {
          this.assignNull()
          console.log(error)
        }
      },

      deletesecurity(selected_watchlist){
        //Post delete api
        var action = 'Delete'
        let hostname = window.location.hostname
        let deletesecurityAPI =`http://${hostname}:5000/add_del_security/${this.user_id}/${selected_watchlist}/${this.stock.code}.${this.stock.exchange}/${action}`
        try
        {
          fetch(deletesecurityAPI,{method: "get",headers: authHeader()})
          .then(response =>{return response.json()})
          .then(data =>{
          if (data.authenticated == false) {
              store.dispatch('auth/logout').then(
                () => {
                  alert("Session Expired. Please login again.")
                  this.$router.push('/login');
                },
                error => {
                  console.log(error);
                }
              )
          } else {
            console.log("Status: "+data)
          }
          
          })
          .catch(e => {
          console.log("Response status: "+e)
          })
        }
        catch(error)
        {
          this.assignNull()
          console.log(error)
        }
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
      this.user_id = getId()
      if (localStorage.code) {
        this.stock = {
          name: localStorage.name,
          code: localStorage.code,
          exchange: localStorage.exchange
        }
        localStorage.logoURL ? this.logoURL = localStorage.logoURL : null
      }
      this.fetchWatchlist_func () 
    }
  } 
</script>

<style>
.avatar {
  cursor: pointer !important;
}
</style>