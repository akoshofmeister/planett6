function Block(type, image, pos) {
    var Block = {};
    Block.type = type;
    Block.width = 10;
    Block.height = 10;
    Block.pos = pos;
    Block.image = image;

    Block.getRealX = function() {
        return Block.pos.x / 111;
    }

    Block.getRealY = function() {
        return Block.pos.y / 111;
    }

    Block.getX = function() {
        return Block.pos.x;
    }

    Block.getY = function() {
        return Block.pos.y;
    }

    Block.getImage = function() {
        return Block.image;
    }

    return Block;
}