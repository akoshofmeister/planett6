 
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
var GAME = new GAME(1473, 888, ctx);
GAME.create()
    .then(GAME.start)
    .catch(function(err) {
        console.log(err);
    })

/*
var nav = new Image();

nav.src = "./images/nav.png";

nav.onload = function () {
    ctx.clearRect(0, 0, 1473, 888);
    ctx.drawImage(nav, 0, 0);
    myAudio = new Audio('./music2.mp3'); 
    myAudio.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);
    myAudio.play();
}



*/
var isStarted = true;

window.onkeyup = function (e) {
    var key = e.keyCode ? e.keyCode : e.which;

    if (key == 32) {
        if (isStarted) {
            GAME && (GAME.isPaused ? GAME.start() : GAME.stop());
        } else {
            isStarted = true;
            myAudio.pause();
            myAudio = new Audio('./music.mp3');
            document.getElementById("akep").style.display ="none";
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
