import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import Game from '@/components/game/Game';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/game',
      name: 'Game',
      component: Game,
    },
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
    },
  ],
});
