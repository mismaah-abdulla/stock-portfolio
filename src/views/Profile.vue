<template>
  <div id='app'>
    <!--Setup Profile Page (REMOVED)-->
<!--
    <div v-if="firstVisit1">
      <v-app-bar color="white">
        <v-btn icon @click="goToWatchlist()">
          <v-avatar size="45" tile color="white">
            <img src="@/assets/AppLogo.jpg" alt="">
          </v-avatar>          
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn icon @click="currentPage = 'profile'">
          <v-icon v-if="currentPage=='profile'" color="#00E676">mdi-account</v-icon>
          <v-icon v-else-if="currentPage!=='profile'">mdi-account</v-icon>
        </v-btn>
        <v-btn icon @click="currentPage = 'portfolio'">
          <v-icon v-if="currentPage=='portfolio'" color="#00E676">mdi-chart-areaspline</v-icon>
          <v-icon v-else-if="currentPage!=='portfolio'">mdi-chart-areaspline</v-icon>
        </v-btn>
        <v-btn icon @click="currentPage = 'activities'">
          <v-icon v-if="currentPage=='activities'" color="#00E676">mdi-earth</v-icon>
          <v-icon v-else-if="currentPage!=='activities'">mdi-earth</v-icon>
        </v-btn>

        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </v-app-bar> 

      <v-row>
        <v-col cols="12" class="subtitle-2 text-center font-weight-medium mb-n2">Setup Your Proflie</v-col>
      </v-row>

      <v-row justify="center">
        <croppa 
          id="myCroppa"
          v-model="myCroppa" 
          canvas-color="transparent"
          :image-border-radius=320
          :placeholder="'Upload Profile Picture'"
          :placeholder-font-size="12"
          :placeholder-color="'black'"
          :accept="'image/*'"
          :quality="3"
          :zoom-speed="3"
          :disabled="false"
          :disable-drag-and-drop="true"
          :disable-click-to-choose="false"
          :disable-drag-to-move="false"
          :disable-scroll-to-zoom="false"   
          :disable-rotation="true"
          :prevent-white-space="true"
          :show-remove-button="false"
          :auto-sizing="true"
        >
        </croppa>
      </v-row>
-->
<!--
      <v-card dense outlined color=transparent border-color=white class="px-3">

        <v-row justify="center" align="center" class="mt-3">
          <form id="imageForm">
            <v-avatar size="110" color="grey lighten-2" outlined>
              <img v-if="imageUrl !== ''" :src="imageUrl" @click="onPickFile">
              <div class="form-group">
                <div class="custom-file">
                  <input @change="onFilePicked" type="file" class="custom-file-input" name="image" id="image" style="display: none" ref="fileInput" accept="image/*">
                </div>
              </div>             
              <v-btn v-if="imageUrl == ''" icon @click="onPickFile">
                <v-icon medium>mdi-camera</v-icon>                
              </v-btn>
            </v-avatar>
          </form> 
        </v-row>
