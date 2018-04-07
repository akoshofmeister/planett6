<template>
  <!-- eslint-disable max-len -->
  <div id="game">
    <canvas
      id="gameCanvas"
      width="1554"
      height="888"/>
  </div>
</template>

<script>
  /* eslint-disable */
  //TODO: fix the game to launch as a vue component, until then, a placeholder game is here
  import Game from './objects/Game';

  export default {
    name: 'Game',
    data: function() {
      return {
        game: null
      }
    },
    mounted: function() {
      this.game = new Game(1473, 888, document.getElementById("gameCanvas").getContext("2d"));

      this.game.create()
        .then(this.game.start)
        .catch(function(err) {
            console.log(err);
        })
    }
  };
</script>

<style scoped>
</style>
