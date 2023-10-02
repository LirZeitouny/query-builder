<template>
  <router-view />
</template>

<script setup lang="ts">
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000';

// Call the initializeData action when the app starts
</script>
