import Game from '@>/components/game/objects/Game';
import imageLoader from '@>/components/game/imageLoader';
import Bullet from '@>/components/game/objects/Bullet';
import Player from '@>/components/game/objects/Player';

describe('Bullet.js', () => {
    let bullet;
    let player;

    var my_canvas = document.createElement('canvas');
    my_canvas.height = 888;
    my_canvas.width = 1473;
    var my_ctx = my_canvas.getContext("2d");
    var game = new Game(1473, 888, my_ctx);
    game.imageLoader = new imageLoader(game);
    game.imageLoader.loadAll();
    game.create();    
    player = new Player(game, true);

    it("should initialize a bullet", () => {
        
        bullet = new Bullet(game, 90, 500, 1, player);
        assert(bullet.x == 90);
        assert(bullet.y = 500);
        assert(bullet.direction == 1);
        assert(bullet.destroyed == false);
        assert(bullet.movesToLive == 50);
        assert(bullet.player2 == player);
        assert(bullet.game == game);
    });

    describe("check move function", () => {
        it("should destroyed", () => {
            bullet.move();
            expect(bullet.destroyed).to.equal(true);
        });

        it("shouldn't destroyed", () => {
            var tmp_bullet = new Bullet(game, 222, 555, 1, player);
            tmp_bullet.move();
            expect(tmp_bullet.destroyed).to.equal(false);
        });
    });

    it("check getMove function", () => {
        var result =  bullet.getMove();      
        expect(result.x).to.equal(90);
        expect(result.y).to.equal(500);
        expect(result.destroyed).to.equal(false);
    });
});
