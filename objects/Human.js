function Human(type, image, x, y) {
    var Human = {};
    Human.type = type;
    Human.width = 111;
    Human.height = 111;
    Human.backgroundColor = type == "human" ? "pink" : "black";
    Human.x = x;
    Human.y = y;
    Human.image = image;
    Human.dead = false;
    Human.direction = 1;

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