-->
<!--
        <v-row justify="center" class="mt-2 mb-2">
          <v-btn x-small @click="removeImage(1)">Remove</v-btn>        
        </v-row>

        <v-row>
          <v-col cols="12" class="body-2 text-left font-weight-medium mb-n5 mt-n2 ml-2">Personal Information</v-col>
        </v-row>
        <ValidationObserver ref="profileForm">
          <form ref="profileForm1">
            <v-row align="center" justify="center"> 
              <v-col cols="12" sm="6" md="3" class="px-5 py-2 mb-n3">        
                <ValidationProvider name="Display Name" rules="required|minMax:1,30" v-slot="{ errors }" :bails="false">
                  <v-text-field
                    v-model="displayName"
                    label="Display Name" 
                    regular
                    maxlength="30"
                    class="mb-n4"
                  ></v-text-field>
                  <ul class="text-left red--text body-2 font-italic">
                    <li v-for="(error, index) in errors" :key="index">
                      <span>{{ error }}</span>
                    </li>
                  </ul>
                </ValidationProvider>
              </v-col>
            </v-row>
            <v-row align="center" justify="center"> 
              <v-col cols="12" sm="6" md="3" class="px-5 py-2 mb-n3">        
                <ValidationProvider name="gender" rules="required" v-slot="{ errors }" :bails="false">
                  <v-radio-group v-model="genders" :mandatory="true" row class="mb-n4">
                    <v-radio v-model="male" color="teal lighten-2" label="Male" value="Male"></v-radio>
                    <v-radio v-model="female" color="teal lighten-2" label="Female" value="Female"></v-radio>
                  </v-radio-group>
                  <ul class="text-left red--text body-2 font-italic">
                    <li v-for="(error, index) in errors" :key="index">
                      <span>{{ error }}</span>
                    </li>
                  </ul>
                </ValidationProvider>
              </v-col>
            </v-row>
            <v-row align="center" justify="center"> 
              <v-col cols="12" sm="6" md="3" class="px-5 py-2 mb-n3">        
                <ValidationProvider name="Date of Birth">
                  <v-menu
                    ref="datePicker"
                    v-model="datePicker"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >                  
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="date"
                        label="Date of Birth"
                        hint="DD/MM/YYYY format"
                        readonly
                        prepend-icon="event"
                        v-on="on"
                        class="mb-n1"
                        :mandatory="true"
                      ></v-text-field>
                    </template>
                    <v-date-picker 
                      ref="picker" 
                      v-model="date" 
                      :max="new Date().toISOString().substr(0,10)"
                      min="1950-01-01"
                      @change="save"
                    ></v-date-picker>
                  </v-menu>
                </ValidationProvider>
              </v-col>
            </v-row>            
            <v-row align="center" justify="center"> 
              <v-col cols="12" sm="6" md="3" class="px-5 py-2 mb-n3">        
                <ValidationProvider name="country" rules="required" v-slot="{ errors }" :bails="false">
                  <v-autocomplete
                    v-model="country"
                    label="Country"
                    :items="countries" 
                    regular
                    placeholder="Select..."
                    class="mb-n4"
                  ></v-autocomplete>
                  <ul class="text-left red--text body-2 font-italic">
                    <li v-for="(error, index) in errors" :key="index">
                      <span>{{ error }}</span>
                    </li>
                  </ul>
                </ValidationProvider>
              </v-col>
            </v-row> 
            <v-row align="center" justify="center"> 
              <v-col cols="12" sm="6" md="3" class="px-5 py-2 mb-n3">        
                <ValidationProvider name="Educational Level" rules="minMax:0,100" v-slot="{ errors }" :bails="false">
                  <v-text-field
                    v-model="educationalLevel"
                    label="Educational Level" 
                    regular
                    class="mb-n4"
                    maxlength="100"
                  ></v-text-field>
                  <ul class="text-left red--text body-2 font-italic">
                    <li v-for="(error, index) in errors" :key="index">
                      <span>{{ error }}</span>
                    </li>
                  </ul>
                </ValidationProvider>
              </v-col>
            </v-row>
            <v-row align="center" justify="center"> 
              <v-col cols="12" sm="6" md="3" class="px-5 py-2 mb-n3">        
                <ValidationProvider name="Occupation" rules="minMax:0,100" v-slot="{ errors }" :bails="false">
                  <v-text-field
                    v-model="occupation"
                    label="Occupation" 
                    regular
                    class="mb-n4"
                    maxlength="100"
                  ></v-text-field>
                  <ul class="text-left red--text body-2 font-italic">
                    <li v-for="(error, index) in errors" :key="index">
                      <span>{{ error }}</span>
                    </li>
                  </ul>
                </ValidationProvider>
              </v-col>
            </v-row>                    
          </form>
          <v-row>
            <v-spacer></v-spacer>
              <v-btn class="mt-3 mr-3"
                text 
                color="teal lighten-1" 
                @click="submitFile()"
              >Submit
              </v-btn> 
          </v-row>
        </ValidationObserver> 
      </v-card>
    </div>
