import Game from '@>/components/game/objects/Game';
import imageLoader from '@>/components/game/imageLoader';
import Player from '@>/components/game/objects/Player';

describe('Player.js', () => {
    let player;

    var my_canvas = document.createElement('canvas');
    my_canvas.height = 888;
    my_canvas.width = 1473;
    var my_ctx = my_canvas.getContext("2d");
    var game = new Game(1473, 888, my_ctx);
    game.imageLoader = new imageLoader(game);
    game.imageLoader.loadAll();
    game.create();

    it("should initialize a player", () => {
        player = new Player(game, true);
        expect(player.type).to.equal("player");
        expect(player.x).to.equal(222);
        expect(player.y).to.equal(333);
        expect(player.direction).to.equal(1);
        expect(player.maxSpeed).to.deep.equal({ x: 500, y: 8 });
        expect(player.velocity).to.deep.equal({ x: 0, y: 0 });
        expect(player.acceleration).to.deep.equal({ x: 700, y: 0 });
        expect(player.moved).to.equal(false);
        expect(player.player2).to.equal(true);
        expect(player.canShoot).to.equal(true);
        expect(player.health).to.equal(3);
        expect(player.dead).to.equal(false);
        expect(player.game).to.equal(game);
    });

    it("check getMove function", () => {
        player.y = 555;
        player.getMove();
        expect(player.currentImage.index.walk).to.equal(-1);
        player.moved = true;
        player.getMove();
        expect(player.currentImage.index.stand).to.equal(-1);
        expect(player.currentImage.index.walk).to.equal(0);
        expect(player.moved).to.equal(false);
    });

    it("should shoot", () => {
        player.shoot();
        expect(game.bullets.length).to.equal(1);
    });
});
