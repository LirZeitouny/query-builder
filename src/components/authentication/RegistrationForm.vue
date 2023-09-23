<template>
  <div>
    <h2>Registration</h2>
    <form @submit.prevent="register">
      <div class="form-group">
        <label for="username">Username</label>
        <input
          type="text"
          id="username"
          v-model="username"
          class="form-control"
          placeholder="Enter a username"
          required
        />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input
          type="email"
          id="email"
          v-model="email"
          class="form-control"
          placeholder="Enter your email"
          required
        />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          v-model="password"
          class="form-control"
          placeholder="Enter a password"
          required
        />
      </div>
      <button type="submit" class="btn btn-primary">Register</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
    };
  },
  methods: {
    register() {
      // Perform registration logic here
      // You can make an API request to create a new user account
      // For simplicity, we'll just log the registration data
      console.log('Username:', this.username);
      console.log('Email:', this.email);
      console.log('Password:', this.password);

      // After successful registration, you can navigate to another page
      // For example, using Vue Router: this.$router.push('/dashboard');
    },
  },
};
</script>

<style scoped>
/* Add your custom CSS styles here */
/* For example, you can style form elements or add some spacing */
.form-group {
  margin-bottom: 20px;
}
</style>
