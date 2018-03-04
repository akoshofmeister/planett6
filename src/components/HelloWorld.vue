<template>
  <div class="hello">
    <router-link to="/game">Go to game</router-link>
    <h1>{{ msg }}</h1>
    <h2 class="counter">Count: {{ count }}</h2><button @click="increment">Increment</button>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      msg: 'Welcome to Your Vue.js App',
      count: 0
    };
  },
  methods: {
    increment() {
      this.count += 1;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
