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
      <v-col cols="12" class="subtitle-2 text-center font-weight-medium mb-n6">Create an account</v-col>
    </v-row>
    <!--/HEADER-->
    <!--REGISTER-->
    <ValidationObserver ref="signUpForm">
      <form ref="signUpForm1">
        <v-row align="center" justify="center"> 
          <v-col cols="12" sm="6" md="3" class="px-5 py-2 mb-n3">        
            <ValidationProvider name="Username" rules="required|alpha_dash|minMax:8,15" v-slot="{ errors }" :bails="false">
              <v-text-field
                v-model="username2"
                label="Username" 
                regular
                maxlength="15"
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
            <ValidationProvider name="Email" rules="required|email" v-slot="{ errors }" :bails="false">
              <v-text-field
                v-model="userEmail"
                label="Email" 
                regular
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
            <ValidationProvider name="Password" rules="required|minMax:8,15|customPassword" v-slot="{ errors }" :bails="false">
              <v-text-field
                v-model="userPassword2"
                label="Password" 
                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show ? 'text' : 'password'"
                @click:append="show = !show" 
                regular
                maxlength="15"
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
            <ValidationProvider name="PhoneNumber" rules="required|phone" v-slot="{ errors }" :bails="false">
              <v-text-field
                v-model="userPhoneNumber"
                label="Phone Number" 
                regular
                hint="e.g. +60123456789"
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
          <v-col cols="12" sm="6" md="3" class="px-5 py-2">
            <ValidationProvider rules="checked" v-slot="{ errors }">
              <v-checkbox
                v-model="checkbox"
                label="I acknowledge that my information will be used in accordance with the"
                class="caption font-weight-regular" 
                color="blue"
              ></v-checkbox>
              <v-row class="mt-n9">
                <v-col cols="1"></v-col>
                <v-col cols="4" class="body-2 ml-1" @click="goToLogin()">
                  <span class="text-center font-weight-regular blue--text text-darken-1">Privacy Policy</span>   
                </v-col>
                <v-col cols="2" class="body-2 ml-n5">
                  <span class="text-center font-weight-regular grey--text text-darken-4">and</span>
                </v-col>
                <v-col cols="4" class="body-2 ml-n7" @click="goToLogin()">
                  <span class="text-center font-weight-regular blue--text text-darken-1">Cookie Policy</span>  
                </v-col>
              </v-row>
              <span class="text-left red--text body-2 font-italic">{{ errors[0] }}</span>
            </ValidationProvider>           
          </v-col>
        </v-row>
        <v-row align="center" justify="center">    
          <v-col class="text-center" cols="12" sm="4">
            <div class="mx-2">
              <v-btn color="teal lighten-3" block class="white--text" @click="signUp()">Create Account</v-btn>
            </div>
          </v-col>
        </v-row>
        <v-row align="center" justify="center">
          <v-col cols="12" class="body-2 text-center font-weight-regular">By signing up you will receive marketing emails which you may unsubscribe from anytime</v-col>
        </v-row>
      </form>
    </ValidationObserver>
    <!--/REGISTER-->
    <!--FOOTER-->
    <v-row align="center" justify="center">
      <v-col class="caption text-center font-weight-medium" cols="6">Have An Account?</v-col>  
      <v-col class="caption text-left font-weight-medium blue--text ml-n10" cols="3" @click="goToLogin()">Sign In</v-col>      
    </v-row>
    <!--/FOOTER-->    
  </v-card>
</template>

<script>
import { ValidationProvider, extend, ValidationObserver} from "vee-validate/dist/vee-validate.full";
import { required, email } from 'vee-validate/dist/rules';
import PhoneNumber from 'awesome-phonenumber';
import User from '../models/user';

//Credentials Validation
var errorMessage = " must include 1 lower-case, 1 upper-case, 1 number and special character ($@$!%*#?&)";
extend('email', email);
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
extend('customPassword1', {
  message: field => "The " + `${field}` + errorMessage,
  validate: value => {
    var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");
    return strongRegex.test(value);
  }
})
extend('phone', {
  message: 'The {_field_} is not a valid phone number',
  validate(value) {
    return new Promise(resolve => {
      let phone = new PhoneNumber(value);
      resolve({ valid: phone.isValid() })
    })
  }
})
extend('checked',{
  message: 'Please accept our terms & condition to proceed',
  validate(value) {
    return value;
  }
})
//--Credentials Validation

export default {
  name: "Register",
  data() {
    return {
      username2: '',
      userPassword2: '',
      userEmail: '',
      userPhoneNumber: '',
      user: new User('', '', '', ''),      
      show: false,
      result: '',
      checkbox: false,
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
  mounted() {
    if (this.loggedIn) {
      this.$router.push('/watchlist');
    }
  },
  methods: {
    goToLogin () {
      this.$router.push({name: 'Login'});
    },
    signUp() {
      this.$refs.signUpForm.validate().then(success => {
        if (!success) {
          return;
        }
        this.user.username = this.username2;
        this.user.email = this.userEmail;
        this.user.password = this.userPassword2;
        this.user.phoneNumber = this.userPhoneNumber;
        this.$store.dispatch('auth/register', this.user).then(
          () => {
            this.$nextTick(() => {
              this.$refs.signUpForm.reset();
              this.goToLogin();
            });            
          },
          error => {
            console.log(error);     
          }
        )
      })
    }
  }
}
</script>

<style>
</style>