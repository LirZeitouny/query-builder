<template>
  <q-page class="q-mb-md">
    <q-row
      class="q-mb-md"
      justify="center"
      align="center"
      style="height: 100vh"
    >
      <!-- Login Card -->
      <q-col cols="12" sm="6" md="6">
        <q-card class="q-pa-md card">
          <div class="card-content">
            <login-component></login-component>
          </div>
        </q-card>
      </q-col>
    </q-row>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LoginComponent from '../components/authentication/LoginForm.vue';

export default defineComponent({
  name: 'IndexPage',
  components: {
    LoginComponent,
  },
});
</script>

<style scoped>
/* Add your custom CSS styles here */
.card {
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-content {
  padding: 20px;
}

.login-heading,
.registration-heading {
  font-size: 24px;
  margin: 20px 0;
}

.divider {
  margin: 20px 0;
  border-top: 1px solid #ddd;
}

.card:hover {
  transform: scale(1.05);
}
</style>
