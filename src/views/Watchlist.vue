<template>
<div id="app">
  <v-app-bar app color=primary elevation=1 >
    <!-- Watchlist select --> 
    <v-menu v-if='watchlistLoaded'
      bottom
      transition="slide-y-transition"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          color="white"
          v-on="on"
        >
        <v-icon>
          mdi-chevron-down
        </v-icon>
        <div class="text-capitalize">{{selected_watchlist}}</div>
        </v-btn>
      </template>
      <v-list class=py-0>
        <v-list-item
          v-for="(item, i) in listofWatchlist"
          :key="i"
          @click="watchlist_clicked(item)"
        >
        <v-list-item-title color=primary>{{ item }}</v-list-item-title>
        </v-list-item>

        <v-list-item class="tile pa-0" color="blue" @click="dialog_addWatchlist=true">
          <v-row justify=center>
            <v-icon>
              mdi-playlist-plus
            </v-icon>
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
        <div class="text-capitalize">{{selected_watchlist}}</div> 
        </v-btn>
      </template>
    </v-menu>
    <!-- END OF watchlist select-->  
    
    <!-- EDIT WATCHLIST BUTTON -->  
    <v-bottom-sheet v-if='watchlistLoaded'>
      <template v-slot:activator="{ on }">
        <v-btn v-if="selected_watchlist!= 'My Watchlist'" icon v-on="on">
                <v-icon color=white>
                  mdi-playlist-edit
                </v-icon>
                
              </v-btn>
              <v-btn v-else icon disabled>
              </v-btn>
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
    </v-bottom-sheet>

    <!-- DELETE -->
    <v-dialog v-if='watchlistLoaded' v-model="dialog_deleteWatchlist" max-width="500px">
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
                  <v-btn color="error" @click="deleteWatchlist">Confirm </v-btn>
              </v-card-actions>
         </v-card>
    </v-dialog> 

    <!-- RENAME -->
    <v-dialog v-if='watchlistLoaded' v-model="dialog_renameWatchlist" max-width="500px">
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
            <v-btn class="white--text" @click='renameWatchlist' color="blue" v-bind:disabled="edited_watchlistname.trim()==''||check_duplicate" >Save</v-btn>
          </v-card-actions>  
        </v-card>
    </v-dialog> 
    <!-- END OF EDIT WATCHLIST BUTTON -->  
    
    <v-spacer></v-spacer> 

    <v-btn icon @click="asset_peopleSwitch='asset'">
      <v-icon v-if="asset_peopleSwitch=='asset'" color=white>
        mdi-currency-usd-circle-outline
      </v-icon>
      <v-icon v-else color=grey >
        mdi-currency-usd-circle-outline
      </v-icon>
    </v-btn> 
    <v-btn icon  @click="asset_peopleSwitch='people'">
      <v-icon v-if="asset_peopleSwitch=='people'" color=white>
        mdi-account-multiple
      </v-icon>
      <v-icon v-else color=grey >
        mdi-account-multiple
      </v-icon>
    </v-btn>

    <!--ADD MARKET-->
    <v-dialog v-if='watchlistLoaded' v-model="addmarket_screen" fullscreen hide-overlay :retain-focus="false" transition="dialog-bottom-transition">
      <template  v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon color=white>mdi-plus</v-icon>
        </v-btn>
      </template>

      <v-card>
          <v-toolbar dark color="primary">
              <v-btn icon dark @click="addmarket_screen = false">
              <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-toolbar-title>Add Markets</v-toolbar-title>
              <v-spacer></v-spacer>
          </v-toolbar>
          <v-progress-linear
            :active="isLoading"
            :indeterminate="isLoading"
            top
            color="primary"
          ></v-progress-linear>
          <v-col>
              <v-autocomplete
                v-model="model"
                spellcheck="false"
                :search-input.sync="search"
                hide-no-data
                hide-selected
                clearable
                placeholder="Search markets"
                prepend-icon="search"
                return-object
                dense
              >
              </v-autocomplete>
              
              <v-list>
                <v-list-item v-for="(item,i) in items" :key=i @click="addsecurity(item.Code,item.Exchange)">
                  <v-list-item-avatar tile v-if="item.LogoURL">
                    <v-img :src="`http://localhost:5000/logo/${item.LogoURL}`"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-avatar tile v-else color="teal">
                    <span class="white--text title">{{getInitials(item.Name)}}</span>
                  </v-list-item-avatar>
                  <v-list>
                      <v-list-item-title class="justify-center">{{item.Code}}</v-list-item-title>
                      <v-list-item-subtitle>{{item.Name}}</v-list-item-subtitle>
                      <v-list-item-subtitle>{{item.Exchange}}</v-list-item-subtitle>
                  </v-list>
                </v-list-item>
              </v-list>
            </v-col>
      </v-card>
    </v-dialog>
    <!--END OF ADD MARKET-->
  </v-app-bar>

  <v-progress-linear
          :active="!watchlistLoaded"
          :indeterminate="!watchlistLoaded"
          top
          color="primary"
  ></v-progress-linear>

  <!-- MARKET PEOPLE SWITCH -->
  <!-- <v-container class="grey lighten-5">
      <v-row
        v-touch="{
          left: () => swipe('Left'),
          right: () => swipe('Right'),
        }"
        align="center"
        justify="center"
        no-gutters
        class="subtitle-2 font-weight-medium"
        >
        
        <v-col v-if="asset_peopleSwitch!=='people'" cols=5 class="text-right" >
          Assets
        </v-col>
        <v-col v-else cols=5 class="text-right grey--text" @click="asset_peopleSwitch='asset'">
          Assets
        </v-col>
        <v-col cols=1></v-col>
        <v-col v-if="asset_peopleSwitch=='people'" cols=5 class="text-left" >
          People
        </v-col>
        <v-col v-else cols=5 class="text-left grey--text" @click="asset_peopleSwitch='people'">
          People
        </v-col>
        
      </v-row>
  </v-container> -->

  <!-- ASSET INFO LIST -->

  <v-card class="grey lighten-5 header" v-if="asset_peopleSwitch=='asset'" elevation=1 absolute style="border-radius: 0px;" >  
    <v-row
        justify=center
        class="subtitle-2 font-weight-medium"
    >
      <v-col cols=3 class="text-left pl-1">  
          Symbol 
      </v-col>
      <v-col cols=4 class="text-center pr-0" @click="temp_change">
          Change
      </v-col>
      <v-col cols=4 class="text-right pr-1">
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
            <v-avatar tile  color="transparent">
              <img :src="('https://eodhistoricaldata.com'+item.logo)" style="width: 40px; height: 40px" />
            </v-avatar>
          </v-col>
          <v-col v-else class=px-0 cols=1 @click="goToMarkets(item)">
            <v-avatar tile color="teal" size=40>
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
            <span v-if="item.change < 0" class="red--text font-weight-bold">{{item.change_p.toFixed(2)}}%</span>
            <span v-else class="green--text font-weight-bold">+{{item.change_p.toFixed(2)}}%</span>
            </v-row>
            <v-row justify=center>
            <span v-if="item.change < 0" class="red--text caption ">{{item.change.toFixed(2)}}</span>
            <span v-else class="green--text caption">+{{item.change.toFixed(2)}}</span>
            </v-row>
          </v-col>

          <!-- INTRADAY -->
          <v-col cols=3 class=pl-1 @click="goToMarkets(item)">
            <GChart v-if='item.change>=0'
              type="AreaChart"
              :data="item.Intra"
              :options="options_positive"
            />
            <GChart v-else
              type="AreaChart"
              :data="item.Intra"
              :options="options_negative"
            />
          </v-col>

          <!-- PRICE -->
          <v-col cols=2 class="pr-3 pl-0" @click="buy(item)">
            <v-row justify ="end">
            <span class="font-weight-bold">{{item.close.toFixed(2)}}</span>
            </v-row>

            <v-row justify ="end">
            <span class="caption">{{item.last_update}}</span>
            </v-row>
          </v-col>


          <!-- SELL/BUY COLUMN -->
            <!-- <v-col v-if="simulated_change" cols=2.5 @click="sell(item)" class="px-0 mt-2">
              <v-card class="green white--text text-center pa-1" >{{item.low.toFixed(2)}}</v-card>
            </v-col>
            <v-col v-else dense cols=2.5  @click="sell(item)" class="px-0 mt-2">
              <v-card class="grey lighten-2 text-center pa-1" >{{item.low.toFixed(2)}}</v-card>
            </v-col>
           
            <v-col v-if="simulated_change" cols=2.5 @click="buy(item)" class="px-1 mt-2">
              <v-card class="red white--text text-center pa-1" >{{item.high.toFixed(2)}}</v-card>
            </v-col>
            <v-col v-else dense cols=2.5  @click="buy(item)" class="px-1 mt-2">
              <v-card class="grey lighten-2 text-center pa-1" >{{item.high.toFixed(2)}}</v-card>
            </v-col> -->
          <!-- END OF SELL/BUY COLUMN -->

          <!-- TRADE PAGE -->
          <v-dialog v-model="sellbuy_screen"  hide-overlay fullscreen persistent :retain-focus="false" transition="dialog-bottom-transition" >  
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
              <v-card>
                <v-container>
                    <v-row no-gutters>
                      <v-col cols=2 v-if="selected_security.logo"> 
                        <img :src="('https://eodhistoricaldata.com'+selected_security.logo)" style="width: 50px; height: 50px" />
                      </v-col>
                      <v-col cols=2 v-else>
                        <v-avatar first-list-item color="teal">
                          <span class="white--text title">{{getInitials(item.name)}}</span>
                        </v-avatar>
                      </v-col>

                      <v-col class=px-3> 
                        <v-row no-gutters>
                          <v-col v-if="buysell_status==='sell'" cols=2>Sell</v-col>
                          <v-col v-else cols=2>Buy</v-col>
                          <span class="font-weight-black">{{selected_security.display_code}}</span>
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
            <v-col>
              <!-- SET RATE -->
              <v-row class=pl-6>  
                <v-col cols=8 v-if="selected_rate==='at_market'" class="font-weight-black">Set Rate</v-col>
                <v-col cols=8 v-else class="font-weight-black">Rate</v-col>

                <v-col>
                  <v-icon color=blue @click="change_rate_unit">mdi-swap-horizontal</v-icon>
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
                  class="font-weight-black centered-input"
                ></v-text-field>
              </v-row>
              <!-- END OF AMOUNT -->

              <!-- TABS -->
              <v-card>
                <v-tabs flat background-color="transparent" grow mobile-break-point="0"
                  color="blue" center-active centered height="80" >
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

              <v-card>  
                <v-btn x-large block color="blue" dark >Set Order</v-btn>
              </v-card>
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
  

  <!-- PEOPLE LIST-->
  <!-- <v-card outlined color=transparent border-color=white >
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
  </v-card> -->
  <!--END OF PEOPLE LIST-->
    
  <!--DISCOVER PEOPLE BUTTON-->
  <!-- <template>
    <v-card 
      class="pa-3" color=transparent >
      <v-row align="center" 
        justify="center">
        <v-col cols=3 class="text-right"><v-icon  color='blue' >mdi-account-multiple-plus</v-icon>  </v-col>
        <v-col cols=6 class="text-left">DISCOVER PEOPLE</v-col>
      </v-row>
    </v-card>  
  </template> -->
  <!--END OF DISCOVER PEOPLE BUTTON -->

  <!-- ADD WATCHLIST BUTTON -->
  <v-dialog v-model="dialog_addWatchlist" max-width="500px">
      <!-- <template v-slot:activator="{ on }">
        <v-btn v-if="$vuetify.breakpoint.xsOnly || $vuetify.breakpoint.smOnly" class="mx-2" v-on="on"  fixed bottom left fab dark color="primary" >
          <v-icon dark>mdi-playlist-plus</v-icon>
        </v-btn>
        <v-btn v-if="!$vuetify.breakpoint.xsOnly && !$vuetify.breakpoint.smOnly" class="mx-2" v-on="on"  fixed bottom right fab dark color="primary" >
          <v-icon dark>mdi-playlist-plus</v-icon>
        </v-btn>
      </template> -->

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
          <v-btn class="white--text" @click='addWatchlist' color="blue" v-bind:disabled="new_watchlistname.trim()==''||check_duplicate" >Save</v-btn>
        </v-card-actions>  
      </v-card>
  </v-dialog>
  <!-- END OF ADD WATCHLIST BUTTON -->
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
import Vue from 'vue'
import VueScroller from 'vue-scroller'
Vue.use(VueScroller)

