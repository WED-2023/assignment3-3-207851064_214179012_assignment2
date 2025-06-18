import axios from 'axios';
import { reactive } from 'vue';

const store = reactive({
  username: localStorage.getItem('username'),
  server_domain: "http://localhost:3000",

  login(username) {
    localStorage.setItem('username', username);
    this.username = username;
    console.log("login", this.username);
  },

  logout() {
    console.log("logout");
    axios.post(`${this.server_domain}/auth/Logout`,null,
  { withCredentials: true });
    localStorage.removeItem('username');
    this.username = undefined;
  }
});

export default store;
