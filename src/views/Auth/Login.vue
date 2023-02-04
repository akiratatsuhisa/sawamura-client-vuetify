<template>
  <v-container class="fill-height">
    <v-row class="h-100 align-content-center">
      <v-col class="mx-auto" md="8" lg="6">
        <v-card>
          <v-card-title>Login</v-card-title>
          <v-card-subtitle>Login for more info</v-card-subtitle>
          <v-card-text>
            <v-text-field
              class="mb-3"
              label="Username"
              variant="outlined"
              v-model="v$.username.$model"
              :error-messages="getErrorMessage(v$.username)"
              @blur="v$.username.$validate"
              clearable
            ></v-text-field>
            <v-text-field
              class="mb-3"
              label="Password"
              variant="outlined"
              v-model="v$.password.$model"
              :error-messages="getErrorMessage(v$.password)"
              @blur="v$.password.$validate"
              clearable
              :type="showPassword ? 'text' : 'password'"
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="showPassword = !showPassword"
            ></v-text-field>
            <v-btn
              :loading="isLoading"
              variant="elevated"
              block
              @click="onLogin"
              >Login</v-btn
            >
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { required } from "@vuelidate/validators";
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useAuth } from "@/composables/useAuth";
import { getErrorMessage, useVuelidate } from "@/composables/useVuelidate";
import { ILoginRequest } from "@/interfaces/auth";

const router = useRouter();
const route = useRoute();

const { login } = useAuth();

const showPassword = ref(false);

const form = reactive<ILoginRequest>({
  username: "",
  password: "",
});

const [v$, { handleSubmit, isLoading }] = useVuelidate<ILoginRequest>(
  {
    username: {
      required: required,
    },
    password: {
      required: required,
    },
  },
  form
);

const onLogin = handleSubmit(async (data) => {
  await login(data);

  if (typeof route.query.redirect === "string") {
    router.push(route.query.redirect);
  } else {
    router.push({ name: "Home" });
  }
});
</script>
