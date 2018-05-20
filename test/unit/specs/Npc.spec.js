import Game from '@>/components/game/objects/Game';
import ImageLoader from '@>/components/game/imageLoader';
import Npc from '@>/components/game/objects/Npc';

describe('Npc.js', () => {
  let npc;

  const myCanvas = document.createElement('canvas');
  myCanvas.height = 888;
  myCanvas.width = 1473;
  const myCtx = myCanvas.getContext('2d');
  const game = new Game(1473, 888, myCtx);
  game.imageLoader = new ImageLoader(game);
  game.imageLoader.loadAll();
  game.create(true);

  it('should initialize an npc', () => {
    npc = new Npc(game, 555, 555);
    expect(npc.type).to.equal('npc');
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

  describe('check getMove function', () => {
    it('should return die', () => {
      const tmpNpc = new Npc(game, 444, 444);
      tmpNpc.hit();
      tmpNpc.hit();
      const result = tmpNpc.getMove();
      expect(result).to.be.an('object');
      expect(tmpNpc.currentImage.type).to.equal('die');
    });
  });

  describe('check hit and die', () => {
    it('should hit', () => {
      npc.hit();
      expect(npc.dead).to.equal(false);
      expect(npc.health).to.equal(1);
    });

    it('should die', () => {
      npc.hit();
      expect(npc.dying).to.equal(true);
      expect(npc.health).to.equal(0);
      expect(npc.climb).to.equal(0);
      expect(npc.currentImage.index.walk).to.equal(-1);
    });
  });
});
