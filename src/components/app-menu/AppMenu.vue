<template>
  <div class="menu">
    <ul>
      <li>
        <router-link to="/hello">Hello</router-link>
      </li>
      <li>
        <router-link to="/game">Game</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'AppMenu'
  };
</script>

<style scoped>

</style>
