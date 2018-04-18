import Game from '@>/components/game/objects/Game';
import imageLoader from '@>/components/game/imageLoader';
import Npc from '@>/components/game/objects/Npc';

describe('Npc.js', () => {
    let npc;

    var my_canvas = document.createElement('canvas');
    my_canvas.height = 888;
    my_canvas.width = 1473;
    var my_ctx = my_canvas.getContext("2d");
    var game = new Game(1473, 888, my_ctx);
    game.imageLoader = new imageLoader(game);
    game.imageLoader.loadAll();
    game.create();
    
    it("should initialize an npc", () => {
        npc = new Npc(game, 555, 555);
        expect(npc.type).to.equal("npc");
        expect(npc.x).to.equal(555);
        expect(npc.y).to.equal(555);
        expect(npc.velocity).to.deep.equal({ x: 0, y: 0 });
        expect(npc.direction).to.equal(1);
        expect(npc.moved).to.equal(false);
        expect(npc.climb).to.equal(0);
        expect(npc.fixPosClimb).to.deep.equal({ x: 0, y: 0 });
        expect(npc.dead).to.equal(false);
        expect(npc.health).to.equal(2);
        expect(npc.game).to.equal(game);
    });    

    describe("check getMove function", () => {
        it("should return stand", () => {
            var result = npc.getMove();
            expect(npc.currentImage.index.walk).to.equal(-1);
            expect(npc.currentImage.index.climb).to.equal(-1);
            expect(npc.currentImage.type).to.equal("stand");
        });

        it("should return climb", () => {
            npc.climb = 1;
            var result = npc.getMove();
            expect(npc.currentImage.index.walk).to.equal(-1);
            expect(npc.currentImage.type).to.equal("climb");
        });

        it("should return move", () => {
            npc.climb = 0;
            npc.moved = true;
            var result = npc.getMove();
            expect(npc.currentImage.index.walk).to.equal(0);
            expect(npc.currentImage.index.climb).to.equal(-1);
            expect(npc.currentImage.type).to.equal("move");
            expect(npc.moved).to.equal(false);
        });

        it("should return die", () => {
            var tmp_npc = new Npc(game, 444, 444);
            tmp_npc.hit();
            tmp_npc.hit();
            var result = tmp_npc.getMove();
            expect(tmp_npc.currentImage.type).to.equal("die");
        });
    });

    describe("check hit and die", () => {
        it("should hit", () => {
            npc.hit();
            expect(npc.dead).to.equal(false);
            expect(npc.health).to.equal(1);
        });
    
        it("should die", () => {
            npc.hit();
            expect(npc.dying).to.equal(true);
            expect(npc.health).to.equal(0);
            expect(npc.climb).to.equal(0);
            expect(npc.currentImage.index.walk).to.equal(-1);
        });
    });
});
