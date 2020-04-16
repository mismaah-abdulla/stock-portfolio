<template>
<div id="app">
  <v-app-bar app >
    <v-row v-if="!searchExpand" align=center >
      <v-app-bar-nav-icon @click.stop="drawer()"/>
      <!-- Watchlist select --> 
      <v-col>
        <v-menu v-if='watchlistLoaded'
          bottom
          transition="slide-y-transition"
        >
        
          <template v-slot:activator="{ on }">
            <v-btn
              color="white"
              v-on="on"
            >
            <v-icon color="#00E676">
              mdi-chevron-down
            </v-icon>

            <div v-if="selected_watchlist.length<13" class="text-capitalize">{{selected_watchlist}}</div>
            <div v-else class="text-capitalize">{{selected_watchlist.substring(0,12)+".."}}</div>
            
            </v-btn>
          </template>
          
          <v-list class=py-0>
            <v-list-item
              v-for="(item, i) in listofWatchlist"
              :key="i"
            >
              <v-list-item-title @click="watchlist_clicked(item)" color=primary>{{ item }}</v-list-item-title>
              <v-icon class=pl-6 v-if="item!='My Watchlist'" color="grey lighten-1" small @click="rename_watchlist(item)">mdi-pencil</v-icon>
              <v-icon class="pl-3 pr-0" v-if="item!='My Watchlist'" color="grey lighten-1" small @click="delete_watchlist(item)">mdi-delete</v-icon>
            </v-list-item>

            <v-list-item class="tile pa-0" color="blue" @click="dialog_addWatchlist=true">
              <v-row justify=center>
                <v-btn icon>
                  <v-icon color="#00E676">mdi-playlist-plus</v-icon>
                </v-btn>
              </v-row>
            </v-list-item>

          </v-list>
        </v-menu>
      
        <v-menu v-else>
          <template v-slot:activator="{ on }">
            <v-btn
              color="white"
              v-on="on"
            >
            <v-icon>
                mdi-chevron-down
            </v-icon>
            <div v-if="selected_watchlist.length<13" class="text-capitalize">{{selected_watchlist}}</div>
            <div v-else class="text-capitalize">{{selected_watchlist.substring(0,12)+".."}}</div>
            </v-btn>
          </template>
        </v-menu>
      </v-col>
      <!-- END OF watchlist select-->  
  
      <!-- EDIT WATCHLIST BUTTON --> 
      
        <!-- <v-bottom-sheet >
          <template v-slot:activator="{ on }">
            <v-btn small  v-if="(watchlistLoaded&&selected_watchlist!= 'My Watchlist')" icon v-on="on">
                    <v-icon>
                      mdi-playlist-edit
                    </v-icon> 
            </v-btn>

            <v-btn small  v-else-if="(!watchlistLoaded&&selected_watchlist!= 'My Watchlist')" icon color=#E0E0E0>
                    <v-icon>
                      mdi-playlist-edit
                    </v-icon> 
            </v-btn>

            <v-btn v-else icon disabled/>
                 
          </template>
          <v-list class=pa-0>
              <v-list-item class=py-5
                v-for="(item, i) in watchlist_action"
                :key="i"
                @click="editwatchlist(item)"
              >
              <v-list-item-title v-if="item=='Delete Watchlist'" class="text-center red--text">{{ item }}</v-list-item-title>
              <v-list-item-title v-else class="text-center primary--text">{{ item }}</v-list-item-title>
              </v-list-item>
          </v-list>
        </v-bottom-sheet> -->

      <!-- DELETE -->
      <v-dialog v-if="(watchlistLoaded)" v-model="dialog_deleteWatchlist" max-width="500px">
          <v-card>
                <v-card-title> 
                  <span class="headline">Confirm Deletion</span>
                </v-card-title>
                <v-card-text>
                  <span>Delete watchlist: {{ to_delete_watchlist }}</span>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                    <v-btn color="default" text @click="close_dialog_deleteWatchlist">Cancel</v-btn>
                    <v-btn color="error" @click="deleteWatchlist">Confirm </v-btn>
                </v-card-actions>
          </v-card>
      </v-dialog> 

      <!-- RENAME -->
      <v-dialog v-if="(watchlistLoaded)" v-model="dialog_renameWatchlist" max-width="500px">
          <v-card>
            <v-card-title> 
              <span class="headline">Rename Watchlist</span>
            </v-card-title>

            <v-card-text>
              <v-container> 
                <v-text-field v-model='edited_watchlistname' :rules="strRules" label="Watchlist Name" :hint="check_duplicate? 'Duplicate name exists' : ''" ></v-text-field>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="default" text @click="dialog_renameWatchlist=false">Cancel</v-btn>
              <v-btn class="white--text" @click='renameWatchlist' color="#00E676" v-bind:disabled="edited_watchlistname.trim()==''||check_duplicate" >Save</v-btn>
            </v-card-actions>  
          </v-card>
      </v-dialog> 
      <!-- END OF EDIT WATCHLIST BUTTON -->  
      <v-spacer/>
        <v-btn icon @click="asset_peopleSwitch='asset'" small >
          <v-icon v-if="asset_peopleSwitch=='asset'" color="#00E676">
            mdi-currency-usd-circle-outline
          </v-icon>
          <v-icon v-else color=#E0E0E0  >
            mdi-currency-usd-circle-outline
          </v-icon>
        </v-btn> 
        
        <v-btn icon  @click="asset_peopleSwitch='people'" small > 
          <v-icon v-if="asset_peopleSwitch=='people'" color="#00E676">
            mdi-account-multiple
          </v-icon>
          <v-icon v-else color=#E0E0E0>
            mdi-account-multiple
          </v-icon>
        </v-btn>

        <v-btn v-if='watchlistLoaded' icon small  @click="searchBtn">
          <v-icon >mdi-plus</v-icon>
        </v-btn>
        <v-btn v-else icon small color=#E0E0E0>
          <v-icon >mdi-plus</v-icon>
        </v-btn>

    </v-row>
    
    <!--ADD MARKET-->
    <v-scroll-x-reverse-transition hide-on-leave>
      <v-row v-show="searchExpand" class=pa-2>
        <v-autocomplete
            autofocus
            ref="autocomplete"
            class="pt-3"
            spellcheck="false"
            v-model="model"
            :items="items"
            :loading="isLoading"
            :search-input.sync="search"
            placeholder="Search market to add"
            no-filter
            hide-no-data
            hide-selected
            clearable
            prepend-icon="mdi-plus"
            return-object
            dense
            @blur="searchExpand = false"
            @input="addsecurity()"
        >
           <template v-slot:item="{ item }" >
               <v-list-item-avatar tile v-if="item.LogoURL">
                <v-img :src="item.LogoURL"></v-img>
               </v-list-item-avatar>
              <v-list-item-avatar tile v-else color="teal">
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
    <!--END OF ADD MARKET-->

  </v-app-bar>

  <v-progress-linear
      :active="!watchlistLoaded"
      :indeterminate="!watchlistLoaded"
      top
      color="#00C853"
  ></v-progress-linear>

  <!-- ASSET INFO LIST -->

  <v-card class="grey lighten-5 header" v-if="asset_peopleSwitch=='asset'" elevation=1 absolute style="border-radius: 0px;" >  
    <v-row
        justify=center
        class="subtitle-2 font-weight-medium"
    >
      <v-col cols=3 class="text-left pl-1">  
          Symbol 
      </v-col>
      <v-col cols=3 class="text-right pr-1" @click="temp_change">
          Change
      </v-col>
      <v-col cols=5 class="text-left pl-7">
          Price
      </v-col>
    </v-row>   
  </v-card>
  <v-card class="grey lighten-5 header" v-else elevation=1 absolute style="border-radius: 0px;" >  
    <v-row
        justify=center
        class="subtitle-2 font-weight-medium"
    >
      <v-col cols=3 class="text-left pl-1">  
          People 
      </v-col>
      <v-col cols=4 class="text-center pr-0" @click="temp_change">
          Risk Score
      </v-col>
      <v-col cols=4 class="text-right pr-1">
          Change
      </v-col>
    </v-row>   
  </v-card>
  
  <v-card outlined color=transparent border-color=white height=50% v-if="asset_peopleSwitch=='asset'">
    <template>
		<swipe-list 
			ref="list"
			:items="securitydetails"
			item-key="code"
		>
			<template v-slot="{ item }">
				<div ref="content" class="card-content" >
					<v-row>

          <v-col class="px-0 ma-0" cols=1 @click="goToMarkets(item)" v-if="item.logo">
            <v-avatar color="transparent">
              <img :src="('https://eodhistoricaldata.com'+item.logo)" style="width: 40px; height: 40px" />
            </v-avatar>
          </v-col>
          <v-col v-else class=px-0 cols=1 @click="goToMarkets(item)">
            <v-avatar color="teal" size=40>
              <span class="white--text title">{{getInitials(item.name)}}</span>
            </v-avatar>
          </v-col>

          <v-col class="pl-8 pr-0 ma-0" > 
            <v-row  @click="goToMarkets(item)"><span class="font-weight-bold px-0">{{item.display_code}} </span></v-row>
            <v-row v-if="item.name.length<14"  @click="goToMarkets(item)"><span class="caption px-0" style="font-size:10px">{{item.name}} </span></v-row>
            <v-row v-else  @click="goToMarkets(item)"><span class="caption px-0" style="font-size:10px">{{item.name.substring(0,14)+".."}} </span></v-row>
          </v-col> 

          <!-- CHANGE -->
          <v-col cols=2 class="pl-1" @click="goToMarkets(item)"> 
            <v-row justify=start>
            <span v-if="item.change < 0" class="red--text font-weight-bold">{{parseFloat(item.change_p).toFixed(2)}}%</span>
            <span v-else class="green--text font-weight-bold">+{{parseFloat(item.change_p).toFixed(2)}}%</span>
            </v-row>
            <v-row justify=center>
            <span v-if="item.change < 0" class="red--text caption ">{{item.change.toFixed(2)}}</span>
            <span v-else class="green--text caption">+{{item.change.toFixed(2)}}</span>
            </v-row>
          </v-col>

          <!-- PRICE -->
          <v-col cols=2 class="pr-3 pl-3" @click="buy(item)">
            <v-row justify ="center">
            <span class="font-weight-bold">{{item.close.toFixed(2)}}</span>
            </v-row>

            <v-row justify ="center">
            <span class="caption">{{item.last_update}}</span>
            </v-row>
          </v-col>

          <!-- INTRADAY CHART-->
          <v-col cols=3 class="pt-3 pl-1 py-0 ma-0 pa-0" @click="goToMarkets(item)">
           <apexchart v-if='item.change>=0' height="25%" width="95%" type="area" :options="chartOptionsPositive" :series="item.series"></apexchart>
            <apexchart v-else height="25%" width="95%" type="area" :options="chartOptionsNegative" :series="item.series"></apexchart> 
            <!-- <highcharts :series = "item.series" :options="chartOptions" ></highcharts> -->
          </v-col>

          <!-- TRADE PAGE -->
          <v-dialog v-model="sellbuy_screen"  hide-overlay fullscreen persistent :retain-focus="false" transition="dialog-bottom-transition" >  
            <v-card style=" border-radius:0px;">       
              <v-toolbar dark color="#f5f5f5">
                  <v-btn icon color=black @click="close_dialog_sellbuy">
                  <v-icon>mdi-close</v-icon>
                  </v-btn>
                  <v-toolbar-title class="teal--text title" v-if="buysell_status==='sell'">Sell </v-toolbar-title>
                  <v-toolbar-title class="teal--text title" v-else>Buy </v-toolbar-title>
                  <v-spacer></v-spacer> 
                  <v-toolbar-title class="grey--text text--lighten-2" v-if="buysell_status==='sell'" @click='sellbuy_change'>Buy</v-toolbar-title>
                  <v-toolbar-title class="grey--text text--lighten-2" v-else @click='sellbuy_change'>Sell </v-toolbar-title>
              </v-toolbar> 
              <v-card style=" border-radius:0px;">
                <v-container>
                    <v-row no-gutters>
                      <v-col cols=2 v-if="selected_security.logo"> 
                        <img :src="('https://eodhistoricaldata.com'+selected_security.logo)" style="width: 50px; height: 50px" />
                      </v-col>
                      <v-col cols=2 v-else>
                        <v-avatar color="teal" size=50>
                          <span class="white--text title">{{getInitials(selected_security.name)}}</span>
                        </v-avatar>
                      </v-col>

                      <v-col class=px-3> 
                        <v-row no-gutters>
                          <v-col v-if="buysell_status==='sell'" cols=2>Sell</v-col>
                          <v-col v-else cols=2>Buy</v-col>
                          <span class="font-weight-black">{{selected_security.display_code}}</span>
                        </v-row>
                        <v-row no-gutters > 
                          <v-col cols=5><h2 class="font-weight-black">{{selected_security.close}} </h2></v-col>
                          <v-col class=pt-2><span v-if="selected_security.change_p < 0" class="red--text"> {{selected_security.change}} ({{selected_security.change_p}}%)</span>
                          <span v-else class="green--text">+{{selected_security.change}} (+{{selected_security.change_p}}%)</span></v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                </v-container>
              </v-card>
            <v-col>
              <!-- SET RATE -->
              <v-row class=pl-6>  
                <v-col cols=8 v-if="selected_rate==='at_market'" class="font-weight-black">Set Rate</v-col>
                <v-col cols=8 v-else class="font-weight-black">Rate</v-col>

                <v-col>
                  <v-icon color=#00E676 @click="change_rate_unit">mdi-swap-horizontal</v-icon>
                  <span v-if="selected_rate==='at_market'" class="font-weight-black" @click="change_rate_unit">Rate</span>
                  <span v-else class="font-weight-black" @click="change_rate_unit">Market</span>
                </v-col>

              </v-row>
          
              <v-row class=px-12>
                <v-text-field v-if="selected_rate==='at_market'"
                 disabled
                 value="At Market"
                 outlined
                 filled
                 class="font-weight-black centered-input"
                ></v-text-field>
              </v-row>

              <v-row class=px-4>
                <v-text-field v-if="selected_rate!='at_market'"
                  v-model.number='current_rate'
                  type="number"
                  append-outer-icon="mdi-plus"
                  prepend-icon="mdi-minus"
                  @click:append-outer="inc_rate"
                  @click:prepend="dec_rate"
                  outlined
                  class="font-weight-black centered-input"
                ></v-text-field>
              </v-row>
              <!-- END OF SET RATE -->

              <!-- AMOUNT -->
              <v-row class=pl-6>  
                <v-col cols=8 v-if="selected_unit==='amount'" class="font-weight-black">Amount</v-col>
                <v-col cols=8 v-else class="font-weight-black">Units</v-col>

                <v-col>
                  <v-icon color=#00E676 @click="change_unit">mdi-swap-horizontal</v-icon>
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
                  class="font-weight-black centered-input"
                ></v-text-field>
              </v-row>
              <!-- END OF AMOUNT -->

              <!-- TABS -->
              <v-card>
                <v-tabs flat background-color="transparent" grow mobile-break-point="0"
                  color="#00E676" center-active centered height="80" >
                  <v-tab v-if='stoploss<0'>$ {{stoploss}} <br> Stop<br>Loss<br></v-tab>
                  <v-tab v-else>$ 0 <br> Stop<br>Loss<br></v-tab>

                  <v-tab v-if='takeprofit>0'>$ {{takeprofit}}<br>Take<br>Profit<br></v-tab>
                  <v-tab v-else>NO TP<br>Take<br>Profit<br></v-tab>
                  <v-tab-item v-for="n in 2" :key="n" >
                    <v-container fluid>
                        <!-- STOP LOSS -->
                        <div v-if="n==1">
                          <v-card flat>
                          <v-row class=pl-6>  
                            <v-col cols=8 v-if="selected_unit_stoploss==='amount'" class="font-weight-black">Amount</v-col>
                            <v-col cols=8 v-else class="font-weight-black">Rate</v-col>
                            <v-col>
                              <v-icon color=#00E676 @click="change_unit_stoploss">mdi-swap-horizontal</v-icon>
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
                            class="font-weight-black centered-input"
                          ></v-text-field>
                          </v-row>
                          </v-card>
                        </div> 

                        <!-- TAKE PROFIT  -->  
                        <div v-if="n==2">
                          <v-card flat>
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
                            class="font-weight-black centered-input"
                          ></v-text-field>
                          </v-row>
                          </v-card>
                        </div> 
                    </v-container>
                  </v-tab-item>
                </v-tabs>
              </v-card>
              <!-- END OF TABS -->

              <v-row class="px-3 pt-3">  
                <v-btn x-large block color="#00E676" dark >Set Order</v-btn>
              </v-row>
            </v-col>
            </v-card>
          </v-dialog>
          <!-- END OF TRADE PAGE --> 

          </v-row>
				</div>
			</template>

      <!-- DELETE SECURITY -->
			<template v-slot:right="{ item }">
				<div class="swipeout-action red" @click="open_dialog_deletesecurity(item)">
					<v-icon color=white>mdi-delete</v-icon>
				</div>

        <v-dialog v-model="dialog_deleteSecurity" max-width="500px" :retain-focus="false">
          <v-card>
              <v-card-title> 
                <span class="headline">Confirm Deletion</span>
              </v-card-title>
              <v-card-text>
                <span>Delete security from watchlist: {{todelete_security_display}}</span>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                  <v-btn color="default" text @click="close_dialog_deleteSecurity">Cancel</v-btn>
                  <v-btn color="error" @click="deletesecurity">Confirm </v-btn>
              </v-card-actions>
          </v-card>
        </v-dialog> 
			</template>

		</swipe-list>
    
    </template>
  <!-- END OF INFO LIST -->
  

  <!-- ADD WATCHLIST BUTTON -->
  <v-dialog v-model="dialog_addWatchlist" max-width="500px">
      <v-card>
        <v-card-title> 
          <span class="headline">New Watchlist</span>
        </v-card-title>

        <v-card-text>
          <v-container> 
            <v-text-field v-model='new_watchlistname' :rules="strRules" label="Watchlist Name" :hint="check_duplicate? 'Duplicate name exists' : ''" ></v-text-field>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="default" text @click="close_dialog_addWatchlist">Cancel</v-btn>
          <v-btn class="white--text" @click='addWatchlist' color="#00E676" v-bind:disabled="new_watchlistname.trim()==''||check_duplicate" >Save</v-btn>
        </v-card-actions>  
      </v-card>
  </v-dialog>
  <!-- END OF ADD WATCHLIST BUTTON -->
  <!-- <v-col cols=3><highcharts :options="chartOptions" ></highcharts></v-col> -->
  </v-card>

  <v-snackbar
      v-model="snackbar"
      :timeout="2000"
    >
      {{ snackbar_text }}
  </v-snackbar>
