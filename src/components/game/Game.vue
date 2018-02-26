<template>
  <div id="game">
    <canvas id="gamecanvas" width="1473" height="888">  </canvas>
  </div>
</template>

<script>/* eslint-disable */
//TODO: fix the game to launch as a vue component
  import 'lodash';
  import './objects/Game';
  import './objects/Bullet';
  import './objects/Block';
  import './objects/Player';
  import './imageLoader';
  export default {
    name: 'Game',
    mounted() {
      const canvas = document.getElementById('gamecanvas');
      const ctx = canvas.getContext('2d');
      var GAME = new GAME(1473, 888, ctx);
      GAME.create()
        .then(GAME.start)
        .catch((err) => {
          console.log(err);
        });

      let isStarted = true;

      window.onkeyup = function (e) {
        const key = e.keyCode ? e.keyCode : e.which;

        if (key == 32) {
          if (isStarted) {
            GAME && (GAME.isPaused ? GAME.start() : GAME.stop());
          } else {
            isStarted = true;
            myAudio.pause();
            myAudio = new Audio('./music.mp3');
            document.getElementById('akep').style.display = 'none';
            GAME = new Game(1200, 600, ctx);
            GAME.create();
            GAME.start();
            myAudio.addEventListener('ended', function () {
              this.currentTime = 0;
              this.play();
            }, false);
            myAudio.play();
          }
        } else if (key == 39) {
          GAME.navigator.forward = false;
        } else if (key == 37) {
          GAME.navigator.backward = false;
        } else if (key == 38) {
          GAME.navigator.up = false;
        } else if (key == 13) {
          GAME && GAME.shoot();
        }
      };

      window.onkeydown = function (e) {
        const key = e.keyCode ? e.keyCode : e.which;

        if (key == 39) {
          GAME.navigator.forward = true;
        } else if (key == 37) {
          GAME.navigator.backward = true;
        } else if (key == 38) {
          GAME.navigator.up = true;
        }
      };
    }
  };
</script>

<style scoped>
  * {
    padding: 0;
    margin: 0;
  }

  canvas {
    display: block;
    margin: 0 auto;
  }

  #akep {
    animation-name: pulse;
    animation-duration: 0.5s;
    animation-timing-function: ease-out;
    animation-delay: 0s;
    animation-direction: alternate;
    animation-iteration-count: infinite;
    animation-fill-mode: none;
    animation-play-state: running;
  }

  @keyframes pulse {
    0% {
      opacity: 0.2;
    }
    100% {
      opacity: 1;
    }
  }
</style>
