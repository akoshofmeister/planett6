<template>
  <div id="app">
    <app-menu />
    <router-view/>
  </div>
</template>

<script>
  import AppMenu from './components/app-menu/AppMenu';

  export default {
    name: 'App',
    components: { AppMenu }
  };
</script>

<style>
  html, body {
    padding: 0;
    margin: 0;
  }

  #app {
    width: 100%;
    height: 100%;
  }
</style>
