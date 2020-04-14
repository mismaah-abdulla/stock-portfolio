<template>
  <!--LOGIN PAGE -->
  <v-card dense outlined color=transparent border-color=white class="px-3">
    <v-row>
      <v-col cols=12></v-col>
    </v-row>
        <v-row>
      <v-col cols=12></v-col>
    </v-row>
    <v-row class="ml-1">
      <v-avatar size="60" tile color="white" class="ml-6" right>
        <img src="@/assets/AppLogo.jpg" alt="">
      </v-avatar>
      <v-col cols="2">
        <h2 class="text-right ml-n4 font-weight-light lime--text text--lighten-1">let's</h2>
      </v-col>
      <v-col cols="3">
        <h2 class="text-left ml-n4 font-weight-light green--text text--lighten-1">invest</h2>
      </v-col>
      <v-col cols="3">
        <h2 class="text-left ml-n10 font-weight-light teal--text text--lighten-2">together</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="3" class="subtitle-2 text-left ml-2 font-weight-medium">Sign In</v-col>
    </v-row>
    <!--LOGIN FORM -->
    <ValidationObserver ref="loginForm">
      <form ref="loginForm1">
        <v-row align="center" justify="center"> 
          <v-col cols="12" sm="6" md="3" class="px-5 py-1">
            <ValidationProvider name="Username" rules="required" v-slot="{ errors }" :bails="false">
              <v-text-field
                v-model="username1"
                label="USERNAME OR EMAIL" 
                regular
                counter
              ></v-text-field>
              <ul class="overline text-left font-regular font-weight-bold red--text">
                <li v-for="(error, index) in errors" :key="index">
                  <span>{{ error }}</span>
                </li>
              </ul>
            </ValidationProvider>   
          </v-col>
        </v-row>
        <v-row align="center" justify="center"> 
          <v-col cols="12" sm="6" md="3" class="px-5 py-0">      
            <ValidationProvider name="Password" rules="required|minMax:8,15|customPassword" v-slot="{ errors }" :bails="false">
              <v-text-field
                v-model="userPassword1"
                label="PASSWORD" 
                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show ? 'text' : 'password'"
                @click:append="show = !show" 
                regular
                counter
                maxlength="15"
              ></v-text-field>
              <ul style="color:red" class="overline text-left font-regular font-weight-bold red--text">
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
    <!--END OF LOGIN FORM -->
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
    <!--END OF DIALOG (INCORRECT USERNAME/PASSWORD) -->
    <!--END OF LOGIN PAGE -->
    <!--SIGN UP PAGE -->
    <v-row align="center" justify="center">
      <v-col class="caption text-right font-weight-medium" cols="6">Don't Have An Account?</v-col>
      <v-dialog v-model="dialog_signup" fullscreen hide-overlay transition="dialog-bottom-transition">
        <template v-slot:activator="{ on }">
          <v-col class="caption text-left font-weight-medium blue--text ml-n4" cols="3" v-on="on">Sign Up</v-col>
        </template>
        <!--SIGN UP FORM -->
        <ValidationObserver ref="signUpForm">
          <form ref="signUpForm1">
            <v-card>
              <v-card-text>
                <v-row>
                  <v-col cols=12></v-col>
                </v-row>
                <v-row class='ml-1'>
                  <v-avatar size="60" tile color="white" class="ml-6" right>
                    <img src="@/assets/AppLogo.jpg" alt="">
                  </v-avatar>
                  <v-col cols="2">
                    <h2 class="text-right ml-n4 mt-3 font-weight-light lime--text text--lighten-1">let's</h2>
                  </v-col>
                  <v-col cols="3">
                    <h2 class="text-left ml-n4 mt-3 font-weight-light green--text text--lighten-1">invest</h2>
                  </v-col>
                  <v-col cols="3">
                    <h2 class="text-left ml-n11 mt-3 font-weight-light teal--text text--lighten-2">together</h2>
                  </v-col>
                </v-row>
                <v-row align="center" justify="center">
                  <v-col cols="12" class="subtitle-2 text-center font-weight-medium">Create an account</v-col>
                </v-row>
                <v-container grid-list-md class="mt-n5">
                  <v-layout wrap>
                    <v-flex xs12>
                      <ValidationProvider name="Username" rules="required|alpha_dash|minMax:8,15" v-slot="{ errors }" :bails="false">
                        <v-text-field
                          v-model="username2"
                          label="Username" 
                          class="mb-n4"
                          regular
                          counter
                          maxlength="15"
                        ></v-text-field>
                        <ul class="overline text-left font-regular font-weight-bold red--text">
                          <li v-for="(error, index) in errors" :key="index">
                            <span>{{ error }}</span>
                          </li>
                        </ul>  
                      </ValidationProvider>
                    </v-flex>
                    <v-flex xs12>
                      <ValidationProvider name="Email" rules="required|email" v-slot="{ errors }" :bails="false">
                        <v-text-field
                          v-model="userEmail" 
                          label="Email" 
                          class="mb-n4"
                          regular
                          ></v-text-field>
                          <ul class="overline text-left font-regular font-weight-bold red--text">
                            <li v-for="(error, index) in errors" :key="index">
                              <span>{{ error }}</span>
                            </li>
                          </ul>               
                      </ValidationProvider>
                    </v-flex>
                    <v-flex xs12>
                      <ValidationProvider name="Password" rules="required|minMax:8,15|customPassword" v-slot="{ errors }" :bails="false">
                        <v-text-field
                        v-model="userPassword2"
                        label="Password" 
                        class="mb-n4"
                        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                        :type="show1 ? 'text' : 'password'"
                        @click:append="show1 = !show1" 
                        regular
                        counter
                        maxlength="15"
                        ></v-text-field>
                        <ul style="color:red" class="overline text-left font-regular font-weight-bold red--text">
                          <li v-for="(error, index) in errors" :key="index">
                            <span>{{ error }}</span>
                          </li>
                        </ul>
                      </ValidationProvider>
                    </v-flex>
                    <v-flex xs12>
                      <ValidationProvider name="Phone Number" rules="required|phone" v-slot="{ errors }" :bails="false">
                        <v-text-field 
                        v-model="userPhoneNumber"
                        label="Phone Number"
                        regular
                        hint="e.g. +60123456789"
                        ></v-text-field>
                        <ul style="color:red" class="overline text-left font-regular font-weight-bold red--text">
                          <li v-for="(error, index) in errors" :key="index">
                            <span>{{ error }}</span>
                          </li>
                        </ul>
                      </ValidationProvider>
                    </v-flex>
                    <v-flex xs12>
                      <ValidationProvider rules="checked" v-slot="{ errors }">
                        <v-checkbox
                          v-model="checkbox"
                          label="I acknowledge that my information will be used in accordance with the"
                          class="caption font-weight-regular" 
                          color="blue"
                        ></v-checkbox>
                        <v-row class="mt-n9">
                          <v-col cols="1"></v-col>
                          <v-col cols="4" class="body-2 font-weight-regular blue--text text-darken-1 ml-1" @click="close_dialog_signup()">Privacy Policy</v-col>
                          <v-col cols="2" class="body-2 font-weight-medium ml-n5">and</v-col>
                          <v-col cols="4" class="body-2 font-weight-regular blue--text text-darken-1 ml-n7" @click="close_dialog_signup()">Cookie Policy</v-col>
                        </v-row>
                        <span class="font-regular text-left font-italic font-weight-bold red--text">{{ errors[0] }}</span>
                      </ValidationProvider>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-row align="center" justify="center">    
                  <v-col class="text-center" cols="12" sm="4">
                    <div class="mx-2 mt-n6">
                      <v-btn color="teal lighten-3" block class="white--text" @click="createAccount()">Create Account</v-btn>
                    </div>
                  </v-col>
                </v-row>
              </v-card-actions>
              <v-row align="center" justify="center">
                <v-col class="overline text-center font-weight-regular px-8">By signing up you will receive marketing emails which you may unsubscribe from anytime</v-col>
              </v-row>
              <v-row justify="center" class="py-4">
                <v-col cols="4" class="caption text-right font-weight-medium">Have An Account?</v-col>
                <v-col cols="3" class="caption text-left font-weight-medium blue--text ml-n4" @click="close_dialog_signup()">Sign In</v-col>
              </v-row>
            </v-card>
          </form>
        </ValidationObserver>
        <!--END OF SIGN UP FORM -->
      </v-dialog>
    </v-row>
    <!--END OF SIGN UP PAGE -->
  </v-card>