</div>
</template>

<script>
import { SwipeList } from 'vue-swipe-actions';
import Touch from 'vuetify/es5/directives/touch'
import 'vue-swipe-actions/dist/vue-swipe-actions.css';
import VueApexCharts from 'vue-apexcharts'
//import {Chart} from 'highcharts-vue'

export default {
  name: 'Watchlist',
  components: {
      SwipeList,apexchart: VueApexCharts  //highcharts:Chart
    },
  directives: {
    Touch
  },
  data: function() {
    return{
      searchExpand: false,
      asset_peopleSwitch:'asset',
      new_watchlistname:'',
      edited_watchlistname:'',
      to_edit_watchlist:'',
      default_watchlist:"My Watchlist",
      selected_watchlist:'',        //Keep track if a watchlist is selected 
      dialog_deleteWatchlist:false,
      to_delete_watchlist:"",
      dialog_renameWatchlist:false,
      todelete_security:'',todelete_security_display:'',
      dialog_deleteSecurity:false,
      watchlistLoaded:false, 
      watchlist_action:["Rename Watchlist","Delete Watchlist"],
      listofWatchlist:[],           //User's watchlist list w/o security
      securitydetails:[],           //Security details from selected watchlist
      securitydetailloaded:false,
      dialog_addWatchlist:false,
      close_addwatchlist:true,
      simulated_change:true,
      sellbuy_screen:false,
      buyscreen:false,
      addmarket_screen:false,
      selected_security:[],         //Selected security to buy/sell
      buysell_status:"",
      selected_unit:"amount",
      selected_unit_stoploss:"amount", 
      selected_unit_takeprofit:"amount",
      amountunit:1000,
      stoploss:-1000, 
      takeprofit:1000,
      selected_rate:'at_market',
      current_rate:0,
      search: null,
      model: null,
      isLoading: false,
      symbolsExchangesNames: [],
      logos: [],
      snackbar:false,
      snackbar_text:'',
      strRules: [
        v => !!v || 'This field is required',
      ],

      // //Highcharts
      // chartOptions: {
      //   title: { text: '' },
      //   chart: {
      //     type: 'area',
      //     height: "70%",
      //   },
      //   xAxis: { visible: false },
      //   yAxis: { visible: false },
      //   legend: { enabled: false},
      //   credits: { enabled: false },
      //   tooltip: { enabled: false },

      //   series: [{
      //     lineWidth: 1,
      //     lineColor: '#FF0000',
      //     marker: { enabled: false},
      //     states: {
      //       hover: {
      //         enabled: false
      //       }
      //     },
      //     color: {
      //           linearGradient: {
      //             x1: 0,
      //             x2: 0,
      //             y1: 0,
      //             y2: 1
      //           },
      //           stops: [
      //               [0, '#FF0000'],
      //               [1, '#F8F8FF']
      //           ]
      //     },
      //     data: [5, 3, 4, 2, 4, 4, 5, 5]
      //   }]
      // },


      //Apex Chart
      chartOptionsNegative: {
          chart: {
            sparkline: {
              enabled: true
            },
            toolbar:{
              show:false
            },
            zoom: {
              enabled: false
            },
          },
          xaxis: {
            labels: {
              show: false
            }
          },
          yaxis: {
            labels: {
              show: false
            }
          },
          dataLabels: {
              enabled: false
          },
          fill: {
            colors: ["#FF0000"],
            // type: 'gradient',
            // gradient: {
            //   shadeIntensity: 0.9,
            //   opacityFrom: 0.9,
            //   opacityTo: 0.8,
            //   stops: [0, 95, 100]  
            //}
          },
          grid: {
            show: false,
            padding: {
              left: 0,
              right: -4,
              bottom:0,
              top:0
            }
          },
          dropShadow: {
            enabled: false,
          },
          stroke: {
              show: true,
              curve: 'straight',
              lineCap: 'butt',
              colors:  ["#FF0000"],
              width: 1,
              dashArray: 0,      
          },
          tooltip: {
            enabled: false,
          }
      },
      chartOptionsPositive: {
          chart: {
            sparkline: {
              enabled: true
            },
            toolbar:{
              show:false
            },
            zoom: {
              enabled: false
            },
          },
          xaxis: {
            labels: {
              show: false
            }
          },
          yaxis: {
            labels: {
              show: false
            }
          },
          dataLabels: {
              enabled: false
          },
          fill: {
            colors: ['#00ff00'],
            // type: 'gradient',
            // gradient: {
            //   shadeIntensity: 0.9,
            //   opacityFrom: 0.9,
            //   opacityTo: 0,
            //   stops: [0, 95, 100]  
            //}
          },
          grid: {
            show: false,
            padding: {
              left: 0,
              right: -4,
              bottom:0,
              top:0
            }
          },
          dropShadow: {
            enabled: false,
          },
          stroke: {
              show: true,
              curve: 'straight',
              lineCap: 'butt',
              colors:  ['#00ff00'],
              width: 1,
              dashArray: 0,      
          },
          tooltip: {
            enabled: false,
          }
      },

    }
  },

  methods:{
    searchBtn(){
      this.$refs.autocomplete.focus()
      this.searchExpand = true
    },

    drawer(){
      this.$emit('drawer')
    },
    swipe (direction) {
        (direction=='Left') ? this.asset_peopleSwitch='people':this.asset_peopleSwitch='asset'
    },

    editwatchlist(action){
      if(action=='Delete Watchlist'){
        this.to_delete_watchlist=this.selected_watchlist
        this.dialog_deleteWatchlist=true
      }else{
        this.to_edit_watchlist=this.selected_watchlist
        this.edited_watchlistname=this.selected_watchlist
        this.dialog_renameWatchlist=true
      }
    },

    delete_watchlist(watchlist){
      this.to_delete_watchlist=watchlist
      this.dialog_deleteWatchlist=true
    },

    rename_watchlist(watchlist){
      this.to_edit_watchlist=watchlist
      this.edited_watchlistname=watchlist
      this.dialog_renameWatchlist=true
    },

    addWatchlist(){
      var action = 'add'
      let hostname = window.location.hostname
      let addwatchlistAPI = `http://${hostname}:5000/1001/watchlist/${this.new_watchlistname}/${action}`
      try
      {
        fetch(addwatchlistAPI,{method: "get"})
        .then(response =>{return response.json()})
        .then(data =>{
        console.log(data)
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
      this.listofWatchlist.push(this.edited_watchlistname)
      this.selected_watchlist=this.new_watchlistname
      this.new_watchlistname=''
      this.securitydetails=[]
      
      this.close_dialog_addWatchlist()
    },

    renameWatchlist(){
      let hostname = window.location.hostname
      let renamewatchlistAPI = `http://${hostname}:5000/1001/watchlist/rename/${this.to_edit_watchlist}/${this.edited_watchlistname}`
      try
      {
        fetch(renamewatchlistAPI,{method: "get"})
        .then(response =>{return response.json()})
        .then(data =>{
        console.log(data)
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

      for(var i=0;i<this.listofWatchlist.length;i++){
        if(this.listofWatchlist[i]==this.to_edit_watchlist){
          this.listofWatchlist[i]=this.edited_watchlistname
          break;
        }
      }
      if(this.selected_watchlist==this.to_edit_watchlist){
        this.selected_watchlist=this.edited_watchlistname
        this.to_edit_watchlist=''
        this.edited_watchlistname=''
      }
      
      this.dialog_renameWatchlist=false
    },

    deleteWatchlist(){
      var action = 'delete'
      let hostname = window.location.hostname
      let addwatchlistAPI = `http://${hostname}:5000/1001/watchlist/${this.to_delete_watchlist}/${action}`
      try
      {
        fetch(addwatchlistAPI,{method: "get"})
        .then(response =>{return response.json()})
        .then(data =>{
        console.log(data) 
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
      for(var i=0;i<this.listofWatchlist.length;i++){
        if(this.listofWatchlist[i]==this.to_delete_watchlist){
          this.listofWatchlist.splice(i,1)
          break;
        }
      }
      if(this.selected_watchlist==this.to_delete_watchlist){
        this.securitydetails=[]
        this.selected_watchlist=this.default_watchlist
        this.fetchWatchlistsymbol (this.selected_watchlist)
      }
      this.dialog_deleteWatchlist=false
    },

    addsecurity(){
      var action = 'add'
      var getdata =  ''
      let hostname = window.location.hostname
      let security = this.model.Code+'.'+this.model.Exchange
      let addsecurityAPI = `http://${hostname}:5000/1001/watchlist/${this.selected_watchlist}/${security}/${action}`
      this.$refs.autocomplete.blur()
      try
      {
        fetch(addsecurityAPI,{method: "get"})
        .then(response =>{return response.json()})
        .then(data =>{
        getdata=data.status
        console.log("Status: "+getdata)
        
        if(getdata.toLowerCase().includes("fail")){
          this.snackbar_text=security+" is already in "+this.selected_watchlist
          this.snackbar=true
        }else{
          this.snackbar_text=security+" added to "+this.selected_watchlist
          this.snackbar=true
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
      this.search = null
      this.symbolsExchangesNames = []
      this.addmarket_screen=false
      this.fetchWatchlistsymbol (this.selected_watchlist)
    },

    deletesecurity(){
      //Post delete api
      var action = 'delete'
      let hostname = window.location.hostname
      let deletesecurityAPI = `http://${hostname}:5000/1001/watchlist/${this.selected_watchlist}/${this.todelete_security}/${action}`
      try
      {
        fetch(deletesecurityAPI,{method: "get"})
        .then(response =>{return response.json()})
        .then(data =>{
        console.log(data) 
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

      //Delete from security details (local)
      for(var i=0;i<this.securitydetails.length;i++){
        if(this.securitydetails[i].code===this.todelete_security) {
          this.securitydetails.splice(i,1)
          break
        }
      }
      this.close_dialog_deleteSecurity()
      
    },

    open_dialog_deletesecurity(security){
      this.todelete_security=security.code
      this.todelete_security_display= this.todelete_security.split('.')[0]
      this.dialog_deleteSecurity=true
    },

    close_dialog_deleteSecurity(){
      this.dialog_deleteSecurity = !this.dialog_deleteSecurity
      this.snackbar_text=this.todelete_security+" deleted from watchlist"
      this.snackbar=true
      this.todelete_security=''
    },

    close_dialog_deleteWatchlist(){
      this.dialog_deleteWatchlist = false
    },

    close_dialog_addWatchlist(){
      this.fetchWatchlist_func()
      this.dialog_addWatchlist = false
    },

    close_dialog_sellbuy(){
      this.sellbuy_screen=false
      this.amountunit=1000,
      this.stoploss=-1000, 
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

    fetchWatchlist_func () {
      this.watchlistLoaded = false
      let hostname = window.location.hostname
      let watchlist_listAPI = `http://${hostname}:5000/1001/watchlist`
      try
      {
        fetch(watchlist_listAPI,{method: "get"})
        .then(response =>{return response.json()})
        .then(data =>{
        this.listofWatchlist=[]
        for(var i=0;i<data.length;i++){
          this.listofWatchlist.push(data[i])
        }
        //console.log(this.listofWatchlist)
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

    temp_change(){
      this.simulated_change=!this.simulated_change
      this.asset_peopleSwitch='asset'
    },

    fetchWatchlistsymbol (value) {
      this.watchlistLoaded = false
      let hostname = window.location.hostname
      let list_symbol_API = `http://${hostname}:5000/1001/watchlist/${value}`
      try
      {
        fetch(list_symbol_API,{method: "get"})
        .then(response =>{return response.json()})
        .then(data =>{
        this.securitydetails=[]

        for(var i=0;i<data.length;i++){
          this.fetchrealtime (data[i]) 
        }
        
        if(data.length==0){this.watchlistLoaded = true}
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
        fetch(realtimeAPI,{method: "get"})
        .then(response =>{return response.json()})
        .then(data =>{
        this.watchlistLoaded = true

        var now = new Date()
        var ts=new Date(data.last_update * 1000)

        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
        var month = months[ts.getMonth()]
        var date = ts.getDate()
        var hour = ts.getHours().toString().length == 1 ? '0' + ts.getHours() : ts.getHours()
        var min = ts.getMinutes().toString().length == 1 ? '0' + ts.getMinutes() : ts.getMinutes()

        var time
        var todaydate = now.getDate()
        if(data.status=="True")
          date == todaydate ? time = hour + ':' + min : time = date + ' ' + month
        else
          time = date + ' ' + month
        data.last_update=time
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
    
    change_rate_unit(){
      if(this.selected_rate==='at_market'){
        this.selected_rate='rate'
        this.current_rate=this.selected_security.close}
      else 
        {this.selected_rate='at_market'}
    },
    inc_rate(){
      this.current_rate+=0.01
    },

    dec_rate(){
      this.current_rate+=0.01
    },

    goToMarkets(item){
  
      var model_code = item.code.split('.')[0]
      var model_exchange = item.code.split('.')[1] 
      this.$router.push({name: 'Markets', params: {code: model_code, exchange: model_exchange}})
 
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

    customFilter(){
      return true
    },

    getInitials(name){
      if(name){
        let names = name.split(' '),
        initials = names[0].substring(0, 1).toUpperCase()
        if(names.length > 1) initials += names[1].substring(0,1).toUpperCase()
        return initials
      }
    },
  },

  computed:{
   
    check_duplicate()
    {
      for(var i=0;i<this.listofWatchlist.length;i++){
        if(this.dialog_addWatchlist==true){
          if(this.listofWatchlist[i].trim().toLowerCase()===this.new_watchlistname.trim().toLowerCase())
          { 
            return true
          }
        }
        else if(this.dialog_renameWatchlist==true){
          if(this.listofWatchlist[i].trim().toLowerCase()===this.edited_watchlistname.trim().toLowerCase())
          { 
            return true
          }
        }
      }
      return false
    },

    items () {
        return this.symbolsExchangesNames
      }
  },

  watch: {
    search (val) {
      if(this.model && val == this.model.Name) return
      this.fetchDebounced()
    },
  },

  mounted () {
    this.fetchWatchlist_func()
    this.selected_watchlist=this.default_watchlist
    this.fetchWatchlistsymbol(this.default_watchlist)
  },
}
</script>

<style>
.swipeout-action {
  display: flex;
  align-items: center;
  padding: 0 1rem;
  cursor: pointer;
  left: 0;
}

.swipeout-action.red {
  color: white;
  background-color: rgb(255, 59, 48);
}

.swipeout-action.red:hover {
  background-color: darken(rgb(255, 59, 48), 5%);
}

.swipeout-list-item {
  flex: 1;
  border-bottom: 1px solid lightgray;
}


.swipeout-list-item:first-of-type {
  border-top: none;
  border-top: 40px solid lightgray;
}

.card-content {
  padding-left: 20px;
  padding-right: 20px;
}

.transition-left {
	transform: translate3d(-100%, 0 ,0) !important;
}

.centered-input input {
  text-align: center
}

.first-list-item{
  background: #E8E8E8;
  border-top-style: solid;
  border-top-width: 0px;
  border-top-color: grey;
}

.header {
  position:fixed;      
  width:100vw; 
  z-index:1;  
  height:40px;     
}




</style>
