import Vue from 'vue';
import { PATHS } from './paths';

export default {
  token1: null,
  token2: null,

  user1: {
    login(username, password) {
      return Vue.$http.post(PATHS.LOGIN, {
        username,
        password
      }).then((response) => {
        this.token1 = response.authToken;
        return response.user;
      });
    },
    get() {
      Vue.$http.headers.common['x-auth-token'] = this.token1 || 'null';
      return Vue.$http.get(PATHS.USER);
    }
  },

  user2: {
    login(username, password) {
      return Vue.$http.post(PATHS.LOGIN, {
        username,
        password
      }).then((response) => {
        this.token2 = response.authToken;
        return response.user;
      });
    },
    get() {
      Vue.$http.headers.common['x-auth-token'] = this.token2 || 'null';
      return Vue.$http.get(PATHS.USER);
    }
  },

  register(username, password) {
    return Vue.$http.post(PATHS.USER, {
      username,
      password
    });
  }
};
