import Block from '@>/components/game/objects/Block';
import Game from '@>/components/game/objects/Game';
import imageLoader from '@>/components/game/imageLoader';

describe('Block.js', () => {
    let block;

    var my_canvas = document.createElement('canvas');
    my_canvas.height = 888;
    my_canvas.width = 1473;
    var my_ctx = my_canvas.getContext("2d");
    var game = new Game(1473, 888, my_ctx);
    game.imageLoader = new imageLoader(game);
    game.imageLoader.loadAll(); 

    it("should initialize a block", () => {
        var type = game.blockTypes.ground;
        block = new Block(game, type, game.imageLoader.get(type), 111, 111);
        assert(typeof block != undefined);
        assert(block.type == type);
        assert(block.width == 10);
        assert(block.height == 10);
        assert(block.x == 111);
        assert(block.y == 111);
        //assert(block.image == game.imageLoader.get(type));
        assert(block.game == game);
    });

    it("check getRealX", () => {
        assert(block.getRealX() == 1);
    });

    it("check getRealY", () => {
        assert(block.getRealY() == 1);
    });

    it("check getX", () => {
        assert(block.getX() == 111);
    });

    it("check getY", () => {
        assert(block.getY() == 111);
    });

    /*
    it("check getImage", () => {
        assert(block.getImage() == game.imageLoader.get(type));
    });
    */
});
