<template>
  <router-view />
</template>

<script setup lang="ts">
import axios from 'axios';
import { useStore } from 'vuex';

axios.defaults.baseURL = 'http://localhost:3000';

const store = useStore();

// Call the initializeData action when the app starts
store.dispatch('initializeData');
</script>
