import Vue from 'vue';
import Router from 'vue-router';
import Welcome from '../components/welcome/Welcome';
import Game from '../components/game/Game';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/game',
      name: 'Game',
      component: Game,
    },
    {
      path: '/welcome',
      name: 'Welcome',
      component: Welcome,
    },
    {
      path: '/',
      redirect: {
        name: 'Welcome'
      }
    }
  ],
});
