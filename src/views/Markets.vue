<template>
  <div app>

    <!-- TOP BAR -->
    <v-app-bar class=px-2 color=white app elevation="1">
      <v-row v-if="!searchExpand"  align=center>
        <v-col cols=2 class=px-1>
          <v-avatar @click.stop="drawer()" v-if="URL!=''" size=40 tile ><img :src="URL"></v-avatar>
          <v-avatar @click.stop="drawer()" v-else color="teal" size=40>
            <span class="white--text title">{{getInitials(this.$props.name)}}</span>
          </v-avatar>
        </v-col>
        <v-col cols=6 class="pa-0 pl-2">
          <v-row>
            <span class="font-weight-bold " style="font-size:15px">{{this.$props.name}} </span>  
          </v-row>

          <v-row>
            <span class="caption" style="font-size:10px">{{this.$props.code}}.{{this.$props.exchange}}</span>  
          </v-row>          
        </v-col>
        <v-spacer></v-spacer>
        <v-btn icon small class=px-4 @click="sheet=!sheet">
          <v-icon >mdi-eye-plus</v-icon>
        </v-btn>
        <v-btn icon small class=px-4>
          <v-icon >mdi-pencil-box-multiple</v-icon>
        </v-btn>
        <v-btn icon small @click="searchBtn" class=px-4>
          <v-icon >mdi-magnify</v-icon>
        </v-btn>        
      </v-row>
      
      <v-scroll-x-reverse-transition hide-on-leave>
        <v-row v-show="searchExpand"  class=pa-2 >
          <v-autocomplete
              autofocus
              ref="autocomplete"
              class="pt-3"
              spellcheck="false"
              v-model="model"
              :items="items"
              :loading="isLoading"
              :search-input.sync="search"
              placeholder="Search Market"
              no-filter
              hide-no-data
              hide-selected
              clearable
              prepend-icon="mdi-magnify"
              return-object
              dense
              @blur="searchExpand = false"
              @input="goToMarkets()"
          >
            <template v-slot:item="{ item }" >
                <v-list-item-avatar tile v-if="item.LogoURL">
                  <v-img :src="item.LogoURL"></v-img>
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
        </v-row>
      </v-scroll-x-reverse-transition>
    </v-app-bar>

    <!-- <CompanyDetails v-if="stock" :key="stock.Code" :stock="stock"></CompanyDetails> -->
    <v-card class="white pt-1 pb-2" flat absolute style="border-radius: 0px;" >
      <v-app-bar class=px-2 color=white dense flat height=30>
        <v-row class="pt-1 pb-0">
          <v-col cols=3 class="pt-1 pb-1 px-0">
            <span class=caption style="font-size:10px">Current Price </span>  
          </v-col>
          <v-col cols=5 class="pl-4 pt-1 pb-1">
            <span class=caption style="font-size:10px">Daily Gain/Loss </span>  
          </v-col>
        </v-row>
      </v-app-bar>

      <v-app-bar class=px-2 color=white dense flat height=60>
        <v-row class="pt-0 pb-1" align=start>
          <v-col cols=3 class="pt-1 pb-1 px-0">
            <span class="red--text display-1 font-weight-bold">282</span> 
            <span class="red--text body-1 font-weight-bold">.80 </span>   
          </v-col>
          <v-col cols=5 class="pt-5 pb-0 pl-3 pr-0">
            <v-icon size=x-large color=red>mdi-menu-down</v-icon>
            <span class="red--text body-1 font-weight-bold" style="font-size:10px">3.89 (1.36%)</span>  
          </v-col>
          <v-col class="px-0 pt-3 pb-0">
            <v-btn small color=green class="white--text">
              Buy
            </v-btn> 
          </v-col>
          <v-spacer></v-spacer>
          <v-col class="px-0 pt-3 pb-0">
            <v-btn small color=red class="white--text">
              Sell
            </v-btn> 
          </v-col>
        </v-row>
      </v-app-bar>
      
      <v-app-bar color=white height="30" flat dense >
        <v-col cols=3 class="mr-n4 ml-n5">
          <v-btn v-if="page!='about'" @click.end="page='about'" x-small outlined color="lime darken-2">About</v-btn>
          <v-btn v-else x-small depressed color="lime lighten-2">About</v-btn>
        </v-col>
        <v-col cols=3  class="mr-n5">
          <v-btn v-if="page!='stats'" @click.end="page='stats'" x-small outlined color="lime darken-2">Stats</v-btn>
          <v-btn v-else x-small depressed color="lime lighten-2">Stats</v-btn>
        </v-col>
        <v-col cols=3 class="mr-0">
          <v-btn v-if="page!='charts'" @click.end="page='charts'" x-small outlined color="lime darken-2">Charts</v-btn>
          <v-btn v-else x-small depressed color="lime lighten-2">Charts</v-btn>
        </v-col>
        <v-col cols=3 class="pl-1">
          <v-btn v-if="page!='posts'" @click.end="page='posts'" x-small outlined color="lime darken-2">Posts</v-btn>
          <v-btn v-else x-small depressed color="lime lighten-2">Posts</v-btn>
        </v-col>
      </v-app-bar>
    </v-card>

    <v-divider ></v-divider>

    <Chart v-show="page=='charts'" v-if="stock" :key="stock.Code" :stock="stock" :tab="tab"/>
    <Stats v-show="page=='stats'" v-if="stock"  :key="stock.Code" :stock="stock"></Stats>

    <v-bottom-sheet v-model="sheet">
      <v-sheet class="text-center" height="200px">
        <div class="py-3">This is a bottom sheet using the controlled by v-model instead of activator</div>
      </v-sheet>
    </v-bottom-sheet>

  </div>