-->
    <!--Show Profile Page-->
    <div v-if="(editpp == false && editcp == false)">
      <!--Top Bar-->
      <v-app-bar color="white" flat dense>
        <v-btn icon @click="goToWatchlist()">
          <v-avatar size="35" tile color="white">
            <v-icon v-if="profile_pic == ''" size="30">mdi-face</v-icon>
            <img v-else :src="profilePicture">
          </v-avatar>          
        </v-btn>
        <div v-if="(displayName == '' && country == '')">
          <span spellcheck="false" class="body-2 font-weight-bold black--text">Display Name</span><br>
        </div>

        <div v-else-if="(displayName !== '' && country == '')" spellcheck="false" class="caption font-weight-bold black--text">{{displayName}}<br></div>
        <div v-else-if="(displayName == '' && country !== '')" spellcheck="false" class="caption font-weight-bold black--text">Display Name<br>{{country}}</div>
        <div v-else spellcheck="false" class="caption font-weight-bold black--text">{{displayName}}<br>{{country}}</div>        


        <v-spacer></v-spacer>
        <v-btn icon @click="currentPage = 'watchlist'">
          <v-icon v-if="currentPage == 'watchlist'" color="#00E676">mdi-eye-plus</v-icon>
          <v-icon v-else-if="currentPage !== 'watchlist'">mdi-eye-plus</v-icon>
        </v-btn>
        <v-btn icon @click="currentPage = 'writePost'">
          <v-icon v-if="currentPage == 'writePost'" color="#00E676">mdi-pencil-box-multiple</v-icon>
          <v-icon v-else-if="currentPage !== 'writePost'">mdi-pencil-box-multiple</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </v-app-bar>
      <!--//Top Bar-->
<!--
        <v-btn icon @click="currentPage = 'profile'">
          <v-icon v-if="currentPage=='profile'" color="#00E676">mdi-account</v-icon>
          <v-icon v-else-if="currentPage!=='profile'">mdi-account</v-icon>
        </v-btn>
        <v-btn icon @click="currentPage = 'portfolio'">
          <v-icon v-if="currentPage=='portfolio'" color="#00E676">mdi-chart-areaspline</v-icon>
          <v-icon v-else-if="currentPage!=='portfolio'">mdi-chart-areaspline</v-icon>
        </v-btn>
        <v-btn icon @click="currentPage = 'activities'">
          <v-icon v-if="currentPage=='activities'" color="#00E676">mdi-earth</v-icon>
          <v-icon v-else-if="currentPage!=='activities'">mdi-earth</v-icon>
        </v-btn>
