<template>
  <section class="container_type_auth">
    <div class="card card_type_auth">
      <h1 class="heading heading_size_lg margin-bottom_size_lg align_center">
        <span class="logo-pattern">To</span>notes
      </h1>
      <div class="margin-bottom_size_md">
        <label class="label">Username</label>
        <input class="input" type="text" v-model="credentials.username" />
      </div>
      <div class="margin-bottom_size_lg">
        <label class="label">Password</label>
        <input class="input" type="password" v-model="credentials.password" />
      </div>
      <button
        class="button"
        @click="authenticateUser()"
        :disabled="isCredentialsExist"
      >
        Log In
      </button>
      <transition name="animation-fade">
        <p
          class="paragraph paragraph_type_error margin-top_size_md"
          v-if="error.isVisible"
        >
          {{ error.message }}
        </p>
      </transition>
    </div>
  </section>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import axios from "axios";

export default {
  name: "Auth",
  data: () => ({
    credentials: {
      username: "",
      password: "",
    },
    error: {
      isVisible: false,
      message: "",
    },
  }),
  computed: {
    ...mapState(["vuexRestUrl"]),

    // VALIDATE INPUTS
    isCredentialsExist: function() {
      return (
        this.credentials.username === "" || this.credentials.password === ""
      );
    },

    // CONVERT CREDENTIALS TO BASE64 STRING
    encodedCredentials() {
      return btoa(`${this.credentials.username}:${this.credentials.password}`);
    },
  },
  methods: {
    ...mapMutations([
      "vuexSetCredentials",
      "vuexSetUserAuthenticated",
      "vuexToggleLoadingState",
    ]),

    // SET VALID CREDENTIALS AND SET USER AUTHENTICATED
    startApplication() {
      this.vuexSetCredentials(this.encodedCredentials);
      this.vuexSetUserAuthenticated(true);
    },

    // SEND GET REQUEST WITH CREDENTIALS TO SERVER
    authenticateUser() {
      this.vuexToggleLoadingState(true);

      axios({
        method: "get",
        url: this.vuexRestUrl,
        headers: {
          Authorization: `Basic ${this.encodedCredentials}`,
        },
      })
        .then(() => {
          this.startApplication();
        })
        .catch((error) => {
          if (error.response) {
            // HANDLE CASE WHEN NO NOTES FOUND
            if (error.response.status === 404) {
              this.startApplication();
            } else {
              this.error.isVisible = true;
              this.error.message = error.response.data.message;
            }
          }
        })
        .then(() => {
          this.vuexToggleLoadingState(false);
        });
    },
  },
};
</script>
