
<template>
<div id="app2">
  <v-card dense outlined color=transparent border-color=white class="px-3">
    <v-col class="title text-center font-weight-medium">Login</v-col>
    <v-row align="center" justify="center"> 
        <v-col cols="12" sm="6" md="3" class="px-5 py-1">
            <v-text-field
            label="Username/Email"
            rounded
            dense
            outlined
            ></v-text-field>
        </v-col>
    </v-row>
    <v-row align="center" justify="center"> 
        <v-col cols="12" sm="6" md="3" class="px-5 py-0">
            <v-text-field
            v-model="password"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[rules.required, rules.min]"
            :type="show ? 'text' : 'password'"
            @click:append="show = !show"
            name="password-input"
            label="Password"
            hint="At least 8 characters"
            counter
            rounded
            dense
            outlined
            ></v-text-field>
        </v-col>
    </v-row>
    <v-row align="center" justify="center">    
        <v-col class="text-center" cols="12" sm="4">
        <div class="px-2 py-0 mx-10">
            <v-btn @click="logIn()" color="light-blue lighten-1" block="true" rounded="true" class="white--text">Login</v-btn>
        </div>
        </v-col>
    </v-row>
    <v-row align="center" justify="center">
      <v-col 
        class="caption text-center font-weight-medium mr-n12 mt-n3" 
        cols="5"       
      >Need An Account?</v-col>
      <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <template v-slot:activator="{ on }">
        <v-col class="caption text-center font-weight-medium mt-1" cols="4">
          <p class="blue--text" v-on="on">Sign Up Now</p>
        </v-col>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Sign Up</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md4>
                <v-text-field label="Username*" required clearable outlined></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Email*" requried clearable outlined></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Password*" type="password" required outlined></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Phone Number" outlined></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="dialog = false">Create Account</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    </v-row>
  </v-card>
  <v-layout row justify-center>
    
  </v-layout>
</div>
</template>

<script>
export default {
    name: "Login",
    data() {
      return {
          show: false,
          dialog: false,
          rules: {
            required: value => !!value || 'Required.',
            min: v => v.length >= 8 || 'Min 8 characters',
            emailMatch: () => ('The email and password you entered don\'t match'),
          },
      }
    },
    methods: {
      logIn () {
        this.$emit('loggedIn')
      }
    },
}
</script>


<style>
</style>