</template>

<script>
import { ValidationProvider, extend, ValidationObserver} from "vee-validate/dist/vee-validate.full";
import { required, email } from 'vee-validate/dist/rules';
import PhoneNumber from 'awesome-phonenumber';

var errorMessage = " must include 1 lower-case, 1 upper-case, 1 number and special character ($@$!%*#?&)";
extend('email', email);
extend('required', {
  ...required,
  message: 'This field is required'
})
extend('alpha_dash', {
  message: 'The {_field_} field can only contains alphabet, number, underscore and dash'
})
extend('minMax', {
  validate(value, { min, max}) {
    return value.length >= min && value.length <= max;
  },
  params: ['min', 'max'],
  message: 'The {_field_} field must be only between {min} to {max} characters'
})
extend('customPassword', {
  message: field => "The " + `${field}` + errorMessage,
  validate: value => {
    var notTheseChars = /["'?&/<>\s]/;
    var mustContainTheseChars = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#!@$%^*-]).{8,}$/;

    var containsForbiddenChars = notTheseChars.test(value);
    var containsRequiredChars = mustContainTheseChars.test(value);
    
    if (containsRequiredChars && !containsForbiddenChars) {
      return true;
    } else {
      if (containsForbiddenChars) {
        errorMessage = ' cannot contain characters: " ' + " ' ? & / < > or space";
      } else {
        errorMessage = " must include 1 lower-case, 1 upper-case, 1 number and special character ($@$!%*#?&)";
      }
      return false;
    }
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

export default {
  name: "Login",
  data() {
    return {
      username1: '',
      userPassword1: '',
      username2: '',
      userPassword2: '',
      userEmail: '',
      userPhoneNumber: '',
      show: false,
      show1: false,
      dialog_signup: false,
      dialog_login_fail: false,
      result: '',
      checkbox: false,
      rules: {
        required1: value => !!value || 'Required.',
        min: v => v.length >= 8 || 'Minimum 8 characters',
      }
    }
  },
  components: {
    ValidationProvider,
    ValidationObserver
  },
  methods: {
    logIn () {
      this.$refs.loginForm.validate().then(success => {
        if (!success) {
          return;
        }
        let hostname = window.location.hostname
        let logInAPI = `http://${hostname}:5000/login/${this.username1}/${this.userPassword1}`
        try {
          fetch(logInAPI)
          .then(response =>{return response.json()})
          .then(data => {
            console.log(data)
            this.result = data
            if (this.result == "successful") {
              this.$emit('loggedIn')
            } else {
              this.dialog_login_fail = true
            }
          })
          .catch(e => {console.log("Response status: " + e)})
        }
        catch(error) {
          this.assignNull()
          console.log(error)
        }        
      })
    },
    createAccount () {
      this.$refs.signUpForm.validate().then(success => {
        if (!success) {
          return;
        }
        let hostname = window.location.hostname
        let signUpAPI = `http://${hostname}:5000/signup/${this.username2}/${this.userEmail}/${this.userPassword2}/${this.userPhoneNumber}`
        try {
          fetch(signUpAPI)
          .then(response =>{return response.json()})
          .then(data =>{
            console.log(data)
            this.result = data
            if (this.result == "successful") {
              this.close_dialog_signup()
              alert('Successfully Created Account!');
              this.$nextTick(() => {
                this.$refs.signUpForm.reset();
              });
            }
          })
          .catch(e => {console.log("Response status: "+e)})
        }
        catch(error) {
          this.assignNull()
          console.log(error)
        }
      })
    },
    close_dialog_signup () {
      this.dialog_signup = false
      this.username2 = ''
      this.userEmail = ''
      this.userPassword2 = ''
      this.userPhoneNumber = ''
      this.username1 = ''
      this.userPassword1 = ''
      this.$nextTick(() => {
        this.$refs.signUpForm.reset();
        this.$refs.loginForm.reset();
      });
    }
  }
}
</script>

<style lang="scss">
</style>