-->
      <!--Header Bar-->
      <v-app-bar color="grey lighten-4" class="mb-n1" dense height="30" flat>
        <v-col cols="3" @click="currentPage = 'profile'" class="mr-n3 ml-n5">
          <v-btn v-if="currentPage == 'profile'" x-small depressed color="lime lighten-2">Profile</v-btn>
          <v-btn v-else x-small outlined color="lime darken-2">Profile</v-btn>
        </v-col>
        <v-col cols="3" @click="currentPage = 'posts'" class="mr-n5">
          <v-btn v-if="currentPage == 'posts'" x-small depressed color="lime lighten-2">Posts</v-btn>
          <v-btn v-else x-small outlined color="lime darken-2">Posts</v-btn>
        </v-col>
        <v-col cols="4" @click="currentPage = 'portfolio'">
          <v-btn v-if="currentPage == 'portfolio'" x-small depressed color="lime lighten-2">Portfolio</v-btn>
          <v-btn v-else x-small outlined color="lime darken-2">Portfolio</v-btn>
        </v-col>        
      </v-app-bar>
      <!--//Header Bar-->
      <!--Cover Picture-->
      <v-row dense class="mb-n12">
        <v-col cols="12">
          <img v-if="cover_pic == ''" src="@/assets/blueBackground.jpg" height="110" width="100%" @click="editCoverPic()">
          <img v-else :src="coverPicture" alt="" height="110" width="100%" @click="editCoverPic()">
        </v-col>
      </v-row>
      <!--//Cover Picture-->

      <v-row class="mt-n12">
        <!--Profile Picture-->
        <v-col cols="4" class="mt-n10 ml-4">
          <v-avatar size="120" color="white" outlined>
            <v-icon v-if="profile_pic == ''" size="50" @click="editProfilePic()">mdi-face</v-icon>
            <img v-else :src="profilePicture" @click="editProfilePic()">
          </v-avatar>    
        </v-col>
        <!--//Profile Picture-->
        <!--Display Name & Country-->
        <v-col cols="6" class="mt-7">
          <div v-if="displayName == ''" contenteditable @blur="onEdit" spellcheck="false" class="body-2 font-weight-bold black--text">Display Name</div>
          <div v-else contenteditable @blur="onEdit" spellcheck="false" class="body-2 font-weight-bold black--text">{{displayName}}</div>
          <select id="countryDropdown" class="countries" @change="onEdit2">
            <option v-if="country !== ''">{{country}}</option> 
            <option v-else value="">Country</option>
            <option value="United States">United States</option>
            <option value="Singapore">Singapore</option>
            <option value="Hong Kong">Hong Kong</option>
          </select>
          <!--<div v-if="country == ''" contenteditable @blur="onEdit2" spellcheck="false" class="caption font-weight-bold black--text">Country</div>
          <div v-else class="caption font-weight-regular grey--text text--darken-3">{{country}}</div>-->
        </v-col>
        <!--Display Name & Country-->
      </v-row>
      <!--Dashboard-->
      <v-row>
        <v-col cols="12" class="ml-3 mt-n4">
          <div class="subtitle-2 text-left font-weight-bold black--text">Dashboard</div>
        </v-col>
        <v-col cols="12" class="ml-3 mt-n6 mb-n4">
          <div class="text-left font-italic caption">Private to you</div>
        </v-col>
      </v-row>
      
      <v-row align="center" justify="center">
        <v-col cols="4">
          <v-card outlined color="grey lighten-2" max-height="50">
            <v-card-text class="body-2">
              <div class="text-center mt-n2 font-weight-bold black--text">76</div>
              <div class="text-center mx-n3">Profile Views</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="4" class="ml-n3 mr-n3">
          <v-card outlined color="grey lighten-2" max-height="50">
            <v-card-text class="body-2">
              <div class="text-center mt-n2 font-weight-bold black--text">150</div>
              <div class="text-center mx-n2">Post Views</div>
            </v-card-text>
          </v-card>          
        </v-col>
        <v-col cols="4">
          <v-card outlined color="grey lighten-2" max-height="50">
            <v-card-text class="body-2">
              <div class="text-center mt-n2 font-weight-bold black--text">25</div>
              <div class="text-center mx-n2">Searches</div>
            </v-card-text>
          </v-card>          
        </v-col>
      </v-row>
      <!--//Dashboard-->
      <!--About-->
      <v-row class="mb-n4">
        <v-col cols="12" class="ml-3 mt-n3">
          <div class="subtitle-2 text-left font-weight-bold black--text">About</div>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" class="ml-3">
          <div v-if="about == ''" style="max-width:320px" contenteditable @blur="onEdit1" spellcheck="false" class="text-left font-weight-light black--text">Write something about yourself!</div>
          <div v-else style="max-width:320px" contenteditable @blur="onEdit1" spellcheck="false" class="text-left font-weight-light black--text">{{about}}</div>
        </v-col>
      </v-row>
      <!--//About-->
    </div>
    <!--Edit Profile Picture -->
    <div v-else-if="(editpp == true && editcp == false)">
      <v-row justify="center" class="mt-5 mb-3">
        <div class="body-2 font-weight-bold black--text">Profile Picture</div>
      </v-row>

      <v-row justify="center" class="mb-5">
        <croppa
          id="myCroppa1"
          v-model="myCroppa1" 
          canvas-color="transparent"
          :image-border-radius=320
          :placeholder="'Upload Profile Picture'"
          :placeholder-font-size="12"
          :placeholder-color="'black'"
          :accept="'image/*'"
          :quality="3"
          :zoom-speed="3"
          :disabled="false"
          :disable-drag-and-drop="true"
          :disable-click-to-choose="false"
          :disable-drag-to-move="false"
          :disable-scroll-to-zoom="false"   
          :disable-rotation="true"
          :prevent-white-space="true"
          :show-remove-button="false"
          :auto-sizing="true"
        >
        </croppa>
      </v-row>
      
      <v-row justify="center" class="mt-2 mb-2">
        <v-btn x-small @click="removeImage(2)">Remove</v-btn>        
      </v-row>
      
      <v-row class="mt-4">
        <v-spacer></v-spacer>
          <v-btn class="mt-3"
            text 
            color="teal lighten-1" 
            @click="editProfilePic()"
          >Cancel
          </v-btn> 
          <v-btn class="mt-3 mr-3"
            text 
            color="teal lighten-1" 
            @click="submitImages(1)"
          >Submit
          </v-btn> 
      </v-row>
    </div>
    <!--//Edit Profile Picture -->
    <!--Edit Cover Picture -->      
    <div v-else-if="(editpp == false && editcp == true)">
      <v-row justify="center" class="mt-5 mb-3">
        <div class="body-2 font-weight-bold black--text">Cover Picture</div>
      </v-row>

      <v-row justify="center" class="mb-5">
        <croppa 
          id="myCroppa2"
          v-model="myCroppa2"
          canvas-color="transparent"
          :placeholder="'Upload Cover Picture'"
          :placeholder-font-size="12"
          :placeholder-color="'black'"
          :accept="'image/*'"
          :quality="3"
          :zoom-speed="3"
          :disabled="false"
          :disable-drag-and-drop="true"
          :disable-click-to-choose="false"
          :disable-drag-to-move="false"
          :disable-scroll-to-zoom="false"   
          :disable-rotation="true"
          :prevent-white-space="true"
          :show-remove-button="false"
          :auto-sizing="true">
        </croppa>
      </v-row>

      <v-row justify="center" class="mt-2 mb-2">
        <v-btn x-small @click="removeImage(3)">Remove</v-btn>        
      </v-row>

      <v-row class="mt-4">
        <v-spacer></v-spacer>
          <v-btn class="mt-3"
            text 
            color="teal lighten-1" 
            @click="editCoverPic()"
          >Cancel
          </v-btn> 
          <v-btn class="mt-3 mr-3"
            text 
            color="teal lighten-1" 
            @click="submitImages(2)"
          >Submit
          </v-btn> 
      </v-row>
    </div>
    <!--//Edit Cover Picture -->
  </div>
