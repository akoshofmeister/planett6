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
					<h2>Bejelentkezés</h2>
					<div v-for="(player, index) in players"
						:key="index">
						<span v-if="index == 0">
							Egyjátékos mód <br/>
						</span>
						<span v-else>
							Kétjátékos mód <br/>
						</span>
						<template v-if="!player.loggedin">
							<input type="text" v-model="player.name" placeholder="Felhasználónév"/>
							<input type="password" v-model="player.pw" placeholder="Jelszó"/>
							<div v-show='player.name != "" && player.pw != ""' 
								class="button"
								@click="login(player)">
								Bejelentkezés
							</div>
						</template>
						<template v-else>
							<div class="button"
							@click="logout(player)"
							>
								Kijelentkezés ({{ player.name }})
							</div>
						</template>
					</div>
					<br/>
					<div v-if="isPlayerLoggedin"
					@click="start()"
					class="button">
						A játék indítása ({{gameMode}} mód)
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
				players: [{name: '', pw:'', loggedin: false}],
				isGameRunning: false
			}
		},
		computed: {
			isPlayerLoggedin: function() {
				return this.players.filter(p => p.loggedin).length != 0;
			},
			gameMode: function() {
				let length = this.players.filter(p => p.loggedin).length;
				return length == 1 ? "egyjátékos" : "kétjátékos";
			}
		},
		methods: {
			start: function() {
				let player1 = this.players[0].loggedin && this.players[0].name || null;
				let player2 = this.players[1] && this.players[1].loggedin && this.players[1].name;

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

				if(this.players.length == 1) {
					this.players.push({name: '', pw:'', loggedin: false});
				}
			},
			logout: function(player) {
				player.loggedin=false;

				if(this.players.length == 2 && !this.isPlayerLoggedin) {
					this.players.pop();
				}
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
	background-color: rgba(0,0,0,0.9);
}

input[type=text], input[type=password] {
	border: none;
	border-bottom: 2px solid white;
	background-color: transparent;
	padding: 2px;
	color: white;
	font-family: 'Courier New', Courier, monospace;
}

#menu {
	width: 490px;
	margin-left: calc((100vw - 490px ) / 2);
	margin-top: 100px;
	background-color: rgb(41,54,88);
	color: white;
	border-radius: 5px;
	padding: 15px;
	font-family: 'Courier New', Courier, monospace;
}

h2 {
	margin: 0;
	padding: 0;
}

.button {
	text-align: center;
	padding: 5px;
	cursor: pointer;
	background-color: rgb(148, 40, 73);
	max-width: 200px;
	padding: 5px;
	margin: 5px;
	transition: background-color .5s
}

.button:hover {
	background-color: rgb(122, 33, 59);
}

</style>