import { SwipeList } from 'vue-swipe-actions';
import Touch from 'vuetify/es5/directives/touch'
import 'vue-swipe-actions/dist/vue-swipe-actions.css';
import { GChart } from 'vue-google-charts'
export default {
  name: 'Watchlist',
  components: {
			SwipeList, GChart
    },
  directives: {
    Touch
  },
  data: function() {
    return{
      asset_peopleSwitch:'asset',
      new_watchlistname:'',
      edited_watchlistname:'',
      default_watchlist:"My Watchlist",
      selected_watchlist:'',        //Keep track if a watchlist is selected 
      dialog_deleteWatchlist:false,
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

      // CHART
      dayData: null,
      options_positive:{
        legend: 'none',
        areaOpacity:'0.1',
        chartArea: {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        },
        colors: ['#00ff00'],
        width:'100%',
        height: 50,
        vAxis: {
          gridlines: {
          color: 'transparent'
          }
        },
      },
      options_negative:{
        legend: 'none',
        areaOpacity:'0.1',
        chartArea: {
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        },
        colors: ['#FF0000'],
        width:'100%',
        height: 50,
        vAxis: {
          gridlines: {
          color: 'transparent'
          }
        },
      }
    }
  },

  methods:{
  
    swipe (direction) {
        (direction=='Left') ? this.asset_peopleSwitch='people':this.asset_peopleSwitch='asset'
    },

    editwatchlist(action){
      if(action=='Delete Watchlist'){
        this.dialog_deleteWatchlist=true
      }else{
        this.edited_watchlistname=this.selected_watchlist
        this.dialog_renameWatchlist=true
      }
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
      this.selected_watchlist=this.new_watchlistname
      this.new_watchlistname=''
      this.fetchWatchlistsymbol(this.selected_watchlist)
      this.close_dialog_addWatchlist()
    },

    renameWatchlist(){
      let hostname = window.location.hostname
      let renamewatchlistAPI = `http://${hostname}:5000/1001/watchlist/rename/${this.selected_watchlist}/${this.edited_watchlistname}`
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
      this.selected_watchlist=this.edited_watchlistname
      this.edited_watchlistname=''
      this.fetchWatchlist_func () 
      this.fetchWatchlistsymbol(this.selected_watchlist)
      this.dialog_renameWatchlist=false
    },

    deleteWatchlist(){
      var action = 'delete'
      let hostname = window.location.hostname
      let addwatchlistAPI = `http://${hostname}:5000/1001/watchlist/${this.selected_watchlist}/${action}`
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
      this.dialog_deleteWatchlist=false
      this.selected_watchlist=this.default_watchlist
      this.fetchWatchlistsymbol (this.selected_watchlist)
      this.fetchWatchlist_func()
    },

    addsecurity(code,exchange){
      var action = 'add'
      var getdata =  ''
      let hostname = window.location.hostname
      let security = code+'.'+exchange
      let addsecurityAPI = `http://${hostname}:5000/1001/watchlist/${this.selected_watchlist}/${security}/${action}`
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
      this.listofWatchlist=[]
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
        //console.log(this.securitydetails) //Log security details
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
    
    // fetchIntraday (security) {
    //   this.loaded = false
    //   let hostname = window.location.hostname
    //   let API = `http://${hostname}:5000/intra/${security}`
    //   try{
    //     fetch(API)
    //     .then(response => response.json())
    //     .then(data => {
    //       this.renderChartD(data)
    //       this.loaded = true
    //     })
    //   }
    //   catch(e){
    //     console.log(e)
    //   }
    // },
   
    // renderChartD (data){
    //   this.dayData = [['Date', '']]
    //   for(let i in data){
    //     let moment = require('moment')
    //     let time = moment(data[i].datetime, "HH:mm:ss").format("hh:mm A")
    //     this.dayData.push([time, data[i].close])
    //   }
    // },
    
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
      let names = name.split(' '),
      initials = names[0].substring(0, 1).toUpperCase()
      if(names.length > 1) initials += names[1].substring(0,1).toUpperCase()
      return initials
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

.swipeout-list-item:last-of-type {
  border-bottom: none;
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
