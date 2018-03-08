import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '../components/hello/HelloWorld';
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
      path: '/hello',
      name: 'HelloWorld',
      component: HelloWorld,
    },
    {
      path: '/',
      redirect: {
        name: 'HelloWorld'
      }
    }
  ],
});
