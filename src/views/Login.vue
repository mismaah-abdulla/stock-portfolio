<template>
  <v-card dense outlined color=transparent border-color=white class="px-3">
    <!--SPACE-->
    <v-row>
      <v-col cols=12></v-col>
    </v-row>
    <!--/SPACE -->
    <!--HEADER-->
    <v-row align="center" justify="center" class="mb-n2">
      <v-col cols="2" sm="3" class='mr-3'>
        <v-avatar size="60" tile color="white" right>
          <img src="@/assets/AppLogo.jpg" alt="">
        </v-avatar>
      </v-col>
      <v-col cols="3" sm="3" class="ml-n5">
        <h2 class="text-center font-weight-light lime--text text--lighten-1">let's</h2>
      </v-col>
      <v-col cols="3" sm="3" class="ml-n7">
        <h2 class="text-left font-weight-light green--text text--lighten-1">invest</h2>
      </v-col>
      <v-col cols="4" sm="3" class="ml-n5">
        <h2 class="text-left font-weight-light teal--text text--lighten-2">together</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="subtitle-2 text-left font-weight-medium ml-2 mb-n5">Sign In</v-col>
    </v-row>
    <!--/HEADER-->
    <!--LOGIN-->
    <ValidationObserver ref="loginForm">
      <form ref="loginForm1">
        <v-row align="center" justify="center"> 
          <v-col cols="12" sm="6" md="3" class="px-5 py-1">
            <ValidationProvider name="Username" rules="required" v-slot="{ errors }" :bails="false">
              <v-text-field
                v-model="username1"
                label="Username or Email" 
                regular
                class="mb-n3"
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
          <v-col cols="12" sm="6" md="3" class="px-5 py-1">      
            <ValidationProvider name="Password" rules="required|minMax:8,15|customPassword" v-slot="{ errors }" :bails="false">
              <v-text-field
                v-model="userPassword1"
                label="Password" 
                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show ? 'text' : 'password'"
                @click:append="show = !show" 
                regular
                maxlength="15"
                class="mb-n3"
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
          <v-col class="text-center" cols="12" sm="4">
            <div class="py-0 mx-2">
              <v-btn @click="logIn()" color="teal lighten-3" block class="white--text">Sign In</v-btn>
            </div>
          </v-col>
        </v-row>
      </form>
    </ValidationObserver>
    <!--/LOGIN-->
    <!--DIALOG (INCORRECT USERNAME/PASSWORD) -->
    <v-dialog v-model="dialog_login_fail" transition="dialog-bottom-transition">
      <v-card>
        <v-card-text class="subtitle-2 pt-4 red--text">Incorrect Username or Password</v-card-text>
        <v-card-text class="subtitle-2 text--primary">Please Check Again</v-card-text>
        <v-card-actions>
          <v-btn text bottom absolute right color="teal lighten-2" @click="dialog_login_fail = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--/DIALOG (INCORRECT USERNAME/PASSWORD) -->
    <!--FOOTER-->
    <v-row align="center" justify="center">
      <v-col class="caption text-right font-weight-medium" cols="6">Don't Have An Account?</v-col>  
      <v-col class="caption text-left font-weight-medium blue--text ml-n4" cols="3" @click="goToRegister">Sign Up</v-col>      
    </v-row>
    <!--/FOOTER-->
  </v-card>
</template>

<script>
import { ValidationProvider, extend, ValidationObserver} from "vee-validate/dist/vee-validate.full";
import { required } from 'vee-validate/dist/rules';
import User from '../models/user';

//Username & Password Validation
var errorMessage = " must include 1 lower-case, 1 upper-case, 1 number and special character ($@$!%*#?&)";
extend('required', {
  ...required,
  message: 'This field is required'
})
extend('minMax', {
  validate(value, { min, max}) {
    return value.length >= min && value.length <= max;
  },
  params: ['min', 'max'],
  message: 'The {_field_} must be only between {min} to {max} characters'
})
extend('customPassword', {
  message: field => "The " + `${field}` + errorMessage,
  validate: value => {
    var notTheseChars = /["'?/<>\s\\#()_+=[\]{}|:;,.`~]/;
    var mustContainTheseChars = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#$%^&*-]).{8,}$/;

    var containsForbiddenChars = notTheseChars.test(value);
    var containsRequiredChars = mustContainTheseChars.test(value);
    
    if (containsRequiredChars && !containsForbiddenChars) {
      return true;
    } else {
      if (containsForbiddenChars) {
        errorMessage = ' cannot contain characters: " ' + " ' ? # / \\ < > ( ) _ + = [ ] { } | : ; , . ` ~ or space";
      } else {
        errorMessage = " must include 1 lower-case, 1 upper-case, 1 number and special character (!@$%^&*-)";
      }
      return false;
    }
  }
})
//--Username & Password Validation

export default {
  name: "Login",
  data() {
    return {
      username1: '',
      userPassword1: '',
      user: new User('', ''),
      show: false,
      dialog_login_fail: false,
      checkbox: false
    }
  },
  components: {
    ValidationProvider,
    ValidationObserver
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },
  created() {
    if (this.loggedIn) {
      this.$router.push({name: 'Watchlist'})
    }
  },
  methods: {
    goToRegister () {
      this.$router.push({name: 'Register'});
    },
    logIn() {
      this.$refs.loginForm.validate().then(success => {
        if (!success) {
          return;
        }
        this.user.username = this.username1;
        this.user.password = this.userPassword1;
        this.$store.dispatch('auth/login', this.user).then(
          () => {
            this.$router.push({ name: 'Profile'});
          },
          error => {
            console.log(error);
            this.dialog_login_fail = true;
          }
        )
      })
    }
  }
}

/*
    logIn () {
      this.$refs.loginForm.validate().then(success => {
        if (!success) {
          return;
        }
        //let hostname = window.location.hostname
        //let logInAPI = `http://${hostname}:5000/login/${this.username1}/${this.userPassword1}`
        try {
          //fetch(logInAPI)
          //.then(response =>{return response.json()})
          //.then(data => {
          //  console.log(data)
            this.user.username = this.username1;
            this.user.password = this.userPassword1;
            this.result = AuthService.loginAPI(this.user);
            console.log(this.result)
            if (this.result !== "fail") {
              //localStorage.setItem('user', JSON.stringify(this.result));
              this.$router.push({ name: 'Watchlist'});
            } else {
              this.dialog_login_fail = true
            }
          //})
          //.catch(e => {console.log("Response status: " + e)})
        }
        catch(error) {
          console.log(error)
        }        
      })
    }
    //add import AuthService
    //add result: '' in return data()
  */
</script>

<style lang="scss">
</style>