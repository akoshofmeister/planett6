function Player(type, image, x, y, sizeX, sizeY) {
    var Player = {
        type,
        image,
        x,
        y,
        sizeX,
        sizeY,
        direction: 1,
        dead: false,
        moves: []
    };

    Player.forward = function() {

    }

    var canMove = function() {
        
    }

    Human.kill = function() {
        Human.dead = true;
    }

    Human.incX = function(value) {
        Human.x = (value || 1) * 111 + Human.x;
    }

    Human.incY = function(value) {
        Human.y = (value || 1) * 111 + Human.y;
    }

    Human.getRealX = function() {
        return Human.x / 111;
    }

    Human.getRealY = function() {
        return Human.y / 111;
    }

    Human.getX = function() {
        return Human.x;
    }

    Human.getY = function() {
        return Human.y;
    }

    return Human;
}