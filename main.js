var Position = function (width, height, x, y) {
    return { width, height, x, y };
}

var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
var game;

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




var isStarted = false;

window.onkeyup = function (e) {
    var key = e.keyCode ? e.keyCode : e.which;

    if (key == 32) {
        if (isStarted) {
            game && (game.isPaused ? game.start() : game.stop());
        } else {
            isStarted = true;
            myAudio.pause();
            myAudio = new Audio('./music.mp3');
            document.getElementById("akep").style.display ="none";
            game = new Game(1200, 600, ctx);
            game.create();
            game.start();
            myAudio.addEventListener('ended', function () {
                this.currentTime = 0;
                this.play();
            }, false);
            myAudio.play();
        }
    } else if (key == 39) {
        game && (game.move = false);
    } else if (key == 37) {
        game && (game.move = false);
    } else if (key == 13) {
        game && game.shoot();
    }
}

window.onkeydown = function (e) {
    var key = e.keyCode ? e.keyCode : e.which;

    if (key == 39) {
        game && ((game.direction = 1) && (game.move = true));
    } else if (key == 37) {
        game && ((game.direction = -1) && (game.move = true));
    } else if (key == 38) {
        game && game.jump == 0 && (game.jump = 3);
    }
}