</template>

<script>
//import { ValidationProvider, extend, ValidationObserver} from "vee-validate/dist/vee-validate.full";
//import { required } from 'vee-validate/dist/rules';
import { getId } from '../utils';
import authHeader from '../services/auth-header';
import store from '../store';

/*
extend('required', {
  ...required,
  message: 'This field is required'
})
extend('alpha_dash', {
  message: 'The {_field_} can only contains alphabet, number, underscore and dash'
})
extend('minMax', {
  validate(value, { min, max}) {
    return value.length >= min && value.length <= max;
  },
  params: ['min', 'max'],
  message: 'The {_field_} must be only between {min} to {max} characters'
})
*/

export default {
  name: "Profile",
  data() {
    return {
      displayName: '',
      //educationalLevel: '',
      //occupation: '',
      about: '',
      //gender: '',
      //male: 'Male',
      //female: 'Female',
      //genders: ['', 'Male', 'Female'],
      country: '',
      countries: ['', 'United States', 'Singapore', 'Hong Kong'],
      //datePicker: false,
      //date: '',
      currentPage: 'profile',
      imageUrl: '',
      profile_pic: null,
      cover_pic: null,
      user_id: '',
      //firstVisit1: true,
      myCroppa: {},
      myCroppa1: {},
      myCroppa2: {},
      editpp: false,
      editcp: false,
    }
  },
  watch: {
    datePicker(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
    }
  },
  created() {
    if(getId()!=0) {
      this.user_id = getId()
      console.log(this.user_id)
      this.getData();
      this.loadImage();
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
  },
  computed: {
    profilePicture () {
      return `data:image/png;base64, ${this.profile_pic}`
    },
    coverPicture () {
      return `data:image/png;base64, ${this.cover_pic}`
    }
  },
  /*
  components: {
    ValidationProvider,
    ValidationObserver
  },
  */
  methods: {
    removeImage(image) {
      if (image == 1) {
        this.myCroppa.remove();
      } else if (image == 2) {
        this.myCroppa1.remove();
      } else if (image == 3) {
        this.myCroppa2.remove();
      }
    },
    editProfilePic() {
      this.editpp = !this.editpp;
    },
    editCoverPic() {
      this.editcp = !this.editcp;
    },
    loadImage() {
      let hostname = window.location.hostname
      let API_URL = `http://${hostname}:5000/profile/show-image/${this.user_id}`
      try {
        fetch(API_URL)
        .then(response => {return response.json()})
        .then(data => {
          if (data !== "no pic") {
            this.profile_pic = data.base64_profile
            this.cover_pic = data.base64_cover
          } else {
            this.profile_pic = '';
            this.cover_pic = '';
          }
     
        })
        .catch(e => {
          console.log(e)
        })
      }
      catch(error){
        console.log(error);
      }      
    },
    onEdit(evt) {
      var src = evt.target.innerText;
      if (src == '') {
        alert('Display Name cannot leave empty');
        evt.target.innerText = 'Display Name';
      } 
      else {
        this.displayName = src;
        let formData = new FormData();
        formData.append('userId', this.user_id);
        formData.append('data', 1);
        formData.append('display_name', this.displayName);
        let hostname = window.location.hostname;
        let API_URL = `http://${hostname}:5000/profile/edit`      
        try {
          fetch(API_URL, {
            method: 'POST',
            body: formData
          })
          .then(response =>{ return response.json();})
          .then(data =>{
            if (data == "successful") {
              console.log(data);
            } else {
              console.log(data);
            }
          })
          .catch(e => {
            console.log(e)
          })
        }catch(error){
          console.log(error);
        }
      }
    },
    onEdit1(evt) {
      var src = evt.target.innerText;
      if (src == '') {
        evt.target.innerText = 'Write Something About Yourself!';
      }
      else {
        this.about = src;
        let formData = new FormData();
        formData.append('userId', this.user_id);
        formData.append('data', 2);
        formData.append('about', this.about);
        let hostname = window.location.hostname;
        let API_URL = `http://${hostname}:5000/profile/edit`      
        try {
          fetch(API_URL, {
            method: 'POST',
            body: formData
          })
          .then(response =>{ return response.json();})
          .then(data =>{
            if (data == "successful") {
              console.log(data);
            } else {
              console.log(data);
            }
          })
          .catch(e => {
            console.log(e)
          })
        }catch(error){
          console.log(error);
        }
      }
    },
    onEdit2() {
      var sel = document.getElementById("countryDropdown");
      var text = sel.options[sel.selectedIndex].text;
      if (text == 'Country') {
        this.country = "";
      }
      else {
        this.country = text;
      }
      if (this.country !== "") {
        let formData = new FormData();
        formData.append('userId', this.user_id);
        formData.append('data', 3);
        formData.append('countryname', this.country);
        let hostname = window.location.hostname;
        let API_URL = `http://${hostname}:5000/profile/edit`      
        try {
          fetch(API_URL, {
            method: 'POST',
            body: formData
          })
          .then(response =>{ return response.json();})
          .then(data =>{
            if (data == "successful") {
              console.log(data);
            } else {
              console.log(data);
            }
          })
          .catch(e => {
            console.log(e)
          })
        }catch(error){
          console.log(error);
        }
      }
    },
    getData() {
      let hostname = window.location.hostname
      let API_URL = `http://${hostname}:5000/profile/getdata/${this.user_id}`
      try {
        fetch(API_URL, 
        {
          method: 'GET',
          headers: authHeader()
        })
        .then(response => {return response.json()})
        .then(data => {
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
            this.displayName = data.DisplayName;
            this.country = data.Country;
            this.about = data.About;
          }
        })
        .catch(e => {
        console.log("Response status: "+e)
        })        
      }
      catch(error) {
        console.log(error)
      }
    },
    save(date) {
      this.$refs.datePicker.save(date);
    },
    goToWatchlist() {
      this.$router.push('/watchlist');
    },
    onPickFile() {
      this.$refs.fileInput.click();
    },
    onFilePicked(event) {
      const files = event.target.files; //files[0] is the file
      let filename = files[0].name;
      if (filename.lastIndexOf('.') <= 0) {
        return alert('Please add a valid file!');
      }
      const fileReader = new FileReader()
      fileReader.addEventListener('load', 
        () => {
          this.imageUrl = fileReader.result
      })
      if ( /\.(jpe?g|png|gif)$/i.test( filename ) ) {
        fileReader.readAsDataURL(files[0]);
        //this.image = files[0];
        //console.log(this.image)
      }
    },
    submitImages(pic) {
      if (pic == 1) { //Profile Pic
        console.log(pic)
        this.myCroppa1.generateBlob(
          blob => {
            let formData = new FormData();
            if (blob !== null) {
              formData.append('profile', blob, 'profile_pic.jpg');
            }
            formData.append('userId', this.user_id);
            formData.append('pic', 1);
            let hostname = window.location.hostname
            let API_URL = `http://${hostname}:5000/profile/submitimages`
            try {
              fetch(API_URL, {
                method: 'POST',
                body: formData
              })
              .then(response =>{ return response.json();})
              .then(data =>{
                if (data == "successful") {
                  this.editpp = false;
                  window.location.reload();
                } 
                else {
                  alert("Please upload an image")
                  console.log(data);
                }
              })
              .catch(e => {
                console.log(e)
              })
            }
            catch(error) {
              console.log(error);
            }
          },
          'image/*',
          0.8
        );         
      }
      else if (pic == 2) {
        console.log(pic)
        this.myCroppa2.generateBlob(
          blob => {
            let formData = new FormData();
            if (blob !== null) {
              formData.append('cover', blob, 'cover_pic.jpg');
            }
            formData.append('userId', this.user_id);
            formData.append('pic', 2);
            let hostname = window.location.hostname
            let API_URL = `http://${hostname}:5000/profile/submitimages`
            try {
              fetch(API_URL, {
                method: 'POST',
                body: formData
              })
              .then(response =>{ return response.json();})
              .then(data =>{
                if (data == "successful") {
                  this.editcp = false;
                  window.location.reload();
                } 
                else {
                  alert("Please upload an image")
                  console.log(data);
                }
              })
              .catch(e => {
                console.log(e)
              })
            }
            catch(error) {
              console.log(error);
            }
          },
          'image/*',
          0.8
        );                   
      }
    },






/*
    submitFile() {
      this.$refs.profileForm.validate().then(success => {
        if (!success) {
          return;
        }
        let formData = new FormData();
        this.myCroppa.generateBlob(
          blob => {
            if (blob !== null) {
              formData.append('image', blob, 'profile_pic.jpg');
            }
            formData.append('userId', this.user_id);
            formData.append('displayName', this.displayName);
            formData.append('gender', this.genders);
            formData.append('dateOfBirth', this.date);
            formData.append('country', this.country);
            formData.append('educationalLevel', this.educationalLevel);
            formData.append('occupation', this.occupation);  
            let hostname = window.location.hostname
            let API_URL = `http://${hostname}:5000/profile/submit`          
            try {
              fetch(API_URL, {
                method: 'POST',
                body: formData
              })
              .then(response =>{ return response.json();})
              .then(data =>{
                if (data == "successful") {
                  window.location.reload();
                } else {
                  console.log(data);
                }
              })
              .catch(e => {
                console.log(e)
              })
            }catch(error){
              console.log(error);
            }                
          },
          'image/*',
          0.8
        );
      });
    },
        let formData = new FormData(document.getElementById("imageForm"));
        console.log(formData)
        try {
          fetch('http://localhost:5000/profile/submit', {
            method: 'POST',
            body: formData
          })
          .then(response =>{ return response.json();})
          .then(data =>{
            if (data == "successful") {
              window.location.reload();
            } else {
              console.log(data);
            }
          })
          .catch(e => {
            console.log(e)
          })
        }catch(error){
          console.log(error);
        }
      })
*/
/*
    submitFile2() {
      let formData = new FormData(document.getElementById("imageForm2"));
      formData.append('userId', this.user_id);      
      try {
        fetch('http://localhost:5000/profile/submit2', {
          method: 'POST',
          body: formData
        })
        .then(response =>{ return response.json();})
        .then(data =>{
          if (data == "successful") {
            window.location.reload();
          } else {
            console.log(data);
          }
        })
        .catch(e => {
          console.log(e)
        })
      }catch(error){
        console.log(error);
      }
    },    
    showImage() {
      try {
        fetch('http://localhost:5000/profile/show-image')
        .then(response =>{return response.json();})
        .then(data =>{
          console.log(data)
          //console.log(JSON.parse(data))
          //this.imageUrl = 'data:image/jpeg;base64,' + btoa(data);
        })
        .catch(e => {
          console.log(e)
        })
      }
      catch(error){
        console.log(error);
      }
    }
*/
  }
}
</script>




<style>
#myCroppa {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-color: #DCDCDC;  
}
#myCroppa1 {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-color: #DCDCDC;  
}
#myCroppa2 {
  width: 100%;
  height: 110px;
  background-color: #DCDCDC;  
}
.countries {
  color: black;
  font-size: 12px;
}
.countries option {
  color: black;
  padding: 4px 8px;
  font-size: 13px;
  display: block;
}

</style>