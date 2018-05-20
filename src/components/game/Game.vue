<template>
  <!-- eslint-disable max-len -->
  <div id="game">
    <div v-if="gamePaused" id="background">
      <div id="menu">
        <template v-if="isGameRunning">
          <div v-html="getGameStateMessage()"></div>
          <div class="button"
            @click="restartGame()">
            Újrakezdés
          </div>
        </template>
        <template v-else>
          <div v-for="(player, index) in players"
            :key="index">
            <template v-if="!player.loggedin">
              <label>
                Felhasználónév
              </label>
              <input type="text" v-model="player.name" name="username"/>
              <label>
                Jelszó
              </label>
              <input type="password" v-model="player.pw" name="password"/>
              <div class="button"
              @click="login(player)"
              >Bejelentkezes</div>
            </template>
            <template v-else>
              {{ player.name }} bejelentkezve!<br/>
              <div class="button"
              @click="logout(player)"
              >
                Kijelentkezés
              </div>
            </template>
          </div>
          <div v-if="isPlayerLoggedin"
          @click="start()"
          class="button">
            Indítás
          </div>
        </template>
      </div>
    </div>
    <canvas
      id="gameCanvas"
      width="1554"
      height="888"
      style="margin-left: calc((100vw - 1554px) / 2 );"/>
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
        game: null,
        gamePaused: false,
        event: new Event('pauseGame'),
        players: [{name: '', pw:'', loggedin: false}, {name: '', pw:'', loggedin: false}],
        isGameRunning: false
      }
    },
    computed: {
      isPlayerLoggedin: function() {
        return this.players.filter(p => p.loggedin).length != 0;
      }
    },
    methods: {
      start: function() {
        let player1 = (this.players[0].loggedin && this.players[0].name) || (this.players[1].loggedin && this.players[1].name) || null;
        let player2 = player1 && player1 != this.players[1].name && (this.players[1].loggedin && this.players[1].name);

        if(player1) {
          this.game.addPlayer(player1, player2);
          this.gamePaused = false;
          this.isGameRunning = true;
          this.game.start(true);
        }
      },
      login: function(player) {
        player.pw = "";
        player.loggedin=true;
      },
      logout: function(player) {
        player.loggedin=false;
      },
      toggleGamePaused: function() {
        this.gamePaused = !this.gamePaused;
      },
      restartGame: function() {
        location.reload();
      },
      getGameStateMessage: function() {
        let state = this.game && this.game.getState();

        if(state == 0) {
          return "Vesztettél!";
        } else if(state == 1) {
          return "Vesztettetek!"
        } else if(state == 2) {
          return "Nyertél!"
        } else if(state == 3) {
          return "Nyertetek!"
        }

        return "Játék szüneteltetve. Nyomd meg az ESC billentyűt a folytatáshoz."
      },
      preload: function() {
        this.game.preload();
        this.gamePaused = true;
      }
    },
    mounted: function() {
      this.game = new Game(1473, 888, document.getElementById("gameCanvas").getContext("2d"), this.event);

      this.game.create()
        .then(this.preload)
        .catch(function(err) {
            console.log(err);
        }) 
    },
    created: function() {
      document.addEventListener('pauseGame', function (e) {
        this.toggleGamePaused();
      }.bind(this));
    },
    beforeDestroy: function() {
      document.removeEventListener('pauseGame');
    }
  };

 /*  this.game.create()
        .then(this.game.start.bind(this, true))
        .catch(function(err) {
            console.log(err);
        }) */
</script>

<style scoped>

#background {
  position: absolute;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0.5);
}

#menu {
  width: 490px;
  height: 200px;
  margin-left: calc((100vw - 490px ) / 2);
  margin-top: 100px;
  background-color: white;
  padding: 5px;
}

.button {
  width: 100px;
  text-align: center;
  padding: 5px;
  margin: auto;
  cursor: pointer;
  background-color: red;
}

</style>
