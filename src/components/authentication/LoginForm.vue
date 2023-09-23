<template>
  <div class="login-container">
    <h1 class="login-title">Sign in</h1>

    <form @submit.prevent="login" class="login-form">
      <div class="form-group">
        <label for="email">Email or mobile phone number</label>
        <input
          type="email"
          id="email"
          name="email"
          v-model="username"
          required
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          v-model="password"
          required
        />
      </div>

      <div class="forgot-password">
        <a href="#" class="forgot-password-link">Forgot your password?</a>
      </div>

      <button type="submit" class="login-button">Sign in</button>
    </form>

    <div class="create-account">
      <p>New?</p>
      <router-link to="/register" class="create-account-link"
        >Create your account</router-link
      >
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    login() {
      // Perform login logic here
      // You can make an API request to authenticate the user
      // For simplicity, we'll just log the username and password
      console.log('Username:', this.username);
      console.log('Password:', this.password);

      // After successful login, you can navigate to another page
      // For example, using Vue Router: this.$router.push('/dashboard');
    },
  },
};
</script>

<style scoped>
/* Add your custom CSS styles here */
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.login-title {
  font-size: 24px;
  margin-bottom: 20px;
}

.login-form {
  width: 300px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-size: 14px;
  margin-bottom: 5px;
}

input[type='text'],
input[type='password'],
input[type='email'] {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.forgot-password {
  text-align: right;
  margin-bottom: 15px;
}

.forgot-password-link {
  font-size: 12px;
  text-decoration: none;
  color: #007bff;
}

.login-button {
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

.create-account {
  text-align: center;
  margin-top: 20px;
}

.create-account p {
  font-size: 14px;
}

.create-account-link {
  font-size: 16px;
  text-decoration: none;
  color: #007bff;
}
</style>