</template>

<script>
import Chart from '../components/Chart'
// import ChartYD from '../components/ChartYD'
//import CompanyDetails from '../components/CompanyDetails'
import Stats from '../components/Stats'
// import StockMap from '../components/StockMap'
import { getId } from '../utils'
import store from '../store'
import authHeader from '../services/auth-header'

export default {
  components: {
    Chart,
    // ChartYD,
    //CompanyDetails,
    Stats,
    // StockMap
  },
  data: () => ({
    page:"charts",
    stock: null,
    URL:'',
    tab: null,
    tabHeaders: ["Chart", "Stats", "News Feed"],
    searchExpand:false,
    model:null,
    isLoading:false,
    search: null,
    symbolsExchangesNames: [],
    sheet: false,
    user_id:'',
  }),
  props: {
    code: String,
    exchange: String,
    LogoURL: String,
    name: String
  },
  methods: {
    
    drawer(){
      this.$emit('drawer')
    },

    getInitials(name){
      if(name){
        let names = name.split(' '),
        initials = names[0].substring(0, 1).toUpperCase()
        if(names.length > 1) initials += names[1].substring(0,1).toUpperCase()
        return initials
      }
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

    searchBtn(){
      this.$refs.autocomplete.focus()
      this.searchExpand = true
    },

    fetchWatchlist_func () {
      this.watchlistLoaded = false
      let hostname = window.location.hostname
      let watchlist_listAPI = `http://${hostname}:5000/watchlist/${this.user_id}`
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
          else{
            this.securityLoaded=true
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

  },
  computed:{
    items () {
      return this.symbolsExchangesNames
    }
  },
  watch: {
    model () {
      this.tab = "Stats"
    },

    search (val) {
      if(this.model && val == this.model.Name) return
      this.fetchDebounced()
    },

  },
  mounted () {
    if(getId()!=0){
      this.user_id = getId()
      this.fetchWatchlist_func()
    }
    else
    {
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
     
    this.stock = { Code: this.$props.code, Exchange: this.$props.exchange, Logo: this.$props.LogoURL, Name:this.$props.name }
    if(this.$props.LogoURL){this.URL=this.$props.LogoURL}
  }
}
</script>