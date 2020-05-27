<template>

  <div>
    <v-progress-linear
      :active="!securityLoaded"
      :indeterminate="!securityLoaded"
      top
      color="#00C853"
    ></v-progress-linear>
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

      <v-app-bar v-if="securityLoaded" class=px-2 color=white dense flat height=60>
        <v-row class="pt-0 pb-1" align=start>
          <v-col cols=3 class="pt-1 pb-1 px-0">
            <span v-if="securitydetails.change<0" class="red--text display-1 font-weight-bold">{{securitydetails.price1}}</span> 
            <span v-else class="green--text display-1 font-weight-bold">{{securitydetails.price1}}</span> 
            <span v-if="securitydetails.change<0" class="red--text body-1 font-weight-bold">{{securitydetails.price2}} </span>   
            <span v-else class="green--text body-1 font-weight-bold">{{securitydetails.price2}} </span> 
          </v-col>
          <v-col cols=5 class="pt-5 pb-0 pl-3 pr-0">
            <v-icon v-if="securitydetails.change<0" size=x-large color=red>mdi-menu-down</v-icon>
            <v-icon v-else-if="securitydetails.change>0" size=x-large color=green>mdi-menu-up</v-icon>
            <v-icon v-else size=medium>mdi-equal</v-icon>

            <span v-if="securitydetails.change<0" class="red--text body-2 font-weight-bold" style="font-size:10px">{{securitydetails.change.toFixed(2).substr(1)}} ({{parseFloat(securitydetails.change_p).toFixed(2)}}%)</span>  
            <span v-else-if="securitydetails.change>0" class="green--text body-2 font-weight-bold" style="font-size:10px">{{securitydetails.change}} ({{parseFloat(securitydetails.change_p).toFixed(2)}}%)</span>  
            <span v-else class="body-2 font-weight-bold" style="font-size:10px"> ({{parseFloat(securitydetails.change_p).toFixed(2)}}%)</span>  
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
      
      <v-app-bar v-else class=px-2 color=white dense flat height=60>
        <v-row class="pt-0 pb-1" align=start>
          <v-col cols=3 class="pt-1 pb-1 px-0">
            <!-- <span class="black--text display-1 font-weight-bold">0.00</span>  -->
          </v-col>
          <v-col cols=5 class="pt-5 pb-0 pl-3 pr-0">
            <!-- <span class="black--text body-1 font-weight-bold" style="font-size:10px">0.00 (0.00%)</span>   -->
          </v-col>
          <v-col class="px-0 pt-3 pb-0">
            <v-btn small color="grey-lighten-1" class="black--text">
              Buy
            </v-btn> 
          </v-col>
          <v-spacer></v-spacer>
          <v-col class="px-0 pt-3 pb-0">
            <v-btn small color="grey-lighten-1" class="black--text">
              Sell
            </v-btn> 
          </v-col>
        </v-row>
      </v-app-bar>

      <v-app-bar class=px-1 color=white height="30" flat dense >
        <v-col cols=3 class="mr-n4 ml-n5">
          <v-btn v-if="page!='about'&&securityLoaded" @click.end="page='about'" x-small outlined color="lime darken-2">About</v-btn>
          <v-btn v-else-if="securityLoaded" x-small depressed color="lime lighten-2">About</v-btn>
          <v-btn v-else x-small depressed color="grey-lighten-1">About</v-btn>
        </v-col>
        <v-col cols=3  class="mr-n5">
          <v-btn v-if="page!='stats'&&securityLoaded" @click.end="page='stats'" x-small outlined color="lime darken-2">Stats</v-btn>
          <v-btn v-else-if="securityLoaded" x-small depressed color="lime lighten-2">Stats</v-btn>
          <v-btn v-else x-small depressed color="grey-lighten-1">Stats</v-btn>
        </v-col>
        <v-col cols=3 class="mr-0">
          <v-btn v-if="page!='charts'&&securityLoaded" @click.end="page='charts'" x-small outlined color="lime darken-2">Charts</v-btn>
          <v-btn v-else-if="securityLoaded" x-small depressed color="lime lighten-2">Charts</v-btn>
          <v-btn v-else x-small depressed color="grey-lighten-1">Charts</v-btn>
        </v-col>
        <v-col cols=3 class="pl-1">
          <v-btn v-if="page!='posts'&&securityLoaded" @click.end="page='posts'" x-small outlined color="lime darken-2">Posts</v-btn>
          <v-btn v-else-if="securityLoaded" x-small depressed color="lime lighten-2">Posts</v-btn>
          <v-btn v-else x-small depressed color="grey-lighten-1">Posts</v-btn>
        </v-col>
        
      </v-app-bar>
    </v-card>

    <Chart v-show="page=='charts'" v-if="stock"/>
    <!-- <StockMap v-show="page=='charts'" v-if="stock"/> -->
    <Stats v-show="page=='stats'" v-if="stock"/>
    <About v-show="page=='about'" v-if="stock"/>

  </div>
</template>

<script>
import Chart from '../components/Chart'
import Stats from '../components/Stats'
import About from '../components/About'
// import StockMap from '../components/StockMap'
import { getId } from '../utils'
import store from '../store'
import authHeader from '../services/auth-header'

export default {
  components: {
    Chart,
    Stats,
    About,
    // StockMap
  },
  data: () => ({
    page:"charts",
    stock: null,
    sheet: false,
    user_id:'',
    securitydetails:null,  
    securityLoaded: false
  }),
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

    fetchrealtime () {
      let hostname = window.location.hostname
      let realtimeAPI = `http://${hostname}:5000/price/${this.user_id}/${localStorage.code}.${localStorage.exchange}`
      try
      {
        fetch(realtimeAPI,{method: "get",headers: authHeader()})
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
            this.securitydetails=data
            if(this.securitydetails.close<0.01) 
              this.securitydetails.close=parseFloat(this.securitydetails.close).toFixed(3); 
            else 
              this.securitydetails.close=parseFloat(this.securitydetails.close).toFixed(2);
            
            if(this.securitydetails.change<0.01)
              this.securitydetails.change=parseFloat(this.securitydetails.change).toFixed(3);
            else              
              this.securitydetails.change=parseFloat(this.securitydetails.change).toFixed(2);

            var close=this.securitydetails.close+ ''
            var arr=close.split(".")
            this.securitydetails.price1=arr[0]
            arr[1].length<2?this.securitydetails.price2='.'+arr[1]+'0':this.securitydetails.price2='.'+arr[1]
            this.securitydetails.change=parseFloat(this.securitydetails.change)

            this.securityLoaded=true
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
  mounted () {
    if(getId()!=0){
      this.user_id = getId()
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
    this.fetchrealtime ()
    this.stock = { code: localStorage.code, exchange: localStorage.exchange, logo: localStorage.logoURL, name: localStorage.name }
  },

}
</script>