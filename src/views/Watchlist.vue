<template>
<div>
  <v-card dense outlined color=transparent border-color=white class="px-3">  
    <v-row align="center" class="pa-1">
      <!-- Watchlist select -->  
        <v-col cols="9.5">
            <v-select
              :items="listofWatchlist"
              item-text="name"
              :loading="!watchlistLoaded"
              label="Select Watchlist"
              dense
              @input="watchlist_clicked"
            ></v-select>
        </v-col>
      <!-- END OF watchlist select-->  

      <!-- EDIT BUTTON -->
        <v-btn icon v-if="hideEdit && selected_watchlist" @click='editMode'>
          <v-icon right>
              mdi-playlist-edit
          </v-icon>
        </v-btn>
        <v-btn icon v-else-if="selected_watchlist" @click='editMode'>
          <v-icon >
              mdi-playlist-check
          </v-icon>
        </v-btn>
        <v-btn icon v-else disabled >
          <v-icon >
            mdi-playlist-star
          </v-icon>
        </v-btn>
      <!-- END OF EDIT BUTTON -->

      <!-- DELETE WATCHLIST BUTTON -->   
        <v-dialog v-if="hideEdit && selected_watchlist" v-model="dialog_deleteWatchlist" max-width="500px">
          <template  v-slot:activator="{ on }">
              <v-btn icon v-on="on">
              <v-icon>
                mdi-playlist-remove
              </v-icon>
              </v-btn>
          </template>
          <v-card>
              <v-card-title> 
                <span class="headline">Confirm Deletion</span>
              </v-card-title>
              <v-card-text>
                <span>Delete watchlist: {{ selected_watchlist }}</span>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                  <v-btn color="default" text @click="close_dialog_deleteWatchlist">Cancel</v-btn>
                  <v-btn color="error">Confirm </v-btn>
              </v-card-actions>
          </v-card>
        </v-dialog> 
      <!-- END OF DELETE WATCHLIST BUTTON -->  
    </v-row>
  </v-card>

  <!-- WATCHLIST DETAILS LIST -->
  <v-card outlined color=transparent border-color=white >
    <v-container class="grey lighten-5">
      <v-row
        align="center"
        justify="center"
        no-gutters
        class="subtitle-2 font-weight-medium"
        >
        <v-col cols=6>  
          MARKETS 
        </v-col>
        <v-col  cols=3 class="text-center" @click="temp_change">
          SELL
        </v-col>
        <v-col  cols=3 class="text-center">
          BUY
        </v-col>
      </v-row>
    </v-container>

    <v-container v-for="(item) in securitydetails" v-bind:key='item.code'>
      <v-row align='center' justify="center">
        <v-col cols=2>
          <img :src="('https://eodhistoricaldata.com'+item.logo)" style="width: 45px; height: 45px" />
        </v-col>
        <v-col cols=4 > 
          <span>{{item.code}}</span>
          <br>
          <span v-if="item.change < 0" class="red--text">{{item.change.toFixed(2)}} ({{item.change_p.toFixed(2)}}%)</span>
          <span v-else class="green--text">{{item.change.toFixed(2)}} ({{item.change_p.toFixed(2)}}%)</span>
        </v-col> 

        <!-- SELL/BUY COLUMN -->
        <template>
          <v-col v-if="simulated_change" dense cols=3 class="green white--text text-center" @click="sell(item)">
            {{item.low.toFixed(2)}}
          </v-col>
          <v-col v-else dense cols=3 class="grey lighten-2 text-center"  @click="sell(item)">
            {{item.low.toFixed(2)}}
          </v-col>
        </template>
       
        <template>
          <v-col v-if="simulated_change" dense cols=3 class="red white--text text-center"  @click="buy(item)">
            {{item.high.toFixed(2)}}
          </v-col>
          <v-col v-else dense cols=3 class="grey lighten-2 text-center"  @click="buy(item)">
            {{item.high.toFixed(2)}}
          </v-col>
        </template>
        <!-- END OF SELL/BUY COLUMN -->

        <!-- SELL PAGE -->
        <v-dialog v-model="sellbuy_screen" fullscreen hide-overlay persistent :retain-focus="false" transition="dialog-bottom-transition">  
          <v-card>
            <v-toolbar dark color="primary">
                <v-btn icon dark @click="close_dialog_sellbuy">
                <v-icon >mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title v-if="buysell_status==='sell'">Sell </v-toolbar-title>
                <v-toolbar-title v-else>Buy </v-toolbar-title>
                <v-spacer></v-spacer> 
                <v-toolbar-title class="grey--text" v-if="buysell_status==='sell'" @click='sellbuy_change'>Buy</v-toolbar-title>
                <v-toolbar-title class="grey--text" v-else @click='sellbuy_change'>Sell </v-toolbar-title>
            </v-toolbar> 
            <v-card outlined>
              <v-container>
                <v-row no-gutters>
                  <v-col cols=2> 
                    <img :src="('https://eodhistoricaldata.com'+selected_security.logo)" style="width: 50px; height: 50px" />
                  </v-col>
                  <v-col class=px-3> 
                    <v-row no-gutters>
                      <v-col cols=2>SELL</v-col>
                      <span class="font-weight-black">{{selected_security.code}}</span>
                    </v-row>
                    <v-row no-gutters > 
                      <v-col cols=4><h2 class="font-weight-black">{{selected_security.close}} </h2></v-col>
                      <v-col class=pt-2><span v-if="selected_security.change_p < 0" class="red--text"> {{selected_security.change}} ({{selected_security.change_p}}%)</span>
                      <span v-else class="green--text">{{selected_security.change}} ({{selected_security.change_p}}%)</span></v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>

            <!-- AMOUNT -->
            <v-row class=pl-6>  
              <v-col cols=8 v-if="selected_unit==='amount'" class="font-weight-black">Amount</v-col>
              <v-col cols=8 v-else class="font-weight-black">Units</v-col>

              <v-col>
                <v-icon color=blue @click="change_unit">mdi-swap-horizontal</v-icon>
                <span v-if="selected_unit==='amount'" class="font-weight-black" @click="change_unit">Units</span>
                <span v-else class="font-weight-black" @click="change_unit">Amount</span>
              </v-col>

            </v-row>
            <v-row class=px-4>
              
              <v-text-field
                v-model.number='amountunit'
                type="number"
                append-outer-icon="mdi-plus"
                prepend-icon="mdi-minus"
                @click:append-outer="inc_amountunit"
                @click:prepend="dec_amountunit"
                outlined
              ></v-text-field>
            </v-row>
            <!-- END OF AMOUNT -->

            <!-- TABS -->
            <v-card flat>
              <v-tabs flat background-color="transparent" grow mobile-break-point="0"
                color="blue" center-active centered height="80" >
                <v-tab v-if='stoploss<0'>$ {{stoploss}} <br> STOP<br>LOSS<br></v-tab>
                <v-tab v-else>$ 0 <br> STOP<br>LOSS<br></v-tab>

                <v-tab>{{leverage}}<br>LEVERAGE<br></v-tab>

                <v-tab v-if='takeprofit>0'>$ {{takeprofit}}<br>TAKE<br>PROFIT<br></v-tab>
                <v-tab v-else>$ 0<br>TAKE<br>PROFIT<br></v-tab>
                <v-tab-item v-for="n in 3" :key="n" >
                  <v-container fluid>
                      <!-- STOP LOSS -->
                      <div v-if="n==1">
                        <v-card>
                        <v-row class=pl-6>  
                          <v-col cols=8 v-if="selected_unit_stoploss==='amount'" class="font-weight-black">Amount</v-col>
                          <v-col cols=8 v-else class="font-weight-black">Rate</v-col>
                          <v-col>
                            <v-icon color=blue @click="change_unit_stoploss">mdi-swap-horizontal</v-icon>
                            <span v-if="selected_unit_stoploss==='amount'" class="font-weight-black" @click="change_unit_stoploss">Rate</span>
                            <span v-else class="font-weight-black" @click="change_unit_stoploss">Amount</span>
                          </v-col>

                        </v-row>
                        <v-row class=px-4>
                        <v-text-field
                          v-model.number='stoploss'
                          type="number"
                          append-outer-icon="mdi-plus"
                          prepend-icon="mdi-minus"
                          @click:append-outer="inc_stoploss"
                          @click:prepend="dec_stoploss"
                          outlined
                        ></v-text-field>
                        </v-row>
                        </v-card>
                      </div> 

                      <!-- LEVERAGE   -->
                      <div v-if="n==2" >
                        <v-card class="text-center">
      
                          <v-btn-toggle 
                            mandatory
                            class="pa-5"
                            color="blue">
                            <v-btn color="white" x-large @click="leverage1">
                              X1
                            </v-btn>
                            <v-btn color="white" x-large @click="leverage2">
                              X2
                            </v-btn>
                          </v-btn-toggle>

                          <v-row justify="center">CFD TRADE<br></v-row>
                          <v-row justify="center">HIGHER LEVERAGE MEANS HIGHER RISK</v-row>
                        </v-card>
                      </div>

                      <!-- TAKE PROFIT  -->  
                      <div v-if="n==3">
                        <v-card>
                        <v-row class=pl-6>  
                          <v-col cols=8 v-if="selected_unit_takeprofit==='amount'" class="font-weight-black">Amount</v-col>
                          <v-col cols=8 v-else class="font-weight-black">Rate</v-col>

                          <v-col>
                            <v-icon color=blue @click="change_unit_takeprofit">mdi-swap-horizontal</v-icon>
                            <span v-if="selected_unit_takeprofit==='amount'" class="font-weight-black" @click="change_unit_takeprofit">Rate</span>
                            <span v-else class="font-weight-black" @click="change_unit_takeprofit">Amount</span>
                          </v-col>

                        </v-row>
                        <v-row class=px-4>
                        <v-text-field
                          v-model.number='takeprofit'
                          type="number"
                          append-outer-icon="mdi-plus"
                          prepend-icon="mdi-minus"
                          @click:append-outer="inc_takeprofit"
                          @click:prepend="dec_takeprofit"
                          outlined
                        ></v-text-field>
                        </v-row>
                        </v-card>
                      </div> 
                  </v-container>
                </v-tab-item>
              </v-tabs>
            </v-card>
            <!-- END OF TABS -->

            <v-card>  
              <v-btn x-large block color="blue" dark >Open Trade</v-btn>
            </v-card>

          </v-card>
        </v-dialog>
        <!-- END OF SELL PAGE -->
      </v-row>
    </v-container>
  </v-card>
  <!-- END OF WATCHLIST DETAILS LIST -->

  <!--ADD MARKET BUTTON-->
    <template v-if="selected_watchlist">
        <v-card 
            class="pa-3" color=transparent >
            <v-row align="center" 
            justify="center">
            <v-col cols=3 class="text-right"><v-icon  color='blue' >mdi-account-multiple-plus</v-icon>  </v-col>
            <v-col cols=6 class="text-left">ADD MARKET</v-col>
            </v-row>
        </v-card>  
    </template>
    <template v-else>
        <v-card 
            class="pa-3" color=transparent >
            <v-row align="center" 
            justify="center">
            <v-col cols=2 class="text-right"><v-icon  color='grey' >mdi-file-find</v-icon>  </v-col>
            <v-col cols=6 class="text-left">SELECT WATCHLIST</v-col>
            </v-row>
        </v-card>  
    </template>
  <!--END OF ADD MARKET BUTTON-->

  <!--PEOPLE LIST-->
  <v-card outlined color=transparent border-color=white >
    <v-container class="grey lighten-5">
      <v-row
        align="center"
        justify="center"
        no-gutters
        class="subtitle-2 font-weight-medium"
      >
        <v-col cols=6>  
          PEOPLE 
        </v-col>
        <v-col  cols=3 class="text-center">
          SCORE
        </v-col>
        <v-col  cols=3 class="text-center">
          CHANGE
        </v-col>
      </v-row>
    </v-container>
  </v-card>
  <!--END OF PEOPLE LIST-->
    
  <!--DISCOVER PEOPLE BUTTON-->
  <template v-if="selected_watchlist">
    <v-card 
      class="pa-3" color=transparent >
      <v-row align="center" 
        justify="center">
        <v-col cols=3 class="text-right"><v-icon  color='blue' >mdi-account-multiple-plus</v-icon>  </v-col>
        <v-col cols=6 class="text-left">DISCOVER PEOPLE</v-col>
      </v-row>
    </v-card>  
  </template>
  <template v-else>
    <v-card 
      class="pa-3" color=transparent >
      <v-row align="center" 
        justify="center">
        <v-col cols=2 class="text-right"><v-icon  color='grey' >mdi-file-find</v-icon>  </v-col>
        <v-col cols=6 class="text-left">SELECT WATCHLIST</v-col>
      </v-row>
    </v-card>  
  </template>
  <!--END OF DISCOVER PEOPLE BUTTON-->

  <!-- ADD WATCHLIST BUTTON -->
  <v-dialog v-model="dialog_addWatchlist" max-width="500px">
      <template v-slot:activator="{ on }">
        <v-btn v-if="$vuetify.breakpoint.xsOnly || $vuetify.breakpoint.smOnly" class="mx-2" v-on="on"  fixed bottom left fab dark color="primary" >
          <v-icon dark>mdi-plus</v-icon>
        </v-btn>
        <v-btn v-if="!$vuetify.breakpoint.xsOnly && !$vuetify.breakpoint.smOnly" class="mx-2" v-on="on"  fixed bottom right fab dark color="primary" >
          <v-icon dark>mdi-plus</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-card-title> 
          <span class="headline">New Watchlist</span>
        </v-card-title>

        <v-card-text>
          <v-container> 
            <v-text-field :rules="strRules" label="Watchlist Name" :hint="check_duplicate? 'Duplicate name exists' : ''" ></v-text-field>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="default" text @click="close_dialog_addWatchlist">Cancel</v-btn>
          <v-btn class="white--text" color="blue" v-bind:disabled="check_duplicate" >Save</v-btn>
        </v-card-actions>  
      </v-card>
  </v-dialog>
  <!-- END OF ADD WATCHLIST BUTTON -->
