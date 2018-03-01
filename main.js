 
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
var GAME = new GAME(1473, 888, ctx);

GAME.create()
    .then(GAME.start)
    .catch(function(err) {
        console.log(err);
    })

var isStarted = true;

window.onkeyup = function (e) {
    var key = e.keyCode ? e.keyCode : e.which;

    if (key == 32) {
        GAME && (GAME.isPaused ? GAME.start() : GAME.stop());
    }
    if (key == 39) {
        GAME.navigator.player.forward = false;
    }
    if (key == 37) {
        GAME.navigator.player.backward = false;
    }
    if (key == 38) {
        GAME.navigator.player.up = false;
    }

    if (key == 68) {
        GAME.navigator.player2.forward = false;
    }
    if (key == 65) {
        GAME.navigator.player2.backward = false;
    }
    if (key == 87) {
        GAME.navigator.player2.up = false;
    }

}

window.onkeydown = function (e) {
    var key = e.keyCode ? e.keyCode : e.which;

    if (key == 39) {
        GAME.navigator.player.forward = true;
    }
    if (key == 37) {
        GAME.navigator.player.backward = true;
    }
    if (key == 38) {
        GAME.navigator.player.up = true;
    }

    if (key == 68) {
        GAME.navigator.player2.forward = true;
    }
    if (key == 65) {
        GAME.navigator.player2.backward = true;
    }
    if (key == 87) {
        GAME.navigator.player2.up = true;
    }
}
