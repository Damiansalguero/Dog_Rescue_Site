<template>
  <div class="hello" id="reg-form">
    <div v-if="emailSend">
      <h1>A verification email has been sent to {{ email }}</h1>
    </div>
    <form id="register-form" v-on:submit.prevent="sendReg">
      <input
        class="input-login"
        type="text"
        name="first"
        required
        placeholder="First Name"
        v-model="regForm.first"
      />
      <input
        class="input-login"
        type="text"
        name="last"
        required
        placeholder="Last Name"
        v-model="regForm.last"
      />
      <input
        class="input-login"
        type="email"
        name="email"
        required
        placeholder="Email"
        v-model="regForm.email"
      />
      <input
        class="input-login"
        type="password"
        name="password"
        required
        placeholder="Password"
        v-model="regForm.password"
      />
      <b-button id="btn-sign-two" type="submit">Submit</b-button>
    </form>
    <b-button id="btn-sign" v-on:click.prevent="$emit('swap-authForm')">
      Sign in?
    </b-button>
  </div>
</template>

<script>
import axios from "@/axios";

export default {
  name: "Register",
  props: {},
  data: function() {
    return {
      emailSend: false,
      email: "",
      regForm: {
        first: null,
        last: null,
        email: null,
        password: null
      }
    };
  },
  mounted: function() {},
  methods: {
    sendReg: function() {
      var self = this;
      axios
        .post("/sendReg", this.regForm)
        .then(function(resp) {
          if (resp.data.success) {
            self.emailSend = true;
            self.email = resp.data.email;
          }
        })
        .catch(err => console.log(err));
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style src="../../../public/style.register.css" scoped></style>