</div>
</template>

<script>

export default {
  name: 'Watchlist',
  data: function() {
    return{
      hideEdit:true,
      selected_watchlist:'',        //Keep track if a watchlist is selected 
      dialog_deleteWatchlist:false,
      watchlistLoaded:false, 
      listofWatchlist:[],           //User's watchlist list w/o security
      listofWatchlist_security:[],  //User's watchlist list w/ security
      filteredWatchlist:[],         //Filtered selected watchlist
      securitydetails:[],           //Security details from selected watchlist
      securitydetailloaded:false,
      dialog_addWatchlist:false,
      close_addwatchlist:true,
      simulated_change:false,
      sellbuy_screen:false,
      buyscreen:false,
      selected_security:[],         //Selected security to buy/sell
      buysell_status:"",
      selected_unit:"amount",
      selected_unit_stoploss:"amount", 
      selected_unit_takeprofit:"amount",
      amountunit:1000,
      stoploss:-1000, 
      leverage:'X1', 
      takeprofit:1000,

      strRules: [
        v => !!v || 'This field is required',
      ],
    }
  },

  methods:{
    editMode () {
      this.hideEdit = !(this.hideEdit)
    },

    close_dialog_deleteWatchlist(){
      this.dialog_deleteWatchlist = false
    },

    close_dialog_addWatchlist(){
      this.dialog_addWatchlist = false
    },

    close_dialog_sellbuy(){
      this.sellbuy_screen=false
      this.amountunit=1000,
      this.stoploss=-1000, 
      this.leverage='X1', 
      this.takeprofit=1000
    },

    sell(security){
      this.buysell_status="sell"
      this.selected_security = security
      console.log(this.selected_security)
      this.sellbuy_screen = true
    },

    buy(security){
      this.buysell_status="buy"
      this.selected_security = security
      console.log(this.selected_security)
      this.sellbuy_screen = true
    },

    fetchWatchlist () {
      this.watchlistLoaded = false
      let hostname = window.location.hostname
      let watchlist_listAPI = `http://${hostname}:5000/watchlist/1001`
      try
      {
        fetch(watchlist_listAPI)
        .then(response =>{return response.json()})
        .then(data =>{
        this.listofWatchlist=(data[0].Watchlist_Name)
        this.watchlistLoaded = true
        })
        .catch(e => {
        console.log("Response status: "+e)
        this.watchlistLoaded = true
        })
      }
      catch(error)
      {
        this.assignNull()
        console.log(error)
      }
    },

    watchlist_clicked(selection){
      this.selected_watchlist=selection;
      this.fetchWatchlistsymbol (selection)
    },

    temp_change(){this.simulated_change=!this.simulated_change},

    fetchWatchlistsymbol (value) {
      this.watchlistLoaded = false
      let hostname = window.location.hostname
      let list_symbol_API = `http://${hostname}:5000/watchlist/1001/${value}`
      try
      {
        fetch(list_symbol_API)
        .then(response =>{return response.json()})
        .then(data =>{
        this.listofWatchlist_security=data
        this.filteredWatchlist = (this.listofWatchlist_security.Watchlist.filter(item=>item.Name === this.selected_watchlist))[0].Security
        this.securitydetails=[]
        for(var i=0;i<this.filteredWatchlist.length;i++){
          this.fetchrealtime (this.filteredWatchlist[i])
        }
        console.log(this.securitydetails) //Log security details
        this.securitydetails.sort((a, b) => a.code - b.code )
        })
        .catch(e => {
        console.log("Response status: "+e)
        this.watchlistLoaded = true
        })
      }
      catch(error)
      {
        this.assignNull()
        console.log(error)
      }
    },

    fetchrealtime (security) {
      this.watchlistLoaded = false
      let hostname = window.location.hostname
      let realtimeAPI = `http://${hostname}:5000/rt/${security}`
      try
      {
        fetch(realtimeAPI)
        .then(response =>{return response.json()})
        .then(data =>{
        this.watchlistLoaded = true
        this.securitydetails.push(Object.assign({},data))
        return data
        })
        .catch(e => {
        console.log("Response status: "+e)
        this.watchlistLoaded = true
        })
      }
      catch(error)
      {
        this.assignNull()
        console.log(error)
      }
    },

    sellbuy_change(){
      this.buysell_status==='buy'? this.buysell_status='sell':this.buysell_status='buy'
    },

    change_unit(){
      this.selected_unit==='amount'? this.selected_unit='unit':this.selected_unit='amount'
    },

    change_unit_stoploss(){
      this.selected_unit_stoploss==='amount'? this.selected_unit_stoploss='rate':this.selected_unit_stoploss='amount'
    },

    change_unit_takeprofit(){
      this.selected_unit_takeprofit==='amount'? this.selected_unit_takeprofit='rate':this.selected_unit_takeprofit='amount'
    },
      
    inc_amountunit(){this.amountunit+=25},
    dec_amountunit(){if(this.amountunit>25){this.amountunit-=25}else{this.amountunit=0}},

    dec_stoploss(){this.stoploss-=25},
    inc_stoploss(){if(this.stoploss<=-25){this.stoploss+=25}else{this.stoploss=0}},

    inc_takeprofit(){this.takeprofit+=25},
    dec_takeprofit(){if(this.takeprofit>25){this.takeprofit-=25}else{this.takeprofit=0}},

    leverage1(){
        this.leverage="X1"
        this.takeprofit=this.amountunit*1
    },

    leverage2(){
        this.leverage="X2"
        this.takeprofit=this.amountunit*2
    }, 
    
  },

  computed:{
    check_duplicate()
    {
      // for(var i=0;i<this.watchlist_list_backup.length;i++){
      //    if(this.watchlist_list_backup[i].name.trim().toLowerCase()===this.editedItem.name.trim().toLowerCase())
      //    { 
      //     return true
      //    }
      // }
      return false
    },
  },

  mounted () {
    this.fetchWatchlist ()
  }
}
</script>

<style>

</style>