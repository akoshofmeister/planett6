import Game from '@>/components/game/objects/Game';
import Player from '@>/components/game/objects/Player';
import ImageLoader from '@>/components/game/imageLoader';
import { expect } from 'chai';


describe('Game.js', () => {
  const myCanvas = document.createElement('canvas');
  myCanvas.height = 888;
  myCanvas.width = 1473;
  const myCtx = myCanvas.getContext('2d');
  const game = new Game(1473, 888, myCtx);
  game.imageLoader = new ImageLoader(game);
  game.imageLoader.loadAll();

  it('should initialize', () => {
    expect(game.keys.length).to.equal(9);
    expect(game.width).to.equal(1473);
    expect(game.height).to.equal(888);
    expect(game.ctx).to.equal(myCtx);
    expect(game.isPaused).to.equal(false);
    expect(game.blockTypes).to.deep.equal({ air: 'air', ground: 'ground' });
    expect(game.gravity).to.equal(0.2);
    expect(game.players).to.deep.equal([]);
    expect(game.blocks).to.deep.equal([]);
    expect(game.npcs).to.deep.equal([]);
    expect(game.bullets).to.deep.equal([]);
    expect(game.fps).to.equal(28);
  });

  it('should create', () => {
    game.create(true);
    expect(game.blocks.length).to.equal(0);
    expect(game.players.length).to.equal(0);
    expect(game.npcs.length).to.equal(0);
    // expect(document.getEventListener("keydown")).is.not(undefined)
    // expect(document.getEventListener("keyup")).is.not(null)
  });

  it('should add Bullet', () => {
    game.create(true);
    game.addBullet(0, 10, -1, new Player(game, true));
    expect(game.bullets.length).to.equal(1);
  });


  describe('validPos function', () => {
    it('should return false', () => {
      game.create(true);
      expect(game.validPos(-1, 0)).to.equal(false);
    });
  });

  describe('canGo function', () => {
    /*
    it('should return true', () => {
      game.create(true);
      expect(game.canGo(1,6,false,false)).to.equal(true);
    });
    */
    it('should return false', () => {
      game.create(true);
      expect(game.canGo(9, 5, false, false)).to.equal(false);
    });
  });

  it('normalize functions', () => {
    game.create(true);
    expect(game.normalizeX(1.2)).to.equal(0);
    expect(game.normalizeX(212)).to.equal(1);
    expect(game.normalizeX(567)).to.equal(5);
    expect(game.normalizeX(730)).to.equal(6);
  });
});
