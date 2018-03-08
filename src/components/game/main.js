 
var canvas = document.getElementById("game");
var ctx = canvas.getContext("2d");
var GAME = new GAME(1473, 888, ctx);

GAME.create()
    .then(GAME.start)
    .catch(function(err) {
        console.log(err);
    })