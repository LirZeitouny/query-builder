<template>
  <router-view />
</template>

<script lang="ts">
import axios from 'axios';

// Configure Axios base URL
import { defineComponent } from 'vue';
axios.defaults.baseURL = 'http://localhost:3000';

export default defineComponent({
  name: 'App',
});
</script>
