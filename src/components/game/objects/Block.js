/* eslint-disable */

function Block(type, image, x, y) {
    var Block = {};
    Block.type = type;
    Block.width = 10;
    Block.height = 10;
    Block.x = x;
    Block.y = y;
    Block.image = image;

    Block.getRealX = function() {
        return Block.x / 111;
    }

    Block.getRealY = function() {
        return Block.y / 111;
    }

    Block.getX = function() {
        return Block.x;
    }

    Block.getY = function() {
        return Block.y;
    }

    Block.getImage = function() {
        return Block.image;
    }

    return Block;
}
