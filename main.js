 
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
    } else if (key == 39) {
        GAME.navigator.forward = false;
    } else if (key == 37) {
        GAME.navigator.backward = false;
    } else if (key == 38) {
        GAME.navigator.up = false;
    } else if (key == 13) {
        GAME && GAME.shoot();
    }
}

window.onkeydown = function (e) {
    var key = e.keyCode ? e.keyCode : e.which;

    if (key == 39) {
        GAME.navigator.forward = true;
    } else if (key == 37) {
        GAME.navigator.backward = true;
    } else if (key == 38) {
        GAME.navigator.up = true;
    }
}
